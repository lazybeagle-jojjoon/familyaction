import { Navigate, Route, Routes } from "react-router-dom";
import FinalePage from "./pages/FinalePage";
import HomePage from "./pages/HomePage";
import LobbyPage from "./pages/LobbyPage";
import RoundPage from "./pages/RoundPage";
import SetupPage from "./pages/SetupPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/setup" element={<SetupPage />} />
      <Route path="/lobby" element={<LobbyPage />} />
      <Route path="/round/:type" element={<RoundPage />} />
      <Route path="/finale" element={<FinalePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
