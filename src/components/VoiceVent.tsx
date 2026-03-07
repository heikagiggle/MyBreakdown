import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mic, Square, Send, Phone, RotateCcw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { analyzeStress, hasCrisisKeywords } from '../lib/stressAnalyzer';

interface VoiceVentProps {
  onBack: () => void;
  onComplete: (stressScore: number) => void;
}

const HELPLINES = [
  { name: 'MANI (Nigeria)', number: '0800-123-4566', flag: '🇳🇬' },
  { name: 'Suicide & Crisis Lifeline (US)', number: '988', flag: '🇺🇸' },
  { name: 'Samaritans (UK)', number: '116 123', flag: '🇬🇧' },
  { name: 'Crisis Services Canada', number: '1-833-456-4566', flag: '🇨🇦' },
  { name: 'Lifeline Australia', number: '13 11 14', flag: '🇦🇺' },
  { name: 'iCall (India)', number: '9152987821', flag: '🇮🇳' },
  { name: 'Befrienders Worldwide', number: 'befrienders.org', flag: '🌍' },
];

export default function VoiceVent({ onBack, onComplete }: VoiceVentProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedText, setRecordedText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSafety, setShowSafety] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = (event: any) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setRecordedText(transcript);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      stopRecording();
    };

    recognitionRef.current.start();
    setIsRecording(true);
    setRecordingDuration(0);

    // Timer for duration display
    timerRef.current = setInterval(() => {
      setRecordingDuration((d) => d + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const resetRecording = () => {
    stopRecording();
    setRecordedText('');
    setRecordingDuration(0);
  };

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    if (!recordedText.trim()) return;

    // Safety check FIRST — before any scoring or DB write
    if (hasCrisisKeywords(recordedText)) {
      setShowSafety(true);
      return;
    }

    setIsSubmitting(true);
    const stressScore = analyzeStress(recordedText);

    try {
      await supabase.from('rants').insert({
        type: 'audio',
        content: recordedText.trim(),
        stress_score: stressScore,
      });
      onComplete(stressScore);
    } catch (error) {
      console.error('Error saving rant:', error);
      // Still navigate even if DB fails
      onComplete(stressScore);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Waveform bars for recording animation
  const waveBarCount = 18;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #fdf6ff 0%, #ede1f8 35%, #dff0ea 70%, #fbe8f2 100%)',
        display: 'flex',
        flexDirection: 'column',
        padding: 24,
      }}
    >
      {/* Back button */}
      <motion.button
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        onClick={onBack}
        style={{
          alignSelf: 'flex-start',
          marginBottom: 24,
          background: 'rgba(255,255,255,0.6)',
          border: 'none',
          borderRadius: 14,
          padding: '8px 10px',
          cursor: 'pointer',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 2px 10px rgba(120,80,180,0.1)',
        }}
      >
        <ArrowLeft size={22} color="#6b4d8a" />
      </motion.button>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          maxWidth: 480,
          width: '100%',
          margin: '0 auto',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <motion.h2
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          style={{
            fontSize: 30,
            fontWeight: 800,
            color: '#3d2a55',
            fontFamily: 'Georgia, serif',
            marginBottom: 8,
            textAlign: 'center',
          }}
        >
          Speak your mind 🎙️
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          style={{
            color: '#9b7ab8',
            fontSize: 14,
            marginBottom: 44,
            textAlign: 'center',
            lineHeight: 1.5,
            maxWidth: 300,
          }}
        >
          Press the button and say everything you're holding in. The bear is listening 🐻
        </motion.p>

        {/* ── Mic Button ── */}
        <div style={{ position: 'relative', marginBottom: 28 }}>
          {/* Pulse rings when recording */}
          {isRecording && [1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: '2px solid rgba(255,140,200,0.5)',
              }}
              animate={{ scale: [1, 1.4 + ring * 0.25], opacity: [0.6, 0] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                delay: ring * 0.35,
                ease: 'easeOut',
              }}
            />
          ))}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.93 }}
            onClick={isRecording ? stopRecording : startRecording}
            style={{
              width: 128,
              height: 128,
              borderRadius: '50%',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isRecording
                ? 'linear-gradient(135deg, #ff9ecd, #ffb3d9)'
                : 'linear-gradient(135deg, #edddf8, #c8f0e0)',
              boxShadow: isRecording
                ? '0 8px 32px rgba(255,140,200,0.45)'
                : '0 8px 28px rgba(180,130,220,0.3)',
              transition: 'all 0.3s',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {isRecording ? (
              <Square size={44} color="white" fill="white" />
            ) : (
              <Mic size={44} color="#3d2a55" />
            )}
          </motion.button>
        </div>

        {/* Status label */}
        <motion.p
          animate={{ opacity: 1 }}
          style={{
            color: isRecording ? '#d060a0' : '#9b7ab8',
            fontWeight: 600,
            fontSize: 14,
            marginBottom: 16,
          }}
        >
          {isRecording
            ? `🔴 Recording — ${formatDuration(recordingDuration)}`
            : recordedText
            ? '✅ Recording saved — review below'
            : 'Tap to start recording'}
        </motion.p>

        {/* ── Waveform animation while recording ── */}
        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                height: 48,
                marginBottom: 24,
              }}
            >
              {Array.from({ length: waveBarCount }).map((_, i) => (
                <motion.div
                  key={i}
                  style={{
                    width: 4,
                    borderRadius: 4,
                    background: `hsl(${280 + i * 5}, 60%, 70%)`,
                  }}
                  animate={{
                    height: [8, 16 + Math.sin(i * 0.8) * 24, 8],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 0.7 + Math.random() * 0.5,
                    repeat: Infinity,
                    delay: i * 0.06,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Transcript + Actions ── */}
        <AnimatePresence>
          {recordedText && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              style={{ width: '100%' }}
            >
              {/* Transcript box */}
              <div
                style={{
                  background: 'rgba(255,255,255,0.72)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 22,
                  padding: '18px 20px',
                  maxHeight: 180,
                  overflowY: 'auto',
                  boxShadow: '0 4px 20px rgba(120,80,180,0.1)',
                  border: '1.5px solid rgba(200,168,232,0.3)',
                  marginBottom: 14,
                }}
              >
                <p style={{ color: '#3d2a55', lineHeight: 1.7, fontSize: 15, margin: 0 }}>
                  {recordedText}
                </p>
              </div>

              {/* Action row */}
              <div style={{ display: 'flex', gap: 10 }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={resetRecording}
                  style={{
                    flex: '0 0 auto',
                    background: 'rgba(255,255,255,0.6)',
                    border: '1.5px solid rgba(200,168,232,0.35)',
                    borderRadius: 18,
                    padding: '14px 16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 14,
                    color: '#9b7ab8',
                    fontWeight: 500,
                  }}
                >
                  <RotateCcw size={16} />
                  Redo
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #edddf8, #c8f0e0)',
                    border: '1.5px solid rgba(200,168,232,0.4)',
                    borderRadius: 18,
                    padding: '14px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    fontSize: 15,
                    fontWeight: 700,
                    color: '#3d2a55',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.65 : 1,
                    boxShadow: '0 4px 16px rgba(180,130,220,0.18)',
                    transition: 'all 0.2s',
                  }}
                >
                  <Send size={17} />
                  {isSubmitting ? 'Sending...' : 'Send to Bear 🐻'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subtle safety link */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          onClick={() => setShowSafety(true)}
          style={{
            background: 'none',
            border: 'none',
            marginTop: 28,
            color: '#b09ac8',
            fontSize: 12,
            cursor: 'pointer',
            textDecoration: 'underline',
            textDecorationStyle: 'dotted',
          }}
        >
          🆘 I need urgent support
        </motion.button>
      </motion.div>

      {/* ── Safety Modal ─────────────────────────────────── */}
      <AnimatePresence>
        {showSafety && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              background: 'rgba(40,20,60,0.55)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
            }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
              style={{
                background: 'white',
                borderRadius: 28,
                padding: 28,
                maxWidth: 380,
                width: '100%',
                boxShadow: '0 20px 60px rgba(40,20,60,0.3)',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ fontSize: 48 }}>🫂</div>
                <h2
                  style={{
                    color: '#3d2a55',
                    fontSize: 19,
                    fontWeight: 700,
                    marginTop: 10,
                    marginBottom: 10,
                    lineHeight: 1.4,
                  }}
                >
                  I'm very concerned about what you just shared.
                </h2>
                <p style={{ color: '#6b4d8a', fontSize: 14, lineHeight: 1.7 }}>
                  Please reach out to someone who can help right now. You deserve real, immediate support. 💜
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {HELPLINES.map((h) => (
                  <div
                    key={h.name}
                    style={{
                      background: '#f8f2ff',
                      borderRadius: 14,
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <span style={{ fontSize: 22 }}>{h.flag}</span>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#3d2a55', margin: 0 }}>
                        {h.name}
                      </p>
                      <p
                        style={{
                          fontSize: 13,
                          color: '#9060b8',
                          margin: 0,
                          display: 'flex',
                          alignItems: 'center',
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
                  width: '100%',
                  background: 'linear-gradient(135deg, #edddf8, #f8eeff)',
                  border: '1.5px solid rgba(200,168,232,0.5)',
                  borderRadius: 16,
                  padding: 14,
                  fontSize: 15,
                  fontWeight: 600,
                  color: '#3d2a55',
                  cursor: 'pointer',
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