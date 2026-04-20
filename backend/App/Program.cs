using System.Text.Json;
using System.Text.Json.Nodes;
using backend;
using backend.App.GameServices;
using backend.Gamecomponents;

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

// this two use makes the program to go through wwwroot folder to get the 
// frontend when we start backend.
app.UseDefaultFiles(); 
app.UseStaticFiles();

app.UseSession();

app.UseCors(policy =>
    policy.AllowAnyOrigin()
          .AllowAnyMethod()
          .AllowAnyHeader());

GameServer Server = new GameServer();
var wordService = new WordService();

Endpoints.GetSessions(app, Server);
Endpoints.CreatePlayer(app, Server);
Endpoints.DeleteSession(app, Server);
Endpoints.ToggleReady(app, Server);
Endpoints.CreateSession(app, Server);
Endpoints.StartGame(app, Server, wordService);
app.Run();