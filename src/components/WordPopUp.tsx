import Tile from "../interfaces/Tile";
import { useState } from "react";
export default function WordPopUp({ tile, onClose }: { tile: Tile; onClose: () => void; }) {
  const [errorText, setErrorText] = useState("");
  const [word, setWord] = useState("");

  async function ClaimTile(x: number, y: number, word: string, e: React.FormEvent) {
    e.preventDefault();
    const guessResponse = await fetch(`/api/sessions/${localStorage.getItem("sessionID")}/guess-word`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          playerID: localStorage.getItem("playerID"),
          x: x,
          y: y,
          word: word
        })
      }
    );
    if (!guessResponse.ok) {
      var body = await guessResponse.json();
      setErrorText(body.message);
      return;
    }
    onClose();
    return;
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      {errorText === "" ?
        (
          <form
            className="bg-slate-800 rounded-xl p-6 max-w-md w-full shadow-lg items-center "
            onSubmit={(e) => ClaimTile(tile.x, tile.y, word, e)}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-gray-600 mb-4 bg-white/80 text-2xl w-fit px-3 rounded">{tile.word}</p>
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              className="w-full border-2 bg-white rounded mb-5 px-2"
              placeholder="Guess the word..."></input>
            <div className="flex flex-row justify-between">
              <button
                type="submit"
                className="bg-orange-500 text-black font-bold px-4 py-2 rounded-lg hover:opacity-100 opacity-50"
              >
                Guess
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-black text-white px-4 py-2 rounded-lg hover:opacity-100 opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div
            className="bg-slate-800 rounded-xl p-6 max-w-md w-full shadow-lg items-center"
            onClick={e => { e.stopPropagation(); setErrorText(""); }}
          >
            <p className="text-gray-600 mb-4 bg-white/80 text-2xl w-fit px-3 rounded">{errorText}</p>
            <button
              className="bg-black text-white px-4 py-2 rounded-lg hover:opacity-100 opacity-50"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        )
      }
    </div>
  );
}