import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import GamePage from "../pages/GamePage";
import LobbyPage from "../pages/LobbyPage";
export default function Main() {
  return <main
    className="
      bg-amber-500/30
      bg-linear-to-t
      max-w-7xl
      min-h-screen
      pt-40
      items-center
      justify-center
      align-center
    ">
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/lobby" element={<LobbyPage />} />
      <Route path="/game" element={<GamePage />} />
    </Routes>
  </main>;
};