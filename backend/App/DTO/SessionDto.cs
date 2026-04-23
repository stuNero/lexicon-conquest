
namespace backend.DTO;

public class SessionDto
{
  public string? Url { get; set; }
  public Player[]? Players { get; set; }
  public bool InGame { get; set; }
  public int CurrentPlayerIndex { get; set; }
  public int TurnNumber { get; set; }
  public Guid? CurrentPlayerId { get; set; }
  public BoardDto? Board { get; set; }
  public required Dictionary<Guid, int> PlayerScores { get; set; }
}
// DTO for the session data we want to send to the frontend.
// This keeps the API response shape clear instead of sending the full backend GameSession object.
// Think DTO as nice package of Data organized in box just as frontend wants it.
