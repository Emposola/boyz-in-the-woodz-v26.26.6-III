/* ============================================================
   BROTHERHOOD ARCHETYPES — Four profiles: Hustler, Father, Lost, Nostalgic
   Describes feelings, not demographics. "This is you if…"
   ============================================================ */
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Baby, Compass, Clock } from 'lucide-react';

const ARCHETYPES = [
  {
    icon: Zap,
    title: 'The Hustler',
    color: 'hsl(82, 60%, 45%)',
    tagline: 'You never stop. And that\'s the problem.',
    description: 'You built something. Maybe a business, maybe a career that looks incredible on paper. But you can\'t remember the last time you sat still without guilt. Your phone is an extension of your hand. You need the woods to remind you that silence isn\'t weakness.',
    thisIsYouIf: [
      'Your calendar is always full but your tank is always empty',
      'You feel guilty relaxing',
      'The word "retreat" sounds like "quitting" to you',
    ],
  },
  {
    icon: Baby,
    title: 'The Father',
    color: 'hsl(28, 70%, 50%)',
    tagline: 'Everyone comes first. Except you.',
    description: 'You pour into your kids, your partner, your team. You haven\'t had a conversation about yourself — not about "Dad stuff" — in months. The woods aren\'t about escaping your family. They\'re about returning as a fuller version of yourself.',
    thisIsYouIf: [
      'Your identity has merged with "Dad" or "Provider"',
      'You can\'t remember your last hobby',
      'You\'re great at caring for others, terrible at caring for yourself',
    ],
  },
  {
    icon: Compass,
    title: 'The Lost',
    color: 'hsl(200, 50%, 50%)',
    tagline: 'You\'re not broken. You\'re just not found yet.',
    description: 'Something shifted — a breakup, a job loss, a move, a death. You\'re not in crisis, but you\'re not okay either. You\'re in that gray zone where every day works but nothing feels right. The brotherhood doesn\'t fix you. It holds space while you find your footing.',
    thisIsYouIf: [
      'You\'re going through the motions but something feels off',
      'You moved to a new city and your crew is thin',
      'You want to talk to someone but don\'t know who',
    ],
  },
  {
    icon: Clock,
    title: 'The Nostalgic',
    color: 'hsl(280, 40%, 55%)',
    tagline: 'You remember when life was simpler.',
    description: 'Campfires as a kid. Roughhousing with friends. Dirt under your nails without it being a problem. Somewhere along the way, adulting replaced adventure. You don\'t need to go backward — you need to bring that energy forward.',
    thisIsYouIf: [
      'You miss camping, fishing, or just being outside',
      'You scroll outdoor content but never go',
      'You want your kids to have what you had — but updated',
    ],
  },
];

export default function Archetypes() {
  return (
    <div className="min-h-screen">
      {/* --- Hero --- */}
      <section className="py-20 md:py-28 bg-secondary/30 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto px-4">
          <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">Find Your Type</span>
          <h1 className="font-heading text-4xl md:text-6xl tracking-wide uppercase mt-2">
            Brotherhood Archetypes
          </h1>
          <p className="text-muted-foreground text-sm md:text-base mt-4">
            We don't care about your job title, income, or Instagram following. 
            We care about where you are emotionally. Which one resonates?
          </p>
        </motion.div>
      </section>

      {/* --- Archetype Cards --- */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-20 grid md:grid-cols-2 gap-6">
        {ARCHETYPES.map((arch, i) => (
          <motion.div
            key={arch.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-card border border-border rounded-lg p-8 hover:border-primary/30 transition-colors"
          >
            {/* Icon + Title */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: `${arch.color}20` }}>
                <arch.icon className="w-5 h-5" style={{ color: arch.color }} />
              </div>
              <div>
                <h3 className="font-heading text-xl tracking-wider uppercase">{arch.title}</h3>
                <p className="text-xs italic text-muted-foreground">{arch.tagline}</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {arch.description}
            </p>

            {/* "This is you if…" */}
            <div className="border-t border-border pt-4">
              <h4 className="text-xs font-heading tracking-wider uppercase text-primary mb-2">This is you if…</h4>
              <ul className="space-y-1.5">
                {arch.thisIsYouIf.map((item, j) => (
                  <li key={j} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: arch.color }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </section>
    </div>
  );
}