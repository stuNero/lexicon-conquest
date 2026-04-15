using Microsoft.AspNetCore.Identity.Data;

namespace backend;

public class Player
{
  public Guid id { get; set; } = Guid.NewGuid();
  public string UserName { get; set; }
  public bool Ready { get; set; }
  public Player(string userName, bool ready)
  {
    UserName = userName;
    Ready = ready;
  }
}