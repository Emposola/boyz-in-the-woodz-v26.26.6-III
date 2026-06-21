/* ============================================================
   BREATHING TOOL — /wellness/breathing-tool
   ============================================================ */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Maximize, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FG = '#2D5A27';
const SAND = '#D2B48C';

const PATTERNS = [
  { label: 'Box Breathing', id: 'box', phases: [{ name: 'Inhale', dur: 4 }, { name: 'Hold', dur: 4 }, { name: 'Exhale', dur: 4 }, { name: 'Hold', dur: 4 }], desc: '4-4-4-4 · Calm & focus' },
  { label: 'Calm', id: 'calm', phases: [{ name: 'Inhale', dur: 5 }, { name: 'Exhale', dur: 5 }], desc: '5-5 · Simple reset' },
  { label: '4-7-8 Sleep', id: '478', phases: [{ name: 'Inhale', dur: 4 }, { name: 'Hold', dur: 7 }, { name: 'Exhale', dur: 8 }], desc: '4-7-8 · Deep calm' },
  { label: 'Energize', id: 'energize', phases: [{ name: 'Inhale', dur: 2 }, { name: 'Exhale', dur: 2 }], desc: '2-2 · Quick boost' },
];

const DURATIONS = [{ label: '1 min', seconds: 60 }, { label: '3 min', seconds: 180 }, { label: '5 min', seconds: 300 }, { label: '10 min', seconds: 600 }];

const SOUNDS = ['None', 'Forest', 'Ocean', 'Campfire'];

const PHASE_COLORS = { Inhale: FG, Hold: SAND, Exhale: '#5C4033' };

