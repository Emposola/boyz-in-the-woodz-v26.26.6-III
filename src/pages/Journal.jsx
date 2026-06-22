/* ============================================================
   JOURNAL / BLOG — Pulls from DB, slug-based links,
   dynamic topic counts, full SEO meta
   ============================================================ */
import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
  BookOpen, Search, Trees, Share2, Heart, Clock,
  ArrowRight, Camera, Flame, TrendingUp, Shield, Zap, Star,
  Users, AlertCircle, Trophy, Tag
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const FG = '#2D5A27';
const SAND = '#D2B48C';
const SITE_URL = 'https://boyzinthewoodz.com';

const ALL_CATEGORIES = [
  { label: 'All Topics',         value: 'All',                icon: BookOpen },
  { label: 'Field Notes',        value: 'Field Notes',        icon: Camera },
  { label: 'Retreat Recaps',     value: 'Retreat Recaps',     icon: Trees },
  { label: 'Science',            value: 'Science',            icon: Zap },
  { label: 'Culture',            value: 'Culture',            icon: Users },
  { label: 'Gear',               value: 'Gear',               icon: Shield },
  { label: 'Brotherhood Stories',value: 'Brotherhood Stories',icon: Trophy },
  { label: 'Mental Health',      value: 'Mental Health',      icon: Heart },
  { label: 'Nature & Adventure', value: 'Nature & Adventure', icon: Trees },
  { label: 'Guest Posts',        value: 'Guest Posts',        icon: Camera },
  { label: 'General',            value: 'General',            icon: BookOpen },
];

/* ── SEO for the journal index ── */
function JournalSEO({ category }) {
  useEffect(() => {
    const title = category && category !== 'All'
      ? `${category} — Journal · Boyz In The Woodz`
      : 'Journal — Brotherhood Field Notes · Boyz In The Woodz';
    const desc = 'Stories, field notes, and survival wisdom from the brotherhood. Read what brothers are sharing from the trail.';
    document.title = title;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
    meta.content = desc;
  }, [category]);
  return null;
}

