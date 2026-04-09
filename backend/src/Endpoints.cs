namespace backend;

using System.Runtime.CompilerServices;
using System.Security.Cryptography.X509Certificates;
using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Mvc.ModelBinding;

public static class Endpoints
{
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
  public static void CreatePlayer(WebApplication app, GameServer Server)
  {
    app.MapPost("/api/sessions/{url}", (string url, NewPlayer createP) =>
    {
      Player newPlayer = new Player
      (
        userName: createP.userName,
        ready: createP.ready
      );
      var session = Server.gameSessions.FirstOrDefault(s => s.Url == url);
      if (session == null)
      {
        return Results.NotFound();
      }
      session.players.Add(newPlayer);
      return Results.Ok();
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
    app.MapPut("/api/players/", (string url, string userName) =>
    {
      foreach (GameSession session in Server.gameSessions)
      {
        if (session.Url == url)
        {
          foreach (Player player in session.players)
          {
            if (player.UserName == userName)
            {
              if (player.Ready)
                player.Ready = false;
              else if (!player.Ready)
                player.Ready = true;
              return Results.Ok();
            }
          }
          return Results.NotFound(new { message = $"Player with username: {userName} could not be found" });
        }
      }
      return Results.NotFound(new { message = $"Session with url: {url} could not be found" });
    });
  }
}