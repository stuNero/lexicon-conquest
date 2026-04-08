namespace backend;

using System.Runtime.CompilerServices;
using System.Security.Cryptography.X509Certificates;
using System.Text.Json;
using System.Text.Json.Nodes;

public static class Endpoints
{
  public static void GetPlayers(WebApplication app, GameSession session)
  {
    List<Player> players = [];
    foreach (Player player in session.players)
    {
      players.Add(player);
    }
    Player[] playersArray = players.ToArray();

    var playerNamesJSON = JsonSerializer.Serialize(playersArray);
    app.MapGet("/api/players", () => new
    {
      players = playersArray
    });
  }
  public record sessionObject(string Url, Player[] players);
  public static void GetSessions(WebApplication app, GameEngine engine)
  {
    app.MapGet("/api/sessions", (string? url) =>
    {
      // For specified search:
      if (!string.IsNullOrWhiteSpace(url))
      {
        return engine.gameSessions
        .Where(s => s.Url == url)
        .Select(s => new sessionObject(
          s.Url,
          s.players.ToArray()
          ));
      }
      // For generic search
      return engine.gameSessions
      .Select(s => new sessionObject(
        s.Url,
        s.players.ToArray()
        ));
    });
  }
  public record NewPlayer(string userName, bool ready = false);
  public static void CreatePlayer(WebApplication app, GameEngine engine)
  {
    app.MapPost("/api/sessions/{url}", (string url, NewPlayer createP) =>
    {
      Player newPlayer = new Player
      (
        userName: createP.userName,
        ready: createP.ready
      );
      var session = engine.gameSessions.FirstOrDefault(s => s.Url == url);
      if (session == null)
      {
        return Results.NotFound();
      }
      session.players.Add(newPlayer);
      return Results.Ok();
    });
  }
}