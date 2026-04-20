using backend.Gamecomponents;
using backend.DTO;

// Mapper = converts internal game objects into DTOs
// Think of this as a "translator" between backend and frontend
public static class BoardMapper
{
  public static BoardDto ToDto(Board board)
  {
    var dto = new BoardDto
    // Calculate size from tiles (since Board stores them flat)
    {
      Width = board.Tiles.Max(t => t.X) + 1,
      Height = board.Tiles.Max(t => t.Y) + 1
    };

    foreach (var tile in board.Tiles)
    {
      dto.Tiles.Add(new TileDto(
     tile.X,
     tile.Y,
     tile.Word
   ));
    }
    // Return clean data ready for frontend
    return dto;
  }
}
// IMPORTANT:
// We NEVER send the real Board object directly to frontend
// because it contains internal logic and references (like neighbors)
// Instead we convert it into a simple DTO that is safe and easy to use
// Think DTO as the format we want to send to Frontend and Mapper as the transformer for that data