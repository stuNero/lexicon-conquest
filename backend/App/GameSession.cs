namespace backend;

using backend.Gamecomponents;
public class GameSession
{
  public string Url;
  public List<Player> players;
  public Board? Board { get; set; }
  public GameSession()
  {
    Url = Guid.NewGuid().ToString().Substring(0, 8);
    players = new List<Player>();
  }
}