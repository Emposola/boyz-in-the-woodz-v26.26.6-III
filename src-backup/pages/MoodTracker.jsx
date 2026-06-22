/* ============================================================
   MOOD TRACKER — /wellness/mood-tracker
   ============================================================ */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FG = '#2D5A27';
const SAND = '#D2B48C';

const MOODS = [
  { score: 1, emoji: '😔', label: 'Rough', color: '#5C4033' },
  { score: 2, emoji: '😕', label: 'Low', color: '#8B6914' },
  { score: 3, emoji: '😐', label: 'Neutral', color: '#36454F' },
  { score: 4, emoji: '🙂', label: 'Good', color: FG },
  { score: 5, emoji: '😌', label: 'Grounded', color: '#4CAF50' },
];

const MOCK_HISTORY = [
  { label: 'Pre-Retreat', score: 2 },
  { label: 'Day 1', score: 2 },
  { label: 'Day 2', score: 3 },
  { label: 'Day 3', score: 4 },
  { label: 'Post-Retreat', score: 5 },
];

export default function MoodTracker() {
  const [preRaw, setPreRaw] = useState(null);
  const [postRaw, setPostRaw] = useState(null);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);
  const phase = !preRaw ? 'pre' : !postRaw ? 'post' : 'done';

  const improvement = preRaw && postRaw ? postRaw.score - preRaw.score : null;

  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-14" style={{ background: 'linear-gradient(135deg, rgba(45,90,39,0.1) 0%, transparent 60%)' }}>
        <div className="max-w-2xl mx-auto px-4">
          <span className="text-xs font-heading tracking-[0.3em] uppercase block mb-2" style={{ color: SAND }}>Wellness</span>
          <h1 className="font-heading text-5xl tracking-wide uppercase text-foreground mb-2">Mood Tracker</h1>
          <p className="text-muted-foreground">Track how you feel before and after retreat. The data doesn't lie.</p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Community stat */}
        <div className="bg-card border border-border rounded-xl p-5 mb-8 flex items-center gap-4">
          <TrendingUp className="w-8 h-8 flex-shrink-0" style={{ color: FG }} />
          <div>
            <p className="font-heading text-2xl text-foreground" style={{ color: FG }}>86%</p>
            <p className="text-xs text-muted-foreground font-heading tracking-wider uppercase">of brothers feel better after retreat</p>
          </div>
        </div>

        {phase === 'pre' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl p-6">
            <h2 className="font-heading text-xl tracking-wider uppercase mb-2">How are you feeling <em>right now</em>?</h2>
            <p className="text-xs text-muted-foreground mb-6">Before the retreat. Be honest.</p>
            <div className="flex justify-between gap-3 mb-6">
              {MOODS.map(m => (
                <button key={m.score} onClick={() => setPreRaw(m)}
                  className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${preRaw?.score === m.score ? 'border-primary/60 bg-primary/10' : 'border-border hover:border-border/80 hover:bg-secondary/30'}`}>
                  <span className="text-3xl">{m.emoji}</span>
                  <span className="text-[10px] font-heading tracking-wider uppercase text-muted-foreground">{m.label}</span>
                </button>
              ))}
            </div>
            {preRaw && (
              <Button onClick={() => null} className="w-full font-heading tracking-wider uppercase" style={{ background: FG }}>
                Save Pre-Retreat Mood <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </motion.div>
        )}

        {phase === 'post' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl p-6">
            <div className="mb-5 p-3 rounded-xl bg-secondary/40 text-center">
              <p className="text-xs text-muted-foreground">Pre-retreat mood: <span className="text-foreground">{preRaw.emoji} {preRaw.label}</span></p>
            </div>
            <h2 className="font-heading text-xl tracking-wider uppercase mb-2">How are you feeling <em>now</em>?</h2>
            <p className="text-xs text-muted-foreground mb-6">Post-retreat check-in.</p>
            <div className="flex justify-between gap-3 mb-4">
              {MOODS.map(m => (
                <button key={m.score} onClick={() => setPostRaw(m)}
                  className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${postRaw?.score === m.score ? 'border-primary/60 bg-primary/10' : 'border-border hover:border-border/80 hover:bg-secondary/30'}`}>
                  <span className="text-3xl">{m.emoji}</span>
                  <span className="text-[10px] font-heading tracking-wider uppercase text-muted-foreground">{m.label}</span>
                </button>
              ))}
            </div>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={3}
              placeholder="Optional: what made the difference?"
              className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground mb-4 resize-none focus:outline-none" />
            {postRaw && (
              <Button onClick={() => setSaved(true)} className="w-full font-heading tracking-wider uppercase" style={{ background: FG }}>Save Post-Retreat Mood</Button>
            )}
          </motion.div>
        )}

        {(phase === 'done' || saved) && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border border-border rounded-2xl p-8 text-center">
            {improvement !== null && improvement > 0 ? (
              <>
                <div className="text-5xl mb-4">🎉</div>
                <h2 className="font-heading text-2xl tracking-wider uppercase mb-2">Your mood improved!</h2>
                <p className="text-muted-foreground mb-2">
                  From <strong className="text-foreground">{preRaw?.emoji} {preRaw?.label}</strong> to <strong className="text-foreground">{postRaw?.emoji} {postRaw?.label}</strong>
                </p>
                <p className="text-4xl font-heading mb-1" style={{ color: FG }}>+{improvement} points</p>
                <p className="text-xs text-muted-foreground mb-6">You're among the 86% who feel better after retreat.</p>
              </>
            ) : (
              <>
                <div className="text-5xl mb-4">🌱</div>
                <h2 className="font-heading text-2xl tracking-wider uppercase mb-2">Check-in saved.</h2>
                <p className="text-muted-foreground mb-6">Track your mood across retreats to see your pattern over time.</p>
              </>
            )}
          </motion.div>
        )}

        {/* Sample Journey Chart */}
        <div className="mt-8 bg-card border border-border rounded-xl p-5">
          <h3 className="font-heading text-sm tracking-[0.2em] uppercase mb-5">Sample Mood Journey — Broken Bow 2025</h3>
          <div className="flex items-end gap-3 h-28">
            {MOCK_HISTORY.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-lg transition-all" style={{ height: `${(d.score / 5) * 100}%`, background: i === MOCK_HISTORY.length - 1 ? FG : i === 0 ? '#5C4033' : '#36454F40', minHeight: '8px' }} />
                <span className="text-[8px] text-muted-foreground text-center leading-tight">{d.label}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center italic">Typical pattern: dip on arrival, peak by day 3, sustained post-retreat</p>
        </div>
      </div>
    </div>
  );
}