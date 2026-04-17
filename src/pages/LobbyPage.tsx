import { Link, useParams } from "react-router-dom";
import { Check, X } from 'lucide-react';
import { useEffect, useState } from "react";
import type GameSession from "../interfaces/GameSession";
import type Player from "../interfaces/Player";
import * as signalR from "@microsoft/signalr";

export default function LobbyPage() {
  const { id } = useParams(); // Session id from page url slug
  const [session, setSession] = useState<GameSession | null>(null); // Saving current session
  const [currentPlayer, setCurrentPlayer] = useState<Player>(); // Save current player

  async function ToggleReady() {
    await fetch(`/api/players?url=${id}&id=${localStorage.getItem("playerID")}`,
      {
        method: "PUT"
      });
  }

  useEffect(() => {
    // building signalR connection
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("/gamehub")
      .withAutomaticReconnect()
      .build();

    let isMounted = true;
    const start = async () => {
      try {
        await connection.start();

        if (!isMounted) return;
        // Making first "ping"
        await connection.invoke("JoinSession", id);
      } catch (err) {
      }
    };

    // Starting connection
    start();

    connection.on("SessionUpdated", (session: GameSession) => {
      // sets the session given from backend
      setSession(session);

      // Sets the local current player
      const currentPlayer = session.players
        .find(p => p.id === localStorage.getItem("playerID"));

      setCurrentPlayer(currentPlayer);
    });

    return () => {
      // Clean-up
      isMounted = false;
      // Disconnect signalr if you leave page
      void connection.stop();
    };
  },
    // Triggers when session url changes
    [id]);

  return <div className="
    px-10 py-5
    flex flex-col items-center
    bg-gray-600 border-2 border-solid rounded-2xl
    mx-5 ">
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
    {session?.players.every(player => player.ready == true) ?
      <Link
        className="
              border-2 border-stone-700 rounded
            bg-green-700
              button
              flex flex-col justify-center p-1
              "
        to="/game">
        Starta Spel
      </Link>
      :
      <button className="
          border-2 border-stone-700 rounded
          bg-red-800
          button
          h-10 w-auto my-2 px-2">
        Alla spelare ej redo
      </button>
    }
  </div>;
};