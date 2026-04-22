import Tile from "./PrintTile";
import type Board from "../interfaces/Board";
import type Player from "../interfaces/Player";

export default function PrintBoard({ board, players }: { board?: Board; players?: Player[]; }) {
  if (!board) return null;
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${board.height}, 1fr)`,
        gridTemplateRows: `repeat(${board.width}, 1fr)`
      }}
      className="z-50 m-2 p-3 gap-0.5 rounded-2xl border border-emerald-600 bg-slate-800"
    >
      {
        board.tiles?.map((tile) => {
          const controllingPlayer = players?.find(p => p.id === tile.controlledByPlayerId);
          return <Tile tile={tile} playerColor={controllingPlayer?.color} key={`${tile.x}-${tile.y}`} />;
        })
      }
    </div>
  );
};