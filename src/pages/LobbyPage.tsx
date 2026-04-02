import { Link } from "react-router-dom";
import { Check, X } from 'lucide-react';
export default function LobbyPage() {
  const players = [
    { name: "MaskMax", ready: true },
    { name: "HaviMan", ready: true },
    { name: "KalamataOliver", ready: true },
    { name: "AmirBro", ready: true }];

  return <div className="
    flex flex-col items-center
    bg-gray-600 border-2 border-solid rounded-2xl
    mx-5 ">
    <div className="mt-5 bg-stone-500 rounded-r-2xl">
      {players.map((player) => (
        <div className="flex flex-row pr-2">
          {player.ready ?
            <button className="text-green-700"> <Check /> </button>
            :
            <button className="text-red-700"> <X /> </button>
          }
          <p>{player.name}</p>
        </div>
      ))}
    </div>
    {players.every(player => player.ready == true) ?
      <button className="
      border-2 border-stone-700 rounded
      bg-green-700
      h-10 w-auto my-2 px-2">
        <Link to="/game">
          Starta Spel
        </Link>
      </button>
      :
      <button className="
      border-2 border-stone-700 rounded
      bg-red-800
      h-10 w-auto my-2 px-2">
        Alla spelare ej redo
      </button>

    }
  </div>;
};