import Board from "./Board";
import type Player from "./Player";

export default interface GameSession {
  id: string,
  players: Player[],
  inGame: boolean,
  currentPlayerIndex: number,
  turnNumber: number,
  board: Board;
};