/* ============================================================
   IMPACT STORIES — /brotherhood/impact-stories
   ============================================================ */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Filter, Share2, Heart, PenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEO from '@/components/shared/SEO';

const FG = '#2D5A27';
const SAND = '#D2B48C';

const ARCHETYPES = ['All', 'Hustler', 'Father', 'Lost', 'Nostalgic'];

const STORIES = [
  { id: 1, name: 'Marcus', age: 34, city: 'Houston, TX', archetype: 'Hustler', quote: 'I came back lighter. My wife noticed before I did. That\'s when I knew it worked.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', featured: true, likes: 247 },
  { id: 2, name: 'David', age: 41, city: 'Atlanta, GA', archetype: 'Father', quote: 'My son asked me why I was smiling. I didn\'t have words for it. Just: the woods.', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', featured: false, likes: 183 },
  { id: 3, name: 'James', age: 28, city: 'Chicago, IL', archetype: 'Lost', quote: 'I showed up not knowing what I needed. I left knowing exactly who I was.', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80', featured: false, likes: 156 },
  { id: 4, name: 'Robert', age: 52, city: 'Dallas, TX', archetype: 'Nostalgic', quote: 'Reminded me who I was before the world told me who I should be.', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80', featured: false, likes: 134 },
  { id: 5, name: 'Andre', age: 37, city: 'Memphis, TN', archetype: 'Hustler', quote: 'Three retreats. Three different versions of me came home. All better.', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80', featured: false, likes: 128 },
  { id: 6, name: 'Kevin', age: 45, city: 'Nashville, TN', archetype: 'Father', quote: 'I learned more about being a dad in the woods than in 15 years of trying.', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', featured: false, likes: 119 },
  { id: 7, name: 'Troy', age: 31, city: 'Detroit, MI', archetype: 'Lost', quote: 'I was ready to quit everything. The fire ceremony changed my mind.', img: 'https://images.unsplash.com/photo-1553267751-1c148a7280a1?w=400&q=80', featured: false, likes: 201 },
  { id: 8, name: 'Rico', age: 29, city: 'Miami, FL', archetype: 'Hustler', quote: 'First time in 3 years I slept without my phone. Slept 10 hours straight.', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80', featured: false, likes: 97 },
  { id: 9, name: 'Damon', age: 48, city: 'Charlotte, NC', archetype: 'Nostalgic', quote: 'My grandfather would have loved this. I felt him there with me.', img: 'https://images.unsplash.com/photo-1542178243-bc20204b769f?w=400&q=80', featured: false, likes: 145 },
  { id: 10, name: 'Chris', age: 33, city: 'Phoenix, AZ', archetype: 'Father', quote: 'I cried on day 2. Real tears. In front of strangers who became brothers.', img: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&q=80', featured: false, likes: 88 },
  { id: 11, name: 'Leon', age: 39, city: 'Seattle, WA', archetype: 'Lost', quote: 'The silence on the solo hike was the loudest thing I\'ve ever heard.', img: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&q=80', featured: false, likes: 112 },
  { id: 12, name: 'Marcus Jr.', age: 26, city: 'New Orleans, LA', archetype: 'Nostalgic', quote: 'My dad did retreats for 20 years. Now I understand why he always came back different.', img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80', featured: false, likes: 76 },
];

const ARCHETYPE_COLORS = { Hustler: '#5C4033', Father: FG, Lost: '#36454F', Nostalgic: '#8B6914' };

export default function ImpactStories() {
  const [filter, setFilter] = useState('All');
  const [liked, setLiked] = useState([]);
  const [email, setEmail] = useState('');
  const [subbed, setSubbed] = useState(false);

  const filtered = filter === 'All' ? STORIES : STORIES.filter(s => s.archetype === filter);
  const featured = STORIES.find(s => s.featured);

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Impact Stories — Brotherhood" description="Real stories from brothers who found their edge in the woods." canonical="/impact-stories" />
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=85" alt="Brotherhood" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-black/40" />
        </div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative max-w-5xl mx-auto px-4 pb-12 w-full">
          <div className="flex items-center gap-2 mb-3"><div className="w-8 h-px bg-primary" /><span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">Brotherhood</span></div>
          <h1 className="font-heading text-5xl md:text-7xl tracking-wide uppercase text-white leading-none">Stories That<br /><span className="text-primary">Prove It Works</span></h1>
          <p className="text-white/60 mt-3 text-lg">Real men. Real struggles. Real resets.</p>
        </motion.div>
      </section>

      {/* Impact Stats */}
      <div className="border-y border-border bg-secondary/30">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-wrap justify-center gap-8 md:gap-16">
          {[['124', 'Stories Shared'], ['89%', 'Felt Lighter After Retreat'], ['12', 'Archetypes Represented'], ['47', 'Countries Reached']].map(([v, l]) => (
            <div key={l} className="text-center">
              <div className="font-heading text-3xl" style={{ color: FG }}>{v}</div>
              <p className="text-xs text-muted-foreground font-heading tracking-wider uppercase">{l}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Featured Story */}
        {featured && (
          <div className="mb-14">
            <span className="text-xs font-heading tracking-[0.3em] uppercase mb-3 block" style={{ color: SAND }}>Featured Story</span>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="bg-card border border-border rounded-2xl overflow-hidden grid md:grid-cols-2 gap-0">
              <div className="relative h-64 md:h-auto overflow-hidden">
                <img src={featured.img} alt={featured.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40 hidden md:block" />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-heading tracking-wider uppercase px-2.5 py-1 rounded-full text-white" style={{ background: ARCHETYPE_COLORS[featured.archetype] }}>{featured.archetype}</span>
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-xs text-muted-foreground font-heading tracking-wider uppercase">Featured</span>
                </div>
                <h2 className="font-heading text-3xl tracking-wider uppercase mb-1">{featured.name}, {featured.age}</h2>
                <p className="text-xs text-muted-foreground mb-4">{featured.city}</p>
                <blockquote className="font-accent text-xl italic text-foreground leading-relaxed mb-6 border-l-2 pl-4" style={{ borderColor: FG }}>"{featured.quote}"</blockquote>
                <div className="flex items-center gap-4">
                  <div className="aspect-video bg-secondary rounded-xl flex items-center justify-center flex-1 cursor-pointer hover:bg-secondary/70 transition-colors" style={{ minHeight: '80px' }}>
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/40">
                      <div className="w-0 h-0 ml-1" style={{ borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderLeft: `10px solid ${FG}` }} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-8 items-center">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {ARCHETYPES.map(a => (
            <button key={a} onClick={() => setFilter(a)}
              className={`px-3 py-1.5 rounded-full text-xs font-heading tracking-wider uppercase transition-all ${filter === a ? 'text-white' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
              style={filter === a ? { background: a === 'All' ? FG : ARCHETYPE_COLORS[a] } : {}}>
              {a}
            </button>
          ))}
        </div>

        {/* Story Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 mb-14">
          {filtered.map((story, i) => (
            <motion.div key={story.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 transition-all group">
              <div className="relative h-44 overflow-hidden">
                <img src={story.img} alt={story.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute top-3 left-3 text-[10px] font-heading tracking-wider uppercase px-2.5 py-1 rounded-full text-white" style={{ background: ARCHETYPE_COLORS[story.archetype] || FG }}>{story.archetype}</span>
              </div>
              <div className="p-4">
                <h3 className="font-heading text-base tracking-wider uppercase">{story.name}, {story.age}</h3>
                <p className="text-xs text-muted-foreground mb-3">{story.city}</p>
                <p className="text-sm font-accent italic text-foreground/80 mb-4 line-clamp-2">"{story.quote}"</p>
                <div className="flex items-center justify-between">
                  <button onClick={() => setLiked(l => l.includes(story.id) ? l.filter(x => x !== story.id) : [...l, story.id])}
                    className={`flex items-center gap-1 text-xs transition-colors ${liked.includes(story.id) ? 'text-red-400' : 'text-muted-foreground hover:text-red-400'}`}>
                    <Heart className={`w-4 h-4 ${liked.includes(story.id) ? 'fill-current' : ''}`} />
                    {story.likes + (liked.includes(story.id) ? 1 : 0)}
                  </button>
                  <button className="text-xs font-heading tracking-wider uppercase flex items-center gap-1 hover:text-primary transition-colors">
                    Read <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Write for the Journal */}
        <div className="bg-card border border-border rounded-2xl p-8 text-center mb-14" style={{ borderColor: `${FG}40` }}>
          <PenLine className="w-8 h-8 mx-auto mb-4" style={{ color: FG }} />
          <h2 className="font-heading text-2xl tracking-wide uppercase mb-2">Write for the Journal</h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">Your reset might be the reason a brother decides to go. Every story earns <strong className="text-foreground">500 Brotherhood Points</strong>.</p>
          <Button asChild className="font-heading tracking-wider uppercase" style={{ background: FG }}>
            <Link to="/journal/submit">Write for the Journal <ArrowRight className="w-4 h-4 ml-1" /></Link>
          </Button>
        </div>

        {/* Newsletter */}
        <div className="bg-secondary/40 border border-border rounded-2xl p-6 max-w-lg mx-auto text-center">
          <h3 className="font-heading text-lg tracking-wider uppercase mb-2">Get New Stories Weekly</h3>
          <p className="text-xs text-muted-foreground mb-4">Delivered every Monday morning. No spam — only brotherhood.</p>
          {subbed ? (
            <p className="text-primary font-heading tracking-wider uppercase text-sm">You're in. Welcome to the feed.</p>
          ) : (
            <form onSubmit={e => { e.preventDefault(); setSubbed(true); }} className="flex gap-2">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required
                className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
              <Button type="submit" size="sm" className="font-heading tracking-wider uppercase" style={{ background: FG }}>Subscribe</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}