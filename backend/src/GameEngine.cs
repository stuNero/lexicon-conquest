namespace backend;

public class GameEngine
{
  public List<GameSession> gameSessions;
  public GameEngine()
  {
    gameSessions = new List<GameSession>();
    gameSessions.Add(new GameSession());
  }
}