namespace backend;

using backend.App.GameServices;
using backend.Gamecomponents;
public class GameSession
{
  public string Url { get; set; }
  public List<Player> players { get; set; }
  public Board? Board { get; set; }
  //Nytt
  public bool InGame { get; set; } = false;
  public int CurrentPlayerIndex { get; set; } = 0;
  public int TurnNumber { get; set; } = 1;
  public Dictionary<Guid, int> PlayerScores { get; set; }
  public GameSession()
  {
    Url = Guid.NewGuid().ToString().Substring(0, 8);
    players = new List<Player>();
    PlayerScores = new Dictionary<Guid, int>();
  }
  public Player? CurrentPlayer()
  {
    if (players.Count == 0)
      return null;

    return players[CurrentPlayerIndex];
  }
  public void StartGame(int boardSize, WordService wordService)
  {
    Board = new Board(boardSize, boardSize, wordService, "common_words");
    InGame = true;
    CurrentPlayerIndex = 0;
    TurnNumber = 1;
  }
  public void NextTurn()
  {
    if (players.Count == 0)
      return;

    CurrentPlayerIndex = (CurrentPlayerIndex + 1) % players.Count;
    TurnNumber++;
  }
}
