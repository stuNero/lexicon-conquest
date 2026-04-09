namespace backend;

public class GameServer
{
  public List<GameSession> gameSessions;
  public GameServer()
  {
    gameSessions = new List<GameSession>();
    gameSessions.Add(new GameSession());
    gameSessions.Add(new GameSession());
    gameSessions.Add(new GameSession());
  }
}