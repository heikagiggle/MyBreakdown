import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Mic, Phone } from "lucide-react";
import { EMPATHY_MESSAGES, HELPLINES } from "../lib/utils";

interface HomeProps {
  onNavigate: (page: "text" | "voice" | "game") => void;
}

function getRandomMessage() {
  return EMPATHY_MESSAGES[Math.floor(Math.random() * EMPATHY_MESSAGES.length)];
}

export default function Home({ onNavigate }: HomeProps) {
  const [message] = useState(getRandomMessage);
  const [showSafety, setShowSafety] = useState(false);

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* === BACKGROUND: Large Stuffy Bear === */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "linear-gradient(160deg, #fdf6ff 0%, #ede1f8 35%, #dff0ea 70%, #fbe8f2 100%)",
          zIndex: 0,
        }}
      />

      {/* Central Bear Illustration — soft, large, background */}
      <div
        style={{
          position: "fixed",
          bottom: "-60px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1,
          opacity: 0.18,
          pointerEvents: "none",
        }}
      >
        <svg width="480" height="520" viewBox="0 0 480 520">
          {/* Ears */}
          <ellipse cx="110" cy="90" rx="65" ry="85" fill="#c8a8e8" />
          <ellipse cx="110" cy="90" rx="40" ry="55" fill="#e8d4f8" />
          <ellipse cx="370" cy="90" rx="65" ry="85" fill="#c8a8e8" />
          <ellipse cx="370" cy="90" rx="40" ry="55" fill="#e8d4f8" />
          {/* Body */}
          <ellipse cx="240" cy="380" rx="165" ry="155" fill="#c8a8e8" />
          {/* Belly */}
          <ellipse cx="240" cy="390" rx="105" ry="100" fill="#e8d4f8" />
          {/* Head */}
          <circle cx="240" cy="185" r="145" fill="#c8a8e8" />
          <circle cx="240" cy="185" r="115" fill="#d9bcf0" />
          {/* Eyes */}
          <ellipse cx="195" cy="170" rx="22" ry="26" fill="#4a3060" />
          <circle cx="188" cy="163" r="7" fill="white" opacity="0.8" />
          <ellipse cx="285" cy="170" rx="22" ry="26" fill="#4a3060" />
          <circle cx="278" cy="163" r="7" fill="white" opacity="0.8" />
          {/* Nose */}
          <ellipse cx="240" cy="205" rx="16" ry="12" fill="#9060b8" />
          <path d="M 240 205 L 240 218" stroke="#9060b8" strokeWidth="4" />
          {/* Mouth */}
          <path
            d="M 218 222 Q 240 235 262 222"
            stroke="#9060b8"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Blush */}
          <ellipse
            cx="168"
            cy="202"
            rx="30"
            ry="18"
            fill="#ffb3d9"
            opacity="0.4"
          />
          <ellipse
            cx="312"
            cy="202"
            rx="30"
            ry="18"
            fill="#ffb3d9"
            opacity="0.4"
          />
          {/* Arms */}
          <ellipse
            cx="88"
            cy="365"
            rx="52"
            ry="90"
            fill="#c8a8e8"
            transform="rotate(-20 88 365)"
          />
          <ellipse
            cx="392"
            cy="365"
            rx="52"
            ry="90"
            fill="#c8a8e8"
            transform="rotate(20 392 365)"
          />
          {/* Feet */}
          <ellipse cx="175" cy="498" rx="68" ry="38" fill="#c8a8e8" />
          <ellipse cx="305" cy="498" rx="68" ry="38" fill="#c8a8e8" />
        </svg>
      </div>

      {/* Floating decorative blobs */}
      <div
        style={{
          position: "fixed",
          top: 80,
          right: 20,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "radial-gradient(circle, #ffd6eb44, transparent)",
          filter: "blur(25px)",
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: "fixed",
          top: "30%",
          left: 10,
          width: 90,
          height: 90,
          borderRadius: "50%",
          background: "radial-gradient(circle, #c8e6d944, transparent)",
          filter: "blur(20px)",
          zIndex: 1,
        }}
      />

      {/* === CONTENT === */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-between p-6 py-10">
        {/* Top section */}
        <div className="flex flex-col items-center">
          {/* Small decorative bear face at top */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <motion.svg
              width="110"
              height="110"
              viewBox="0 0 200 200"
              style={{
                filter: "drop-shadow(0 6px 20px rgba(180,130,220,0.3))",
              }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <ellipse cx="58" cy="50" rx="28" ry="36" fill="#d9bcf0" />
              <ellipse cx="58" cy="50" rx="17" ry="23" fill="#edddf8" />
              <ellipse cx="142" cy="50" rx="28" ry="36" fill="#d9bcf0" />
              <ellipse cx="142" cy="50" rx="17" ry="23" fill="#edddf8" />
              <circle cx="100" cy="108" r="68" fill="#d9bcf0" />
              <circle cx="100" cy="108" r="52" fill="#edddf8" />
              <ellipse cx="82" cy="100" rx="10" ry="12" fill="#3d2d55" />
              <ellipse cx="118" cy="100" rx="10" ry="12" fill="#3d2d55" />
              <circle cx="78" cy="96" r="3.5" fill="white" opacity="0.85" />
              <circle cx="114" cy="96" r="3.5" fill="white" opacity="0.85" />
              <ellipse cx="100" cy="116" rx="8" ry="6" fill="#c080d0" />
              <path
                d="M 88 124 Q 100 130 112 124"
                stroke="#9060b8"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
              <ellipse
                cx="74"
                cy="112"
                rx="15"
                ry="9"
                fill="#ffb3d9"
                opacity="0.4"
              />
              <ellipse
                cx="126"
                cy="112"
                rx="15"
                ry="9"
                fill="#ffb3d9"
                opacity="0.4"
              />
            </motion.svg>
          </motion.div>

          <motion.h1
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{
              marginTop: 14,
              fontSize: 32,
              fontWeight: 800,
              color: "#3d2a55",
              fontFamily: "'Georgia', serif",
              letterSpacing: "-0.5px",
            }}
          >
            MyBreakdown
          </motion.h1>

          {/* Empathy message */}
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            style={{
              marginTop: 14,
              maxWidth: 300,
              textAlign: "center",
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(10px)",
              borderRadius: 20,
              padding: "14px 20px",
              boxShadow: "0 4px 20px rgba(180,130,220,0.1)",
            }}
          >
            <p
              style={{
                color: "#6b4d8a",
                fontSize: 14,
                lineHeight: 1.6,
                fontStyle: "italic",
              }}
            >
              "{message}"
            </p>
          </motion.div>
        </div>

        {/* Middle — action buttons */}
        <div
          style={{
            width: "100%",
            maxWidth: 360,
            display: "flex",
            flexDirection: "column",
            gap: 14,
            marginTop: 32,
          }}
        >
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate("text")}
            style={{
              background: "linear-gradient(135deg, #edddf8, #f8eeff)",
              border: "1.5px solid rgba(200,168,232,0.4)",
              borderRadius: 22,
              padding: "22px 28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              fontSize: 16,
              fontWeight: 600,
              color: "#3d2a55",
              cursor: "pointer",
              boxShadow: "0 6px 24px rgba(180,130,220,0.18)",
            }}
          >
            <MessageSquare size={22} />
            Write my Rant
          </motion.button>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate("voice")}
            style={{
              background: "linear-gradient(135deg, #c8f0e0, #dff8ef)",
              border: "1.5px solid rgba(168,220,196,0.4)",
              borderRadius: 22,
              padding: "22px 28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              fontSize: 16,
              fontWeight: 600,
              color: "#1a4434",
              cursor: "pointer",
              boxShadow: "0 6px 24px rgba(100,180,140,0.15)",
            }}
          >
            <Mic size={22} />
            Record a VN
          </motion.button>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate("game")}
            style={{
              background: "linear-gradient(135deg, #fff3e0, #fff8ed)",
              border: "1.5px solid rgba(255,200,120,0.4)",
              borderRadius: 22,
              padding: "18px 28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              fontSize: 15,
              fontWeight: 500,
              color: "#5a3a10",
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(220,170,80,0.12)",
            }}
          >
            🎨 Play Stress Relief Puzzle
          </motion.button>

          {/* Safety trigger button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowSafety(true)}
            style={{
              background: "transparent",
              border: "none",
              marginTop: 8,
              color: "#a07cb8",
              fontSize: 13,
              cursor: "pointer",
              textDecoration: "underline",
              textDecorationStyle: "dotted",
            }}
          >
            🆘 I need urgent support
          </motion.button>
        </div>

        <div style={{ height: 40 }} />
      </div>

      {/* === SAFETY MODAL === */}
      <AnimatePresence>
        {showSafety && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 100,
              background: "rgba(40,20,60,0.55)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
            }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
              style={{
                position: "relative", 
                background: "white",
                borderRadius: 28,
                padding: 28,
                maxWidth: 380,
                width: "100%",
                maxHeight: "80vh", 
                overflowY: "auto", // allow scrolling
                boxShadow: "0 20px 60px rgba(40,20,60,0.3)",
              }}
            >
              {/* Close button */}
              <button
                onClick={() => setShowSafety(false)}
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  background: "transparent",
                  border: "none",
                  fontSize: 20,
                  cursor: "pointer",
                  color: "#6b4d8a",
                  fontWeight: "bold",
                }}
              >
                ✕
              </button>

              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 48 }}>🫂</div>
                <h2
                  style={{
                    color: "#3d2a55",
                    fontSize: 20,
                    fontWeight: 700,
                    marginTop: 8,
                    marginBottom: 10,
                  }}
                >
                  I'm very concerned about what you just shared.
                </h2>
                <p style={{ color: "#6b4d8a", fontSize: 14, lineHeight: 1.6 }}>
                  Please reach out to someone who can help. You deserve real,
                  immediate support. 💜
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  marginBottom: 20,
                }}
              >
                {HELPLINES.map((h) => (
                  <div
                    key={h.name}
                    style={{
                      background: "#f8f2ff",
                      borderRadius: 14,
                      padding: "12px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <span style={{ fontSize: 22 }}>{h.flag}</span>
                    <div>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#3d2a55",
                          margin: 0,
                        }}
                      >
                        {h.name}
                      </p>
                      <p
                        style={{
                          fontSize: 13,
                          color: "#9060b8",
                          margin: 0,
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Phone size={11} /> {h.number}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowSafety(false)}
                style={{
                  width: "100%",
                  background: "linear-gradient(135deg, #edddf8, #f8eeff)",
                  border: "1.5px solid rgba(200,168,232,0.5)",
                  borderRadius: 16,
                  padding: "14px",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#3d2a55",
                  cursor: "pointer",
                }}
              >
                I'm safe, go back
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
