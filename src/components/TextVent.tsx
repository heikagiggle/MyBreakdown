import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Phone } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { analyzeStress, hasCrisisKeywords } from '../lib/stressAnalyzer';

interface TextVentProps {
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

export default function TextVent({ onBack, onComplete }: TextVentProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSafety, setShowSafety] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setCharCount(e.target.value.length);
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    // Safety check FIRST — before any scoring or DB write
    if (hasCrisisKeywords(content)) {
      setShowSafety(true);
      return;
    }

    setIsSubmitting(true);
    const stressScore = analyzeStress(content);

    try {
      await supabase.from('rants').insert({
        type: 'text',
        content: content.trim(),
        stress_score: stressScore,
      });
      onComplete(stressScore);
    } catch (error) {
      console.error('Error saving rant:', error);
      // Still navigate even if DB fails — don't block the user
      onComplete(stressScore);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          maxWidth: 560,
          width: '100%',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          style={{ marginBottom: 6 }}
        >
          <h2
            style={{
              fontSize: 30,
              fontWeight: 800,
              color: '#3d2a55',
              fontFamily: 'Georgia, serif',
              margin: 0,
            }}
          >
            Let it all out 🌊
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          style={{ color: '#9b7ab8', fontSize: 14, marginBottom: 20, lineHeight: 1.5 }}
        >
          Write whatever you're feeling. No judgment, no filter. The bear is listening 🐻
        </motion.p>

        {/* Textarea */}
        <motion.div
          initial={{ scale: 0.97, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{ flex: 1, position: 'relative' }}
        >
          <textarea
            value={content}
            onChange={handleChange}
            placeholder="I'm so tired of... / TODAY WAS AWFUL BECAUSE... / i just need to say..."
            style={{
              width: '100%',
              minHeight: 300,
              padding: '20px 22px',
              background: 'rgba(255,255,255,0.72)',
              backdropFilter: 'blur(10px)',
              borderRadius: 24,
              border: '1.5px solid rgba(200,168,232,0.35)',
              boxShadow: '0 6px 24px rgba(120,80,180,0.1)',
              resize: 'none',
              outline: 'none',
              fontSize: 16,
              lineHeight: 1.7,
              color: '#3d2a55',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(180,130,220,0.6)';
              e.target.style.boxShadow = '0 6px 28px rgba(120,80,180,0.16)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(200,168,232,0.35)';
              e.target.style.boxShadow = '0 6px 24px rgba(120,80,180,0.1)';
            }}
          />
          {/* Character count */}
          <span
            style={{
              position: 'absolute',
              bottom: 14,
              right: 18,
              fontSize: 12,
              color: charCount > 800 ? '#e55' : '#c4a8d8',
              pointerEvents: 'none',
            }}
          >
            {charCount}
          </span>
        </motion.div>

        {/* Submit button */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          whileHover={{ scale: content.trim() ? 1.02 : 1, y: content.trim() ? -2 : 0 }}
          whileTap={{ scale: content.trim() ? 0.97 : 1 }}
          onClick={handleSubmit}
          disabled={!content.trim() || isSubmitting}
          style={{
            marginTop: 16,
            background: content.trim()
              ? 'linear-gradient(135deg, #edddf8, #c8f0e0)'
              : 'rgba(220,210,230,0.5)',
            border: '1.5px solid rgba(200,168,232,0.4)',
            borderRadius: 22,
            padding: '18px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            fontSize: 16,
            fontWeight: 700,
            color: content.trim() ? '#3d2a55' : '#b0a0c0',
            cursor: content.trim() ? 'pointer' : 'not-allowed',
            boxShadow: content.trim() ? '0 6px 20px rgba(180,130,220,0.2)' : 'none',
            transition: 'all 0.25s',
          }}
        >
          <Send size={18} />
          {isSubmitting ? 'Sending to Bear...' : 'Send to Bear 🐻'}
        </motion.button>

        {/* Subtle safety link */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={() => setShowSafety(true)}
          style={{
            background: 'none',
            border: 'none',
            marginTop: 14,
            color: '#b09ac8',
            fontSize: 12,
            cursor: 'pointer',
            textDecoration: 'underline',
            textDecorationStyle: 'dotted',
            textAlign: 'center',
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