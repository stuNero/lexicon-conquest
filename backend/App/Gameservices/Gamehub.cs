using System.Threading.Tasks.Dataflow;
using Microsoft.AspNetCore.SignalR;
namespace backend;

using backend.DTO;
public class GameHub : Hub
{
  private readonly GameServer _server;

  public GameHub(GameServer server)
  {
    _server = server;
  }
  public async Task JoinSession(string url)
  {
    await Groups.AddToGroupAsync(Context.ConnectionId, url);
    var session = _server.gameSessions
            .FirstOrDefault(s => s.Url == url);

    if (session != null)
    {
      await Clients.Caller.SendAsync("SessionUpdated", SessionMapper.ToDto(session));

    }
  }
  public async Task LeaveSession(string url)
  {
    await Groups.RemoveFromGroupAsync(Context.ConnectionId, url);
  }
}