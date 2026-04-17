import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import GamePage from "../pages/GamePage";
import LobbyPage from "../pages/LobbyPage";
export default function Main() {
  return <main
    className='min-h-screen container mx-auto'>
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/lobby" element={<LobbyPage />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </div>
  </main>;
};