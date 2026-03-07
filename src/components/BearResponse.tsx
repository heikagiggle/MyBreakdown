import { motion } from "framer-motion";
import { Home, Sparkles } from "lucide-react";
import { getBearMessage } from "../lib/stressAnalyzer";

interface BearResponseProps {
  stressScore: number;
  previousScore: number | null;
  onHome: () => void;
  onPlayGame: () => void;
}

export default function BearResponse({
  stressScore,
  previousScore,
  onHome,
  onPlayGame,
}: BearResponseProps) {
  const message = getBearMessage(stressScore);

  const getComparison = () => {
    if (previousScore === null) return null;
    const diff = previousScore - stressScore;

    if (diff > 1.5)
      return {
        text: "You're doing better than last time! 🌿",
        color: "text-green-600",
      };
    if (diff < -1.5)
      return {
        text: "Things seem a bit heavier today... 🫂",
        color: "text-purple-600",
      };
    return {
      text: "You're holding steady. I'm here. 🐾",
      color: "text-blue-600",
    };
  };

  const comparison = getComparison();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf8f5] via-[#f0e9f5] to-[#e8f5f0] flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-8"
      >
        <motion.svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          className="drop-shadow-2xl"
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <motion.ellipse
            cx="100"
            cy="150"
            rx="70"
            ry="50"
            fill="#c8e6d9"
            animate={{
              ry: [50, 52, 50],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.circle
            cx="100"
            cy="85"
            r="60"
            fill="#c8e6d9"
            animate={{
              r: [60, 62, 60],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <ellipse cx="80" cy="80" rx="10" ry="12" fill="#4a4a4a" />
          <ellipse cx="120" cy="80" rx="10" ry="12" fill="#4a4a4a" />
          <circle cx="77" cy="78" r="3" fill="white" />
          <circle cx="117" cy="78" r="3" fill="white" />
          <ellipse cx="60" cy="55" rx="20" ry="25" fill="#c8e6d9" />
          <ellipse cx="140" cy="55" rx="20" ry="25" fill="#c8e6d9" />
          <ellipse cx="100" cy="100" rx="8" ry="6" fill="#8b6f47" />
          <path
            d="M 85 110 Q 100 118 115 110"
            stroke="#4a4a4a"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <motion.path
            d="M 70 95 Q 80 88 90 95"
            stroke="none"
            fill="#ffb3d9"
            opacity="0.6"
            animate={{
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.path
            d="M 110 95 Q 120 88 130 95"
            stroke="none"
            fill="#ffb3d9"
            opacity="0.6"
            animate={{
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
          />
        </motion.svg>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-md mb-8"
      >
        {comparison && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-sm font-bold text-center mb-4 uppercase tracking-wider ${comparison.color}`}
          >
            {comparison.text}
          </motion.p>
        )}
        <motion.p
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-xl text-gray-800 leading-relaxed text-center"
        >
          {message}
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="flex flex-col gap-4 w-full max-w-md"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPlayGame}
          className="bg-gradient-to-r from-[#fef3e6] to-[#fff5ed] text-gray-800 py-4 px-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 text-lg font-medium"
        >
          <Sparkles size={20} />
          Play Stress Relief Puzzle
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onHome}
          className="bg-gradient-to-r from-[#e6d9f0] to-[#f0e9f5] text-gray-800 py-4 px-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 text-base font-medium"
        >
          <Home size={20} />
          Back to Home
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="mt-6 text-center"
      >
        <p className="text-sm text-gray-900">
          Current Score:{" "}
          <span className="font-bold text-gray-700">{stressScore}/10</span>
        </p>
        {previousScore !== null && (
          <p className="text-xs text-gray-700">Last time: {previousScore}/10</p>
        )}
      </motion.div>
    </div>
  );
}
