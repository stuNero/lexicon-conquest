namespace backend.App.GameServices;

using backend.DTO;

public record GuessWordResult(
  bool Success,
  string Message,
  SessionDto? Session
);

public class GuessWordHandler
{
  public static void AddScore(Dictionary<Guid, int> scores, Guid playerId, int amount)
  {
    scores.TryAdd(playerId, 0);
    scores[playerId] += amount;
  }
  public static void SubScore(Dictionary<Guid, int> scores, Guid playerId, int amount)
  {
    scores.TryAdd(playerId, 0);
    scores[playerId] -= amount;
  }
  public GuessWordResult Handle(
    string url,
    Guid playerId,
    int x,
    int y,
    string guessedWord,
    GameServer server
  )
  {
    var session = server.gameSessions.FirstOrDefault(s => s.Url == url);

    if (session == null)
      return new GuessWordResult(false, "Session not found", null);

    if (!session.InGame)
      return new GuessWordResult(false, "Game has not started", null);

    if (session.Board == null)
      return new GuessWordResult(false, "Board has not been created", null);

    var currentPlayer = session.CurrentPlayer();

    if (currentPlayer == null)
      return new GuessWordResult(false, "No current player", null);

    if (currentPlayer.id != playerId)
      return new GuessWordResult(false, "It is not this player's turn", null);

    var tile = session.Board.Tiles.FirstOrDefault(t =>
      t.X == x &&
      t.Y == y
    );

    if (tile == null)
      return new GuessWordResult(false, "Tile does not exist", null);

    if (tile.ControlledByPlayerId == playerId)
      return new GuessWordResult(false, "You already control this tile", null);

    if (string.IsNullOrWhiteSpace(guessedWord))
      return new GuessWordResult(false, "You must guess a word", null);

    var wordMatches = string.Equals(
      tile.Word.Trim(),
      guessedWord.Trim(),
      StringComparison.OrdinalIgnoreCase
    );

    var sessionDto = SessionMapper.ToDto(session);

    if (!wordMatches)
    {
      session.NextTurn();
      sessionDto = SessionMapper.ToDto(session);
      return new GuessWordResult(false, "Fel ord SOPA!", sessionDto);
    }

    // The guess was correct, so this is where the tile gets claimed.
    AddScore(session.PlayerScores, playerId, 1);
    if (tile.ControlledByPlayerId != Guid.Empty)
    {
      SubScore(session.PlayerScores, tile.ControlledByPlayerId, 1);
    }
    tile.ControlledByPlayerId = playerId;

    if (session.PlayerScores.ContainsValue(2))
    {
      session.InGame = false;
    }


    session.NextTurn();
    // After a successful claim, move to the next player.

    sessionDto = SessionMapper.ToDto(session);

    return new GuessWordResult(true, "Correct word", sessionDto);
  }
}
