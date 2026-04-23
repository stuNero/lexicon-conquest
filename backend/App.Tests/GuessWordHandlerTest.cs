using Xunit;
using backend.App.GameServices;
using backend;

public class GuessWordHandlerTest
{
  GuessWordHandler guessWordHandler { get; }
  WordService wordService { get; }

  public GuessWordHandlerTest()
  {
    guessWordHandler = new();
    wordService = new();
  }

  private GameSession CreateSessionWithPlayers(int playerCount = 2)
  {
    var session = new GameSession();

    session.players.Add(new Player("testHostPlayer1", true, true));

    for (int i = 2; i <= playerCount; i++)
    {
      session.players.Add(new Player($"testPlayer{i}", true, false));
    }

    return session;
  }

  private static GameServer CreateServerWithSession(GameSession session)
  {
    var server = new GameServer();
    server.gameSessions.Add(session);
    return server;
  }

  [Fact]
  public void Handle_Fails_WhenSessionNotFound()
  {
    GuessWordResult result = guessWordHandler.Handle(
      "Wrong URL",
      Guid.NewGuid(),
      0,
      0,
      "any-word",
      new GameServer()
    );

    Assert.False(result.Success);
    Assert.Equal("Session not found", result.Message);
    Assert.Null(result.Session);
  }

  [Fact]
  public void Handle_Fails_WhenGameNotStarted()
  {
    var session = CreateSessionWithPlayers();
    var server = CreateServerWithSession(session);

    var result = guessWordHandler.Handle(
      session.Url,
      session.players[0].id,
      0,
      0,
      "any-word",
      server
    );

    Assert.False(result.Success);
    Assert.Equal("Game has not started", result.Message);
    Assert.Null(result.Session);
  }

  [Fact]
  public void Handle_Fails_WhenBoardMissing()
  {
    var session = CreateSessionWithPlayers();
    session.InGame = true;
    var server = CreateServerWithSession(session);

    var result = guessWordHandler.Handle(
      session.Url,
      session.players[0].id,
      0,
      0,
      "any-word",
      server
    );

    Assert.False(result.Success);
    Assert.Equal("Board has not been created", result.Message);
    Assert.Null(result.Session);
  }

  [Fact]
  public void Handle_Fails_WhenWrongTurn()
  {
    var session = CreateSessionWithPlayers();
    session.StartGame(10, wordService);
    var tile = session.Board!.Tiles[0];
    var server = CreateServerWithSession(session);

    var result = guessWordHandler.Handle(
      session.Url,
      session.players[1].id,
      tile.X,
      tile.Y,
      tile.Word,
      server
    );

    Assert.False(result.Success);
    Assert.Equal("It is not this player's turn", result.Message);
    Assert.Null(result.Session);
  }

  [Fact]
  public void Handle_Fails_WhenTileMissing()
  {
    var session = CreateSessionWithPlayers();
    session.StartGame(10, wordService);
    var server = CreateServerWithSession(session);

    var result = guessWordHandler.Handle(
      session.Url,
      session.players[0].id,
      999,
      999,
      "any-word",
      server
    );

    Assert.False(result.Success);
    Assert.Equal("Tile does not exist", result.Message);
    Assert.Null(result.Session);
  }

  [Fact]
  public void Handle_Fails_WhenPlayerOwnsTile()
  {
    var session = CreateSessionWithPlayers();
    session.StartGame(10, wordService);
    var currentPlayer = session.players[0];
    var tile = session.Board!.Tiles[0];
    tile.ControlledByPlayerId = currentPlayer.id;
    var server = CreateServerWithSession(session);

    var result = guessWordHandler.Handle(
      session.Url,
      currentPlayer.id,
      tile.X,
      tile.Y,
      tile.Word,
      server
    );

    Assert.False(result.Success);
    Assert.Equal("You already control this tile", result.Message);
    Assert.Null(result.Session);
  }

  [Fact]
  public void Handle_Fails_WhenGuessEmpty()
  {
    var session = CreateSessionWithPlayers();
    session.StartGame(10, wordService);
    var tile = session.Board!.Tiles[0];
    var server = CreateServerWithSession(session);

    var result = guessWordHandler.Handle(
      session.Url,
      session.players[0].id,
      tile.X,
      tile.Y,
      "",
      server
    );

    Assert.False(result.Success);
    Assert.Equal("You must guess a word", result.Message);
    Assert.Null(result.Session);
  }

  [Fact]
  public void Handle_AdvancesTurn_WhenWrongGuess()
  {
    var session = CreateSessionWithPlayers();
    session.StartGame(10, wordService);
    var tile = session.Board!.Tiles[0];
    var server = CreateServerWithSession(session);

    var result = guessWordHandler.Handle(
      session.Url,
      session.players[0].id,
      tile.X,
      tile.Y,
      "definitely-wrong",
      server
    );

    Assert.False(result.Success);
    Assert.Equal("Fel ord SOPA!", result.Message);
    Assert.NotNull(result.Session);
    Assert.Equal(1, session.CurrentPlayerIndex);
    Assert.Equal(2, session.TurnNumber);
  }

  [Fact]
  public void Handle_ClaimsTile_WhenGuessCorrect()
  {
    var session = CreateSessionWithPlayers();
    session.StartGame(10, wordService);
    var currentPlayer = session.players[0];
    var tile = session.Board!.Tiles[0];
    var server = CreateServerWithSession(session);

    var result = guessWordHandler.Handle(
      session.Url,
      currentPlayer.id,
      tile.X,
      tile.Y,
      tile.Word,
      server
    );

    Assert.True(result.Success);
    Assert.Equal("Correct word", result.Message);
    Assert.Equal(currentPlayer.id, tile.ControlledByPlayerId);
    Assert.Equal(1, session.PlayerScores[currentPlayer.id]);
    Assert.Equal(1, session.CurrentPlayerIndex);
    Assert.Equal(2, session.TurnNumber);
  }

  [Fact]
  public void Handle_StealsTile_WhenOwnedByOpponent()
  {
    var session = CreateSessionWithPlayers();
    session.StartGame(10, wordService);
    var currentPlayer = session.players[0];
    var previousOwner = session.players[1];
    var tile = session.Board!.Tiles[0];
    tile.ControlledByPlayerId = previousOwner.id;
    session.PlayerScores[previousOwner.id] = 2;
    var server = CreateServerWithSession(session);

    var result = guessWordHandler.Handle(
      session.Url,
      currentPlayer.id,
      tile.X,
      tile.Y,
      tile.Word,
      server
    );

    Assert.True(result.Success);
    Assert.Equal(1, session.PlayerScores[currentPlayer.id]);
    Assert.Equal(1, session.PlayerScores[previousOwner.id]);
    Assert.Equal(currentPlayer.id, tile.ControlledByPlayerId);
  }

  [Fact]
  public void Handle_EndsGame_WhenScoreIsThree()
  {
    var session = CreateSessionWithPlayers();
    session.StartGame(10, wordService);
    var currentPlayer = session.players[0];
    var tile = session.Board!.Tiles[0];
    session.PlayerScores[currentPlayer.id] = 2;
    var server = CreateServerWithSession(session);

    var result = guessWordHandler.Handle(
      session.Url,
      currentPlayer.id,
      tile.X,
      tile.Y,
      tile.Word,
      server
    );

    Assert.True(result.Success);
    Assert.False(session.InGame);
    Assert.NotNull(result.Session);
    Assert.False(result.Session!.InGame);
    Assert.Equal(3, session.PlayerScores[currentPlayer.id]);
  }
}
