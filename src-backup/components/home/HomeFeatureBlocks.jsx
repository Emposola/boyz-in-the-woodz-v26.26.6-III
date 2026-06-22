/* ============================================================
   HOME FEATURE BLOCKS — 3 new high-conviction features:
   Case Studies, Brotherhood Studio, and Accountability Pods
   ============================================================ */
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Radio, Users, Play, Quote, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FEATURES = [
  {
    icon: BookOpen,
    tag: '15 Real Stories',
    title: 'Case Studies That Prove This Works',
    body: '94% of men who go through BITW report a significant life change within 90 days. These aren\'t marketing claims — they\'re documented outcomes with names, numbers, and before/afters that will make you uncomfortable sitting still.',
    cta: 'Read the Stories',
    to: '/case-studies',
    img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=900&q=85',
    quote: '"I flew into Broken Bow a hollow man. I drove home crying — and that was the best thing that happened to me in 15 years."',
    quoteAuthor: 'Marcus T., Houston',
    accent: 'text-primary',
    border: 'border-primary/30',
    bg: 'bg-primary/5',
    flip: false,
  },
  {
    icon: Radio,
    tag: 'Live Now',
    title: 'Brotherhood Studio — Watch What Happens in The Woodz',
    body: 'Real conversations. No scripts. Watch live retreat circles, behind-the-chair cuts with Dre, campfire sessions, and Q&As with Brotherhood leadership. We\'re live multiple times a week — and it\'s free to watch.',
    cta: 'Enter the Studio',
    to: '/studio',
    img: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=900&q=85',
    quote: '"The campfire session I watched online convinced me to apply for the retreat. Watching real men be real changed everything."',
    quoteAuthor: 'Devon R., Dallas',
    accent: 'text-red-400',
    border: 'border-red-800/40',
    bg: 'bg-red-900/10',
    flip: true,
  },
  {
    icon: Users,
    tag: 'Accountability Pods',
    title: 'The 5-Man Pod: Daily Accountability That Actually Works',
    body: 'Not a group chat. Not a weekly check-in. A 5-man accountability pod — curated brothers who check in daily, show up monthly, and call each other out when they\'re sliding. The fastest-growing feature in the Brotherhood.',
    cta: 'Join the Brotherhood',
    to: '/retreat/apply',
    img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&q=85',
    quote: '"My pod kept me sober for 8 months when nothing else had. I didn\'t need a program. I needed 4 men who\'d notice."',
    quoteAuthor: 'Tyrell W., Atlanta',
    accent: 'text-accent',
    border: 'border-accent/30',
    bg: 'bg-accent/5',
    flip: false,
  },
];

export default function HomeFeatureBlocks() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Flame className="w-4 h-4 text-primary" />
            <span className="text-xs font-heading tracking-[0.4em] text-primary uppercase">What's New</span>
          </div>
          <h2 className="font-heading text-4xl md:text-6xl tracking-wide uppercase">Three Reasons<br /><span className="text-primary">To Stop Waiting</span></h2>
        </motion.div>

        <div className="space-y-20">
          {FEATURES.map((feat, i) => (
            <motion.div key={feat.title}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className={`grid lg:grid-cols-2 gap-10 items-center ${feat.flip ? 'lg:grid-flow-dense' : ''}`}>
              {/* Text side */}
              <div className={feat.flip ? 'lg:col-start-2' : ''}>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${feat.border} ${feat.bg} mb-5`}>
                  <feat.icon className={`w-3.5 h-3.5 ${feat.accent}`} />
                  <span className={`text-[10px] font-heading tracking-widest uppercase ${feat.accent}`}>{feat.tag}</span>
                </div>
                <h3 className="font-heading text-3xl md:text-4xl tracking-wide uppercase leading-tight mb-5">{feat.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-6 text-[15px]">{feat.body}</p>
                <div className={`border-l-2 ${feat.border} pl-4 mb-8`}>
                  <Quote className={`w-4 h-4 ${feat.accent} mb-1.5`} />
                  <p className="font-accent italic text-sm text-foreground leading-relaxed">{feat.quote}</p>
                  <p className="text-xs text-muted-foreground mt-1.5">{feat.quoteAuthor}</p>
                </div>
                <Button asChild className="font-heading tracking-wider uppercase gap-2">
                  <Link to={feat.to}>{feat.cta} <ArrowRight className="w-4 h-4" /></Link>
                </Button>
              </div>
              {/* Image side */}
              <div className={`relative ${feat.flip ? 'lg:col-start-1' : ''}`}>
                <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden group">
                  <img src={feat.img} alt={feat.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {feat.tag === 'Live Now' && (
                    <div className="absolute top-4 left-4 flex items-center gap-1.5">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                      </span>
                      <span className="text-[10px] font-heading tracking-widest uppercase text-red-400">Studio Live</span>
                    </div>
                  )}
                  {feat.tag === 'Live Now' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary/80 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-7 h-7 text-primary-foreground ml-0.5" />
                      </div>
                    </div>
                  )}
                </div>
                {/* Decorative badge */}
                <div className={`absolute -bottom-4 ${feat.flip ? '-right-4' : '-left-4'} hidden md:block bg-card border ${feat.border} rounded-xl px-4 py-3 shadow-xl`}>
                  <p className={`font-heading text-xl ${feat.accent}`}>{i === 0 ? '94%' : i === 1 ? '800+' : '5-man'}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-heading">{i === 0 ? 'Report Life Change' : i === 1 ? 'Live Viewers' : 'Pod System'}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}