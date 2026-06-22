/* ============================================================
   JOURNAL / BLOG — Topics sidebar, urgency, social proof,
   persuasion patterns, brutally honest CTAs
   ============================================================ */
import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
  BookOpen, Search, Trees, Share2, Heart, Clock,
  ArrowRight, Camera, Flame, TrendingUp, Shield, Zap, Star,
  Users, AlertCircle, Trophy
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import SEO from '@/components/shared/SEO';

/* ── Fallback posts ── */
const FALLBACK_POSTS = [
  { id: '1', title: 'Why 20 Minutes in the Forest Changes Everything', body: 'Scientists call it "forest bathing" — but we call it Tuesday. Here\'s what 3 years of retreat data tells us about cortisol, brotherhood, and the case for leaving your phone at camp.', image_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=75&fm=webp', author: 'Marcus Trail', business: 'boyz', published: true, category: 'Science', read_time: 6, featured: true, created_date: '2024-10-15T10:00:00', tags: ['nature', 'mental-health', 'science'] },
  { id: '2', title: 'The Barber Chair Confessional: Why Men Talk Here', body: 'There\'s a reason barbershops have been spaces of masculine intimacy for centuries. No eye contact, rhythmic sound, someone\'s hands in your hair — it lowers the guard.', image_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=75&fm=webp', author: 'Dre Steady Hands', business: 'barber', published: true, category: 'Culture', read_time: 4, featured: false, created_date: '2024-09-28T10:00:00', tags: ['barber', 'culture', 'brotherhood'] },
  { id: '3', title: 'Field Notes: Broken Bow Fall 2024', body: '12 men. 3 days. No cell signal. What happened when we stopped performing and started listening. Raw account from our retreat leader.', image_url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=75&fm=webp', author: 'The Brotherhood', business: 'boyz', published: true, category: 'Field Notes', read_time: 8, featured: false, created_date: '2024-09-10T10:00:00', tags: ['retreat', 'field-notes', 'broken-bow'] },
  { id: '4', title: 'Gear Review: What\'s Actually in Survival Pack 01', body: 'We built this pack by asking one question: what does a man who hasn\'t slept well in 6 months actually need to reset?', image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=75&fm=webp', author: 'Marcus Trail', business: 'boyz', published: true, category: 'Gear', read_time: 5, featured: false, created_date: '2024-08-22T10:00:00', tags: ['gear', 'survival-pack', 'review'] },
  { id: '5', title: 'The Fade that Started a Brotherhood: Dre\'s Origin Story', body: 'In 2019, Dre Williams opened The Chair with one rule: every man who sits down gets treated like family.', image_url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=75&fm=webp', author: 'Dre Steady Hands', business: 'barber', published: true, category: 'Stories', read_time: 7, featured: false, created_date: '2024-07-14T10:00:00', tags: ['origin', 'barber', 'story'] },
  { id: '6', title: 'The Archetype You Become When You Stop Faking It', body: 'Most men have been performing a version of themselves for so long they\'ve forgotten the original.', image_url: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&q=75&fm=webp', author: 'Brotherhood Team', business: 'shared', published: true, category: 'Brotherhood', read_time: 9, featured: false, created_date: '2024-06-05T10:00:00', tags: ['archetype', 'brotherhood', 'identity'] },
  { id: '7', title: 'Big Bend Winter Basecamp: A Full Dispatch', body: 'The coldest retreat we\'ve ever run. 10 men, sub-freezing nights, and the kind of silence that rewires something in your chest.', image_url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=75&fm=webp', author: 'The Brotherhood', business: 'boyz', published: true, category: 'Field Notes', read_time: 11, featured: false, created_date: '2024-02-18T10:00:00', tags: ['retreat', 'big-bend', 'winter'] },
  { id: '8', title: 'How a $35 Haircut Changed My Week Every Time', body: 'There\'s something about the ritual of maintenance. Haircut. Cold drink. 45 minutes where nobody needs anything from you.', image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=75&fm=webp', author: 'James C., Brotherhood Member', business: 'barber', published: true, category: 'Stories', read_time: 3, featured: false, created_date: '2024-01-30T10:00:00', tags: ['barber', 'story', 'ritual'] },
];

const TOPICS = [
  { label: 'All Topics', value: 'All', icon: BookOpen, count: 8 },
  { label: 'Field Notes', value: 'Field Notes', icon: Camera, count: 2 },
  { label: 'Science', value: 'Science', icon: Zap, count: 1 },
  { label: 'Culture', value: 'Culture', icon: Users, count: 1 },
  { label: 'Gear', value: 'Gear', icon: Shield, count: 1 },
  { label: 'Stories', value: 'Stories', icon: Heart, count: 2 },
  { label: 'Brotherhood', value: 'Brotherhood', icon: Trophy, count: 1 },
];

const TRENDING = FALLBACK_POSTS.slice(0, 3);

function PostCard({ post, featured = false, index = 0 }) {
  const [liked, setLiked] = useState(false);
  const handleLike = (e) => { e.stopPropagation(); setLiked(l => !l); };
  const handleShare = (e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(window.location.origin + '/journal#' + post.id);
    toast.success('Link copied!');
  };

  if (featured) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="group relative rounded-2xl overflow-hidden bg-secondary border border-border mb-8">
        <div className="relative h-[44vh] md:h-[52vh]">
          <img src={post.image_url} alt={post.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
        </div>
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <Badge className="bg-primary/20 text-primary border-0 text-[10px]">{post.category}</Badge>
            <Badge variant="outline" className="text-[10px] border-white/30 text-white/70">Featured</Badge>
            <span className="flex items-center gap-1 text-[10px] text-orange-400 font-heading tracking-wider uppercase"><Flame className="w-3 h-3" /> Trending</span>
          </div>
          <h2 className="font-heading text-2xl md:text-4xl tracking-wide uppercase text-white leading-tight mb-3">{post.title}</h2>
          <p className="text-white/70 text-sm mb-4 line-clamp-2">{post.body}</p>
          <div className="flex items-center gap-4 text-white/60 text-xs mb-4">
            <span>{post.author}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.read_time} min read</span>
          </div>
          <div className="flex items-center gap-3">
            <Button className="font-heading tracking-wider uppercase text-sm gap-2" size="sm">
              Read Story <ArrowRight className="w-3.5 h-3.5" />
            </Button>
            <button onClick={handleLike} className={`flex items-center gap-1.5 text-xs transition-colors ${liked ? 'text-red-400' : 'text-white/60 hover:text-red-400'}`}>
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} /> Like
            </button>
            <button onClick={handleShare} className="text-white/60 hover:text-white"><Share2 className="w-4 h-4" /></button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20"
    >
      <div className="relative aspect-video overflow-hidden">
        <img src={post.image_url} alt={post.title} loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-3 left-3">
          <Badge className={`text-[9px] border-0 ${post.business === 'boyz' ? 'bg-primary/20 text-primary' : post.business === 'barber' ? 'bg-accent/20 text-accent' : 'bg-secondary text-muted-foreground'}`}>
            {post.category}
          </Badge>
        </div>
        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] rounded px-2 py-0.5 flex items-center gap-1">
          <Clock className="w-3 h-3" /> {post.read_time}m
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-heading text-base tracking-wide uppercase leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{post.body}</p>
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">{post.author}</div>
          <div className="flex items-center gap-2">
            <button onClick={handleLike} className={`flex items-center gap-1 text-xs transition-colors ${liked ? 'text-red-400' : 'text-muted-foreground hover:text-red-400'}`}>
              <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} /> Like
            </button>
            <button onClick={handleShare} className="text-muted-foreground hover:text-primary">
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        {post.tags && (
          <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-border/50">
            {post.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-[10px] text-muted-foreground/60 bg-secondary px-2 py-0.5 rounded">#{tag}</span>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}

/* ── Urgency banner ── */
function UrgencyBanner() {
  const [secs, setSecs] = useState(1247);
  useEffect(() => {
    const t = setInterval(() => setSecs(s => s > 0 ? s - 1 : 0), 1000);
    return () => clearInterval(t);
  }, []);
  const m = String(Math.floor(secs / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  return (
    <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 mb-5">
      <div className="flex items-center gap-2 mb-1">
        <AlertCircle className="w-4 h-4 text-primary flex-shrink-0" />
        <span className="text-xs font-heading tracking-wider uppercase text-primary">Retreat Spot Alert</span>
      </div>
      <p className="text-xs text-muted-foreground mb-2">Broken Bow Nov retreat — <strong className="text-foreground">2 spots left.</strong> This reservation window closes in:</p>
      <div className="font-heading text-2xl text-primary tracking-widest">{m}:{s}</div>
      <Button asChild size="sm" className="w-full mt-3 font-heading tracking-wider uppercase text-xs">
        <a href="/retreat/apply">Claim My Spot <ArrowRight className="w-3 h-3 ml-1" /></a>
      </Button>
    </div>
  );
}

/* ── Topics sidebar ── */
function TopicsSidebar({ category, setCategory }) {
  return (
    <aside className="space-y-5">
      {/* Topics list */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="font-heading text-sm tracking-[0.2em] uppercase text-primary mb-4">Topics</h3>
        <ul className="space-y-1">
          {TOPICS.map(t => {
            const active = category === t.value;
            return (
              <li key={t.value}>
                <button onClick={() => setCategory(t.value)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
                  <span className="flex items-center gap-2">
                    <t.icon className="w-3.5 h-3.5 flex-shrink-0" />
                    {t.label}
                  </span>
                  <span className={`text-[10px] rounded-full px-2 py-0.5 font-heading ${active ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>{t.count}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Urgency: retreat timer */}
      <UrgencyBanner />

      {/* Trending posts */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="font-heading text-sm tracking-[0.2em] uppercase text-primary mb-4 flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5" /> Trending
        </h3>
        <ul className="space-y-3">
          {TRENDING.map((p, i) => (
            <li key={p.id} className="flex items-start gap-3 group cursor-pointer">
              <span className="font-heading text-2xl text-primary/20 leading-none flex-shrink-0">{i + 1}</span>
              <div>
                <p className="text-xs font-medium leading-snug group-hover:text-primary transition-colors line-clamp-2">{p.title}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{p.read_time} min · {p.category}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Brutally honest pledge CTA */}
      <div className="bg-card border border-primary/30 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-xs font-heading tracking-wider uppercase text-primary">The Code</span>
        </div>
        <p className="text-sm font-medium mb-1">"I'm not fine — I'm ready to change."</p>
        <p className="text-xs text-muted-foreground mb-3">1,200+ brothers have taken the pledge. It takes 10 seconds.</p>
        <Button asChild size="sm" className="w-full font-heading tracking-wider uppercase text-xs">
          <a href="/the-code">Take the Pledge <ArrowRight className="w-3 h-3 ml-1" /></a>
        </Button>
      </div>
    </aside>
  );
}

export default function Journal() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [business, setBusiness] = useState('all');

  const { data: dbPosts } = useQuery({
    queryKey: ['journal-posts'],
    queryFn: () => api.entities.JournalPost.filter({ published: true }, '-created_date', 50),
    initialData: [],
  });

  const posts = dbPosts.length > 0 ? dbPosts : FALLBACK_POSTS;
  const featured = posts.find(p => p.featured) || posts[0];

  const filtered = useMemo(() => {
    return posts
      .filter(p => p.id !== featured?.id)
      .filter(p => category === 'All' || p.category === category)
      .filter(p => business === 'all' || p.business === business)
      .filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.body?.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
  }, [posts, category, business, search, featured]);

  return (
    <div className="min-h-screen pb-12">
      <SEO title="Journal — Brotherhood Field Notes" description="Stories, field notes, and survival wisdom from the brotherhood. Read what brothers are sharing from the trail." canonical="/journal" />
      {/* ─── Hero Header ─── */}
      <section className="relative py-12 bg-secondary/30 overflow-hidden border-b border-border">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1448375240586-882707db888b?w=1400&q=20)', backgroundSize: 'cover' }} />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">The Journal</span>
            </div>
            <h1 className="font-heading text-4xl md:text-6xl tracking-wide uppercase mb-2">Stories from the Field</h1>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              Field notes, barber chair confessionals, gear breakdowns, and the science of being a man worth knowing.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ─── Search + filter bar ─── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search stories..." className="pl-8 bg-secondary border-border text-sm h-9" />
          </div>
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'All Posts', icon: BookOpen },
              { value: 'boyz', label: 'The Woodz', icon: Trees },
            ].map(f => (
              <button key={f.value} onClick={() => setBusiness(f.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-heading tracking-wider uppercase border transition-colors ${business === f.value ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}>
                <f.icon className="w-3 h-3" /> {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ─── Two-column layout: main + sidebar ─── */}
        <div className="grid lg:grid-cols-[1fr_280px] gap-8">
          {/* MAIN CONTENT */}
          <div>
            {/* Featured */}
            {featured && category === 'All' && business === 'all' && !search && (
              <PostCard post={featured} featured={true} />
            )}

            {/* Post grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {filtered.length > 0 ? (
                  filtered.map((post, i) => <PostCard key={post.id} post={post} index={i} />)
                ) : (
                  <div className="col-span-full text-center py-16 text-muted-foreground text-sm">
                    No stories found. Try a different filter.
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* UGC / Field notes CTA */}
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="mt-10 bg-card border border-primary/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-5">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Camera className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-heading text-xl tracking-wider uppercase">Got a Field Note?</h3>
                <p className="text-sm text-muted-foreground mt-1">Submit your retreat story or barber chair epiphany. Earn +50 Brotherhood Points on publication. <strong className="text-foreground">Real voices only.</strong></p>
              </div>
              <Button asChild className="font-heading tracking-wider uppercase flex-shrink-0 text-sm">
                <a href="/upload">Share Your Story <ArrowRight className="w-4 h-4 ml-1" /></a>
              </Button>
            </motion.div>
          </div>

          {/* TOPICS SIDEBAR */}
          <div className="hidden lg:block">
            <TopicsSidebar category={category} setCategory={setCategory} />
          </div>
        </div>

        {/* Mobile topics (horizontal scroll) */}
        <div className="lg:hidden mt-8">
          <p className="text-xs font-heading tracking-[0.2em] uppercase text-primary mb-3">Filter by Topic</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {TOPICS.map(t => (
              <button key={t.value} onClick={() => setCategory(t.value)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-heading tracking-wider uppercase border transition-colors ${category === t.value ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground'}`}>
                <t.icon className="w-3 h-3" /> {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}