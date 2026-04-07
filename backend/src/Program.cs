using System.Text.Json;
using System.Text.Json.Nodes;
using backend;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors();

builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(option =>
{
    option.Cookie.HttpOnly = true;
    option.Cookie.IsEssential = true;
}
);

var app = builder.Build();
app.UseSession();

app.UseCors(policy =>
    policy.AllowAnyOrigin()
          .AllowAnyMethod()
          .AllowAnyHeader());

GameEngine gameEngine = new GameEngine();


ApiRoutes.GetPlayers(app, gameEngine.gameSessions[0]);
ApiRoutes.GetSessionURL(app, gameEngine.gameSessions[0]);

app.Run();