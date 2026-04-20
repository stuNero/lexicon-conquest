namespace backend.DTO;

public class TileDto
{
  public int X { get; set; }
  public int Y { get; set; }

  public string Word { get; set; }

  public TileDto(int x, int y, string word)
  {
    X = x;
    Y = y;
    Word = word;
  }
}