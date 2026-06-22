/* ============================================================
   THE PROBLEM — The crisis facing men today
   Data-driven page matching the brand deck's "Problem" section
   ============================================================ */
import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Brain, HeartPulse, Users, Skull, Eye, Shield, ExternalLink } from 'lucide-react';
import SEO from '@/components/shared/SEO';

const MENTAL_HEALTH_STATS = [
  { value: '77%', label: 'of men experience high stress daily', source: 'American Psychological Association, 2023', icon: Brain, barWidth: '77%' },
  { value: '40%', label: 'of men never discuss mental health', source: 'Movember Foundation, 2022', icon: HeartPulse, barWidth: '40%' },
  { value: '62%', label: 'of men feel emotionally isolated', source: 'Harvard Study of Adult Development, 2023', icon: Users, barWidth: '62%' },
  { value: '75%', label: 'suicide rate — men vs women (men higher)', source: 'WHO Global Health Observatory, 2023', icon: Skull, barWidth: '75%' },
];

const LONELINESS_STATS = [
  { value: '55%', label: 'of men have fewer than 2 close friends', source: 'Survey Centre on American Social Life, 2021', barWidth: '55%' },
  { value: '61%', label: 'of men feel lonely at least weekly', source: 'Cigna Loneliness Index, 2023', barWidth: '61%' },
  { value: '70%', label: 'of men lost friends since age 30', source: 'American Perspectives Survey, 2022', barWidth: '70%' },
];

const SCREEN_STATS = [
  { value: '80%', label: 'check phone within 5 minutes of waking', source: 'IDC Research / Facebook, 2022', barWidth: '80%' },
  { value: '58%', label: 'say work dominates their identity', source: 'Pew Research Center, 2022', barWidth: '58%' },
  { value: '54%', label: 'of fathers spend less than 1hr daily with kids', source: 'American Time Use Survey, 2023', barWidth: '54%' },
];

const ICEBERG_VISIBLE = [
  '"Busy. Focused. Grinding."',
  'Working late',
  'Always available',
  'Looks in control',
];

const ICEBERG_HIDDEN = [
  "Hasn't slept properly in weeks",
  "Can't remember last real conversation",
  'Feels disconnected from everyone',
  'Tired. Isolated. Overloaded.',
];

