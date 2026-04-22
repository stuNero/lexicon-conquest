import type Tile from "../interfaces/Tile";
export default interface Board {
  width: number;
  height: number;
  tiles: Tile[];
}