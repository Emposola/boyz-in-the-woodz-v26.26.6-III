/* ============================================================
   BROTHERHOOD LETTERS — /brotherhood/letters
   ============================================================ */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenLine, Star, ArrowRight, X, Share2, ChevronRight, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const FG = '#2D5A27';
const SAND = '#D2B48C';

const CATEGORIES = ['All', 'Gratitude', 'Struggle', 'Breakthrough', 'Tribute', 'Goodbye'];
const CAT_COLORS = { Gratitude: '#2D5A27', Struggle: '#5C4033', Breakthrough: '#8B6914', Tribute: '#36454F', Goodbye: '#6B5B4B' };

const LETTERS = [
  { id: 1, title: 'To the Man I Was Before the Fire', author: 'Marcus', city: 'Houston', category: 'Goodbye', date: 'May 2026', excerpt: 'I don\'t miss you. I know that sounds harsh. But the version of me who needed to perform every single day — who woke up already exhausted from the weight of everyone else\'s expectations...', body: 'I don\'t miss you. I know that sounds harsh. But the version of me who needed to perform every single day — who woke up already exhausted from the weight of everyone else\'s expectations — that man needed to die in those woods.\n\nI watched him go on night three. I was sitting by the fire. The guides had gone quiet. The other brothers were in their tents. And something just... let go.\n\nI don\'t have a better word for it. Let go.\n\nYou were so tired. You were so scared of what people would think if they saw the tired. So you kept running. I\'m writing this to say: you can stop. We stopped. And the world didn\'t end.\n\nThe woods did what no one else could.\n\nGoodbye, old friend.', featured: true, likes: 892 },
  { id: 2, title: 'Dear Dad, I Finally Get It', author: 'David', city: 'Atlanta', category: 'Tribute', date: 'Apr 2026', excerpt: 'You used to disappear every fall. Three days. No phone. No explanation. I was twelve and I thought you were hiding from us.', body: '', likes: 634 },
  { id: 3, title: 'The Morning After the Breakdown', author: 'James', city: 'Chicago', category: 'Breakthrough', date: 'Mar 2026', excerpt: 'I cried in front of eight strangers. Full-body, ugly, can\'t-breathe crying. And not one of them looked away.', body: '', likes: 547 },
  { id: 4, title: 'I\'m Still Here', author: 'Anonymous', city: 'Detroit', category: 'Struggle', date: 'Mar 2026', excerpt: 'There was a night, not long ago, when I wasn\'t sure I would be. I\'m writing this from the other side.', body: '', likes: 1204 },
  { id: 5, title: 'Thank You for the Silence', author: 'Robert', city: 'Dallas', category: 'Gratitude', date: 'Feb 2026', excerpt: 'Nobody talks about how healing it is to just be quiet together. No agenda. No advice. Just present.', body: '', likes: 423 },
  { id: 6, title: 'To My Sons, From the Woods', author: 'Kevin', city: 'Memphis', category: 'Tribute', date: 'Feb 2026', excerpt: 'I am writing this on the last night. The fire is low. Your grandfather\'s pocket knife is in my hand.', body: '', likes: 389 },
];

