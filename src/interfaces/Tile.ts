export default interface Tile {
  x: number;
  y: number;
  word: string;
  controlledByPlayerId: string;
  color: string | "bg-stone-500";
};