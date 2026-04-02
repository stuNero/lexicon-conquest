import { Link } from "react-router-dom";

export default function HomePage() {
  return <div
    className="
    flex flex-col items-center
    bg-gray-600 border-2 border-solid rounded-2xl
    mx-5">
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
    <button className="border-2 border-stone-700 px-2 bg-green-700 h-10 w-auto rounded mb-2">
      <Link to="/lobby">
        Skapa Session
      </Link>
    </button>
  </div>;
}