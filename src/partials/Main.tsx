import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import GamePage from "../pages/GamePage";
import LobbyPage from "../pages/LobbyPage";
export default function Main() {
  return <main
    className='min-h-screen mx-auto'>
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/lobby/:id" element={<LobbyPage />} />
        <Route path="/game/:id" element={<GamePage />} />
      </Routes>
    </div>
  </main>;
};