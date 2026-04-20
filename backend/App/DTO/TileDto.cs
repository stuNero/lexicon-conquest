namespace backend.DTO;
// This is a simplified version of Tile for the frontend
// only include what the UI needs, nothing extra
public class TileDto
{
  public int X { get; set; }
  public int Y { get; set; }

  // The word shown to the player (later this can be masked)
  public string Word { get; set; }

  public TileDto(int x, int y, string word)
  {
    X = x;
    Y = y;
    Word = word;
  }
}