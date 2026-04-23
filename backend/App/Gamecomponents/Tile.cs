namespace backend.Gamecomponents;

// 1 Tile on the board
public class Tile
{
  // X-position (kolumn)
  public int X { get; }

  // Y-position (rad)
  public int Y { get; }

  // List over neighbors (adjacent tiles)
  public List<Tile> Neighbors { get; } = new List<Tile>();

  // each tile has a word
  public string Word { get; set; }
  public string MaskWord { get; set; }

  public Guid ControlledByPlayerId { get; set; }
  public Tile(int x, int y)
  {
    X = x;
    Y = y;
    Word = "";
    MaskWord = "";
    ControlledByPlayerId = Guid.Empty;
  }
}