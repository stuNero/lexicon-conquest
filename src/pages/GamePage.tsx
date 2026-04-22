import { useSignalR } from "../utils/SignalRContext";
import { useState, useEffect } from "react";
import type GameSession from "../interfaces/GameSession";
import type Player from "../interfaces/Player";
import { useParams } from "react-router-dom";
import * as signalR from '@microsoft/signalr';
import PrintBoard from "../components/PrintBoard";
import Board from "../interfaces/Board";
import { playerColors } from "../components/playerColors";

export default function GamePage() {
  const { id } = useParams();
  const connection = useSignalR();
  const [session, setSession] = useState<GameSession | null>(null); // Saving current session
  const [currentPlayer, setCurrentPlayer] = useState<Player>();
  const [board, SetBoard] = useState<Board>();

  const handleSessionUpdated = (session: GameSession) => {
    setSession(session);
    const currentPlayer = session.players.find(p => p.id === localStorage.getItem("playerID"));
    session.players.map((p, i) => p.color = playerColors[i % 4]);
    setCurrentPlayer(currentPlayer);
    localStorage.setItem("playerColor", currentPlayer!.color);
    const boardStart = async () => {
      SetBoard(session.board);
    };
    boardStart();
  };

  useEffect(() => {
    if (connection.state === signalR.HubConnectionState.Connected) {
      connection.invoke("JoinSession", id).catch(console.error);
    }
    else {
      connection.onreconnected(() => {
        connection.invoke("JoinSession", id).catch(console.error);
      });
    }

    connection.on("SessionUpdated", handleSessionUpdated);
    connection.invoke("JoinSession", id).catch(console.error);

    return () => {
      connection.off("SessionUpdated", handleSessionUpdated);

      if (connection.state === signalR.HubConnectionState.Connected) {
        connection.invoke("LeaveSession", id).catch(console.error);
      }
    };

  }, [id]);

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden py-6">

      <div className="absolute inset-0 -z-50">
        <img
          src="/bg-image.png"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black/40" />
      </div>
      <div className="bg-slate-900/85 border border-emerald-500/30 p-3 rounded-2xl shadow-black/50 backdrop-blur-sm">
        {<div className="bg-slate-800 border border-emerald-600 rounded-2xl px-5 flex flex-row ">
          <p className="font-bold text-slate-400">
            Turn:
          </p>
          <p>
            {session?.turnNumber}
          </p>
        </div>}
        <PrintBoard board={board} players={session?.players} />
        <div className="mt-5 bg-slate-800 border border-emerald-600 rounded-2xl mb-10 p-3">
          {/* Loop through all players in sesh */}
          {session?.players.map((player, index) => (
            // Check on current player ternary
            <div
              key={player.id}
              className={`
                flex flex-row
                pr-2 mb-1
                `}>
              <p className={`
                p-1 px-3 rounded
                flex flex-row
                ${player.color}
                text-slate-800
                border border-white/10`}>
                {player.id === currentPlayer!.id ? <span className="pr-2">You: </span> : ""}
                {player.userName}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div >
  );
}