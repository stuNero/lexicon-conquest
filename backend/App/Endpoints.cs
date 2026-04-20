using Microsoft.AspNetCore.SignalR;

namespace backend;


public static class Endpoints
{
  public static void StartGame(WebApplication app)
  {
    app.MapPost("/api/sessions/start/{url}", async (
      string url,
      GameServer server,
      IHubContext<GameHub> hubContext
    ) =>
    {
      var session = server.gameSessions.FirstOrDefault((s) => s.Url == url);

      if (session == null)
        return Results.NotFound(new { message = $"Session: [{url}] doesn't exist" });
      if (!session.players.All((p) => p.Ready))
        return Results.BadRequest(new { message = "Not all players are ready" });

      session.InGame = true;
      await hubContext.Clients.Group(url).SendAsync("SessionUpdated", session);
      return Results.Ok();
    });
  }
  // new session endpoint
  public record CreateSessionRequest(string userName);
  public record NewSession(string url);
  public static void CreateSession(WebApplication app)
  {
    app.MapPost("/api/sessions", (GameServer server, CreateSessionRequest request) =>
    {

      if (request == null || string.IsNullOrWhiteSpace(request.userName))
      {
        return Results.BadRequest(new
        {
          message = "Request body is required and must include userName for the creator of the session."
        });
      }

      string url;

      do
      {
        url = Guid.NewGuid().ToString().Substring(0, 8);
      }
      while (server.gameSessions.Any(s => s.Url == url));

      var session = new GameSession
      {
        Url = url,
        players = new List<Player>()
      };

      // add creator as first player
      var newPlayer = new Player(userName: request.userName, ready: false, isHost: true);
      session.players.Add(newPlayer);
      server.gameSessions.Add(session);

      return Results.Created($"/api/sessions/{url}", new
      {
        url = url,
        player = newPlayer
      });

    });
  }

  // get all session
  // get session by id can be accessed via url query 
  public record sessionObject(string Url, Player[] players, bool inGame);
  public static void GetSessions(WebApplication app)
  {
    app.MapGet("/api/sessions", async (GameServer server, string? url, IHubContext<GameHub> hubContext) =>
    {
      // For specified search:
      if (!string.IsNullOrWhiteSpace(url))
      {
        await hubContext.Clients.Group(url).SendAsync("SessionUpdated", server.gameSessions
        .Where(s => s.Url == url)
        .Select(s => new sessionObject(
          s.Url,
          s.players.ToArray(),
          s.InGame
          )));
      }
      // For generic search
      return server.gameSessions
      .Select(s => new sessionObject(
        s.Url,
        s.players.ToArray(),
        s.InGame
        ));
    });
  }
  public record NewPlayer(string userName, bool IsHost, bool ready = false);
  public static void CreatePlayer(WebApplication app)
  {
    app.MapPost("/api/sessions/{url}",
    async (string url,
    GameServer server,
    NewPlayer createP,
    IHubContext<GameHub> hubContext) =>
    {
      var session = server.gameSessions.FirstOrDefault(s => s.Url == url);
      if (session == null)
      {
        return Results.NotFound();
      }

      // limit to only 4 players
      if (session.players.Count >= 4) // we use >= because index starts from 0 
      {
        return Results.BadRequest(new
        {
          message = "Session is full (max 4 players)"
        });
      }

      Player newPlayer = new Player
      (
        userName: createP.userName,
        ready: createP.ready,
        isHost: false
        );

      session.players.Add(newPlayer);

      await hubContext.Clients.Group(url)
        .SendAsync("SessionUpdated", session);
      return Results.Ok(newPlayer);
    });
  }
  public static void DeleteSession(WebApplication app)
  {
    app.MapDelete("/api/sessions/{url}", (GameServer server, string url) =>
    {
      if (!server.gameSessions.Exists(s => s.Url == url))
      {
        return Results.NotFound(new { message = $"Session with url: {url} could not be found" });
      }
      server.gameSessions.RemoveAll(s => s.Url == url);

      return Results.Ok();
    });
  }
  public static void ToggleReady(WebApplication app)
  {
    app.MapPut("/api/players/", async (GameServer server, string url, Guid id, IHubContext<GameHub> hubContext) =>
    {
      foreach (GameSession session in server.gameSessions)
      {
        if (session.Url == url)
        {
          foreach (Player player in session.players)
          {
            if (player.id == id)
            {
              if (player.Ready)
                player.Ready = false;
              else if (!player.Ready)
                player.Ready = true;
              await hubContext.Clients.Group(url)
                .SendAsync("SessionUpdated", session);
              return Results.Ok();
            }
          }
          return Results.NotFound(new { message = $"Player with id: {id} could not be found" });
        }
      }
      return Results.NotFound(new { message = $"Session with url: {url} could not be found" });
    });
  }
}