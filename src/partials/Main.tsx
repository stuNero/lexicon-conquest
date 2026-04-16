import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import GamePage from "../pages/GamePage";
import LobbyPage from "../pages/LobbyPage";
export default function Main() {
  return <main
    className="
      flex flex-col
      bg-amber-500/30
      bg-linear-to-b
      from-amber-950
      min-h-screen
      pt-40
      items-center
    ">
    <div className="
    max-w-7xl">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/lobby/:id" element={<LobbyPage />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </div>
  </main>;
};