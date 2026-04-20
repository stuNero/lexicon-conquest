namespace backend;

using backend.Gamecomponents;
using backend.App.GameServices;

public record StartGameRequest(int boardSize);
public static class Endpoints
{

  // new session endpoint
  public record CreateSessionRequest(string userName);
  public record NewSession(string url);
  public static void CreateSession(WebApplication app, GameServer engine)
  {
    app.MapPost("/api/sessions", (CreateSessionRequest request) =>
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

      // add creator as first player
      session.players.Add(new Player(
      userName: request.userName,
      ready: false
      ));
      engine.gameSessions.Add(session);

      return Results.Created($"/api/sessions/{url}", new
      {
        message = "Session created",
        url = url,
        players = session.players
      });

    });
  }

  // get all session
  // get session by id can be accessed via url query 
  public record sessionObject(string Url, Player[] players);
  public static void GetSessions(WebApplication app, GameServer Server)
  {
    app.MapGet("/api/sessions", (string? url) =>
    {
      // For specified search:
      if (!string.IsNullOrWhiteSpace(url))
      {
        return Server.gameSessions
        .Where(s => s.Url == url)
        .Select(s => new sessionObject(
          s.Url,
          s.players.ToArray()
          ));
      }
      // For generic search
      return Server.gameSessions
      .Select(s => new sessionObject(
        s.Url,
        s.players.ToArray()
        ));
    });
  }


  public record NewPlayer(string userName, bool ready = false);

  public static void CreatePlayer(WebApplication app, GameServer server)
  {
    app.MapPost("/api/sessions/{url}", (string url, NewPlayer createP) =>
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
        ready: createP.ready
      );

      session.players.Add(newPlayer);
      return Results.Ok(newPlayer);
    });
  }
  public static void DeleteSession(WebApplication app, GameServer Server)
  {
    app.MapDelete("/api/sessions/{url}", (string url) =>
    {
      if (!Server.gameSessions.Exists(s => s.Url == url))
      {
        return Results.NotFound(new { message = $"Session with url: {url} could not be found" });
      }
      Server.gameSessions.RemoveAll(s => s.Url == url);

      return Results.Ok();
    });
  }
  public static void ToggleReady(WebApplication app, GameServer Server)
  {
    app.MapPut("/api/players/", (string url, Guid id) =>
    {
      foreach (GameSession session in Server.gameSessions)
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
              return Results.Ok();
            }
          }
          return Results.NotFound(new { message = $"Player with id: {id} could not be found" });
        }
      }
      return Results.NotFound(new { message = $"Session with url: {url} could not be found" });
    });
  }

  public static void StartGame(WebApplication app, GameServer server, WordService wordService)
  {
    app.MapPost("/api/sessions/{url}/start",
    (string url, StartGameRequest request) =>
    {
      Console.WriteLine("START ENDPOINT HIT");
      var session = server.gameSessions.FirstOrDefault(s => s.Url == url);

      if (session == null)
        return Results.NotFound();

      var boardSize = request.boardSize;

      session.Board = new Board(boardSize, boardSize, wordService, "common_words");

      return Results.Ok(new
      {
        session.Url,
        players = session.players,
        board = BoardMapper.ToDto(session.Board)
      });
    });
  }
}