Feature: Start Game

  Scenario: Host can start the game after all players are ready
    Given a new session is created with host "Host"
    And another player "Player2" joins the session
    When both players toggle ready
    Then the host can start the game
    And the session is marked as inGame
