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

GameEngine engine = new GameEngine();

Endpoints.GetSessions(app, engine);
Endpoints.CreateSession(app, engine);
Endpoints.CreatePlayer(app, engine);
Endpoints.DeleteSession(app, engine);
Endpoints.ToggleReady(app, engine);
app.Run();