import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Clock, Star } from 'lucide-react';

interface PuzzleGameProps {
  onBack: () => void;
}

type Category = 'shapes' | 'animals';
type AnimalType = 'lion' | 'elephant' | 'bear';
type ShapeType = 'mandala' | 'flower' | 'star';
type Subject = AnimalType | ShapeType | null;

const COLORS = [
  '#e6d9f0', '#c8e6d9', '#ffb3d9', '#fef3e6',
  '#d9e8f5', '#ffe6f0', '#b8f0d8', '#f5d9ff',
  '#fffacc', '#c8f0ff', '#ffd6b8', '#d8f0c8',
];

const TIMER_DURATION = 30;

// ─── SVG PATH DATA for each subject ───────────────────────
// Each subject has: outline path(s) and fill region(s) to analyze

function getLionSVG(color: string, onMouseDown: (e: React.MouseEvent | React.TouchEvent) => void) {
  return (
    <g>
      {/* Mane */}
      <circle cx="140" cy="130" r="85" fill="none" stroke="#5a4020" strokeWidth="3" />
      <circle cx="140" cy="130" r="85" fill={color || '#fff8f0'} opacity="0.3" />
      {/* Head */}
      <circle cx="140" cy="130" r="60" fill={color || '#fff3e0'} stroke="#5a4020" strokeWidth="3"
        onMouseDown={onMouseDown} style={{ cursor: 'crosshair' }} />
      {/* Ears */}
      <ellipse cx="95" cy="82" rx="20" ry="25" fill={color || '#fff3e0'} stroke="#5a4020" strokeWidth="2.5"
        onMouseDown={onMouseDown} style={{ cursor: 'crosshair' }} />
      <ellipse cx="185" cy="82" rx="20" ry="25" fill={color || '#fff3e0'} stroke="#5a4020" strokeWidth="2.5"
        onMouseDown={onMouseDown} style={{ cursor: 'crosshair' }} />
      {/* Inner ears */}
      <ellipse cx="95" cy="83" rx="12" ry="16" fill="#ffb3d9" opacity="0.5" />
      <ellipse cx="185" cy="83" rx="12" ry="16" fill="#ffb3d9" opacity="0.5" />
      {/* Eyes */}
      <ellipse cx="120" cy="122" rx="12" ry="14" fill="#3d2a10" />
      <circle cx="115" cy="118" r="4" fill="white" opacity="0.7" />
      <ellipse cx="160" cy="122" rx="12" ry="14" fill="#3d2a10" />
      <circle cx="155" cy="118" r="4" fill="white" opacity="0.7" />
      {/* Nose */}
      <ellipse cx="140" cy="142" rx="10" ry="7" fill="#ff8fa0" />
      <path d="M 140 142 L 140 155 M 128 162 Q 140 155 152 162" stroke="#5a4020" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Whiskers */}
      <line x1="80" y1="145" x2="125" y2="148" stroke="#5a4020" strokeWidth="1.5" opacity="0.5" />
      <line x1="80" y1="155" x2="125" y2="155" stroke="#5a4020" strokeWidth="1.5" opacity="0.5" />
      <line x1="155" y1="148" x2="200" y2="145" stroke="#5a4020" strokeWidth="1.5" opacity="0.5" />
      <line x1="155" y1="155" x2="200" y2="155" stroke="#5a4020" strokeWidth="1.5" opacity="0.5" />
      {/* Body */}
      <ellipse cx="140" cy="235" rx="70" ry="60" fill={color || '#fff3e0'} stroke="#5a4020" strokeWidth="2.5"
        onMouseDown={onMouseDown} style={{ cursor: 'crosshair' }} />
      {/* Tail */}
      <path d="M 205 250 Q 230 230 220 210 Q 240 195 230 180" stroke="#5a4020" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="230" cy="178" r="10" fill={color || '#fff3e0'} stroke="#5a4020" strokeWidth="2" />
      {/* Paws */}
      <ellipse cx="90" cy="280" rx="25" ry="15" fill={color || '#fff3e0'} stroke="#5a4020" strokeWidth="2" />
      <ellipse cx="190" cy="280" rx="25" ry="15" fill={color || '#fff3e0'} stroke="#5a4020" strokeWidth="2" />
    </g>
  );
}

