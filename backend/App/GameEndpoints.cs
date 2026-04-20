namespace backend;

using backend.Gamecomponents;
using backend.App.GameServices;
// using Microsoft.AspNetCore.SignalR; this lets the file use SignalR’s IHubContext. Needed later

public record StartGameRequest(int boardSize);
public record ClaimTileRequest(Guid playerId, int x, int y);

public static class GameEndpoints
{
  public static void StartGame(WebApplication app, GameServer server, WordService wordService)
  {
    app.MapPost("/api/sessions/{url}/start",
    (string url, StartGameRequest request) =>
    /*
    This is how the singnalR should look like later
    app.MapPost("/api/sessions/{url}/start",
    async (
      string url,
      StartGameRequest request,
      IHubContext<GameHub> hubContext
    ) =>
    */
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

      if (request.boardSize < 2 || request.boardSize > 25)
        return Results.BadRequest(new { message = "Board size must be between 2 and 25" });

      session.StartGame(request.boardSize, wordService);
      /* Och här skickar signalR sin egna respons
      var response = new
            {
              session.Url,
              session.InGame,
              session.CurrentPlayerIndex,
              session.TurnNumber,
              currentPlayerId = session.CurrentPlayer()?.id,
              players = session.players,
              board = BoardMapper.ToDto(session.Board!)
            };

            await hubContext.Clients.Group(url).SendAsync("SessionUpdated", response);

            return Results.Ok(response);
          });
      */
      return Results.Ok(new
      {
        session.Url,
        session.InGame,
        session.CurrentPlayerIndex,
        session.TurnNumber,
        currentPlayerId = session.CurrentPlayer()?.id,
        players = session.players,
        board = BoardMapper.ToDto(session.Board!)
      });
    });
  }

  public static void ClaimTile(WebApplication app, GameServer server)
  {
    app.MapPost("/api/sessions/{url}/claim-tile",
    (string url, ClaimTileRequest request) =>
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

      // Return updated board and new currentPlayerId (next turn initiated)
      return Results.Ok(new
      {
        session.Url,
        session.InGame,
        session.CurrentPlayerIndex,
        session.TurnNumber,
        currentPlayerId = session.CurrentPlayer()?.id,
        players = session.players,
        board = BoardMapper.ToDto(session.Board)
      });
    });
  }

}

/* Endpoint example POST http://localhost:5000/api/sessions/{url}/start
{
  "boardSize": 10
}
Expected respons
{
  "url": "abc12345",
  "inGame": true,
  "currentPlayerIndex": 0,
  "turnNumber": 1,
  "currentPlayerId": "PLAYER_GUID_HERE",
  "players": [
    {
      "id": "PLAYER_GUID_HERE",
      "userName": "Havie",
      "ready": true
    }
  ],
  "board": {
    "width": 10,
    "height": 10,
    "tiles": [
      {
        "x": 0,
        "y": 0,
        "word": "example",
        "controlledByPlayerId": null
      }
    ]
  }
}
*/


/* Claim tile api for postman 
POST http://localhost:5000/api/sessions/{url}/claim-tile
Body:
{
  "playerId": "PUT_CURRENT_PLAYER_ID_HERE",
  "x": 0,
  "y": 0
}
Header:Content-Type: application/json been automatic for me.

Respond should look something like this
{
  "url": "abc12345",
  "inGame": true,
  "currentPlayerIndex": 1,
  "turnNumber": 2,
  "currentPlayerId": "NEXT_PLAYER_ID_HERE",
  "players": [
    {
      "id": "PLAYER_1_ID",
      "userName": "Havvi",
      "ready": true
    },
    {
      "id": "PLAYER_2_ID",
      "userName": "Alex",
      "ready": true
    }
  ],
  "board": {
    "width": 10,
    "height": 10,
    "tiles": [
      {
        "x": 0,
        "y": 0,
        "word": "example",
        "controlledByPlayerId": "PUT_CURRENT_PLAYER_ID_HERE"
      }
    ]
  }
}
*/
