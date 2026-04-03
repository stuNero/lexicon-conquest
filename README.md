# Lexicon Conquest
_A wordgame project for the '__Test, Integration och Leverans course__'._

*demo picture | not final product* <br/>
<img alt="demo picture of board" src="public/demo-board.png" style="width:400px">

## Description
A grid-styled wordgame where you guess the word of a tile to capture it and then conquer the world!
A player traverses the grid by capturing tiles, you win by either reaching a max score or conquering your
opponents tiles.
## Game Rules
- __Turn-Based__
  - With a turn timer
- __Action Points__ for each player, starting with 1
  - One action point per controlled tile!
- __Capture Tiles__ by guessing the word
  - __Capturing__ can only be done from adjacent tiles that are already controlled
- __Win__ by any chosen condition:
  - __Total score__
    - Achieve the set score
  - __Objective__
    - Defeat a certain player
    - Control a certain amount of tiles
  - __Domination__
    - Capture every controlled tile of the other players
- __Special Tiles__ can be captured for unique abilities!
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

## Contributors:
- Amir Jafari ➡️ https://github.com/amirhamza247
- Ha-Viet Kok ➡️ https://github.com/havietkok-sys
- Oliver Apelquist ➡️ https://github.com/OliverApel96
- Max Vemic ➡️ https://github.com/stuNero