function getElephantSVG(color: string, onMouseDown: (e: React.MouseEvent | React.TouchEvent) => void) {
  return (
    <g>
      {/* Body */}
      <ellipse cx="140" cy="215" rx="85" ry="75" fill={color || '#f0f4ff'} stroke="#4060a0" strokeWidth="3"
        onMouseDown={onMouseDown} style={{ cursor: 'crosshair' }} />
      {/* Head */}
      <circle cx="140" cy="115" r="65" fill={color || '#f0f4ff'} stroke="#4060a0" strokeWidth="3"
        onMouseDown={onMouseDown} style={{ cursor: 'crosshair' }} />
      {/* Ears */}
      <ellipse cx="72" cy="115" rx="38" ry="55" fill={color || '#d8e8ff'} stroke="#4060a0" strokeWidth="2.5"
        onMouseDown={onMouseDown} style={{ cursor: 'crosshair' }} />
      <ellipse cx="72" cy="115" rx="25" ry="38" fill="#ffb3d9" opacity="0.4" />
      <ellipse cx="208" cy="115" rx="38" ry="55" fill={color || '#d8e8ff'} stroke="#4060a0" strokeWidth="2.5"
        onMouseDown={onMouseDown} style={{ cursor: 'crosshair' }} />
      <ellipse cx="208" cy="115" rx="25" ry="38" fill="#ffb3d9" opacity="0.4" />
      {/* Trunk */}
      <path d="M 120 145 Q 105 170 108 195 Q 110 215 125 220 Q 130 225 132 215" stroke="#4060a0" strokeWidth="4" fill={color || '#f0f4ff'} strokeLinecap="round" />
      {/* Eyes */}
      <circle cx="118" cy="105" r="10" fill="#2a3060" />
      <circle cx="114" cy="101" r="3.5" fill="white" opacity="0.7" />
      <circle cx="162" cy="105" r="10" fill="#2a3060" />
      <circle cx="158" cy="101" r="3.5" fill="white" opacity="0.7" />
      {/* Tusks */}
      <path d="M 122 145 Q 108 160 112 172" stroke="#ffe8a0" strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* Legs */}
      <rect x="82" y="270" width="38" height="50" rx="15" fill={color || '#f0f4ff'} stroke="#4060a0" strokeWidth="2"
        onMouseDown={onMouseDown} style={{ cursor: 'crosshair' }} />
      <rect x="160" y="270" width="38" height="50" rx="15" fill={color || '#f0f4ff'} stroke="#4060a0" strokeWidth="2"
        onMouseDown={onMouseDown} style={{ cursor: 'crosshair' }} />
      {/* Tail */}
      <path d="M 218 220 Q 238 215 235 235 Q 232 248 225 245" stroke="#4060a0" strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  );
}

