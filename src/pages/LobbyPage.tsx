import { useNavigate, useParams } from "react-router-dom";
import { Check, X, Users, Copy } from 'lucide-react';
import { useEffect, useState } from "react";
import { useSignalR } from "../utils/SignalRContext";
import * as signalR from "@microsoft/signalr";
import type GameSession from "../interfaces/GameSession";
import type Player from "../interfaces/Player";

const playerColors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
];

const playerBorders = [
  "border-red-500/50",
  "border-blue-500/50",
  "border-emerald-500/50",
  "border-amber-500/50",
];

export default function LobbyPage() {
  const navigate = useNavigate();
  const connection = useSignalR();
  const { id } = useParams(); // Session id from page url slug
  const [session, setSession] = useState<GameSession | null>(null); // Saving current session
  const [currentPlayer, setCurrentPlayer] = useState<Player>(); // Save current player
  const [copied, setCopied] = useState(false); // State för copy-knappen

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
  function copyLobbyCode() {
    if (id) {
      navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
      localStorage.setItem("userName", currentPlayer?.userName!);
      if (session.inGame) navigate(`/game/${id}`);
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

  const myId = localStorage.getItem("playerID");

  return (<div className="flex flex-col items-center gap-6 bg-slate-900/95 border border-emerald-500/30 rounded-2xl px-8 py-8 mx-5 max-w-lg w-full shadow-2xl shadow-black/50">
    {/* Title */}
    <div className="flex items-center gap-3">
      <Users className="text-emerald-400 w-7 h-7" />
      <h1 className="text-2xl font-bold text-white">Game Lobby</h1>
    </div>
    {/* Lobby code */}
    <div className="flex items-center gap-3">
      <div className="bg-slate-800 border border-slate-600 rounded-full px-5 py-2 flex items-center gap-2">
        <span className="text-slate-400 text-sm">Lobby Code:</span>
        <span className="text-white font-mono font-bold tracking-wider">{id?.toUpperCase()}</span>
      </div>
      <button
        onClick={copyLobbyCode}
        className="flex items-center gap-1 bg-slate-800 border border-slate-600 rounded-full px-4 py-2 text-slate-300 text-sm hover:bg-slate-700 hover:text-white transition-all"
      >
        <Copy className="w-4 h-4" />
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
    {/* Player count */}
    <p className="text-slate-400 text-sm">
      Players: {session?.players.length ?? 0}/4
    </p>

    {/* Separator */}
    <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-600 to-transparent" />

    {/* Players heading */}
    <h2 className="text-lg font-bold text-white self-start">Players</h2>

    {/* Loop through all players in sesh */}
    <div className="flex flex-col gap-3 w-full">
      {session?.players.map((player, index) => {
        const isMe = player.id === myId;
        return (
          <div
            key={player.id}
            className={`
                flex items-center gap-4 px-5 py-4
                bg-slate-800/80 rounded-xl
                border ${isMe ? "border-slate-500" : playerBorders[index % 4]}
                ${isMe ? "shadow-[0_0_15px_rgba(100,116,139,0.15)]" : ""}
                transition-all
              `}
          >
            <div className={`w-10 h-10 rounded-full ${playerColors[index % 4]} shrink-0`} />

            <div className="flex flex-col flex-1">
              <span className="text-white font-semibold">{player.userName}</span>
              <div className="flex gap-2">
                {player.isHost && <span className="text-slate-400 text-xs">Host</span>}
                {isMe && <span className="text-emerald-400 text-xs font-semibold">You</span>}
              </div>
            </div>

            {isMe ? (
              <button
                onClick={ToggleReady}
                className={`
                    flex items-center gap-1 text-sm font-semibold
                    px-3 py-1 rounded-lg
                    transition-all hover:scale-105
                    ${player.ready
                    ? "text-emerald-400 hover:bg-emerald-500/10"
                    : "text-red-400 hover:bg-red-500/10"
                  }
                  `}
              >
                {player.ready
                  ? <><Check className="w-4 h-4" /> Ready</>
                  : <><X className="w-4 h-4" /> Not Ready</>
                }
              </button>
            ) : (
              <span className={`flex items-center gap-1 text-sm font-semibold ${player.ready ? "text-emerald-400" : "text-red-400"}`}>
                {player.ready
                  ? <><Check className="w-4 h-4" /> Ready</>
                  : <><X className="w-4 h-4" /> Not Ready</>
                }
              </span>
            )}
          </div>
        );
      })}
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
  </div >);
};