namespace backend;

using System.Text.Json;
using System.Text.Json.Nodes;

public static class ApiRoutes
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
  public static void GetSessionURL(WebApplication app, GameSession session)
  {
    app.MapGet("/api/session", () => new
    {
      url = session.Url
    });
  }
}