function getBearSVG(color: string, onMouseDown: (e: React.MouseEvent | React.TouchEvent) => void) {
  return (
    <g>
      {/* Ears */}
      <ellipse cx="90" cy="65" rx="28" ry="35" fill={color || '#f5e6ff'} stroke="#7040a0" strokeWidth="3"
        onMouseDown={onMouseDown} style={{ cursor: 'crosshair' }} />
      <ellipse cx="90" cy="66" rx="18" ry="23" fill="#ffd6eb" opacity="0.5" />
      <ellipse cx="190" cy="65" rx="28" ry="35" fill={color || '#f5e6ff'} stroke="#7040a0" strokeWidth="3"
        onMouseDown={onMouseDown} style={{ cursor: 'crosshair' }} />
      <ellipse cx="190" cy="66" rx="18" ry="23" fill="#ffd6eb" opacity="0.5" />
      {/* Body */}
      <ellipse cx="140" cy="235" rx="78" ry="70" fill={color || '#f5e6ff'} stroke="#7040a0" strokeWidth="3"
        onMouseDown={onMouseDown} style={{ cursor: 'crosshair' }} />
      <ellipse cx="140" cy="240" rx="50" ry="45" fill="#fdf0ff" opacity="0.7" />
      {/* Head */}
      <circle cx="140" cy="130" r="68" fill={color || '#f5e6ff'} stroke="#7040a0" strokeWidth="3"
        onMouseDown={onMouseDown} style={{ cursor: 'crosshair' }} />
      {/* Eyes */}
      <ellipse cx="116" cy="120" rx="11" ry="13" fill="#3d2060" />
      <circle cx="112" cy="116" r="4" fill="white" opacity="0.8" />
      <ellipse cx="164" cy="120" rx="11" ry="13" fill="#3d2060" />
      <circle cx="160" cy="116" r="4" fill="white" opacity="0.8" />
      {/* Nose */}
      <ellipse cx="140" cy="138" rx="10" ry="7" fill="#b060d0" />
      <path d="M 128 148 Q 140 155 152 148" stroke="#7040a0" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Cheek blush */}
      <ellipse cx="105" cy="134" rx="16" ry="10" fill="#ffb3d9" opacity="0.4" />
      <ellipse cx="175" cy="134" rx="16" ry="10" fill="#ffb3d9" opacity="0.4" />
      {/* Arms */}
      <ellipse cx="70" cy="245" rx="22" ry="50" fill={color || '#f5e6ff'} stroke="#7040a0" strokeWidth="2.5"
        onMouseDown={onMouseDown} style={{ cursor: 'crosshair' }} transform="rotate(-18 70 245)" />
      <ellipse cx="210" cy="245" rx="22" ry="50" fill={color || '#f5e6ff'} stroke="#7040a0" strokeWidth="2.5"
        onMouseDown={onMouseDown} style={{ cursor: 'crosshair' }} transform="rotate(18 210 245)" />
      {/* Feet */}
      <ellipse cx="105" cy="295" rx="32" ry="18" fill={color || '#f5e6ff'} stroke="#7040a0" strokeWidth="2" />
      <ellipse cx="175" cy="295" rx="32" ry="18" fill={color || '#f5e6ff'} stroke="#7040a0" strokeWidth="2" />
    </g>
  );
}

function getMandalaSVG(color: string, onMouseDown: (e: React.MouseEvent | React.TouchEvent) => void) {
  const petals = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * 45 * Math.PI) / 180;
    const x = 140 + Math.cos(angle) * 65;
    const y = 155 + Math.sin(angle) * 65;
    return (
      <ellipse key={i} cx={x} cy={y} rx="22" ry="38"
        fill={color || '#f5f0ff'} stroke="#8050c0" strokeWidth="2"
        transform={`rotate(${i * 45} ${x} ${y})`}
        onMouseDown={onMouseDown} style={{ cursor: 'crosshair' }}
      />
    );
  });
  return (
    <g>
      {petals}
      <circle cx="140" cy="155" r="45" fill={color || '#fff0ff'} stroke="#8050c0" strokeWidth="2.5"
        onMouseDown={onMouseDown} style={{ cursor: 'crosshair' }} />
      <circle cx="140" cy="155" r="25" fill={color || '#f8e8ff'} stroke="#8050c0" strokeWidth="2"
        onMouseDown={onMouseDown} style={{ cursor: 'crosshair' }} />
      <circle cx="140" cy="155" r="10" fill={color || '#f0d8ff'} stroke="#8050c0" strokeWidth="2"
        onMouseDown={onMouseDown} style={{ cursor: 'crosshair' }} />
    </g>
  );
}

