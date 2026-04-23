using backend.App.GameServices;
using Xunit;

namespace backend.Tests;

public class GameSessionTest
{
  GameSession testSession { get; }
  public GameSessionTest()
  {
    testSession = new GameSession();
  }
  [Fact]
  public void CurrentPlayer_ReturnsNull_WhenSessionHasNoPlayers()
  {

    Assert.Null(testSession.CurrentPlayer());
  }
  [Fact]
  public void NextTurn_RotatesPlayer_Correctly()
  {
    testSession.players.Add(new Player("testHostPlayer1", true, true));
    testSession.players.Add(new Player("testPlayer2", true, false));
    testSession.players.Add(new Player("testPlayer3", true, false));

    Assert.Equal(0, testSession.CurrentPlayerIndex);
    testSession.NextTurn();
    Assert.Equal(1, testSession.CurrentPlayerIndex);
    testSession.NextTurn();
    Assert.Equal(2, testSession.CurrentPlayerIndex);
    testSession.NextTurn();
    Assert.Equal(0, testSession.CurrentPlayerIndex);
  }
  [Fact]
  public void NextTurn_IncrementsTurns()
  {
    testSession.players.Add(new Player("testHostPlayer1", true, true));
    testSession.players.Add(new Player("testPlayer2", true, false));
    Assert.Equal(1, testSession.TurnNumber);
    testSession.NextTurn();
    Assert.Equal(2, testSession.TurnNumber);
    testSession.NextTurn();
    Assert.Equal(3, testSession.TurnNumber);
    testSession.NextTurn();
    Assert.Equal(4, testSession.TurnNumber);
  }
  [Fact]
  public void StartGame_SetsInGameAndCreatesBoard_WhenCalled()
  {
    WordService wordService = new();
    testSession.StartGame(10, wordService);

    Assert.True(testSession.InGame);
    Assert.NotNull(testSession.Board);
    Assert.Equal(1, testSession.TurnNumber);
  }

}