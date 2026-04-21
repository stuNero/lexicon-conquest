import words from "../assets/words.json";
import forest from "/images/forest.jpg";
import quarry from "/images/quarry.jpg";
import lake from "/images/lake.jpg";

import { useSignalR } from "../utils/SignalRContext";
import { useState, useEffect } from "react";
import type GameSession from "../interfaces/GameSession";
import type Player from "../interfaces/Player";
import { useParams } from "react-router-dom";
import { Check, X } from 'lucide-react';
import * as signalR from '@microsoft/signalr';

function RandomInt(max: number) {
  return Math.floor(Math.random() * max);
}
export default function GamePage() {
  const { id } = useParams();
  const connection = useSignalR();
  const [session, setSession] = useState<GameSession | null>(null); // Saving current session
  const [currentPlayer, setCurrentPlayer] = useState<Player>();
  const images = [forest, quarry, lake];
  const [board] = [{ rows: 10, cols: 10 }];

  async function ToggleReady() {
    await fetch(`/api/players?url=${id}&id=${localStorage.getItem("playerID")}`,
      { method: "PUT" }
    );
  }

  useEffect(() => {
    if (connection.state === signalR.HubConnectionState.Connected) {
      connection.invoke("JoinSession", id).catch(console.error);
    }
    else {
      connection.onreconnected(() => {
        connection.invoke("JoinSession", id).catch(console.error);
      });
    }
    const handleSessionUpdated = (session: GameSession) => {
      setSession(session);
      const currentPlayer = session.players.find(p => p.id === localStorage.getItem("playerID"));
      setCurrentPlayer(currentPlayer);
    };

    connection.on("SessionUpdated", handleSessionUpdated);
    connection.invoke("JoinSession", id).catch(console.error);

    return () => {
      connection.off("SessionUpdated", handleSessionUpdated);

      if (connection.state === signalR.HubConnectionState.Connected) {
        connection.invoke("LeaveSession", id).catch(console.error);
      }
    };

  }, [id]);

  return <div>
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${board.cols}, 1fr)`,
      gridTemplateRows: `repeat(${board.rows}, 1fr)`
    }} className="m-2 border-4 rounded-2xl p-3 gap-0.5 game">
      {
        Array.from({ length: board.rows * board.cols }).map((_, i) => (
          <div
            key={i}
            style={{ backgroundImage: `url(${images[RandomInt(images.length)]})` }}
            className="
              aspect-square border
              h-fit
              flex items-center justify-center
              hover:bg-amber-700
              bg-cover
            ">
            <p className="text-xs lg:text-sm font-bold text-white bg-stone-700/80 p-1 rounded-tr-2xl rounded-bl-2xl">
              {words[RandomInt(words.length)].toUpperCase()}
            </p>
          </div>
        ))
      }
    </div >
    <div className="mt-5 bg-stone-500 rounded-r-2xl mb-10 p-3">
      {/* Loop through all players in sesh */}
      {session?.players.map((player) => (
        // Check on current player ternary
        player.id === currentPlayer!.id ?
          <div
            key={player.id}
            className="flex flex-row pr-2 mb-1 bg-stone-600 bg-linear-to-l from-stone-500 animate-bounce">
            {player.ready ?
              <button onClick={ToggleReady} className="text-green-700 hover:scale-120 animate-pulse "> <Check /> </button>
              :
              <button onClick={ToggleReady} className="text-red-700 animate-pulse hover:scale-120"> <X /> </button>
            }
            <p>{player.userName}</p>
          </div>
          :     // TERNARY MIDDLE POINT
          <div
            key={player.id}
            className="flex flex-row pr-2 mb-1 bg-stone-600 bg-linear-to-l from-stone-500">
            {
              player.ready ?
                <button className="text-green-700"> <Check /> </button>
                :
                <button className="text-red-700"> <X /> </button>
            }
            <p>{player.userName}</p>
          </div>
        // TERNARY END
      ))}
    </div>
  </div>;

}