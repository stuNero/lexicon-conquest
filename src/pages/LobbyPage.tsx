import { useNavigate, useParams, Link } from "react-router-dom";
import { Check, X, Users, Copy, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from "react";
import { useSignalR } from "../utils/SignalRContext";
import * as signalR from "@microsoft/signalr";
import type GameSession from "../interfaces/GameSession";
import type Player from "../interfaces/Player";




// Färger för spelarna, varje spelare får en unik färg baserat på sin position
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        boardSize: localStorage.getItem("boardSize"),
      })
    });
  }

  // Kopierar lobby-koden till urklipp och visar det i 2 sekunder
  function copyLobbyCode() {
    if (id) {
      navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }

    const checkSessionExists = async () => {
      try {
        const response = await fetch(`/api/sessions?url=${encodeURIComponent(id)}`);

        if (!response.ok) {
          navigate("/");
          return;
        }

        const sessions: GameSession[] = await response.json();

        if (sessions.length === 0) {
          navigate("/");
        }
      } catch (error) {
        console.error(error);
        navigate("/");
      }
    };

    checkSessionExists();
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

  const cardBase = `
  flex items-center
  gap-3 sm:gap-4
  px-3 sm:px-5 py-3 sm:py-4
  bg-slate-800/80 rounded-xl
  transition-all border
`;

  const labelSmall = "text-xs uppercase tracking-widest font-semibold";

  const buttonBase = `
  w-full py-2.5 sm:py-3
  text-sm sm:text-base font-bold
  rounded-xl transition-all
`;

  const maxPlayers = Number(localStorage.getItem("playerAmount"));
  const canStartGame = currentPlayer?.isHost && session?.players.length === maxPlayers && session.players.every(player => player.ready);


  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden py-6">

      <div className="absolute inset-0 z-0">
        <img
          src="/bg-image.png"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/50 to-black/40" />
      </div>
      <div className="relative z-10 w-full flex justify-center px-4">

        <div className="
          flex flex-col items-center
          gap-4 sm:gap-6
          bg-slate-900/95
          border border-emerald-500/30
          rounded-2xl
          sm:rounded-2xl
          px-4 sm:px-8 py-6 sm:py-8
          mx-0 sm:mx-5
          max-w-lg w-full
          shadow-2xl shadow-black/50
          ">
          {/* go back to homepage button  */}
          <div className='self-start'>
            <Link
              to="/"
              className="inline-block text-white text-2xl px-4 py-1 bg-emerald-600 rounded-2xl cursor-pointer z-50"
            >
              <ArrowLeft />
            </Link>
          </div>


          {/* Title */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Users className="text-emerald-400 w-6 h-6 sm:w-7 sm:h-7" />
            <h1 className="text-xl sm:text-2xl font-bold text-white">Game Lobby</h1>
          </div>


          {/* Lobby code */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="bg-slate-800 border border-slate-600 rounded-full px-4 sm:px-5 py-2 flex items-center gap-2 text-xs sm:text-sm">
              <span className="text-slate-400">Lobby Code:</span>
              <span className="text-white font-mono font-bold tracking-wider">{id?.toUpperCase()}</span>
            </div>
            <button
              onClick={copyLobbyCode}
              className="flex items-center
                gap-1
                bg-slate-800
                border border-slate-600
                rounded-full
                px-4 py-2
                text-slate-300 text-xs sm:text-sm
                hover:bg-slate-700 hover:text-white transition-all"
            >
              <Copy className="w-4 h-4" />
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          {/* Player count */}
          <p className="text-slate-400 text-sm">
            Players: {session?.players.length ?? 0}/{localStorage.getItem("playerAmount")}
          </p>

          {/* Separator */}
          <div className="h-px w-full bg-linear-to-r from-transparent via-slate-600 to-transparent" />

          {/* Players heading */}
          <h2 className="text-base sm:text-lg font-bold text-white self-start">Players</h2>

          {/* Loop through all players in sesh */}
          <div className="flex flex-col gap-3 w-full">
            {session?.players.map((player, index) => {
              // Kolla om det här kortet är DIN spelare
              const isMe = player.id === myId;
              return (
                <div
                  key={player.id}
                  className={`
              ${cardBase}
              ${isMe ? "border-slate-500" : playerBorders[index % 4]}
              ${isMe ? "shadow-[0_0_15px_rgba(100,116,139,0.15)]" : ""}
              `}
                >
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${playerColors[index % 4]} shrink-0`} />

                  <div className="flex flex-col flex-1">
                    <span className="text-white font-semibold">{player.userName}</span>
                    <div className="flex gap-2">
                      {player.isHost && <span className={`${labelSmall} text-slate-400`}>Host</span>}
                      {isMe && <span className={`${labelSmall} text-emerald-400`}>You</span>}
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
          <div className="flex flex-col gap-3 w-full mt-2">
            {currentPlayer && !currentPlayer.ready && (
              <button
                onClick={ToggleReady}
                className={`
        ${buttonBase}
        bg-red-500 hover:bg-red-400 text-white
        hover:scale-[1.02] active:scale-100
      `}>
                Ready
              </button>
            )}
            {currentPlayer?.ready && (
              <button
                onClick={ToggleReady}
                className={`
        ${buttonBase}
        bg-slate-700 hover:bg-slate-600 text-slate-300
      `}>
                Cancel Ready
              </button>
            )}





            {currentPlayer?.isHost ? (
              canStartGame
                ? (
                  <button
                    onClick={() => StartGame()}
                    className={`
          ${buttonBase}
          bg-emerald-500 hover:bg-emerald-400 text-white text-center
          hover:scale-[1.02] active:scale-100
        `}>
                    Starta Spel
                  </button>
                ) : (
                  <div className={`
        ${buttonBase}
        bg-emerald-500/20 text-emerald-300/60 text-center
        `}>
                    {maxPlayers !== session?.players.length
                      ? "Waiting for all players to join..."
                      : "Waiting for all players to be ready..."
                    }


                  </div>
                )
            ) : (
              <div className={`
       ${buttonBase}
       bg-slate-800 text-slate-400 text-center
      `}>
                Waiting for the host to start...
              </div>
            )}
          </div>
        </div>
      </div >
    </div >
  );
};
