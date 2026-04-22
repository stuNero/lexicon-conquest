using System.Text.Json;
using System.Text.Json.Nodes;
using backend;
using backend.App.GameServices;
using backend.Gamecomponents;

var builder = WebApplication.CreateBuilder(args);

// GameServer is our shared in-memory session store.
// As singleton so endpoints and SignalR use the same session list.
builder.Services.AddSingleton<GameServer>();
builder.Services.AddSignalR();
builder.Services.AddDistributedMemoryCache();
// WordService is shared so game boards can be created through dependency injection too.
builder.Services.AddSingleton<WordService>();

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


Endpoints.GetSessions(app);
Endpoints.CreatePlayer(app);
Endpoints.DeleteSession(app);
Endpoints.ToggleReady(app);
Endpoints.CreateSession(app);
GameEndpoints.StartGame(app);
GameEndpoints.ClaimTile(app);


// this endpoint is for render to see that backend is working fine
app.MapGet("/api/health", () => Results.Ok("OK"));


app.Run();