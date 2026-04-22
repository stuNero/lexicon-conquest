import { useState } from "react";
import type Tile from "../interfaces/Tile";
import WordPopUp from "./WordPopUp";
import fetchJson from "../utils/fetchJson";


export default function PrintTile({ tile, playerColor }: { tile: Tile; playerColor?: string; }) {
  const [showPopup, setShowPopup] = useState(false);
  async function claimTile(x: number, y: number) {
    await fetchJson(`/api/sessions/${localStorage.getItem("sessionID")}/claim-tile`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          playerID: localStorage.getItem("playerID"),
          x: x,
          y: y
        })
      });
  };
  return (
    <>
      <button
        onClick={() => {
          setShowPopup(true);
          claimTile(tile.x, tile.y);
        }}
        style={{
          gridColumn: tile.x + 1,
          gridRow: tile.y + 1
        }}
        className={`
        aspect-square border
        h-fit px-2
        flex text-center items-center
        ${playerColor || "bg-stone-500"}
        hover:bg-stone-600 bg-cover
      `}>
        {tile.word}
      </button>
      {showPopup && <WordPopUp word={tile.word} onClose={() => setShowPopup(false)} />}
    </>
  );
};