export default function BrotherhoodLetters() {
  const [catFilter, setCatFilter] = useState('All');
  const [openLetter, setOpenLetter] = useState(null);
  const [showWrite, setShowWrite] = useState(false);
  const [writeForm, setWriteForm] = useState({ title: '', category: '', body: '', anonymous: false });
  const [submitted, setSubmitted] = useState(false);
  const [liked, setLiked] = useState([]);

  const filtered = catFilter === 'All' ? LETTERS : LETTERS.filter(l => l.category === catFilter);
  const featured = LETTERS.find(l => l.featured);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative min-h-[45vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=1600&q=85" alt="Campfire" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-black/30" />
        </div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative max-w-5xl mx-auto px-4 pb-12 w-full">
          <div className="flex items-center gap-2 mb-3"><div className="w-8 h-px" style={{ background: SAND }} /><span className="text-xs font-heading tracking-[0.3em] uppercase" style={{ color: SAND }}>Open Brotherhood</span></div>
          <h1 className="font-heading text-5xl md:text-7xl tracking-wide uppercase text-white leading-none">Letters from<br /><span className="text-primary">the Woods</span></h1>
          <p className="text-white/60 mt-3">Raw. Honest. Unsent.</p>
        </motion.div>
      </section>

      {/* Letter of the Month */}
      <div className="border-y border-border/50 py-2 bg-yellow-900/10">
        <div className="max-w-5xl mx-auto px-4 flex items-center gap-3">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
          <span className="text-xs font-heading tracking-[0.2em] uppercase text-yellow-400">Letter of the Month</span>
          <span className="text-xs text-muted-foreground truncate">"{featured?.title}" by {featured?.author} from {featured?.city}</span>
          <button onClick={() => setOpenLetter(featured)} className="text-xs font-heading tracking-wider uppercase text-yellow-400 hover:text-yellow-300 ml-auto flex-shrink-0 flex items-center gap-1">
            Read <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Write + Filter row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCatFilter(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-heading tracking-wider uppercase transition-all ${catFilter === c ? 'text-white' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
                style={catFilter === c ? { background: CAT_COLORS[c] || FG } : {}}>
                {c}
              </button>
            ))}
          </div>
          <Button onClick={() => setShowWrite(true)} className="font-heading tracking-wider uppercase flex-shrink-0" style={{ background: FG }}>
            <PenLine className="w-4 h-4 mr-2" /> Write a Letter
          </Button>
        </div>

        {/* Letter Grid */}
        <div className="space-y-4 mb-10">
          {filtered.map((letter, i) => (
            <motion.div key={letter.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
              className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all group cursor-pointer"
              onClick={() => setOpenLetter(letter)}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {letter.featured && <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 flex-shrink-0" />}
                    <span className="text-[10px] font-heading tracking-wider uppercase px-2 py-0.5 rounded-full text-white" style={{ background: CAT_COLORS[letter.category] || FG }}>{letter.category}</span>
                    <span className="text-xs text-muted-foreground">{letter.author} · {letter.city} · {letter.date}</span>
                  </div>
                  <h3 className="font-heading text-base tracking-wider uppercase group-hover:text-primary transition-colors">{letter.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{letter.excerpt}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-xs text-muted-foreground">♥ {letter.likes + (liked.includes(letter.id) ? 1 : 0)}</div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Letter Detail Modal */}
      <AnimatePresence>
        {openLetter && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 overflow-y-auto p-4 pt-8"
            onClick={() => setOpenLetter(null)}>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
              onClick={e => e.stopPropagation()}
              className="bg-card border border-border rounded-2xl p-8 max-w-2xl w-full shadow-2xl my-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className="text-[10px] font-heading tracking-wider uppercase px-2.5 py-1 rounded-full text-white mb-3 inline-block" style={{ background: CAT_COLORS[openLetter.category] || FG }}>{openLetter.category}</span>
                  <h2 className="font-heading text-2xl tracking-wider uppercase mt-2">{openLetter.title}</h2>
                  <p className="text-xs text-muted-foreground mt-1">{openLetter.author} · {openLetter.city} · {openLetter.date}</p>
                </div>
                <button onClick={() => setOpenLetter(null)} className="text-muted-foreground hover:text-foreground p-1"><X className="w-5 h-5" /></button>
              </div>
              <div className="prose prose-sm prose-invert max-w-none">
                {(openLetter.body || openLetter.excerpt).split('\n\n').map((p, i) => (
                  <p key={i} className="text-foreground/80 leading-relaxed mb-4 font-accent text-base">{p}</p>
                ))}
              </div>
              <div className="flex items-center gap-4 pt-6 border-t border-border mt-6">
                <button onClick={() => setLiked(l => l.includes(openLetter.id) ? l.filter(x => x !== openLetter.id) : [...l, openLetter.id])}
                  className={`flex items-center gap-2 text-sm transition-colors ${liked.includes(openLetter.id) ? 'text-red-400' : 'text-muted-foreground hover:text-red-400'}`}>
                  ♥ {openLetter.likes + (liked.includes(openLetter.id) ? 1 : 0)}
                </button>
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Write Modal */}
      <AnimatePresence>
        {showWrite && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 overflow-y-auto"
            onClick={() => setShowWrite(false)}>
            <motion.div initial={{ scale: 0.96 }} animate={{ scale: 1 }} exit={{ scale: 0.96 }}
              onClick={e => e.stopPropagation()}
              className="bg-card border border-border rounded-2xl p-8 max-w-2xl w-full my-8">
              {submitted ? (
                <div className="text-center py-8">
                  <Flame className="w-12 h-12 mx-auto mb-4" style={{ color: FG }} />
                  <h3 className="font-heading text-2xl uppercase mb-2">Letter Submitted</h3>
                  <p className="text-muted-foreground">Admin will review and publish within 48 hours.</p>
                  <p className="text-sm mt-2" style={{ color: FG }}>+500 points pending approval</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-heading text-2xl tracking-wider uppercase">Write a Letter</h3>
                    <button onClick={() => setShowWrite(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
                  </div>
                  <div className="space-y-4">
                    <Input placeholder="Letter title" value={writeForm.title} onChange={e => setWriteForm(f => ({ ...f, title: e.target.value }))} className="bg-secondary border-border h-12 text-base" />
                    <select value={writeForm.category} onChange={e => setWriteForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none">
                      <option value="">Category...</option>
                      {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                    </select>
                    <textarea value={writeForm.body} onChange={e => setWriteForm(f => ({ ...f, body: e.target.value }))}
                      rows={10} placeholder="Write your letter here. Be honest. No performance needed."
                      className="w-full bg-secondary border border-border rounded-md px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none resize-none leading-relaxed" />
                    <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                      <input type="checkbox" checked={writeForm.anonymous} onChange={e => setWriteForm(f => ({ ...f, anonymous: e.target.checked }))} className="accent-green-700 w-4 h-4" />
                      Publish anonymously
                    </label>
                    <Button onClick={() => setSubmitted(true)} className="w-full font-heading tracking-wider uppercase" style={{ background: FG }}>
                      Submit Letter
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}