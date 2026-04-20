using backend.DTO;
public class BoardDto
{
  public int Width { get; set; }
  public int Height { get; set; }

  public List<TileDto> Tiles { get; set; } = new();
}