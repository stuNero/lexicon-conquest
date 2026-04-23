import { useState } from "react";
import type Tile from "../interfaces/Tile";
import WordPopUp from "./WordPopUp";
import Player from "../interfaces/Player";
import GameSession from "../interfaces/GameSession";

export default function PrintTile({ tile, localPlayer, controllingPlayer, session }: { tile: Tile; localPlayer?: Player; controllingPlayer?: Player; session?: GameSession; }) {
  const [showPopup, setShowPopup] = useState(false);
  function replaceBlanks(word: string, blankChar: string = "_") {
    return (
      <div className="flex items-center justify-center whitespace-nowrap">
        {word.split("").map((char, index) => {
          const isBlank = char === blankChar;

          return (
            <span
              key={index}
              className={`
              inline-flex shrink-0 items-center justify-center
              h-6 ${isBlank ? "w-3 mx-0.5" : "w-auto px-px"}
              rounded text-sm font-semibold
              ${isBlank
                  ? "border-2 border-slate-300 bg-white text-black"
                  : "text-white"}
            `}
            >
              {isBlank ? "" : char}
            </span>
          );
        })}
      </div>
    );
  }
  return (
    <>
      <button
        onClick={() => {
          if (localPlayer?.id === session?.currentPlayerId) {
            setShowPopup(true);
          }
        }}
        style={{
          gridColumn: tile.x + 1,
          gridRow: tile.y + 1
        }}
        className={`
          aspect-square border rounded
          px-2
          flex items-center justify-center
          overflow-hidden
          ${controllingPlayer?.color || "bg-stone-500"}
          hover:bg-stone-600 bg-cover
        `}>
        {replaceBlanks(tile.word)}
      </button>
      {showPopup && <WordPopUp
        tile={tile}
        onClose={() => setShowPopup(false)}
      />}
    </>
  );
};
