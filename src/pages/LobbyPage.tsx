import { useNavigate, useParams } from "react-router-dom";
import { Check, X } from 'lucide-react';
import { useEffect, useState } from "react";
import { useSignalR } from "../utils/SignalRContext";
import * as signalR from "@microsoft/signalr";
import type GameSession from "../interfaces/GameSession";
import type Player from "../interfaces/Player";

export default function LobbyPage() {
  const navigate = useNavigate();
  const connection = useSignalR();
  const { id } = useParams(); // Session id from page url slug
  const [session, setSession] = useState<GameSession | null>(null); // Saving current session
  const [currentPlayer, setCurrentPlayer] = useState<Player>(); // Save current player

  async function ToggleReady() {
    await fetch(`/api/players?url=${id}&id=${localStorage.getItem("playerID")}`,
      { method: "PUT" }
    );
  }
  async function StartGame() {
    await fetch(`/api/sessions/start/${id}`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' }
    });
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
      if (session.inGame) navigate(`/game/${id}`);
    };

    connection.on("SessionUpdated", handleSessionUpdated);
    connection.invoke("JoinSession", id).catch(console.error);

    return () => {
      connection.off("SessionUpdated", handleSessionUpdated);
      connection.invoke("LeaveSession", handleSessionUpdated);
    };

  }, [id]);

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
    {
      currentPlayer?.isHost ?
        session?.players.every(player => player.ready == true) ?
          // if player is host and every player is ready
          <button
            className="
              border-2 border-stone-700 rounded
            bg-green-700 hover:scale-110
              button
              flex flex-col justify-center p-1
              "
            type="button"
            onClick={() => StartGame()}
          >
            Starta Spel
          </button>
          :
          // if player is host but every player isn't ready
          <button className="
          border-2 border-stone-700 rounded
          bg-red-800
          button
          h-10 w-auto my-2 px-2">
            All Players Are Not Ready
          </button>
        :
        // if player isn't host
        <button className="
          border-2 border-stone-500 rounded
          bg-stone-600
          button
          h-10 w-auto my-2 px-2">
          Waiting...
        </button>

    }
  </div>;
};