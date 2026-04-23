namespace backend.Tests;

public class PlayerTest
{
  [Fact]
  public void Player_SetsValues_WhenConstructed()
  {
    var player = new Player("testPlayer", true, false);

    Assert.Equal("testPlayer", player.UserName);
    Assert.True(player.Ready);
    Assert.False(player.IsHost);
    Assert.NotEqual(Guid.Empty, player.id);
  }
}
