import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
export default function Main() {
  return <main>
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  </main>;
};