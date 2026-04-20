using System.Text.Json;
using System.Text.Json.Nodes;
using backend;

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
app.UseSession();

Endpoints.GetSessions(app);
Endpoints.CreatePlayer(app);
Endpoints.DeleteSession(app);
Endpoints.ToggleReady(app);
Endpoints.CreateSession(app);
Endpoints.StartGame(app);
app.Run();