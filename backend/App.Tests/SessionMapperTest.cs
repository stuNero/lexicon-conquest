using backend.App.GameServices;
using backend.DTO;

namespace backend.Tests;

public class SessionMapperTest
{
  [Fact]
  public void ToDto_MapsSession()
  {
    var wordService = new WordService();
    var session = new GameSession();
    var firstPlayer = new Player("testHostPlayer1", true, true);
    var secondPlayer = new Player("testPlayer2", true, false);
    session.players.Add(firstPlayer);
    session.players.Add(secondPlayer);
    session.CurrentPlayerIndex = 1;
    session.TurnNumber = 4;
    session.PlayerScores[firstPlayer.id] = 2;
    session.StartGame(10, wordService);
    session.CurrentPlayerIndex = 1;
    session.TurnNumber = 4;

    var dto = SessionMapper.ToDto(session);

    Assert.Equal(session.Url, dto.Url);
    Assert.Equal(2, dto.Players!.Length);
    Assert.Equal(secondPlayer.id, dto.CurrentPlayerId);
    Assert.NotNull(dto.Board);
    Assert.Equal(10, dto.Board!.Width);
    Assert.Equal(10, dto.Board.Height);
    Assert.Same(session.PlayerScores, dto.PlayerScores);
  }
}
