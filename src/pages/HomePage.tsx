import { useNavigate } from "react-router-dom";
import { useState } from "react";
import fetchJson from "../utils/fetchJson";
import type Player from "../interfaces/Player";
export default function HomePage() {
  const navigate = useNavigate();
  const [username, SetUsername] = useState("");
  const [url, SetUrl] = useState("");

  async function CreateLobby() {
    const response = await fetchJson<
      {
        url: string,
        player: Player;
      }>("/api/sessions", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          UserName: username
        })
      });
    localStorage.setItem("sessionID", response.url);
    localStorage.setItem("playerID", response.player.id);

    navigate(`lobby/${response.url}`);
  }
  async function JoinLobby() {
    const response = await fetchJson<Player>
      (`/api/sessions/${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username
        })
      });
    localStorage.setItem("sessionID", url);
    localStorage.setItem("playerID", response.id);
    navigate(`/lobby/${url}`);
  }

  return <div
    className="
    flex flex-col items-center
    bg-gray-600 border-2 border-solid rounded-2xl
    mx-5 w-75 p-2">
    <div className="
            flex flex-col
            w-full
            px-2 py-5 mb-5
            items-center
            bg-linear-to-r from-white/60">
      <label
        htmlFor="username_input"
        className="
          px-2
          text-2xl text-amber-200/50
          bg-stone-700
          text-shadow-md text-shadow-stone-800
          rounded-t-2xl
          text-center
          ">
        Användarnamn: </label>
      <input
        id="username_input"
        onChange={(e) => SetUsername(e.target.value)}
        type="text"
        placeholder="xXPenguinKillerXx"
        required
        className="
          text-center
          h-10 w-fit
          bg-stone-400
          border-2 border-solid border-stone-500 rounded
          " />
    </div>
    <section
      id="create"
      className="mt-10 w-full flex flex-col items-center bg-linear-to-b from-white/60">
      <button onClick={CreateLobby}
        className="
        border-4 border-stone-700 rounded
        hover:bg-green-800 button bg-green-700
        px-2 h-10 my-5
        flex flex-col justify-center">
        Create Session
      </button>
    </section>
    <section
      id="join"
      className="mt-10 w-full flex flex-col items-center bg-linear-to-b from-white/60">
      <div className="
            flex flex-col
            w-fit
            p-2">
        <label
          htmlFor="username_input"
          className="
          py-0.5
          text-2xl text-amber-200/50
          bg-stone-700
          text-shadow-md text-shadow-stone-800
          rounded-t-2xl
          text-center 
          ">
          Lobby ID: </label>
        <input
          id="username_input"
          onChange={(e) => SetUrl(e.target.value)}
          type="text"
          placeholder="XXXXXXXX"
          className="
          text-center
          h-10 w-fit
          bg-stone-400
          border-2 border-solid border-stone-500 rounded
          " />
      </div>
      <button onClick={JoinLobby}
        className="
        border-4 border-stone-700 rounded
        hover:bg-green-800 button bg-green-700
        px-2 h-10
        flex flex-col justify-center">
        Join Session
      </button>
    </section>
  </div>;
}