export default function BreathingTool() {
  const [pattern, setPattern] = useState(PATTERNS[0]);
  const [duration, setDuration] = useState(DURATIONS[1]);
  const [sound, setSound] = useState('Forest');
  const [running, setRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [tick, setTick] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [sessions, setSessions] = useState(34);
  const [fullscreen, setFullscreen] = useState(false);
  const intervalRef = useRef(null);

  const phase = pattern.phases[phaseIdx];
  const phaseDur = phase.dur;
  const progress = tick / phaseDur;

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setTick(t => {
        if (t + 1 >= phaseDur) {
          setPhaseIdx(p => (p + 1) % pattern.phases.length);
          return 0;
        }
        return t + 1;
      });
      setElapsed(e => {
        if (e + 1 >= duration.seconds) { setRunning(false); setSessions(s => s + 1); return 0; }
        return e + 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running, phaseIdx, phaseDur, pattern.phases.length, duration.seconds]);

  const reset = () => { setRunning(false); setPhaseIdx(0); setTick(0); setElapsed(0); };

  const circleSize = fullscreen ? 280 : 200;
  const isInhale = phase.name === 'Inhale';
  const isHold = phase.name === 'Hold';
  const scale = running ? (isInhale ? 1.35 : isHold ? 1.35 : 0.85) : 1;
  const remaining = duration.seconds - elapsed;
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  const BG = fullscreen ? 'fixed inset-0 z-50 bg-background flex flex-col items-center justify-center' : 'min-h-screen bg-background';

  return (
    <div className={BG}>
      {!fullscreen && (
        <section className="relative py-12 overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(45,90,39,0.1) 0%, transparent 60%)' }}>
          <div className="max-w-3xl mx-auto px-4">
            <span className="text-xs font-heading tracking-[0.3em] uppercase block mb-2" style={{ color: SAND }}>Wellness</span>
            <h1 className="font-heading text-5xl tracking-wide uppercase text-foreground mb-2">Breathing Tool</h1>
            <p className="text-muted-foreground">Reset your nervous system. Right now. No equipment.</p>
          </div>
        </section>
      )}

      <div className={`${fullscreen ? 'w-full max-w-2xl px-8' : 'max-w-3xl mx-auto px-4 py-12'}`}>
        {/* Controls */}
        {!fullscreen && (
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            {/* Pattern */}
            <div>
              <p className="text-xs font-heading tracking-[0.2em] uppercase text-muted-foreground mb-2">Pattern</p>
              <div className="space-y-1.5">
                {PATTERNS.map(p => (
                  <button key={p.id} onClick={() => { setPattern(p); reset(); }}
                    className={`w-full text-left px-3 py-2 rounded-xl border text-sm transition-all ${pattern.id === p.id ? 'border-primary/60 bg-primary/10 text-foreground' : 'border-border text-muted-foreground hover:text-foreground hover:bg-secondary/30'}`}>
                    <span className="font-medium block">{p.label}</span>
                    <span className="text-[10px] text-muted-foreground">{p.desc}</span>
                  </button>
                ))}
              </div>
            </div>
            {/* Duration */}
            <div>
              <p className="text-xs font-heading tracking-[0.2em] uppercase text-muted-foreground mb-2">Duration</p>
              <div className="space-y-1.5">
                {DURATIONS.map(d => (
                  <button key={d.label} onClick={() => { setDuration(d); reset(); }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl border text-sm transition-all ${duration.label === d.label ? 'border-primary/60 bg-primary/10 text-foreground' : 'border-border text-muted-foreground hover:text-foreground hover:bg-secondary/30'}`}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
            {/* Sound */}
            <div>
              <p className="text-xs font-heading tracking-[0.2em] uppercase text-muted-foreground mb-2">Sound</p>
              <div className="space-y-1.5">
                {SOUNDS.map(s => (
                  <button key={s} onClick={() => setSound(s)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl border text-sm transition-all ${sound === s ? 'border-primary/60 bg-primary/10 text-foreground' : 'border-border text-muted-foreground hover:text-foreground hover:bg-secondary/30'}`}>
                    {s === 'None' ? '— No sound' : s === 'Forest' ? '🌲 Forest' : s === 'Ocean' ? '🌊 Ocean' : '🔥 Campfire'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Circle Visualizer */}
        <div className="flex flex-col items-center gap-8 mb-8">
          <div className="relative flex items-center justify-center" style={{ width: circleSize + 80, height: circleSize + 80 }}>
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full opacity-10 border-2 border-primary animate-pulse" />
            {/* Progress ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle cx="50%" cy="50%" r="45%" fill="none" stroke={`${FG}30`} strokeWidth="3" />
              <circle cx="50%" cy="50%" r="45%" fill="none" stroke={PHASE_COLORS[phase.name] || FG} strokeWidth="3"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress)}`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.5s' }}
              />
            </svg>
            {/* Animated circle */}
            <motion.div
              animate={{ scale }}
              transition={{ duration: phaseDur * 0.95, ease: isHold ? 'linear' : isInhale ? 'easeInOut' : 'easeInOut' }}
              className="rounded-full flex items-center justify-center"
              style={{ width: circleSize, height: circleSize, background: `radial-gradient(circle, ${PHASE_COLORS[phase.name] || FG}30 0%, ${PHASE_COLORS[phase.name] || FG}10 70%, transparent 100%)`, border: `2px solid ${PHASE_COLORS[phase.name] || FG}60` }}
            >
              <div className="text-center">
                <div className="font-heading text-4xl text-foreground">{running ? phaseDur - tick : phaseDur}</div>
                <div className="font-heading text-sm tracking-[0.3em] uppercase mt-1" style={{ color: PHASE_COLORS[phase.name] || FG }}>
                  {running ? phase.name : 'Ready'}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Timer */}
          {running && (
            <div className="text-center">
              <p className="text-xs text-muted-foreground font-heading tracking-wider uppercase">Time Remaining</p>
              <p className="font-heading text-2xl text-foreground">{mins}:{String(secs).padStart(2, '0')}</p>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={reset} className="rounded-full w-12 h-12"><RotateCcw className="w-5 h-5" /></Button>
            <Button size="icon" onClick={() => setRunning(r => !r)}
              className="rounded-full w-16 h-16 text-white" style={{ background: FG }}>
              {running ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
            </Button>
            <Button variant="outline" size="icon" onClick={() => setFullscreen(f => !f)} className="rounded-full w-12 h-12">
              <Maximize className="w-5 h-5" />
            </Button>
          </div>

          {fullscreen && (
            <button onClick={() => setFullscreen(false)} className="text-xs font-heading tracking-wider uppercase text-muted-foreground hover:text-foreground">
              Exit Fullscreen
            </button>
          )}
        </div>

        {!fullscreen && (
          <>
            {/* Session History */}
            <div className="bg-card border border-border rounded-xl p-5 text-center mb-4">
              <p className="font-heading text-3xl text-foreground" style={{ color: FG }}>{sessions}</p>
              <p className="text-xs text-muted-foreground font-heading tracking-wider uppercase">Breathing Sessions Completed</p>
            </div>

            <button className="w-full flex items-center justify-center gap-2 text-xs font-heading tracking-wider uppercase text-muted-foreground hover:text-foreground border border-border rounded-xl py-3 transition-all hover:bg-secondary/30">
              <Bell className="w-4 h-4" /> Set Daily Reminder
            </button>
          </>
        )}
      </div>
    </div>
  );
}