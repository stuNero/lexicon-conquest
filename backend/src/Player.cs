using Microsoft.AspNetCore.Identity.Data;

namespace backend;

public class Player
{
  public string UserName { get; set; }
  public bool Ready { get; set; }
  public Player(string userName, bool ready)
  {
    UserName = userName;
    Ready = ready;
  }
}