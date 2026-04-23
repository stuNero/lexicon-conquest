namespace backend;

using backend.Gamecomponents;
using backend.App.GameServices;
using backend.DTO;
using Microsoft.AspNetCore.SignalR;

public record StartGameRequest(int boardSize);
public record ClaimTileRequest(Guid playerId, int x, int y);

public record GuessWordRequest(Guid playerId, int x, int y, string word);


public static class GameEndpoints
{
  public static void StartGame(WebApplication app)
  {
    app.MapPost("/api/sessions/start/{url}",
    async (
      string url,
      StartGameRequest? request,
      GameServer server,
      WordService wordService,
      IHubContext<GameHub> hubContext
    ) =>
    {
      var session = server.gameSessions.FirstOrDefault(s => s.Url == url);

      if (session == null)
        return Results.NotFound(new { message = "Session not found" });

      if (session.players.Count < 2)
        return Results.BadRequest(new { message = "At least 2 players are required to start the game" });

      if (!session.players.All(player => player.Ready))
        return Results.BadRequest(new { message = "All players must be ready before the game starts" });

      if (session.InGame)
        return Results.BadRequest(new { message = "Game has already started" });

      var boardSize = request?.boardSize ?? 10;

      if (boardSize < 2 || boardSize > 25)
        return Results.BadRequest(new { message = "Board size must be between 2 and 25" });

      session.StartGame(boardSize, wordService);

      var sessionDto = SessionMapper.ToDto(session);

      await hubContext.Clients.Group(url)
        .SendAsync("SessionUpdated", sessionDto);

      return Results.Ok(sessionDto);
    });
  }

  public static void ClaimTile(WebApplication app)
  {
    app.MapPost("/api/sessions/{url}/claim-tile",
 async (
   string url,
   ClaimTileRequest request,
   GameServer server,
   IHubContext<GameHub> hubContext
 ) =>
 {

   var session = server.gameSessions.FirstOrDefault(s => s.Url == url);

   if (session == null)
     return Results.NotFound(new { message = "Session not found" });

   if (!session.InGame)
     return Results.BadRequest(new { message = "Game has not started" });

   if (session.Board == null)
     return Results.BadRequest(new { message = "Board has not been created" });

   var currentPlayer = session.CurrentPlayer();

   if (currentPlayer == null)
     return Results.BadRequest(new { message = "No current player" });

   if (currentPlayer.id != request.playerId)
     return Results.BadRequest(new { message = "It is not this player's turn" });

   // Find the clicked tile
   var tile = session.Board.Tiles.FirstOrDefault(t =>
     t.X == request.x &&
     t.Y == request.y
   );

   if (tile == null)
     return Results.BadRequest(new { message = "Tile does not exist" });

   if (tile.ControlledByPlayerId == request.playerId)
     return Results.BadRequest(new { message = "You already control this tile" });

   //  Claim / steal the tile
   tile.ControlledByPlayerId = request.playerId;

   session.NextTurn();

   // Build the DTO once so SignalR and HTTP return the same data shape.
   var sessionDto = SessionMapper.ToDto(session);

   await hubContext.Clients.Group(url)
     .SendAsync("SessionUpdated", sessionDto);

   return Results.Ok(sessionDto);
 });
  }
  public static void GuessWord(WebApplication app)
  {
    app.MapPost("/api/sessions/{url}/guess-word", async (
      string url,
      GuessWordRequest request,
      GameServer server,
      GuessWordHandler guessWordHandler,
      IHubContext<GameHub> hubContext
    ) =>
    {
      var result = guessWordHandler.Handle(
        url,
        request.playerId,
        request.x,
        request.y,
        request.word,
        server
      );

      if (!result.Success)
        return Results.BadRequest(new { message = result.Message });

      await hubContext.Clients.Group(url)
        .SendAsync("SessionUpdated", result.Session);

      return Results.Ok(result.Session);
    });
  }

}