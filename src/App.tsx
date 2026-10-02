import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ScenarioPage from "./pages/ScenarioPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import InstructorPage from "./pages/InstructorPage";
import NotFound from "./pages/NotFound";
import LoginGate from "./components/LoginGate";

const App = () => {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem("mesQuizPharmaAuth") === "1"
  );
  const [password, setPassword] = useState(
    () => localStorage.getItem("mesQuizPharmaPass") ?? "dec25"
  );

  const handleLogin = () => {
    sessionStorage.setItem("mesQuizPharmaAuth", "1");
    setAuthed(true);
  };

  const handlePasswordChange = (newPassword: string) => {
    localStorage.setItem("mesQuizPharmaPass", newPassword);
    setPassword(newPassword);
  };

  if (!authed) {
    return (
      <LoginGate
        onLogin={handleLogin}
        currentPassword={password}
        onPasswordChange={handlePasswordChange}
      />
    );
  }

  return (
    <TooltipProvider>
      <Toaster />
      <HashRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/scenario" element={<ScenarioPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="/instructor" element={<InstructorPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  );
};

export default App;
