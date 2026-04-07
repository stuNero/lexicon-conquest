using System.Text.Json;
using System.Text.Json.Nodes;
using backend;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors();

var app = builder.Build();

app.UseCors(policy =>
    policy.AllowAnyOrigin()
          .AllowAnyMethod()
          .AllowAnyHeader());

GameEngine gameEngine = new GameEngine();
List<Player> players = [];
foreach (Player player in gameEngine.gameSessions[0].players)
{
    players.Add(player);
}
Player[] playersArray = players.ToArray();

var playerNamesJSON = JsonSerializer.Serialize(playersArray);
app.MapGet("/api/getSessions", () => new
{
    players = playersArray,
    sessionURL = gameEngine.gameSessions[0].Url
});


app.Run();