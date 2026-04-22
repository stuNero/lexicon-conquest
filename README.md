# LexiConquest
_A wordgame project for the '__Test, Integration och Leverans course__'._

*demo picture | not final product* <br/>
<img alt="demo picture of board" src="public/demo-board.png" style="width:400px">

## Description
A multiplayer wordgame where you capture tiles by guessing each letter 'hang-man' style 
on a map grid to get stronger and win over your opponents! 

## Game Rules
- __Turn-Based__
  - With a turn timer
- __Capture Tiles__ by guessing the word
  - __Capturing__ can only be done from adjacent tiles that are already controlled
<img src="public/captured-tiles.png" style="width:300px">

- __Action Points__ for each player, starting with 1
  - One action point per controlled tile!
- __Win__ by any chosen condition:
  - __Total score__
    - Achieve the set score
  - __Objective__
    - Defeat a certain player
    - Control a certain amount of tiles
  - __Domination__
    - Capture every controlled tile of the other players
- __Special Tiles__ can be captured for unique abilities! (planned)
## Turn Flow
<img src="public/game-flow.png" style="width:800px">

## How To Run
### Needs to be installed:
- Nodejs v24.14
1. Clone the project: <br/>``` git clone git@github.com:stuNero/lexicon-conquest.git```
2. Run in terminal:
- ```npm install```
- ```npm run dev```
## Tech Stack
- React + JS
- C#
- xUnit

## To view the game live go to:
[lexicon-conquest.onrender.com](https://lexicon-conquest.onrender.com/)




## Testplan
In this project we use teststrageti that is integrated through out the whole process. Our main focus has been on TDD and BDD development. 
We have used following tests:
unit-test with xUnit
API-test with Post-they
e2e-test with Playwright and Gherkin

All the tests run automatically in our CI-pipeline on every push and pull requests to DEV and main branches. From security viewpoint our pipeline checks for leaked secrets via Gitleaks, NPM Audit, dotnet list package to find any vulnarabilities in dependencies and Trivy to scan the Docker-container for critial risks. 


## CI/CD Pipeline


## Contributors:
- Amir Jafari ➡️ https://github.com/amirhamza247
- Ha-Viet Kok ➡️ https://github.com/havietkok-sys
- Oliver Apelquist ➡️ https://github.com/OliverApel96
- Max Vemic ➡️ https://github.com/stuNero
