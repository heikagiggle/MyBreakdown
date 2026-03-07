import { motion } from 'framer-motion';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #fdf6ff 0%, #f0e9f8 40%, #e8f4f0 100%)',
      }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      onAnimationComplete={() => setTimeout(onFinish, 2800)}
    >
      {/* Soft background blobs */}
      <div
        style={{
          position: 'absolute', width: 320, height: 320, borderRadius: '50%',
          background: 'radial-gradient(circle, #f5e6ff55, transparent)',
          top: '5%', left: '-10%', filter: 'blur(40px)',
        }}
      />
      <div
        style={{
          position: 'absolute', width: 280, height: 280, borderRadius: '50%',
          background: 'radial-gradient(circle, #c8e6d955, transparent)',
          bottom: '10%', right: '-5%', filter: 'blur(40px)',
        }}
      />

      {/* Bunny SVG */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.34, 1.56, 0.64, 1], delay: 0.1 }}
      >
        <motion.svg
          width="220"
          height="260"
          viewBox="0 0 220 260"
          style={{ filter: 'drop-shadow(0 12px 40px rgba(180,140,220,0.25))' }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Left Ear */}
          <motion.ellipse
            cx="72" cy="55" rx="22" ry="58"
            fill="#f0e6fa"
            stroke="#dcc8ef"
            strokeWidth="2"
            transform="rotate(-12 72 55)"
            animate={{ scaleY: [1, 1.03, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <ellipse cx="72" cy="58" rx="12" ry="40" fill="#ffd6eb" opacity="0.6" transform="rotate(-12 72 55)" />

          {/* Right Ear */}
          <motion.ellipse
            cx="148" cy="55" rx="22" ry="58"
            fill="#f0e6fa"
            stroke="#dcc8ef"
            strokeWidth="2"
            transform="rotate(12 148 55)"
            animate={{ scaleY: [1, 1.03, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
          />
          <ellipse cx="148" cy="58" rx="12" ry="40" fill="#ffd6eb" opacity="0.6" transform="rotate(12 148 55)" />

          {/* Body */}
          <motion.ellipse
            cx="110" cy="195" rx="68" ry="60"
            fill="#f0e6fa"
            stroke="#dcc8ef"
            strokeWidth="2"
            animate={{ ry: [60, 62, 60] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Belly */}
          <ellipse cx="110" cy="200" rx="42" ry="38" fill="#fdf0ff" opacity="0.8" />

          {/* Head */}
          <motion.circle
            cx="110" cy="118" r="58"
            fill="#f0e6fa"
            stroke="#dcc8ef"
            strokeWidth="2"
            animate={{ r: [58, 59.5, 58] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* 🥹 Left Eye - teary */}
          <ellipse cx="92" cy="112" rx="9" ry="11" fill="#2d2d3a" />
          <circle cx="89" cy="109" r="3" fill="white" opacity="0.9" />
          {/* teardrop */}
          <motion.ellipse
            cx="94" cy="125" rx="3.5" ry="5"
            fill="#9ad4ff"
            opacity="0.85"
            animate={{ opacity: [0.5, 0.9, 0.5], cy: [125, 128, 125] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* 🥹 Right Eye - teary */}
          <ellipse cx="128" cy="112" rx="9" ry="11" fill="#2d2d3a" />
          <circle cx="125" cy="109" r="3" fill="white" opacity="0.9" />
          {/* teardrop */}
          <motion.ellipse
            cx="130" cy="125" rx="3.5" ry="5"
            fill="#9ad4ff"
            opacity="0.85"
            animate={{ opacity: [0.5, 0.9, 0.5], cy: [125, 128, 125] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />

          {/* Nose */}
          <ellipse cx="110" cy="127" rx="5" ry="3.5" fill="#ffb3d9" />
          {/* Mouth — slight sad-hopeful curve */}
          <path d="M 100 133 Q 110 138 120 133" stroke="#c8a0c8" strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {/* Cheek blush */}
          <ellipse cx="82" cy="124" rx="12" ry="7" fill="#ffb3d9" opacity="0.35" />
          <ellipse cx="138" cy="124" rx="12" ry="7" fill="#ffb3d9" opacity="0.35" />

          {/* Left arm */}
          <ellipse cx="60" cy="205" rx="16" ry="36" fill="#f0e6fa" stroke="#dcc8ef" strokeWidth="2" transform="rotate(-15 60 205)" />
          {/* Right arm */}
          <ellipse cx="160" cy="205" rx="16" ry="36" fill="#f0e6fa" stroke="#dcc8ef" strokeWidth="2" transform="rotate(15 160 205)" />

          {/* Feet */}
          <ellipse cx="88" cy="248" rx="24" ry="14" fill="#f0e6fa" stroke="#dcc8ef" strokeWidth="2" />
          <ellipse cx="132" cy="248" rx="24" ry="14" fill="#f0e6fa" stroke="#dcc8ef" strokeWidth="2" />

          {/* Tail */}
          <circle cx="174" cy="215" r="14" fill="#fdf0ff" stroke="#dcc8ef" strokeWidth="1.5" />
        </motion.svg>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.7 }}
        style={{
          marginTop: 24,
          fontSize: 36,
          fontWeight: 800,
          color: '#4a3a5c',
          letterSpacing: '-0.5px',
          fontFamily: "'Georgia', serif",
        }}
      >
        MyBreakdown
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        style={{ marginTop: 8, color: '#9b7ab8', fontSize: 15, letterSpacing: 0.3 }}
      >
        a safe space to let it all out 🤍
      </motion.p>

      {/* Loading dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        style={{ display: 'flex', gap: 8, marginTop: 40 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            style={{ width: 8, height: 8, borderRadius: '50%', background: '#c8a8e0' }}
            animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}