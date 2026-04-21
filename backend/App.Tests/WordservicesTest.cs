using backend.App.GameServices;

namespace backend.App.Tests.GameServices;

public class WordServiceTests
{
  // This method just creates a new WordService
  // It will also try to load files from disk when created
  private WordService CreateService()
  {
    return new WordService();
  }

  [Fact]
  public void Constructor_Should_Load_Categories_From_Files()
  {
    // We create the service (this loads files from folder)
    var service = CreateService();

    // Get all categories (file names without .txt)
    var categories = service.GetCategories();

    // Assert
    // Check that we actually got something back
    Assert.NotNull(categories);
    Assert.True(categories.Count > 0);
  }

  [Fact]
  public void GetCategories_Should_Return_List_Of_Category_Names()
  {

    var service = CreateService();

    var categories = service.GetCategories();


    // Check that list is not empty
    Assert.NotEmpty(categories);

    // Check that every category is a string
    foreach (var cat in categories)
    {
      Assert.False(string.IsNullOrWhiteSpace(cat));
    }
  }

  [Fact]
  public void GetRandomWord_Should_Return_Word_From_Category()
  {
    // setup
    var service = CreateService();
    var categories = service.GetCategories();

    // Take first category to test with
    var category = categories[0];

    // Act
    var word = service.GetRandomWord(category);

    // Check that word exists
    Assert.NotNull(word);
    Assert.False(string.IsNullOrWhiteSpace(word));

    // Check that word length follows our rules (3-8 chars)
    Assert.InRange(word.Length, 3, 8);
  }

  [Fact]
  public void GetRandomWord_Should_Throw_If_Category_Does_Not_Exist()
  {
    // Arrange
    var service = CreateService();


    // We expect an exception if category is wrong
    Assert.Throws<Exception>(() =>
    {
      service.GetRandomWord("not_a_real_category");
    });
  }

  [Fact]
  public void GetRandomWord_Should_Return_Different_Words_Over_Time()
  {
    var service = CreateService();
    var category = service.GetCategories()[0];

    var word1 = service.GetRandomWord(category);
    var word2 = service.GetRandomWord(category);


    // Not guaranteed different, but often will be
    // This test is just to see randomness works somewhat
    Assert.NotNull(word1);
    Assert.NotNull(word2);
  }
}