import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Filter, Heart, PenLine, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/AuthContext';
import { toast } from 'sonner';
import SEO from '@/components/shared/SEO';

const FG = '#2D5A27';
const SAND = '#D2B48C';

const ARCHETYPE_COLORS = { Hustler: '#5C4033', Father: FG, Lost: '#36454F', Nostalgic: '#8B6914' };

const FALLBACK_STORIES = [
  { id: 'fb-1', name: 'Marcus', city: 'Houston, TX', archetype: 'Hustler', quote: 'I came back lighter. My wife noticed before I did. That\'s when I knew it worked.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', likes: 247 },
  { id: 'fb-2', name: 'David', city: 'Atlanta, GA', archetype: 'Father', quote: 'My son asked me why I was smiling. I didn\'t have words for it. Just: the woods.', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', likes: 183 },
  { id: 'fb-3', name: 'James', city: 'Chicago, IL', archetype: 'Lost', quote: 'I showed up not knowing what I needed. I left knowing exactly who I was.', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80', likes: 156 },
  { id: 'fb-4', name: 'Robert', city: 'Dallas, TX', archetype: 'Nostalgic', quote: 'Reminded me who I was before the world told me who I should be.', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80', likes: 134 },
  { id: 'fb-5', name: 'Andre', city: 'Memphis, TN', archetype: 'Hustler', quote: 'Three retreats. Three different versions of me came home. All better.', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80', likes: 128 },
  { id: 'fb-6', name: 'Kevin', city: 'Nashville, TN', archetype: 'Father', quote: 'I learned more about being a dad in the woods than in 15 years of trying.', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', likes: 119 },
  { id: 'fb-7', name: 'Troy', city: 'Detroit, MI', archetype: 'Lost', quote: 'I was ready to quit everything. The fire ceremony changed my mind.', img: 'https://images.unsplash.com/photo-1553267751-1c148a7280a1?w=400&q=80', likes: 201 },
  { id: 'fb-8', name: 'Rico', city: 'Miami, FL', archetype: 'Hustler', quote: 'First time in 3 years I slept without my phone. Slept 10 hours straight.', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80', likes: 97 },
  { id: 'fb-9', name: 'Damon', city: 'Charlotte, NC', archetype: 'Nostalgic', quote: 'My grandfather would have loved this. I felt him there with me.', img: 'https://images.unsplash.com/photo-1542178243-bc20204b769f?w=400&q=80', likes: 145 },
  { id: 'fb-10', name: 'Chris', city: 'Phoenix, AZ', archetype: 'Father', quote: 'I cried on day 2. Real tears. In front of strangers who became brothers.', img: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&q=80', likes: 88 },
  { id: 'fb-11', name: 'Leon', city: 'Seattle, WA', archetype: 'Lost', quote: 'The silence on the solo hike was the loudest thing I\'ve ever heard.', img: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&q=80', likes: 112 },
  { id: 'fb-12', name: 'Marcus Jr.', city: 'New Orleans, LA', archetype: 'Nostalgic', quote: 'My dad did retreats for 20 years. Now I understand why he always came back different.', img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80', likes: 76 },
];

function getArchetype(tags) {
  if (!tags || !Array.isArray(tags) || tags.length === 0) return null;
  const match = tags.find(t => typeof t === 'string' && ARCHETYPE_COLORS[t]);
  return match || null;
}

export default function ImpactStories() {
  const { user, isAuthenticated } = useAuth();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [liked, setLiked] = useState(new Set());
  const [email, setEmail] = useState('');
  const [subbed, setSubbed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase
      .from('blog_posts')
      .select('id, title, excerpt, image_url, tags, featured, published_at, author_id, profiles:author_id(full_name, city, archetype)')
      .eq('published', true)
      .eq('category', 'impact-story')
      .order('published_at', { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) {
          const mapped = data.map(p => {
            const profile = p.profiles || {};
            const tags = typeof p.tags === 'string' ? JSON.parse(p.tags) : (p.tags || []);
            return {
              id: p.id,
              name: profile.full_name || 'Anonymous',
              city: profile.city || null,
              archetype: getArchetype(tags) || profile.archetype || 'Brother',
              quote: p.excerpt || 'No excerpt.',
              img: p.image_url || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80',
              featured: p.featured || false,
              likes: 0,
            };
          });
          setStories(mapped);
          const featuredExists = mapped.some(s => s.featured);
          if (!featuredExists && mapped.length > 0) {
            mapped[0].featured = true;
          }
        } else {
          setStories(FALLBACK_STORIES);
        }
        setLoading(false);
      })
      .catch(() => {
        setStories(FALLBACK_STORIES);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (stories.length === 0 || stories[0]?.id?.startsWith('fb-')) return;
    const realIds = stories.filter(s => !s.id.startsWith('fb-')).map(s => s.id);
    if (realIds.length === 0) return;
    supabase
      .from('story_likes')
      .select('story_id')
      .in('story_id', realIds)
      .then(({ data }) => {
        if (!data) return;
        const counts = {};
        data.forEach(l => { counts[l.story_id] = (counts[l.story_id] || 0) + 1; });
        setStories(prev => prev.map(s => ({ ...s, likes: counts[s.id] || 0 })));
      });

    if (isAuthenticated && user) {
      supabase
        .from('story_likes')
        .select('story_id')
        .eq('user_id', user.id)
        .in('story_id', realIds)
        .then(({ data }) => {
          if (data) setLiked(new Set(data.map(l => l.story_id)));
        });
    }
  }, [stories.length, isAuthenticated, user]);

  const ARCHETYPES = ['All', ...new Set(stories.map(s => s.archetype).filter(Boolean))];
  const filtered = filter === 'All' ? stories : stories.filter(s => s.archetype === filter);
  const featured = stories.find(s => s.featured);

  const handleLike = async (storyId) => {
    if (!isAuthenticated) { toast.error('Sign in to like stories.'); return; }
    const isLiked = liked.has(storyId);
    if (isLiked) {
      await supabase.from('story_likes').delete().eq('story_id', storyId).eq('user_id', user.id);
      setLiked(prev => { const n = new Set(prev); n.delete(storyId); return n; });
      setStories(prev => prev.map(s => s.id === storyId ? { ...s, likes: Math.max(0, s.likes - 1) } : s));
    } else {
      await supabase.from('story_likes').insert({ story_id: storyId, user_id: user.id });
      setLiked(prev => new Set(prev).add(storyId));
      setStories(prev => prev.map(s => s.id === storyId ? { ...s, likes: s.likes + 1 } : s));
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Impact Stories — Brotherhood" description="Real stories from brothers who found their edge in the woods." canonical="/impact-stories" />
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

      <div className="border-y border-border bg-secondary/30">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-wrap justify-center gap-8 md:gap-16">
          {[['Stories Shared', stories.length], ['Felt Lighter', '89%'], ['Archetypes', new Set(stories.map(s => s.archetype)).size], ['Countries Reached', '47']].map(([l, v]) => (
            <div key={l} className="text-center">
              <div className="font-heading text-3xl" style={{ color: FG }}>{v}</div>
              <p className="text-xs text-muted-foreground font-heading tracking-wider uppercase">{l}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
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
                  <span className="text-xs font-heading tracking-wider uppercase px-2.5 py-1 rounded-full text-white" style={{ background: ARCHETYPE_COLORS[featured.archetype] || FG }}>{featured.archetype}</span>
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-xs text-muted-foreground font-heading tracking-wider uppercase">Featured</span>
                </div>
                <h2 className="font-heading text-3xl tracking-wider uppercase mb-1">{featured.name}</h2>
                {featured.city && <p className="text-xs text-muted-foreground mb-4">{featured.city}</p>}
                <blockquote className="font-accent text-xl italic text-foreground leading-relaxed mb-6 border-l-2 pl-4" style={{ borderColor: FG }}>"{featured.quote}"</blockquote>
              </div>
            </motion.div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-8 items-center">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {ARCHETYPES.map(a => (
            <button key={a} onClick={() => setFilter(a)}
              className={`px-3 py-1.5 rounded-full text-xs font-heading tracking-wider uppercase transition-all ${filter === a ? 'text-white' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
              style={filter === a ? { background: a === 'All' ? FG : (ARCHETYPE_COLORS[a] || FG) } : {}}>
              {a}
            </button>
          ))}
        </div>

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
                <h3 className="font-heading text-base tracking-wider uppercase">{story.name}</h3>
                {story.city && <p className="text-xs text-muted-foreground mb-3">{story.city}</p>}
                <p className="text-sm font-accent italic text-foreground/80 mb-4 line-clamp-2">"{story.quote}"</p>
                <div className="flex items-center justify-between">
                  <button onClick={() => handleLike(story.id)}
                    className={`flex items-center gap-1 text-xs transition-colors ${liked.has(story.id) ? 'text-red-400' : 'text-muted-foreground hover:text-red-400'}`}>
                    <Heart className={`w-4 h-4 ${liked.has(story.id) ? 'fill-current' : ''}`} />
                    {story.likes + (liked.has(story.id) ? 1 : 0)}
                  </button>
                  <Link to={`/journal/${story.id}`} className="text-xs font-heading tracking-wider uppercase flex items-center gap-1 hover:text-primary transition-colors">
                    Read <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 text-center mb-14" style={{ borderColor: `${FG}40` }}>
          <PenLine className="w-8 h-8 mx-auto mb-4" style={{ color: FG }} />
          <h2 className="font-heading text-2xl tracking-wide uppercase mb-2">Write for the Journal</h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">Your reset might be the reason a brother decides to go. Every story earns <strong className="text-foreground">500 Brotherhood Points</strong>.</p>
          <Button asChild className="font-heading tracking-wider uppercase" style={{ background: FG }}>
            <Link to="/journal/submit">Write for the Journal <ArrowRight className="w-4 h-4 ml-1" /></Link>
          </Button>
        </div>

        <div className="bg-secondary/40 border border-border rounded-2xl p-6 max-w-lg mx-auto text-center">
          <h3 className="font-heading text-lg tracking-wider uppercase mb-2">Get New Stories Weekly</h3>
          <p className="text-xs text-muted-foreground mb-4">Delivered every Monday morning. No spam — only brotherhood.</p>
          {subbed ? (
            <p className="text-primary font-heading tracking-wider uppercase text-sm">You're in. Welcome to the feed.</p>
          ) : (
            <form onSubmit={async e => { e.preventDefault(); if (!email.trim()) return; setSubmitting(true); try { const { error } = await supabase.from('newsletter_subscribers').insert({ email: email.trim(), source: 'impact-stories' }); if (error && error.code !== '23505') throw error; await supabase.functions.invoke('send-newsletter', { body: { action: 'welcome', email: email.trim() } }).catch(() => {}); setSubbed(true); toast.success('Welcome to the brotherhood!'); } catch (err) { toast.error('Something went wrong.'); } finally { setSubmitting(false); } }} className="flex gap-2">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required
                className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
              <Button type="submit" disabled={submitting} size="sm" className="font-heading tracking-wider uppercase" style={{ background: FG }}>{submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Subscribe'}</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
