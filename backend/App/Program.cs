using System.Text.Json;
using System.Text.Json.Nodes;
using backend;
using backend.App.GameServices;
using backend.Gamecomponents;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<GameServer>();
builder.Services.AddSignalR();
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(option =>
{
    option.Cookie.HttpOnly = true;
    option.Cookie.IsEssential = true;
});

var app = builder.Build();
app.MapHub<GameHub>("/gamehub");

// this two use makes the program to go through wwwroot folder to get the 
// frontend when we start backend.
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseSession();


GameServer Server = new GameServer();
var wordService = new WordService();

Endpoints.GetSessions(app, Server);
Endpoints.CreatePlayer(app, Server);
Endpoints.DeleteSession(app, Server);
Endpoints.ToggleReady(app, Server);
Endpoints.CreateSession(app, Server);
GameEndpoints.StartGame(app, Server, wordService);
GameEndpoints.ClaimTile(app, Server);


// this endpoint is for render to see that backend is working fine
app.MapGet("/api/health", () => Results.Ok("OK"));


app.Run();