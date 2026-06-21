/* ============================================================
   DAILY RESET — /wellness/daily-reset
   ============================================================ */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Sun, Moon, Clock, Camera, Bell, ChevronRight, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const FG = '#2D5A27';
const SAND = '#D2B48C';

const TODAY = new Date();
const DAY_RESETS = [
  {
    time: 'Morning',
    icon: Sun,
    title: '4-7-8 Breathing',
    duration: '5 min',
    instruction: 'Inhale through your nose for 4 counts. Hold for 7. Exhale slowly for 8. Repeat 4 times. Do this before you look at your phone.',
    benefit: 'Activates parasympathetic nervous system. Reduces morning cortisol spike.',
    color: SAND,
  },
  {
    time: 'Midday',
    icon: Leaf,
    title: 'Grounding Walk',
    duration: '5 min',
    instruction: 'Step outside. Walk slowly. Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste. No phone.',
    benefit: '5-4-3-2-1 grounding technique reduces cortisol within 10 minutes.',
    color: FG,
  },
  {
    time: 'Evening',
    icon: Moon,
    title: 'Gratitude Prompt',
    duration: '5 min',
    instruction: 'Write 3 specific things you\'re grateful for today. Not "my family" — specific. "My daughter called me funny during dinner." Specificity is the point.',
    benefit: 'Daily gratitude practice reduces depressive symptoms by up to 28%.',
    color: '#5C4033',
  },
];

const PAST_RESETS = [
  { date: 'Jun 4', morning: true, midday: false, evening: true },
  { date: 'Jun 3', morning: true, midday: true, evening: true },
  { date: 'Jun 2', morning: false, midday: true, evening: true },
  { date: 'Jun 1', morning: true, midday: true, evening: false },
  { date: 'May 31', morning: true, midday: true, evening: true },
  { date: 'May 30', morning: true, midday: false, evening: true },
  { date: 'May 29', morning: true, midday: true, evening: true },
];

export default function DailyReset() {
  const [completed, setCompleted] = useState([]);
  const [streak, setStreak] = useState(14);
  const [activeReset, setActiveReset] = useState(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [seconds, setSeconds] = useState(300);

  useEffect(() => {
    if (!timerRunning || seconds <= 0) return;
    const t = setInterval(() => setSeconds(s => { if (s <= 1) { setTimerRunning(false); return 300; } return s - 1; }), 1000);
    return () => clearInterval(t);
  }, [timerRunning, seconds]);

  const complete = (time) => {
    if (!completed.includes(time)) { setCompleted(c => [...c, time]); }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-14" style={{ background: 'linear-gradient(135deg, rgba(45,90,39,0.1) 0%, transparent 60%)' }}>
        <div className="max-w-3xl mx-auto px-4">
          <span className="text-xs font-heading tracking-[0.3em] uppercase block mb-2" style={{ color: SAND }}>Daily Practice</span>
          <h1 className="font-heading text-5xl tracking-wide uppercase text-foreground mb-2">Daily Reset</h1>
          <p className="text-muted-foreground">Take 5. Right now. No equipment. No excuses.</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Streak */}
        <div className="bg-card border border-border rounded-2xl p-5 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Flame className="w-8 h-8 text-orange-400" />
            <div>
              <p className="font-heading text-3xl text-foreground">{streak} days</p>
              <p className="text-xs text-muted-foreground font-heading tracking-wider uppercase">Active Streak</p>
            </div>
          </div>
          <div className="flex gap-2">
            {PAST_RESETS.map((d, i) => (
              <div key={i} className="text-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[9px] mb-0.5 ${(d.morning && d.midday && d.evening) ? 'bg-orange-400 text-white' : (d.morning || d.midday || d.evening) ? 'bg-primary/40 text-foreground' : 'bg-secondary text-muted-foreground'}`}>
                  {d.morning || d.midday || d.evening ? '🔥' : '·'}
                </div>
                <div className="text-[8px] text-muted-foreground">{d.date.split(' ')[1]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Date header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-px bg-primary" />
          <span className="font-heading text-sm tracking-[0.3em] uppercase text-primary">Today — {TODAY.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        </div>

        {/* Reset Cards */}
        <div className="space-y-5 mb-10">
          {DAY_RESETS.map((reset, i) => (
            <motion.div key={reset.time} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <div className={`bg-card border rounded-2xl overflow-hidden transition-all ${completed.includes(reset.time) ? 'border-primary/40 opacity-80' : 'border-border hover:border-primary/30'}`}>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${reset.color}20` }}>
                        <reset.icon className="w-5 h-5" style={{ color: reset.color }} />
                      </div>
                      <div>
                        <span className="text-[10px] font-heading tracking-[0.2em] uppercase text-muted-foreground">{reset.time} Reset</span>
                        <h3 className="font-heading text-base tracking-wider uppercase">{reset.title}</h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{reset.duration}</span>
                      {completed.includes(reset.time) && <span className="text-xs font-heading tracking-wider uppercase px-2 py-0.5 rounded-full text-white" style={{ background: FG }}>Done ✓</span>}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{reset.instruction}</p>
                  <p className="text-xs italic" style={{ color: reset.color }}>Science: {reset.benefit}</p>
                </div>
                {!completed.includes(reset.time) && (
                  <div className="px-5 pb-5 flex gap-3">
                    <Button onClick={() => { setActiveReset(reset); setSeconds(300); setTimerRunning(false); }}
                      size="sm" className="font-heading tracking-wider uppercase text-xs flex-1" style={{ background: reset.color }}>
                      Start Reset
                    </Button>
                    <Button onClick={() => complete(reset.time)} size="sm" variant="outline" className="font-heading tracking-wider uppercase text-xs">
                      Mark Done
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Timer Modal */}
        {activeReset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-card border border-border rounded-2xl p-8 max-w-sm w-full text-center">
              <activeReset.icon className="w-10 h-10 mx-auto mb-4" style={{ color: activeReset.color }} />
              <h3 className="font-heading text-xl tracking-wider uppercase mb-2">{activeReset.title}</h3>
              <p className="text-sm text-muted-foreground mb-6">{activeReset.instruction}</p>
              <div className="font-heading text-5xl text-foreground mb-6">
                {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
              </div>
              <div className="flex gap-3">
                <Button onClick={() => setTimerRunning(r => !r)} className="flex-1 font-heading tracking-wider uppercase" style={{ background: activeReset.color }}>
                  {timerRunning ? 'Pause' : 'Start'}
                </Button>
                <Button variant="outline" onClick={() => { setActiveReset(null); setTimerRunning(false); complete(activeReset.time); }}
                  className="flex-1 font-heading tracking-wider uppercase">
                  Done ✓
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Remind Button */}
        <div className="text-center">
          <button className="inline-flex items-center gap-2 text-xs font-heading tracking-wider uppercase text-muted-foreground hover:text-foreground border border-border rounded-xl px-5 py-3 transition-all hover:bg-secondary/30">
            <Bell className="w-4 h-4" /> Set Daily Reminder
          </button>
        </div>
      </div>
    </div>
  );
}