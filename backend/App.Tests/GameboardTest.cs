using Xunit;
using backend.Gamecomponents;

namespace backend.Tests;

public class BoardTests
{
  // checks that board creates correct amount of tiles
  [Fact]
  public void Board_Should_Create_Correct_Number_Of_Tiles()
  {
    var board = new Board(10, 10);

    Assert.Equal(100, board.Tiles.Count);
  }

  // checks that tiles have correct x and y values
  [Fact]
  public void GetTile_Should_Return_Correct_Coordinates()
  {
    var board = new Board(5, 5);

    var tile = board.GetTile(2, 3);

    Assert.Equal(2, tile.X);
    Assert.Equal(3, tile.Y);
  }

  // checks that middle tile has 4 neighbors
  [Fact]
  public void Middle_Tile_Should_Have_4_Neighbors()
  {
    var board = new Board(5, 5);

    var tile = board.GetTile(2, 2);

    Assert.Equal(4, tile.Neighbors.Count);
  }

  // checks that corner tile has 2 neighbors
  [Fact]
  public void Corner_Tile_Should_Have_2_Neighbors()
  {
    var board = new Board(5, 5);

    var tile = board.GetTile(0, 0);

    Assert.Equal(2, tile.Neighbors.Count);
  }

  // checks that edge tile (not corner) has 3 neighbors
  [Fact]
  public void Edge_Tile_Should_Have_3_Neighbors()
  {
    var board = new Board(5, 5);

    var tile = board.GetTile(0, 2);

    Assert.Equal(3, tile.Neighbors.Count);
  }

  // checks that tile does not get diagonal neighbors
  [Fact]
  public void Tile_Should_Not_Have_Diagonal_Neighbors()
  {
    var board = new Board(5, 5);

    var tile = board.GetTile(2, 2);

    var neighborCoords = tile.Neighbors
        .Select(n => (n.X, n.Y))
        .ToList();

    Assert.Contains((2, 1), neighborCoords);
    Assert.Contains((2, 3), neighborCoords);
    Assert.Contains((1, 2), neighborCoords);
    Assert.Contains((3, 2), neighborCoords);

    Assert.DoesNotContain((1, 1), neighborCoords);
    Assert.DoesNotContain((3, 3), neighborCoords);
  }

  // checks that gettile returns same object every time
  [Fact]
  public void GetTile_Should_Return_Same_Instance()
  {
    var board = new Board(5, 5);

    var tile1 = board.GetTile(1, 1);
    var tile2 = board.GetTile(1, 1);

    Assert.Same(tile1, tile2);
  }

  // checks that board throws if too small
  [Fact]
  public void Board_Should_Throw_If_Too_Small()
  {
    Assert.Throws<ArgumentException>(() => new Board(1, 1));
    Assert.Throws<ArgumentException>(() => new Board(0, 5));
  }

  // checks that board throws if too large
  [Fact]
  public void Board_Should_Throw_If_Too_Large()
  {
    Assert.Throws<ArgumentException>(() => new Board(26, 10));
    Assert.Throws<ArgumentException>(() => new Board(10, 30));
  }

  // checks that board works for smallest valid size
  [Fact]
  public void Board_Should_Work_For_Min_Size()
  {
    var board = new Board(2, 2);

    Assert.Equal(4, board.Tiles.Count);
  }

  // checks that neighbors are linked both ways
  [Fact]
  public void Neighbors_Should_Be_Symmetric()
  {
    var board = new Board(5, 5);

    var tile = board.GetTile(2, 2);
    var neighbor = tile.Neighbors.First();

    Assert.Contains(tile, neighbor.Neighbors);
  }
}