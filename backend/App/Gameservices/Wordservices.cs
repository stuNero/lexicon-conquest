namespace backend.App.GameServices;

public class WordService
{
  // Store all word lists in memory were using dictionary for this to use Key=filenames=category Words=values 
  // key = category name (file name without .txt)
  // value = list of words from that file
  private readonly Dictionary<string, List<string>> _lists;

  // One random instance reused (better than creating new every time)
  private static readonly Random _random = new Random();

  public WordService()
  {
    // Build path to folder where all word files are
    var folder = Path.Combine(
        Directory.GetCurrentDirectory(),
        "Wordlists"
    );

    // Make sure folder exists
    if (!Directory.Exists(folder))
      throw new Exception($"Wordlists folder not found at: {folder}");

    // make a container where we store all categories and their words
    _lists = new Dictionary<string, List<string>>();

    // Get all .txt files in folder
    var files = Directory.GetFiles(folder, "*.txt");

    // Loop all files and load them into memory
    foreach (var file in files)
    {
      // Use file name as category (example: animals.txt -> animals)
      var category = Path.GetFileNameWithoutExtension(file);

      /* Read and clean words clean away potential whitespace, filter and to max min size 3-8, normalize too small letter,
      store as a list in memory */
      var words = File.ReadLines(file)
    .Select(w => w.Trim())
    .Where(w => w.Length >= 3 && w.Length <= 8)
    .Select(w => w.ToLower())
    .ToList();

      // put the words into the dictionary using category as label(KEY)
      _lists[category] = words;
    }

    // Make sure we actually loaded something
    if (_lists.Count == 0)
      throw new Exception("No wordlists found in folder");
  }

  // Get random word from a category
  public string GetRandomWord(string category)
  {
    // Checks if category exists
    if (!_lists.ContainsKey(category))
      throw new Exception($"Category not found: {category}");

    var words = _lists[category];

    // Make sure list is not empty
    if (words.Count == 0)
      throw new Exception($"Word list is empty for category: {category}");

    // Return random word
    return words[_random.Next(words.Count)];
  }

  // Get all available categories (file names)
  public List<string> GetCategories()
  {
    return _lists.Keys.ToList();
  }
}


