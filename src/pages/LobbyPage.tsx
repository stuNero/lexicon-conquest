import { Link, useNavigate, useParams } from "react-router-dom";
import { Check, X } from 'lucide-react';
import { useEffect, useState } from "react";
import type GameSession from "../interfaces/GameSession";
import type Player from "../interfaces/Player";
import * as signalR from "@microsoft/signalr";

export default function LobbyPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [session, setSession] = useState<GameSession | null>(null);
  const [player, setPlayer] = useState<Player>();

  async function ToggleReady() {
    await fetch(`/api/players?url=${id}&id=${localStorage.getItem("playerID")}`,
      {
        method: "PUT"
      });
  }

  useEffect(() => {
    if (localStorage.getItem("playerID") == null) {
      navigate("*");
      return;
    }
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("/gamehub")
      .withAutomaticReconnect()
      .build();

    let isMounted = true;
    const start = async () => {
      try {
        await connection.start();

        if (!isMounted) return;

        await connection.invoke("JoinSession", id);
      } catch (err) {
      }
    };

    start();

    connection.on("SessionUpdated", (session: GameSession) => {
      setSession(session);
      const currentPlayer = session.players
        .find(p => p.id === localStorage.getItem("playerID"));

      setPlayer(currentPlayer);
    });

    return () => {
      isMounted = false;
      void connection.stop();
    };
  }, [id]);

  return <div className="
    px-10 py-5
    flex flex-col items-center
    bg-gray-600 border-2 border-solid rounded-2xl
    mx-5 ">
    <div className="mt-5 bg-stone-500 rounded-r-2xl mb-10 p-3">
      {session?.players.map((player) => (
        <div
          key={player.id}
          className="flex flex-row pr-2 mb-1 bg-stone-600 bg-linear-to-l from-stone-500">
          {player.ready ?
            <button className="text-green-700"> <Check /> </button>
            :
            <button className="text-red-700"> <X /> </button>
          }
          <p>{player.userName}</p>
        </div>
      ))}
    </div>
    {player?.ready ?
      <button
        onClick={ToggleReady}
        className="
            border-2 border-stone-700 rounded
            bg-green-800 hover:bg-red-800
            button
            h-10 w-auto my-2 px-2">
        Redo!
      </button>
      :
      <button
        onClick={ToggleReady}
        className="
            border-2 border-stone-700 rounded
            bg-red-800 hover:bg-green-800
            button
            h-10 w-auto my-2 px-2">
        Ej redo
      </button>

    }
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