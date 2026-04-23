import { useSignalR } from "../utils/SignalRContext";
import { useState, useEffect } from "react";
import type GameSession from "../interfaces/GameSession";
import type Player from "../interfaces/Player";
import { useNavigate, useParams } from "react-router-dom";
import * as signalR from '@microsoft/signalr';
import PrintBoard from "../components/PrintBoard";
import Board from "../interfaces/Board";
import { buttonBase, playerColors } from "../utils/TailwindStyles";
import PlayerCard from "../components/PlayerCard";

export default function GamePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const connection = useSignalR();
  const [session, setSession] = useState<GameSession | undefined>(); // Saving current session
  const [localPlayer, setLocalPlayer] = useState<Player>();
  const [board, SetBoard] = useState<Board>();

  const handleSessionUpdated = (session: GameSession) => {
    setSession(session);
    session.players.map((p, i) => p.color = playerColors[i % 4]);

    const localPlayer = session.players.find(p => p.id === localStorage.getItem("playerID"));

    if (session.currentPlayerId) {
      localStorage.setItem("currentPlayerID", session.currentPlayerId);
    }
    localStorage.setItem("playerColor", localPlayer!.color);

    setLocalPlayer(localPlayer);
    const boardStart = async () => {
      SetBoard(session.board);
    };
    boardStart();
  };
  async function LeaveSession() {
    const res = await fetch(`/api/sessions/${id}`,
      {
        method: "DELETE"
      }
    );
    if (!res.ok) {
      const body = await res.json();
      console.error(body.message);
      return;
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
    connection.on("SessionClosed", () => {

      // leave group (optional)
      connection.invoke("LeaveSession", id);

      // redirect
      navigate("/");
    });
    connection.on("SessionUpdated", handleSessionUpdated);
    connection.invoke("JoinSession", id).catch(console.error);

    return () => {
      connection.off("SessionUpdated", handleSessionUpdated);

      if (connection.state === signalR.HubConnectionState.Connected) {
        connection.invoke("LeaveSession", id).catch(console.error);
      }
    };

  }, [connection, id, navigate]);

  const scores = session?.playerScores ?? {};
  const scoreValues = Object.values(scores);
  const maxScore = scoreValues.length > 0 ? Math.max(...scoreValues) : 0;
  const winners = Object.entries(scores)
    .filter(([_, score]) => score === maxScore)
    .map(([playerId]) =>
      session?.players.find(p => p.id === playerId)?.userName ?? "Unknown player"
    );

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden py-6">

      <div className="absolute inset-0 -z-50">
        <img
          src="/bg-image.png"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/50 to-black/40" />
      </div>
      {session?.inGame ?
        (<div className="bg-slate-900/85 border border-emerald-500/30 p-3 rounded-2xl shadow-black/50 backdrop-blur-sm">
          {<div className="bg-slate-800 border border-emerald-600 rounded-2xl px-5 flex flex-row ">
            <p className="font-bold text-slate-400">
              Turn:
            </p>
            <p className="px-3 text-slate-400 font-extrabold animate-bounce">
              {session?.turnNumber}
            </p>
            <p className="px-3 text-slate-400 font-bold animate-pulse">{session?.players.find((p) => p.id == session.currentPlayerId)?.userName}'s turn!</p>
          </div>}
          <PrintBoard board={board} players={session?.players} session={session} />
          <div className="mt-5 bg-slate-800 border border-emerald-600 rounded-2xl mb-10 p-3">
            {/* Loop through all players in sesh */}
            {session?.players.map((player, index) => {
              // Kolla om det här kortet är DIN spelare
              const isMe = player.id === localPlayer?.id;
              return (
                <PlayerCard
                  key={player.id}
                  index={index}
                  player={player}
                  isMe={isMe}
                  sessionID={id}
                  showReady={false}
                />
              );
            })}
          </div>
        </div>)
        :
        (
          <div className="bg-slate-900/85 border border-emerald-500/30 p-3 rounded-2xl shadow-black/50 backdrop-blur-sm">
            {<div className="bg-slate-800 border border-emerald-600 rounded-2xl px-5 flex flex-col items-center ">
              <p className="px-3 text-slate-400 font-extrabold animate-bounce scale-110">
                Game Finished!
              </p>
              <p className="mt-5 font-bold text-pink-600 rounded-l pl-2 animate-ping">
                WINNER: <span className="">{winners.join(", ")}</span>
              </p>
            </div>}
            <div className="flex flex-col bg-slate-800 border border-emerald-600 rounded-2xl mt-5 px-5 ">
              <p className="font-bold text-pink-600 bg-linear-to-r rounded-l pl-2 animate-pulse from-stone-500">Scores:</p>
              {Object.entries(session?.playerScores ?? {}).sort().map(([id, score]) => (
                <div
                  key={id}
                  className="font-bold text-slate-400">
                  {session?.players.find((p) => p.id == id)?.userName}'s Score: <span className="text-pink-500 animate-pulse ">{score}</span>
                </div>
              ))}
            </div>
            {localPlayer?.isHost ?
              (
                <button
                  onClick={() => LeaveSession()}
                  className={`
            ${buttonBase}
            mt-5
            bg-emerald-500 hover:bg-emerald-400 text-white text-center
            hover:scale-[1.02] active:scale-100
          `}>
                  Quit Game
                </button>
              )
              :
              (
                <div className={`
                  ${buttonBase}
                  px-2 bg-slate-600 border-2 mt-5 border-emerald-500 text-slate-400 text-center
                  `}>
                  Waiting for host to close session...
                </div>
              )
            }
          </div>
        )
      }

    </div >
  );
}
