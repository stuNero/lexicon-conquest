using Microsoft.AspNetCore.Identity.Data;

namespace backend;

public class Player
{
  public Guid id { get; set; } = Guid.NewGuid();
  public string UserName { get; set; }
  public bool Ready { get; set; }
  public bool IsHost { get; set; }
  public Player(string userName, bool ready, bool isHost)
  {
    UserName = userName;
    Ready = ready;
    IsHost = isHost;
  }
}