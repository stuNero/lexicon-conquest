namespace backend;

using backend.DTO;
using Microsoft.AspNetCore.SignalR;

public static class Endpoints
{

  // new session endpoint
  public record CreateSessionRequest(string userName);
  public record NewSession(string url);
  public static void CreateSession(WebApplication app)
  {
    app.MapPost("/api/sessions", (CreateSessionRequest request, GameServer engine) =>
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
      while (engine.gameSessions.Any(s => s.Url == url));

      var session = new GameSession
      {
        Url = url,
        players = new List<Player>()
      };

      /* Save the host player in a variable so we can return it directly to the frontend. T
       The frontend needs this player's id for localStorage after creating a lobby.
       This is not ideal, i would prefer every data contract via DTOs
        */
      var hostPlayer = new Player(
        userName: request.userName,
        ready: false,
        isHost: true
      );

      session.players.Add(hostPlayer);
      engine.gameSessions.Add(session);

      return Results.Created($"/api/sessions/{url}", new
      {
        message = "Session created",
        url = url,

        // Keep players for backwards compatibility with code that already reads the full player list.
        players = session.players,

        // Add player so the frontend can read response.player.id directly. 
        player = hostPlayer
      });


    });
  }

  // get all session
  // get session by id can be accessed via url query 

  public static void GetSessions(WebApplication app)
  {
    app.MapGet("/api/sessions", IResult (string? url, GameServer server) =>
    {
      if (!string.IsNullOrWhiteSpace(url))
      {
        var sessions = server.gameSessions
          .Where(s => s.Url == url)
          .Select(s => SessionMapper.ToDto(s));

        return Results.Ok(sessions);
      }

      var allSessions = server.gameSessions
        .Select(s => SessionMapper.ToDto(s));

      return Results.Ok(allSessions);
    });
  }



  public record NewPlayer(string userName, bool ready = false);

  public static void CreatePlayer(WebApplication app)
  {
    app.MapPost("/api/sessions/{url}", (string url, NewPlayer createP, GameServer server) =>
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
      return Results.Ok(newPlayer);
    });
  }
  public static void DeleteSession(WebApplication app)
  {
    app.MapDelete("/api/sessions/{url}", (string url, GameServer server) =>
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
    app.MapPut("/api/players/", async (
      GameServer server,
      string url,
      Guid id,
      IHubContext<GameHub> hubContext
    ) =>
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

              var sessionDto = SessionMapper.ToDto(session);

              await hubContext.Clients.Group(url)
                .SendAsync("SessionUpdated", sessionDto);

              return Results.Ok(sessionDto);
            }
          }

          return Results.NotFound(new { message = $"Player with id: {id} could not be found" });
        }
      }

      return Results.NotFound(new { message = $"Session with url: {url} could not be found" });
    });
  }

};

