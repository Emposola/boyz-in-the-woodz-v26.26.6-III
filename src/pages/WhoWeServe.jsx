/* ============================================================
   WHO WE SERVE — The 4 men we serve
   Each persona maps to a feeling, a stat, and a solution
   ============================================================ */
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Baby, Cloud, TreePine, ArrowRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '@/components/shared/SEO';

const PERSONAS = [
  {
    icon: Zap,
    title: 'The Hustler',
    tagline: 'Always working. Never stopping.',
    needs: 'Silence. Reset.',
    stat: '58%',
    statLabel: 'of men say work defines their identity',
    source: 'Pew Research Center, 2022',
    description: 'He runs on adrenaline and caffeine. His phone is an extension of his hand. He hasn\'t taken a real day off in months. His identity is his output — and he\'s running on empty.',
    solution: 'Gets time to breathe, reset, and connect with fellow brothers at a place where his status does not matter.',
    color: 'text-primary',
    bg: 'bg-primary/10',
    borderColor: 'border-primary/30',
    experience: '/retreat/weekend-reset',
    experienceLabel: 'Weekend Reset',
  },
  {
    icon: Baby,
    title: 'The Father',
    tagline: 'Wants to be present. Life moves too fast.',
    needs: 'Time. Clarity.',
    stat: '54%',
    statLabel: 'of fathers spend less than 1hr daily with their kids',
    source: 'American Time Use Survey, 2023',
    description: 'He wants to teach his son to fish, to build a fire, to be a man — but he\'s too tired after work. He wants to be present but life keeps pulling him away.',
    solution: 'Spends quality time with his son(s), teaches them fishing, building a fire, hunting — and makes lifelong friends during retreats.',
    color: 'text-accent',
    bg: 'bg-accent/10',
    borderColor: 'border-accent/30',
    experience: '/retreat/deep-dive',
    experienceLabel: 'Deep Dive Retreat',
  },
  {
    icon: Cloud,
    title: 'The Lost One',
    tagline: 'Feels off. Can\'t explain why.',
    needs: 'Space to feel.',
    stat: '1 in 3',
    statLabel: 'men show signs of depression with no diagnosis',
    source: 'NIMH, 2023',
    description: 'Something\'s wrong but he can\'t name it. He\'s not depressed enough to call a hotline but not okay enough to keep going. He needs something he can\'t Google.',
    solution: 'Gets to meet people and do things that actually help his mental health. Takes time to live slowly and embrace the moment.',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    borderColor: 'border-blue-400/30',
    experience: '/retreat/expedition',
    experienceLabel: 'Expedition',
  },
  {
    icon: TreePine,
    title: 'The Nostalgic',
    tagline: 'Misses who he was before.',
    needs: 'A way back.',
    stat: '70%',
    statLabel: 'of men lost their best friend after age 30',
    source: 'American Perspectives Survey, 2022',
    description: 'He remembers when life was simple. When he and his boys would just... hang out. No agendas. No networking. Just presence. He wants that feeling back.',
    solution: 'Gets to feel like he has gone back in time to when he was wild and free — a great place to reconnect with old friends or make new ones.',
    color: 'text-amber-600',
    bg: 'bg-amber-600/10',
    borderColor: 'border-amber-600/30',
    experience: '/retreat/apply',
    experienceLabel: 'Apply Now',
  },
];

export default function WhoWeServe() {
  return (
    <div className="min-h-screen">
      <SEO
        title="Who We Serve — The Men We Exist For"
        description="Every man who has ever said 'I'm fine' when he wasn't — he's our man. Meet The Hustler, The Father, The Lost One, and The Nostalgic."
        canonical="/who-we-serve"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Who We Serve',
          description: 'Boyz In The Woodz serves men who need space to breathe — The Hustler, The Father, The Lost One, and The Nostalgic.',
          publisher: { '@type': 'Organization', name: 'BOYZ IN THE WOODZ' },
        }}
      />

      {/* Hero */}
      <section className="relative py-20 md:py-32 bg-secondary/20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">Section 04</span>
            <h1 className="font-heading text-5xl md:text-7xl tracking-wide uppercase mt-3">
              Who We Serve
            </h1>
            <p className="text-muted-foreground text-base md:text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
              We don't serve a demographic. We serve a feeling.
            </p>
            <p className="text-foreground font-accent text-xl md:text-2xl italic mt-4 max-w-xl mx-auto">
              "Every man who has ever said 'I'm fine' when he wasn't — he's our man."
            </p>
          </motion.div>
        </div>
      </section>

      {/* Personas */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 space-y-12 md:space-y-20">
          {PERSONAS.map((persona, i) => (
            <motion.div
              key={persona.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center`}
            >
              {/* Info Card */}
              <div className={`${i % 2 !== 0 ? 'md:order-2' : ''}`}>
                <div className={`inline-flex items-center gap-2 ${persona.bg} rounded-full px-4 py-1.5 mb-4`}>
                  <persona.icon className={`w-4 h-4 ${persona.color}`} />
                  <span className={`text-xs font-heading tracking-wider uppercase ${persona.color}`}>{persona.title}</span>
                </div>
                <h2 className="font-heading text-3xl md:text-4xl tracking-wide uppercase mb-2">{persona.tagline}</h2>
                <p className="text-muted-foreground text-sm mb-4">Needs: <span className="text-foreground font-medium">{persona.needs}</span></p>
                <p className="text-foreground/70 leading-relaxed mb-6">{persona.description}</p>

                {/* Stat */}
                <div className={`${persona.bg} border ${persona.borderColor} rounded-xl p-4 mb-6`}>
                  <div className="flex items-baseline gap-2">
                    <span className={`font-heading text-3xl ${persona.color}`}>{persona.stat}</span>
                    <span className="text-sm text-foreground/70">{persona.statLabel}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{persona.source}</p>
                </div>

                {/* Solution */}
                <div className="bg-card border border-border rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="text-xs font-heading tracking-wider uppercase text-primary">What He Gets</span>
                  </div>
                  <p className="text-sm text-foreground/70">{persona.solution}</p>
                </div>

                <Link to={persona.experience}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-heading tracking-wider uppercase text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  {persona.experienceLabel} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Visual Placeholder */}
              <div className={`${i % 2 !== 0 ? 'md:order-1' : ''}`}>
                <div className={`aspect-[4/3] rounded-2xl ${persona.bg} border ${persona.borderColor} flex items-center justify-center`}>
                  <div className="text-center">
                    <persona.icon className={`w-16 h-16 ${persona.color} mx-auto mb-4 opacity-40`} />
                    <p className={`font-heading text-4xl ${persona.color}`}>{persona.stat}</p>
                    <p className="text-xs text-muted-foreground mt-1">{persona.statLabel}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Closing */}
      <section className="py-20 md:py-28 bg-primary/5">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-4xl md:text-5xl tracking-wide uppercase mb-4">
              Men Don't Need Saving.<br />They Need <span className="text-primary">Space</span>.
            </h2>
            <p className="text-muted-foreground text-base mb-8 max-w-xl mx-auto">
              Whether you're the hustler, the father, the lost one, or the nostalgic — there's a seat at the fire for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/retreat/apply"
                className="inline-flex items-center justify-center px-8 py-3 rounded-xl font-heading tracking-wider uppercase text-sm text-primary-foreground bg-primary hover:bg-primary/90 transition-colors">
                Apply for Retreat <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
              <Link to="/the-problem"
                className="inline-flex items-center justify-center px-8 py-3 rounded-xl font-heading tracking-wider uppercase text-sm text-foreground border border-border hover:bg-secondary transition-colors">
                See The Data
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
