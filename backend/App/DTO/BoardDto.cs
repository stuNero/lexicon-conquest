using backend.DTO;

// This is what we SEND to the frontend
// DTO = Data Transfer Object
// It is a "clean version" of our Board without internal logic
public class BoardDto
{
  public int Width { get; set; }
  public int Height { get; set; }

  // Flat list of all tiles (easy for frontend to loop through)
  public List<TileDto> Tiles { get; set; } = new();
}