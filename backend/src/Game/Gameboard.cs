namespace backend.Game;

// Board = hela spelplanen den är dynamisk så - var board = new Board(10, 10); när du behöver ett board så kan du bestämma storlek
public class Board
{
  //  (grid) som håller alla tiles tänk: ett rutnät där du kan slå upp via [x, y]
  private Tile[,] _grid;

  // En "platt" lista av alla tiles bra för loopar och tester
  public List<Tile> Tiles { get; } = new List<Tile>();

  private int _width;
  private int _height;

  public Board(int width, int height)
  {
    _width = width;
    _height = height;

    // Skapar själva grid-strukturen i minnet
    _grid = new Tile[width, height];

    //  kallar på skapa alla tiles
    CreateTiles();

    // Steg 2: koppla ihop neighbors
    ConnectedTiles();
  }
  //  SKAPA ALLA TILES
  private void CreateTiles()
  {
    // Loopar igenom hela griden. x = kolumn
    for (int x = 0; x < _width; x++)
    {
      // y = rad
      for (int y = 0; y < _height; y++)
      {
        // Skapar en ny tile på position (x, y)
        var tile = new Tile(x, y);

        // Sparar den i griden 
        _grid[x, y] = tile;

        // Lägger även i lista 
        Tiles.Add(tile);
      }
    }
  }


  //STEG 2: KOPPLA GRANNAR

  private void ConnectedTiles()
  {
    // Vi går igenom alla tiles igen
    for (int x = 0; x < _width; x++)
    {
      for (int y = 0; y < _height; y++)
      {
        var tile = _grid[x, y];

        // UPP (y - 1) Bara om vi INTE är längst upp
        if (y > 0)
          tile.Neighbors.Add(_grid[x, y - 1]);

        //NER (y + 1) Bara om vi INTE är längst ner
        if (y < _height - 1)
          tile.Neighbors.Add(_grid[x, y + 1]);

        // VÄNSTER (x - 1)
        if (x > 0)
          tile.Neighbors.Add(_grid[x - 1, y]);

        // HÖGER (x + 1)
        if (x < _width - 1)
          tile.Neighbors.Add(_grid[x + 1, y]);

        // Viktigt: Vi lägger INTE till diagonaler bara 4 grannar upp ner vänster höger.
      }
    }
  }

  // HÄMTA TILE

  public Tile GetTile(int x, int y)
  {
    // Returnerar direkt från griden 
    return _grid[x, y];
  }
}