function getFlowerSVG(color: string, onMouseDown: (e: React.MouseEvent | React.TouchEvent) => void) {
  const petals = Array.from({ length: 6 }, (_, i) => {
    const angle = (i * 60 * Math.PI) / 180;
    const x = 140 + Math.cos(angle) * 70;
    const y = 155 + Math.sin(angle) * 70;
    return (
      <ellipse key={i} cx={x} cy={y} rx="30" ry="50"
        fill={color || '#fff5f0'} stroke="#d06080" strokeWidth="2.5"
        transform={`rotate(${i * 60} ${x} ${y})`}
        onMouseDown={onMouseDown} style={{ cursor: 'crosshair' }}
      />
    );
  });
  return (
    <g>
      {petals}
      <circle cx="140" cy="155" r="38" fill={color || '#fff8c0'} stroke="#d06080" strokeWidth="2.5"
        onMouseDown={onMouseDown} style={{ cursor: 'crosshair' }} />
      <circle cx="140" cy="155" r="20" fill="#ffd600" opacity="0.6"
        onMouseDown={onMouseDown} style={{ cursor: 'crosshair' }} />
      {/* leaf stem */}
      <path d="M 140 190 Q 140 240 135 270" stroke="#40a060" strokeWidth="4" fill="none" strokeLinecap="round" />
      <ellipse cx="120" cy="248" rx="22" ry="12" fill="#60c080" stroke="#40a060" strokeWidth="2" transform="rotate(-30 120 248)" />
    </g>
  );
}

function getStarSVG(color: string, onMouseDown: (e: React.MouseEvent | React.TouchEvent) => void) {
  // 5-pointed star
  const starPath = () => {
    const cx = 140, cy = 155, outerR = 100, innerR = 42;
    const points: string[] = [];
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const angle = (i * 36 - 90) * (Math.PI / 180);
      points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
    }
    return points.join(' ');
  };
  return (
    <g>
      <polygon points={starPath()} fill={color || '#fffde0'} stroke="#d0a000" strokeWidth="3"
        onMouseDown={onMouseDown} style={{ cursor: 'crosshair' }} />
      {/* Inner details */}
      <circle cx="140" cy="155" r="32" fill={color || '#fff8c0'} stroke="#d0a000" strokeWidth="2"
        onMouseDown={onMouseDown} style={{ cursor: 'crosshair' }} />
      <circle cx="140" cy="155" r="16" fill={color || '#ffe880'} opacity="0.6" />
    </g>
  );
}

// ─── Main Component ────────────────────────────────────────

