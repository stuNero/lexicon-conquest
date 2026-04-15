Feature: API Sessions

    Scenario: Hämta alla sessions
        Given att jag öppnar "/api/sessions" i webbläsaren
        Then ska statuskoden inte vara 404
        And svaret ska vara en JSON-array
        And varje session ska ha en unik URL
        And varje session ska ha en lista av players

  