namespace backend;

public class GameSession
{
  public string Url { get; set; }
  public List<Player> players { get; set; }
  public GameSession()
  {
    Url = Guid.NewGuid().ToString().Substring(0, 8);
    players = new List<Player>();
  }
}