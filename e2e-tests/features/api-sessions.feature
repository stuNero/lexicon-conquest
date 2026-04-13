Feature: API Sessions

    Scenario: Hämta alla sessions
        Given att jag öppnar "/api/sessions" i webbläsaren
        Then ska statuskoden vara 200
        And svaret ska vara en JSON-array
        And varje session ska ha en unik URL
        And varje session ska ha en lista av players

    Scenario: Hämta specifik session
        Given att jag öppnar "/api/sessions?url=df2e988a" i webbläsaren
        Then ska svaret vara en array med 1 session
        And sessionens URL ska matcha den efterfrågade