/* ── Post card ── */
function PostCard({ post, featured = false, index = 0 }) {
  const [liked, setLiked] = useState(false);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (liked) return;
    setLiked(true);
    await supabase.from('blog_posts').update({ likes: (post.likes || 0) + 1 }).eq('id', post.id);
    toast.success('❤️ Thanks!');
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard?.writeText(`${window.location.origin}/journal/${post.slug}`);
    toast.success('Link copied!');
  };

  if (featured) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link to={`/journal/${post.slug}`}
          className="group relative rounded-2xl overflow-hidden bg-secondary border border-border mb-8 block">
          <div className="relative h-[44vh] md:h-[52vh]">
            {post.image_url && (
              <img src={post.image_url} alt={post.title} loading="eager"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
          </div>
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <Badge className="bg-primary/20 text-primary border-0 text-[10px]">{post.category}</Badge>
              <Badge variant="outline" className="text-[10px] border-white/30 text-white/70">Featured</Badge>
              <span className="flex items-center gap-1 text-[10px] text-orange-400 font-heading tracking-wider uppercase">
                <Flame className="w-3 h-3" /> Editor's Pick
              </span>
            </div>
            <h2 className="font-heading text-2xl md:text-4xl tracking-wide uppercase text-white leading-tight mb-3">
              {post.title}
            </h2>
            <p className="text-white/70 text-sm mb-4 line-clamp-2">{post.excerpt || post.body?.slice(0, 150)}</p>
            <div className="flex items-center gap-4 text-white/60 text-xs mb-4">
              <span>{post.author_name}</span>
              {post.read_time && (
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.read_time} min read</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 bg-primary text-white text-sm font-heading tracking-wider uppercase px-4 py-2 rounded-lg">
                Read Story <ArrowRight className="w-3.5 h-3.5" />
              </span>
              <button onClick={handleLike}
                className={`flex items-center gap-1.5 text-xs transition-colors ${liked ? 'text-red-400' : 'text-white/60 hover:text-red-400'}`}>
                <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
              </button>
              <button onClick={handleShare} className="text-white/60 hover:text-white">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay: index * 0.04 }}>
      <Link to={`/journal/${post.slug}`}
        className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 block h-full">
        <div className="relative aspect-video overflow-hidden">
          {post.image_url ? (
            <img src={post.image_url} alt={post.title} loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full bg-secondary flex items-center justify-center">
              <Trees className="w-10 h-10 text-muted-foreground/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute top-3 left-3">
            <Badge className="text-[9px] border-0 bg-primary/80 text-white">{post.category}</Badge>
          </div>
          {post.read_time && (
            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] rounded px-2 py-0.5 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {post.read_time}m
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-heading text-sm tracking-wide uppercase leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2 flex-1">
            {post.excerpt || post.body?.slice(0, 120)}
          </p>
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
            <div className="text-xs text-muted-foreground truncate max-w-[120px]">{post.author_name}</div>
            <div className="flex items-center gap-2">
              <button onClick={handleLike}
                className={`flex items-center gap-1 text-xs transition-colors ${liked ? 'text-red-400' : 'text-muted-foreground hover:text-red-400'}`}>
                <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
                {(post.likes || 0) + (liked ? 1 : 0) > 0 && (post.likes || 0) + (liked ? 1 : 0)}
              </button>
              <button onClick={handleShare} className="text-muted-foreground hover:text-primary">
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {post.tags.slice(0, 2).map(tag => (
                <span key={tag} className="text-[10px] text-muted-foreground/60 bg-secondary px-2 py-0.5 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  );
}

/* ── Sidebar ── */
function Sidebar({ category, setCategory, topics, trending }) {
  return (
    <aside className="space-y-5">
      {/* Topics */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="font-heading text-sm tracking-[0.2em] uppercase mb-4" style={{ color: FG }}>Topics</h3>
        <ul className="space-y-0.5">
          {topics.map(t => {
            const active = category === t.value;
            return (
              <li key={t.value}>
                <button onClick={() => setCategory(t.value)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                    active ? 'text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                  style={active ? { background: FG } : {}}>
                  <span className="flex items-center gap-2">
                    <t.icon className="w-3.5 h-3.5 flex-shrink-0" />
                    {t.label}
                  </span>
                  <span className={`text-[10px] rounded-full px-2 py-0.5 font-heading ${
                    active ? 'bg-white/20 text-white' : 'bg-secondary text-muted-foreground'
                  }`}>{t.count}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Trending */}
      {trending.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-heading text-sm tracking-[0.2em] uppercase mb-4 flex items-center gap-1.5" style={{ color: FG }}>
            <TrendingUp className="w-3.5 h-3.5" /> Trending
          </h3>
          <ul className="space-y-3">
            {trending.map((p, i) => (
              <li key={p.id}>
                <Link to={`/journal/${p.slug}`}
                  className="flex items-start gap-3 group">
                  <span className="font-heading text-2xl leading-none flex-shrink-0"
                    style={{ color: `${FG}40` }}>{i + 1}</span>
                  <div>
                    <p className="text-xs font-medium leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {p.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {p.read_time}m · {p.category}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Retreat CTA */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Trees className="w-4 h-4" style={{ color: FG }} />
          <span className="text-xs font-heading tracking-wider uppercase" style={{ color: FG }}>Next Retreat</span>
        </div>
        <p className="text-sm font-medium mb-1">Stop reading. Start living it.</p>
        <p className="text-xs text-muted-foreground mb-3">
          Limited spots. A deposit secures yours.
        </p>
        <Button asChild size="sm" className="w-full font-heading tracking-wider uppercase text-xs"
          style={{ background: FG }}>
          <Link to="/retreat/apply">Apply Now <ArrowRight className="w-3 h-3 ml-1" /></Link>
        </Button>
      </div>

      {/* The Code CTA */}
      <div className="bg-card border border-primary/20 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-xs font-heading tracking-wider uppercase text-primary">The Code</span>
        </div>
        <p className="text-sm font-medium mb-1">"I'm not fine — I'm ready to change."</p>
        <p className="text-xs text-muted-foreground mb-3">1,200+ brothers have taken the pledge.</p>
        <Button asChild size="sm" variant="outline" className="w-full font-heading tracking-wider uppercase text-xs">
          <Link to="/the-code">Take the Pledge <ArrowRight className="w-3 h-3 ml-1" /></Link>
        </Button>
      </div>
    </aside>
  );
}

export default function Journal() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [searchParams] = useSearchParams();
  const { cat } = useParams();

  // Support /journal/category/:cat route
  useEffect(() => {
    if (cat) setCategory(cat);
  }, [cat]);

  // Support ?tag= param
  const tagParam = searchParams.get('tag');

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['journal-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('created_date', { ascending: false });
      if (error) return [];
      return data || [];
    },
    staleTime: 60000,
  });

  const featured = posts.find(p => p.featured) || posts[0];

  // Build dynamic topic counts
  const topics = useMemo(() => {
    return ALL_CATEGORIES.map(cat => ({
      ...cat,
      count: cat.value === 'All'
        ? posts.length
        : posts.filter(p => p.category === cat.value).length,
    })).filter(t => t.value === 'All' || t.count > 0);
  }, [posts]);

  // Trending = most viewed
  const trending = useMemo(() => {
    return [...posts]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 3);
  }, [posts]);

  const filtered = useMemo(() => {
    return posts
      .filter(p => p.id !== featured?.id)
      .filter(p => category === 'All' || p.category === category)
      .filter(p => !tagParam || p.tags?.includes(tagParam))
      .filter(p => !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.body?.toLowerCase().includes(search.toLowerCase()) ||
        p.excerpt?.toLowerCase().includes(search.toLowerCase())
      );
  }, [posts, category, tagParam, search, featured]);

  return (
    <div className="min-h-screen pb-12">
      <JournalSEO category={category} />

      {/* Hero */}
      <section className="relative py-12 bg-secondary/30 border-b border-border overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1448375240586-882707db888b?w=1400&q=20)', backgroundSize: 'cover' }} />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">The Journal</span>
            </div>
            <h1 className="font-heading text-4xl md:text-6xl tracking-wide uppercase mb-2">
              Stories from the Field
            </h1>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              Field notes, barber chair confessionals, gear breakdowns, and the science of being a man worth knowing.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Active tag filter banner */}
        {tagParam && (
          <div className="mb-5 flex items-center gap-3">
            <Tag className="w-4 h-4 text-primary" />
            <span className="text-sm">Showing posts tagged <strong className="text-foreground">#{tagParam}</strong></span>
            <Link to="/journal" className="text-xs text-muted-foreground hover:text-foreground underline">Clear</Link>
          </div>
        )}

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search stories..." className="pl-8 bg-secondary border-border text-sm h-9" />
          </div>
        </div>

        {/* Layout */}
        <div className="grid lg:grid-cols-[1fr_280px] gap-8">
          {/* Main */}
          <div>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
                    <div className="aspect-video bg-secondary" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-secondary rounded w-3/4" />
                      <div className="h-3 bg-secondary rounded w-full" />
                      <div className="h-3 bg-secondary rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Featured */}
                {featured && category === 'All' && !search && !tagParam && (
                  <PostCard post={featured} featured={true} />
                )}

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  <AnimatePresence mode="popLayout">
                    {filtered.length > 0 ? (
                      filtered.map((post, i) => (
                        <PostCard key={post.id} post={post} index={i} />
                      ))
                    ) : (
                      <div className="col-span-full text-center py-16 text-muted-foreground">
                        <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-20" />
                        <p className="font-heading tracking-wider uppercase text-sm">No stories found</p>
                        <button onClick={() => { setSearch(''); setCategory('All'); }}
                          className="text-xs text-primary mt-2 hover:underline">Clear filters</button>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Write for us CTA */}
                <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-10 bg-card border border-primary/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-5">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Camera className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="font-heading text-xl tracking-wider uppercase">Got a Field Note?</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Submit your retreat story. Earn <strong className="text-foreground">+500 Brotherhood Points</strong> on publication.
                    </p>
                  </div>
                  <Button asChild className="font-heading tracking-wider uppercase flex-shrink-0 text-sm"
                    style={{ background: FG }}>
                    <Link to="/journal/submit">Share Your Story <ArrowRight className="w-4 h-4 ml-1" /></Link>
                  </Button>
                </motion.div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <Sidebar
              category={category}
              setCategory={setCategory}
              topics={topics}
              trending={trending}
            />
          </div>
        </div>

        {/* Mobile topic pills */}
        <div className="lg:hidden mt-8">
          <p className="text-xs font-heading tracking-[0.2em] uppercase mb-3" style={{ color: FG }}>Filter by Topic</p>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {topics.map(t => (
              <button key={t.value} onClick={() => setCategory(t.value)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-heading tracking-wider uppercase border transition-colors ${
                  category === t.value
                    ? 'text-white border-transparent'
                    : 'border-border text-muted-foreground'
                }`}
                style={category === t.value ? { background: FG } : {}}>
                <t.icon className="w-3 h-3" /> {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
