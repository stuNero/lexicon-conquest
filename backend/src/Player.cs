using Microsoft.AspNetCore.Identity.Data;

namespace backend;

public class Player
{
  public Guid id { get; set; }
  public string UserName { get; set; }
  public bool Ready { get; set; }
  public Player(string userName, bool ready)
  {
    id = Guid.NewGuid();
    UserName = userName;
    Ready = ready;
  }
}