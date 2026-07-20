import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Diseases from "./pages/Diseases";
import EyeScan from "./pages/EyeScan";
import Results from "./pages/Results";
import Exercises from "./pages/Exercises";
import HealthyHabits from "./pages/HealthyHabits";
import ScreenTimeCalculator from "./pages/ScreenTimeCalculator";
import BlueLight from "./pages/BlueLight";
import Progress from "./pages/Progress";
import Contact from "./pages/Contact";

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("netra_theme") || "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    localStorage.setItem("netra_theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar theme={theme} toggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/diseases" element={<Diseases />} />
          <Route path="/scan" element={<EyeScan />} />
          <Route path="/results" element={<Results />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/habits" element={<HealthyHabits />} />
          <Route path="/screentime" element={<ScreenTimeCalculator />} />
          <Route path="/blue-light" element={<BlueLight />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
