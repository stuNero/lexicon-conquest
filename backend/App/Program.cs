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

// this two use makes the program to go through wwwroot folder to get the 
// frontend when we start backend.
app.UseDefaultFiles(); 
app.UseStaticFiles();

app.UseSession();



// this endpoint is for render to see that backend is working fine
app.MapGet("/api/health", () => Results.Ok("OK"));
Endpoints.GetSessions(app);
Endpoints.CreatePlayer(app);
Endpoints.DeleteSession(app);
Endpoints.ToggleReady(app);
Endpoints.CreateSession(app);
Endpoints.StartGame(app);

app.Run();