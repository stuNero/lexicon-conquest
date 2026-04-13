namespace backend;

public class GameSession
{
  public string Url;
  public List<Player> players;
  public GameSession()
  {
    Url = Guid.NewGuid().ToString().Substring(0, 8);
    players = new List<Player>();

    players.Add(new("nero", true));
    players.Add(new("oliver", false));
    players.Add(new("amir", true));
    players.Add(new("haviet", false));

  }
}