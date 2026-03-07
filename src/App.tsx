import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SplashScreen from "./components/SplashScreen";
import Home from "./components/Home";
import TextVent from "./components/TextVent";
import VoiceVent from "./components/VoiceVent";
import BearResponse from "./components/BearResponse";
import PuzzleGame from "./components/PuzzleGame";

type Page = "splash" | "home" | "text" | "voice" | "response" | "game";

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("splash");
  const [stressScore, setStressScore] = useState<number>(5);
  const [previousScore, setPreviousScore] = useState<number | null>(null);

  useEffect(() => {
    if (import.meta.env.PROD && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }
  }, []);

  const handleNavigate = (page: Exclude<Page, "splash">) => {
    setCurrentPage(page);
  };

  // const handleVentComplete = (score: number) => {
  //   setStressScore(score);
  //   setCurrentPage('response');
  // };
  const handleVentComplete = (score: number) => {
    // 1. Check for a previously saved score
    const savedScore = localStorage.getItem("lastStressScore");
    if (savedScore) {
      setPreviousScore(parseFloat(savedScore));
    } else {
      setPreviousScore(null);
    }

    // 2. Save the current score as the new "last score"
    localStorage.setItem("lastStressScore", score.toString());

    // 3. Update current state
    setStressScore(score);
    setCurrentPage("response");
  };

  const handleBackToHome = () => {
    setCurrentPage("home");
  };

  return (
    <AnimatePresence mode="wait">
      {currentPage === "splash" && (
        <motion.div
          key="splash"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <SplashScreen onFinish={() => setCurrentPage("home")} />
        </motion.div>
      )}

      {currentPage === "home" && (
        <motion.div
          key="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Home onNavigate={handleNavigate} />
        </motion.div>
      )}

      {currentPage === "text" && (
        <motion.div
          key="text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <TextVent onBack={handleBackToHome} onComplete={handleVentComplete} />
        </motion.div>
      )}

      {currentPage === "voice" && (
        <motion.div
          key="voice"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <VoiceVent
            onBack={handleBackToHome}
            onComplete={handleVentComplete}
          />
        </motion.div>
      )}

      {currentPage === "response" && (
        <motion.div
          key="response"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <BearResponse
            stressScore={stressScore}
            previousScore={previousScore}
            onHome={handleBackToHome}
            onPlayGame={() => handleNavigate("game")}
          />
        </motion.div>
      )}

      {currentPage === "game" && (
        <motion.div
          key="game"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <PuzzleGame onBack={handleBackToHome} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
