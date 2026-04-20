using backend.Gamecomponents;
using backend.DTO;
public static class BoardMapper
{
  public static BoardDto ToDto(Board board)
  {
    var dto = new BoardDto
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

    return dto;
  }
}