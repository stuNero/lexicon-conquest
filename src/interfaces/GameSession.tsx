import type Player from "./Player";

export default interface GameSession {
  id: string,
  players: Player[];
};