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
  public void Tile_Should_Start_With_Empty_Neighbors_List()
  {

    var tile = new Tile(0, 0);

    // Check that neighbors list is empty at start
    Assert.Empty(tile.Neighbors);
  }

  [Fact]
  public void Tile_Should_Allow_Adding_Neighbors()
  {
    var tile = new Tile(0, 0);
    var neighbor = new Tile(1, 0);

    // Add neighbor manually
    tile.Neighbors.Add(neighbor);

    // Check that neighbor was added
    Assert.Single(tile.Neighbors);
    Assert.Contains(neighbor, tile.Neighbors);
  }

  [Fact]
  public void Tile_Should_Keep_Reference_To_Same_Neighbor_Object()
  {

    var tile = new Tile(0, 0);
    var neighbor = new Tile(1, 0);

    // Add neighbor
    tile.Neighbors.Add(neighbor);

    // get the same object back from the list
    var sameNeighbor = tile.Neighbors[0];

    // Check that it's the same object (not a copy) Its to verify that they point to the same object in memory.
    Assert.True(object.ReferenceEquals(neighbor, sameNeighbor));
  }

  [Fact]
  public void Tile_Should_Handle_Multiple_Neighbors()
  {
    // Create tiles
    var tile = new Tile(0, 0);
    var n1 = new Tile(1, 0);
    var n2 = new Tile(0, 1);
    var n3 = new Tile(-1, 0);

    // Add multiple neighbors
    tile.Neighbors.Add(n1);
    tile.Neighbors.Add(n2);
    tile.Neighbors.Add(n3);

    // Check count
    Assert.Equal(3, tile.Neighbors.Count);

    // Check all exist
    Assert.Contains(n1, tile.Neighbors);
    Assert.Contains(n2, tile.Neighbors);
    Assert.Contains(n3, tile.Neighbors);
  }

  [Fact]
  public void Tile_Should_Not_Affect_Other_Tiles_When_Adding_Neighbors()
  {
    // Create two tiles
    var tileA = new Tile(0, 0);
    var tileB = new Tile(1, 1);

    // Add neighbor only to A
    tileA.Neighbors.Add(tileB);

    // Check A has neighbor
    Assert.Single(tileA.Neighbors);

    // Check B still has no neighbors
    Assert.Empty(tileB.Neighbors);
  }
}