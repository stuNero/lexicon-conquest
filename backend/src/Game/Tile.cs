namespace backend.Game;

// 1 Tile on the board
public class Tile
{
  // X-position (kolumn)
  public int X { get; }

  // Y-position (rad)
  public int Y { get; }

  // List over neighbors (adjacent tiles)
  public List<Tile> Neighbors { get; } = new List<Tile>();

  public Tile(int x, int y)
  {
    X = x;
    Y = y;
  }
}