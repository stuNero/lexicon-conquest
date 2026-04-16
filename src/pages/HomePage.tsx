import { useNavigate } from "react-router-dom";
import { useState } from "react";
import fetchJson from "../utils/useFetch";
import type Player from "../interfaces/Player";
export default function HomePage() {
  const navigate = useNavigate();
  const [username, SetUsername] = useState("");


  async function CreateLobby() {
    const response = await fetchJson<
      {
        url: string,
        player: Player;
      }>("api/sessions", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          UserName: username
        })
      });
    localStorage.setItem("playerID", response.player.id);

    navigate(`lobby/${response.url}`);
  }

  return <div
    className="
    flex flex-col items-center
    bg-gray-600 border-2 border-solid rounded-2xl
    mx-5 p-10">
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
        Användarnamn: </label>
      <input
        id="username_input"
        onChange={(e) => SetUsername(e.target.value)}
        type="text"
        placeholder=""
        className="
        text-center
        h-10 w-fit
        bg-stone-400
        border-2 border-solid border-stone-500 rounded
        " />
    </div>
    <div className="
          flex flex-col
          w-fit
          p-2">
      <label
        htmlFor="player-count-input"
        className="
        py-0.5
        text-2xl text-amber-200/50
        bg-stone-700
        text-shadow-md text-shadow-stone-800
        rounded-t-2xl
        text-center 
        ">
        Antal spelare: </label>
      <input
        id="player-count-input"
        type="text"
        placeholder="2"
        className="
        text-center
        h-10 w-fit
        bg-stone-400
        border-2 border-solid border-stone-500 rounded
        " />
    </div>
    <div className="
          flex flex-col
          w-fit
          p-2">
      <label
        htmlFor="board-size-input"
        className="
        py-0.5
        text-2xl text-amber-200/50
        text-shadow-md text-shadow-stone-800
        bg-stone-700
        rounded-t-2xl
        text-center ">
        Brädets storlek: </label>
      <input
        id="board-size-input"
        type="text"
        placeholder="10x10"
        className="
        text-center
        h-10 w-fit
        bg-stone-400
        border-2 border-solid border-stone-500 rounded
        " />
    </div>
    <button onClick={CreateLobby}
      className="
      border-4 border-stone-700 rounded
      hover:bg-green-800 button bg-green-700
      px-2 h-10
      flex flex-col justify-center">
      Create Session
    </button>
  </div>;
}