export default function PuzzleGame({ onBack }: PuzzleGameProps) {
  const [screen, setScreen] = useState<'category' | 'subject' | 'canvas' | 'result'>('category');
  const [category, setCategory] = useState<Category | null>(null);
  const [subject, setSubject] = useState<Subject>(null);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [brushSize, setBrushSize] = useState(16);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [isDrawing, setIsDrawing] = useState(false);
  const [focusScore, setFocusScore] = useState(0);
  const [outsidePercent, setOutsidePercent] = useState(0);
  const [bearFeedback, setBearFeedback] = useState('');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null); // for outline reference
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  // ── Timer ──────────────────────────────────────────────
  useEffect(() => {
    if (screen !== 'canvas') return;
    setTimeLeft(TIMER_DURATION);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          computeScore();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [screen, subject]);

  // ── Canvas drawing ─────────────────────────────────────
  const getPos = (e: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = useCallback((e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    e.preventDefault();
    setIsDrawing(true);
    const pos = getPos(e, canvas);
    lastPos.current = pos;
    const ctx = canvas.getContext('2d')!;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, brushSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = selectedColor + 'cc';
    ctx.fill();
  }, [selectedColor, brushSize]);

  const draw = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    e.preventDefault();
    const ctx = canvas.getContext('2d')!;
    const pos = getPos(e, canvas);
    if (lastPos.current) {
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = selectedColor + 'cc';
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
    lastPos.current = pos;
  }, [isDrawing, selectedColor, brushSize]);

  const stopDraw = useCallback(() => {
    setIsDrawing(false);
    lastPos.current = null;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || screen !== 'canvas') return;
    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDraw);
    canvas.addEventListener('mouseleave', stopDraw);
    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDraw);
    return () => {
      canvas.removeEventListener('mousedown', startDraw);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDraw);
      canvas.removeEventListener('mouseleave', stopDraw);
      canvas.removeEventListener('touchstart', startDraw);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stopDraw);
    };
  }, [screen, startDraw, draw, stopDraw]);

  // ── Score computation ──────────────────────────────────
  const computeScore = () => {
    const canvas = canvasRef.current;
    const overlay = overlayCanvasRef.current;
    if (!canvas || !overlay) return;

    const ctx = canvas.getContext('2d')!;
    const ovCtx = overlay.getContext('2d')!;
    const { width, height } = canvas;

    const paintData = ctx.getImageData(0, 0, width, height).data;
    const maskData = ovCtx.getImageData(0, 0, width, height).data;

    let totalPainted = 0;
    let insidePainted = 0;
    let outsidePainted = 0;
    let totalInside = 0;

    for (let i = 0; i < paintData.length; i += 4) {
      const painted = paintData[i + 3] > 30;
      const insideMask = maskData[i + 3] > 128; // white in mask = inside shape

      if (insideMask) totalInside++;
      if (painted) {
        totalPainted++;
        if (insideMask) insidePainted++;
        else outsidePainted++;
      }
    }

    const coverageScore = totalInside > 0 ? Math.min((insidePainted / totalInside) * 10, 10) : 0;
    const outsideRatio = totalPainted > 0 ? outsidePainted / totalPainted : 0;
    const outsidePct = Math.round(outsideRatio * 100);
    const finalScore = Math.max(0, Math.round(coverageScore - outsideRatio * 5));

    setFocusScore(Math.min(finalScore, 10));
    setOutsidePercent(outsidePct);

    if (outsidePct > 35) {
      setBearFeedback("let's try to keep the focus inside the lines next time, it helps calm the mind 🐾");
    } else if (finalScore >= 7) {
      setBearFeedback("amazing focus! you stayed in the lines and covered so much — that mindfulness is powerful 🌿💜");
    } else if (finalScore >= 4) {
      setBearFeedback("good effort! each stroke counts. the more you color, the calmer the mind becomes 🎨");
    } else {
      setBearFeedback("it's okay — starting is the hardest part. even a few strokes help release stress 🤍");
    }

    setScreen('result');
  };

  const resetGame = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setTimeLeft(TIMER_DURATION);
    setFocusScore(0);
    setScreen('canvas');
  };

  // ── Draw outline mask on overlay canvas ───────────────
  // We use SVG rendered to image as a mask — simplified: mark interior via floodfill color
  // For this implementation, we use a white-filled SVG render as the mask
  useEffect(() => {
    if (screen !== 'canvas') return;
    const overlay = overlayCanvasRef.current;
    if (!overlay) return;
    const ctx = overlay.getContext('2d')!;
    ctx.clearRect(0, 0, overlay.width, overlay.height);
    // Draw a white fill approximation of the shape bounds as mask
    // (approximating interior using bounding fill shapes)
    ctx.fillStyle = 'white';
    if (subject === 'bear' || subject === 'lion' || subject === 'elephant') {
      // Body oval
      ctx.beginPath();
      ctx.ellipse(140, 215, 80, 72, 0, 0, Math.PI * 2);
      ctx.fill();
      // Head
      ctx.beginPath();
      ctx.arc(140, subject === 'lion' ? 130 : subject === 'elephant' ? 115 : 130, subject === 'elephant' ? 63 : 65, 0, Math.PI * 2);
      ctx.fill();
    } else if (subject === 'mandala' || subject === 'flower') {
      ctx.beginPath();
      ctx.arc(140, 155, 105, 0, Math.PI * 2);
      ctx.fill();
    } else if (subject === 'star') {
      const cx = 140, cy = 155, outerR = 100;
      ctx.beginPath();
      ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [screen, subject]);

  // ─── RENDER ────────────────────────────────────────────

  const CANVAS_W = 280;
  const CANVAS_H = 310;

  // const renderSubjectSVG = () => {
  //   const noop = (e: React.MouseEvent | React.TouchEvent) => e.preventDefault();
  //   if (subject === 'lion') return getLionSVG(COLORS[0], noop);
  //   if (subject === 'elephant') return getElephantSVG(COLORS[0], noop);
  //   if (subject === 'bear') return getBearSVG(COLORS[0], noop);
  //   if (subject === 'mandala') return getMandalaSVG(COLORS[0], noop);
  //   if (subject === 'flower') return getFlowerSVG(COLORS[0], noop);
  //   if (subject === 'star') return getStarSVG(COLORS[0], noop);
  //   return null;
  // };

  // ─── Screen: Category Selection ───────────────────────
  if (screen === 'category') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fdf6ff, #f0e9f8, #e8f4f0)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <motion.button onClick={onBack} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: 'absolute', top: 24, left: 24, background: 'none', border: 'none', cursor: 'pointer', color: '#6b4d8a' }}>
          <ArrowLeft size={26} />
        </motion.button>

        <motion.h2 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ fontSize: 28, fontWeight: 800, color: '#3d2a55', fontFamily: 'Georgia, serif', marginBottom: 8, textAlign: 'center' }}>
          Calm Coloring 🎨
        </motion.h2>
        <motion.p initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} style={{ color: '#9b7ab8', fontSize: 14, marginBottom: 40, textAlign: 'center' }}>
          Choose what you'd like to color today
        </motion.p>

        <div style={{ display: 'flex', gap: 20, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { key: 'shapes', label: 'Shapes', emoji: '⭐', desc: 'Mandalas, flowers & stars', color: '#ffe6f0' },
            { key: 'animals', label: 'Animals', emoji: '🦁', desc: 'Lion, elephant & bear', color: '#e6f0ff' },
          ].map((c, i) => (
            <motion.button
              key={c.key}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              whileHover={{ scale: 1.04, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setCategory(c.key as Category); setScreen('subject'); }}
              style={{
                background: c.color,
                border: '2px solid rgba(200,150,220,0.3)',
                borderRadius: 24,
                padding: '28px 32px',
                width: 155,
                textAlign: 'center',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(180,130,220,0.15)',
              }}
            >
              <div style={{ fontSize: 44, marginBottom: 10 }}>{c.emoji}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#3d2a55' }}>{c.label}</div>
              <div style={{ fontSize: 12, color: '#9b7ab8', marginTop: 6 }}>{c.desc}</div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // ─── Screen: Subject Selection ─────────────────────────
  if (screen === 'subject') {
    const options = category === 'animals'
      ? [
          { key: 'lion', label: 'Lion', emoji: '🦁' },
          { key: 'elephant', label: 'Elephant', emoji: '🐘' },
          { key: 'bear', label: 'Bear', emoji: '🐻' },
        ]
      : [
          { key: 'mandala', label: 'Mandala', emoji: '🌸' },
          { key: 'flower', label: 'Flower', emoji: '🌺' },
          { key: 'star', label: 'Star', emoji: '⭐' },
        ];

    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fdf6ff, #f0e9f8, #e8f4f0)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <motion.button onClick={() => setScreen('category')} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: 'absolute', top: 24, left: 24, background: 'none', border: 'none', cursor: 'pointer', color: '#6b4d8a' }}>
          <ArrowLeft size={26} />
        </motion.button>
        <motion.h2 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ fontSize: 26, fontWeight: 800, color: '#3d2a55', fontFamily: 'Georgia, serif', marginBottom: 8 }}>
          Pick one to color
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} style={{ color: '#9b7ab8', fontSize: 14, marginBottom: 36, textAlign: 'center' }}>
          You'll have 30 seconds to shade as much as you can
        </motion.p>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          {options.map((o, i) => (
            <motion.button
              key={o.key}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15 * i, type: 'spring', stiffness: 200 }}
              whileHover={{ scale: 1.06, y: -4 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => { setSubject(o.key as Subject); setScreen('canvas'); }}
              style={{
                background: 'white',
                border: '2px solid rgba(180,130,220,0.25)',
                borderRadius: 22,
                padding: '22px 26px',
                width: 130,
                textAlign: 'center',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(180,130,220,0.12)',
              }}
            >
              <div style={{ fontSize: 46, marginBottom: 8 }}>{o.emoji}</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#3d2a55' }}>{o.label}</div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // ─── Screen: Canvas Shading ────────────────────────────
  if (screen === 'canvas') {
    const timerColor = timeLeft <= 10 ? '#e55' : timeLeft <= 20 ? '#e8a020' : '#60a860';
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fdf6ff, #f0e9f8, #e8f4f0)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 16px', userSelect: 'none' }}>
        {/* Header */}
        <div style={{ width: '100%', maxWidth: 380, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <button onClick={() => { clearInterval(timerRef.current!); setScreen('subject'); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b4d8a' }}>
            <ArrowLeft size={24} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'white', borderRadius: 20, padding: '8px 16px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
            <Clock size={16} color={timerColor} />
            <span style={{ fontSize: 18, fontWeight: 700, color: timerColor }}>{timeLeft}s</span>
          </div>
          <button onClick={() => { clearInterval(timerRef.current!); resetGame(); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b4d8a' }}>
            <RotateCcw size={22} />
          </button>
        </div>

        <p style={{ color: '#9b7ab8', fontSize: 13, marginBottom: 10, textAlign: 'center' }}>
          Use your finger to shade inside the lines 🖌️
        </p>

        {/* Canvas area */}
        <div style={{ position: 'relative', width: CANVAS_W, height: CANVAS_H, borderRadius: 24, overflow: 'hidden', boxShadow: '0 8px 30px rgba(120,80,180,0.18)', background: 'white' }}>
          {/* Hidden overlay canvas for mask */}
          <canvas ref={overlayCanvasRef} width={CANVAS_W} height={CANVAS_H} style={{ position: 'absolute', top: 0, left: 0, opacity: 0, pointerEvents: 'none' }} />

          {/* Paint canvas */}
          <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} style={{ position: 'absolute', top: 0, left: 0, zIndex: 1, touchAction: 'none' }} />

          {/* SVG outline on top */}
          <svg width={CANVAS_W} height={CANVAS_H} viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
            style={{ position: 'absolute', top: 0, left: 0, zIndex: 2, pointerEvents: 'none' }}>
            {subject === 'lion' && getLionSVG('transparent', () => {})}
            {subject === 'elephant' && getElephantSVG('transparent', () => {})}
            {subject === 'bear' && getBearSVG('transparent', () => {})}
            {subject === 'mandala' && getMandalaSVG('transparent', () => {})}
            {subject === 'flower' && getFlowerSVG('transparent', () => {})}
            {subject === 'star' && getStarSVG('transparent', () => {})}
          </svg>
        </div>

        {/* Brush size */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '12px 0', background: 'white', padding: '10px 18px', borderRadius: 16, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
          <span style={{ fontSize: 12, color: '#9b7ab8' }}>Brush</span>
          <input type="range" min={8} max={32} value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))}
            style={{ width: 100 }} />
          <div style={{ width: brushSize, height: brushSize, borderRadius: '50%', background: selectedColor, border: '1.5px solid rgba(0,0,0,0.1)' }} />
        </div>

        {/* Color palette */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 320 }}>
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedColor(c)}
              style={{
                width: 38, height: 38, borderRadius: '50%', background: c,
                border: selectedColor === c ? '3px solid #6b4d8a' : '2px solid rgba(0,0,0,0.08)',
                cursor: 'pointer',
                boxShadow: selectedColor === c ? '0 0 0 3px rgba(107,77,138,0.25)' : 'none',
                transform: selectedColor === c ? 'scale(1.15)' : 'scale(1)',
                transition: 'all 0.15s',
              }}
            />
          ))}
        </div>

        {/* Manual finish */}
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={() => { clearInterval(timerRef.current!); computeScore(); }}
          style={{ marginTop: 16, background: 'linear-gradient(135deg, #edddf8, #f8eeff)', border: '1.5px solid rgba(200,168,232,0.4)', borderRadius: 18, padding: '12px 28px', fontSize: 14, fontWeight: 600, color: '#3d2a55', cursor: 'pointer' }}
        >
          ✅ I'm done, score me!
        </motion.button>
      </div>
    );
  }

  // ─── Screen: Result ────────────────────────────────────
  if (screen === 'result') {
    const stars = Math.max(1, Math.round(focusScore / 2));
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fdf6ff, #f0e9f8, #e8f4f0)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 28 }}>
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 180 }}>
          {/* Score circle */}
          <div style={{ width: 130, height: 130, borderRadius: '50%', background: 'white', boxShadow: '0 8px 30px rgba(120,80,180,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <div style={{ fontSize: 38, fontWeight: 800, color: '#3d2a55' }}>{focusScore}/10</div>
            <div style={{ fontSize: 12, color: '#9b7ab8' }}>Focus Score</div>
          </div>
        </motion.div>

        {/* Stars */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={28} fill={i < stars ? '#ffd600' : 'none'} color={i < stars ? '#ffd600' : '#d0c0e0'} />
          ))}
        </motion.div>

        {/* Bear feedback */}
        <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} style={{ background: 'white', borderRadius: 22, padding: '20px 24px', maxWidth: 320, textAlign: 'center', boxShadow: '0 4px 20px rgba(120,80,180,0.12)', marginBottom: 24 }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>🐻</div>
          <p style={{ color: '#6b4d8a', fontSize: 15, lineHeight: 1.6, fontStyle: 'italic' }}>
            "{bearFeedback}"
          </p>
        </motion.div>

        {outsidePercent > 0 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} style={{ fontSize: 13, color: '#a07cb8', marginBottom: 16 }}>
            {outsidePercent}% of your strokes went outside the lines
          </motion.p>
        )}

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <motion.button
            initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={resetGame}
            style={{ background: 'linear-gradient(135deg, #c8f0e0, #dff8ef)', border: '1.5px solid rgba(168,220,196,0.4)', borderRadius: 18, padding: '14px 24px', fontSize: 14, fontWeight: 600, color: '#1a4434', cursor: 'pointer' }}
          >
            🎨 Try Again
          </motion.button>
          <motion.button
            initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => setScreen('category')}
            style={{ background: 'linear-gradient(135deg, #edddf8, #f8eeff)', border: '1.5px solid rgba(200,168,232,0.4)', borderRadius: 18, padding: '14px 24px', fontSize: 14, fontWeight: 600, color: '#3d2a55', cursor: 'pointer' }}
          >
            Choose Another
          </motion.button>
          <motion.button
            initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.9 }}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={onBack}
            style={{ background: 'transparent', border: '1.5px solid rgba(180,130,220,0.3)', borderRadius: 18, padding: '14px 24px', fontSize: 14, fontWeight: 500, color: '#9b7ab8', cursor: 'pointer' }}
          >
            Back to Home
          </motion.button>
        </div>
      </div>
    );
  }

  return null;
}