function StatBar({ stat, icon: Icon, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="bg-card border border-border rounded-xl p-5"
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-destructive" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-heading text-3xl text-foreground">{stat.value}</span>
          </div>
          <p className="text-sm text-foreground/80 mb-2">{stat.label}</p>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: stat.barWidth }}
              viewport={{ once: true }}
              transition={{ delay: delay + 0.3, duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, hsl(0, 62%, 50%), hsl(28, 70%, 50%))' }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
            <ExternalLink className="w-2.5 h-2.5" /> {stat.source}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function TheProblem() {
  return (
    <div className="min-h-screen">
      <SEO
        title="The Problem — Crisis Facing Men Today"
        description="77% of men experience high daily stress. 40% never discuss mental health. 62% feel emotionally isolated. The data is clear — men need a reset. Here's why Boyz In The Woodz exists."
        canonical="/the-problem"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'The Problem — Crisis Facing Men Today',
          description: 'Statistics on male mental health, loneliness, and the screen epidemic driving the need for brotherhood and nature-based resets.',
          publisher: { '@type': 'Organization', name: 'BOYZ IN THE WOODZ' },
        }}
      />

      {/* Hero */}
      <section className="relative py-20 md:py-32 bg-destructive/5">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <AlertTriangle className="w-10 h-10 text-destructive mx-auto mb-4" />
            <span className="text-xs font-heading tracking-[0.3em] text-destructive uppercase">The Data Is Clear</span>
            <h1 className="font-heading text-5xl md:text-7xl tracking-wide uppercase mt-3">
              What's Happening<br />To Men Right Now
            </h1>
            <p className="text-muted-foreground text-base md:text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
              This isn't opinion. This is research. The crisis is measurable, documented, and growing.
              And it's exactly why BOYZ IN THE WOODZ exists.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Iceberg */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">The Iceberg</span>
            <h2 className="font-heading text-3xl md:text-5xl tracking-wide uppercase mt-2">What's Really Going On</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* What People See */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <Eye className="w-5 h-5 text-primary" />
                <h3 className="font-heading text-lg tracking-wider uppercase text-primary">What People See</h3>
              </div>
              <ul className="space-y-4">
                {ICEBERG_VISIBLE.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground/80">
                    <div className="w-2 h-2 rounded-full bg-primary/60 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* What's Underneath */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <h3 className="font-heading text-lg tracking-wider uppercase text-destructive">What's Underneath</h3>
              </div>
              <ul className="space-y-4">
                {ICEBERG_HIDDEN.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground/80">
                    <div className="w-2 h-2 rounded-full bg-destructive/60 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-center text-muted-foreground text-sm mt-8 max-w-xl mx-auto">
            Men aren't weak. They're just never given time to reset.
          </motion.p>
        </div>
      </section>

      {/* Mental Health Crisis */}
      <section className="py-16 md:py-24 bg-secondary/20">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="text-xs font-heading tracking-[0.3em] text-destructive uppercase">Section 01</span>
            <h2 className="font-heading text-3xl md:text-5xl tracking-wide uppercase mt-2">Mental Health Crisis Among Men</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-4">
            {MENTAL_HEALTH_STATS.map((stat, i) => (
              <StatBar key={stat.label} stat={stat} icon={stat.icon} delay={i * 0.1} />
            ))}
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="mt-8 bg-card border border-border rounded-xl p-6 text-center">
            <p className="font-heading text-xl tracking-wider uppercase text-foreground">
              77% of men report high daily stress
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              3 in 4 men have no close confidant outside family. 40% never talk about their mental health.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Loneliness Epidemic */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="text-xs font-heading tracking-[0.3em] text-accent uppercase">Section 02</span>
            <h2 className="font-heading text-3xl md:text-5xl tracking-wide uppercase mt-2">The Loneliness Epidemic</h2>
            <p className="text-muted-foreground text-sm mt-4 max-w-2xl mx-auto">
              The Harvard Study of Adult Development — the longest-running study of adult life — found that men who lack close friendships are significantly more likely to experience physical illness, cognitive decline, and early death. Not metaphorically. Literally.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-4">
            {LONELINESS_STATS.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-xl p-5 text-center">
                <div className="font-heading text-4xl text-accent">{stat.value}</div>
                <p className="text-sm text-foreground/80 mt-2">{stat.label}</p>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mt-4">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: stat.barWidth }}
                    viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                    className="h-full rounded-full bg-accent" />
                </div>
                <p className="text-[10px] text-muted-foreground mt-3 flex items-center justify-center gap-1">
                  <ExternalLink className="w-2.5 h-2.5" /> {stat.source}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Screen & Hustle */}
      <section className="py-16 md:py-24 bg-secondary/20">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">Section 03</span>
            <h2 className="font-heading text-3xl md:text-5xl tracking-wide uppercase mt-2">The Screen & Hustle Problem</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-4">
            {SCREEN_STATS.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-xl p-5 text-center">
                <div className="font-heading text-4xl text-primary">{stat.value}</div>
                <p className="text-sm text-foreground/80 mt-2">{stat.label}</p>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mt-4">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: stat.barWidth }}
                    viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                    className="h-full rounded-full bg-primary" />
                </div>
                <p className="text-[10px] text-muted-foreground mt-3 flex items-center justify-center gap-1">
                  <ExternalLink className="w-2.5 h-2.5" /> {stat.source}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Shield className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="font-heading text-4xl md:text-6xl tracking-wide uppercase mb-4">
              That Is Exactly What<br /><span className="text-primary">BOYZ IN THE WOODZ</span><br />Will Provide
            </h2>
            <p className="text-muted-foreground text-base mb-8 max-w-xl mx-auto">
              The clothing will be the connection to the solutions that modern men need right now:
              Brotherhood, Freedom, and Nature.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/how-it-works" className="inline-flex items-center justify-center px-8 py-3 rounded-xl font-heading tracking-wider uppercase text-sm text-primary-foreground bg-primary hover:bg-primary/90 transition-colors">
                See How It Works
              </a>
              <a href="/retreat/apply" className="inline-flex items-center justify-center px-8 py-3 rounded-xl font-heading tracking-wider uppercase text-sm text-foreground border border-border hover:bg-secondary transition-colors">
                Apply for Retreat
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
