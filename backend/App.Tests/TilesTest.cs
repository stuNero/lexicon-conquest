using Xunit;
using backend.Gamecomponents;

namespace backend.Tests;

// These test only test how tiles and neighbur tiles works in isolation.
public class TileTests
{
  [Fact]
  public void Tile_Should_Store_X_And_Y()
  {

    var tile = new Tile(3, 5);

    // Check that position is saved correctly
    Assert.Equal(3, tile.X);
    Assert.Equal(5, tile.Y);
  }

  [Fact]
  public void Tile_ShouldStartEmpty()
  {
    var tile = new Tile(0, 0);

    Assert.Equal("", tile.Word);
    Assert.Equal("", tile.MaskWord);
    Assert.Equal(Guid.Empty, tile.ControlledByPlayerId);
  }
}
