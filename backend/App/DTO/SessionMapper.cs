
namespace backend.DTO;

public static class SessionMapper
{
  public static SessionDto ToDto(GameSession session)
  {
    return new SessionDto
    {
      Url = session.Url,
      Players = session.players.ToArray(),
      InGame = session.InGame,
      CurrentPlayerIndex = session.CurrentPlayerIndex,
      TurnNumber = session.TurnNumber,
      CurrentPlayerId = session.CurrentPlayer()?.id,
      Board = session.Board == null ? null : BoardMapper.ToDto(session.Board),
      PlayerScores = session.PlayerScores
    };
  }
}
