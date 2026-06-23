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
import { useCategories, CATEGORY_META } from '@/lib/journalCategories';

const FG = '#2D5A27';
const SAND = '#D2B48C';
const SITE_URL = 'https://boyzinthewoodz.com';

const CATEGORY_ICON = {
  'Field Notes': Camera, 'Retreat Recaps': Trees, 'Brotherhood Stories': Trophy,
  'Guest Posts': Camera, 'Science': Zap, 'Mental Health': Heart,
  'Nature & Adventure': Trees, 'Gear': Shield, 'Culture': Users, 'General': BookOpen,
};

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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <Link to={`/journal/${post.slug}`}
          className="group relative rounded-2xl overflow-hidden bg-secondary border border-border block">
          {/* Image */}
          <div className="relative h-56 sm:h-72 md:h-[420px]">
            {post.image_url && (
              <img src={post.image_url} alt={post.title} loading="eager"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          </div>
          {/* Overlay content */}
          <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-8">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-[9px] font-heading tracking-wider uppercase px-2 py-0.5 rounded-full text-white"
                style={{ background: FG }}>{post.category}</span>
              <span className="text-[9px] font-heading tracking-wider uppercase text-orange-400 flex items-center gap-1">
                <Flame className="w-3 h-3" /> Editor's Pick
              </span>
            </div>
            <h2 className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-wide uppercase text-white leading-tight mb-2">
              {post.title}
            </h2>
            <p className="text-white/65 text-xs sm:text-sm mb-3 line-clamp-2 max-w-2xl">
              {post.excerpt || post.body?.slice(0, 120)}
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-white/60 text-xs">
                {post.author_name && <span>{post.author_name}</span>}
                {post.read_time && (
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.read_time}m</span>
                )}
              </div>
              <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-xs font-heading tracking-wider uppercase px-3 py-1.5 rounded-full border border-white/20 group-hover:bg-primary transition-colors ml-auto">
                Read <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay: Math.min(index * 0.04, 0.2) }}>
      <Link to={`/journal/${post.slug}`}
        className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 flex flex-col h-full">
        {/* Image */}
        <div className="relative overflow-hidden" style={{ paddingTop: '56.25%' /* 16:9 */ }}>
          <div className="absolute inset-0">
            {post.image_url ? (
              <img src={post.image_url} alt={post.title} loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            ) : (
              <div className="w-full h-full bg-secondary flex items-center justify-center">
                <Trees className="w-10 h-10 text-muted-foreground/20" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
          {/* Category */}
          <div className="absolute top-3 left-3 z-10">
            <span className="text-[9px] font-heading tracking-wider uppercase px-2 py-0.5 rounded-full text-white"
              style={{ background: `${FG}cc` }}>
              {post.category}
            </span>
          </div>
          {/* Read time */}
          {post.read_time && (
            <div className="absolute bottom-3 right-3 z-10 bg-black/70 text-white text-[10px] rounded-full px-2.5 py-0.5 flex items-center gap-1 backdrop-blur-sm">
              <Clock className="w-2.5 h-2.5" /> {post.read_time}m
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-heading text-sm md:text-base tracking-wide uppercase leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 flex-1 leading-relaxed">
            {post.excerpt || post.body?.slice(0, 110)}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
            <span className="text-[11px] text-muted-foreground truncate max-w-[130px]">
              {post.author_name}
            </span>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={handleLike}
                className={`flex items-center gap-1 text-[11px] transition-colors ${liked ? 'text-red-400' : 'text-muted-foreground hover:text-red-400'}`}>
                <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
                {((post.likes || 0) + (liked ? 1 : 0)) > 0 && ((post.likes || 0) + (liked ? 1 : 0))}
              </button>
              <button onClick={handleShare} className="text-muted-foreground hover:text-primary p-0.5">
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {post.tags.slice(0, 2).map(tag => (
                <span key={tag} className="text-[10px] text-muted-foreground/50 bg-secondary/80 px-2 py-0.5 rounded-full">
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

  // Decode category from URL param — handles spaces and special chars
  useEffect(() => {
    if (cat) {
      const decoded = decodeURIComponent(cat);
      setCategory(decoded);
    }
  }, [cat]);
  const tagParam = searchParams.get('tag');

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['journal-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts').select('*').eq('status', 'published')
        .order('created_date', { ascending: false });
      if (error) return [];
      return data || [];
    },
    staleTime: 60000,
  });

  const featured = posts.find(p => p.featured) || posts[0];

  const { data: dbCategories = [] } = useCategories();

  const topics = useMemo(() => {
    const all = { label: 'All Topics', value: 'All', icon: BookOpen, count: posts.length };
    const rest = dbCategories
      .filter(cat => cat && cat !== 'All')
      .map(cat => ({
        label: CATEGORY_META[cat]?.display || cat,
        value: cat,
        icon: CATEGORY_ICON[cat] || BookOpen,
        count: posts.filter(p => p.category === cat).length,
      }))
      .filter(t => t.count > 0);
    return [all, ...rest];
  }, [dbCategories, posts]);

  const trending = useMemo(() => [...posts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3), [posts]);

  const filtered = useMemo(() => {
    return posts
      .filter(p => p.id !== featured?.id)
      .filter(p => category === 'All' || p.category === category)
      .filter(p => !tagParam || p.tags?.includes(tagParam))
      .filter(p => !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.excerpt?.toLowerCase().includes(search.toLowerCase())
      );
  }, [posts, category, tagParam, search, featured]);

  return (
    <div className="min-h-screen pb-20 lg:pb-12">
      <JournalSEO category={category} />

      {/* ── Hero ── */}
      <section className="relative py-10 md:py-16 border-b border-border overflow-hidden"
        style={{ background: 'linear-gradient(180deg, rgba(45,90,39,0.08) 0%, transparent 100%)' }}>
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1448375240586-882707db888b?w=1400&q=20)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-heading tracking-[0.35em] text-primary uppercase">The Journal</span>
            </div>
            <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl tracking-wide uppercase mb-2">
              Stories from the Field
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto">
              Field notes, barber chair confessionals, gear breakdowns, and the science of being a man worth knowing.
            </p>
          </motion.div>

          {/* Search — prominent, centered */}
          <div className="max-w-lg mx-auto">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search stories, topics, authors..."
                className="pl-10 h-11 bg-card border-border text-sm rounded-xl shadow-sm" />
              {search && (
                <button onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs">
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Mobile topic pills — ABOVE content ── */}
      <div className="lg:hidden sticky top-16 z-20 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none -mx-1 px-1">
          {topics.map(t => (
            <button key={t.value} onClick={() => setCategory(t.value)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-heading tracking-wider uppercase border transition-all ${
                category === t.value ? 'text-white border-transparent shadow-sm' : 'border-border text-muted-foreground bg-card'
              }`}
              style={category === t.value ? { background: FG } : {}}>
              {t.label} <span className="opacity-60">·{t.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Tag filter notice ── */}
      {tagParam && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl px-4 py-2.5 w-fit">
            <Tag className="w-3.5 h-3.5 text-primary" />
            <span className="text-sm">Tag: <strong className="text-foreground">#{tagParam}</strong></span>
            <Link to="/journal" className="text-xs text-muted-foreground hover:text-foreground ml-1">✕ Clear</Link>
          </div>
        </div>
      )}

      {/* ── Main layout ── */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-4">
        <div className="grid lg:grid-cols-[1fr_300px] gap-8 xl:gap-12">

          {/* ── Main content ── */}
          <div className="min-w-0">
            {isLoading ? (
              <div className="space-y-5">
                {/* Featured skeleton */}
                <div className="rounded-2xl overflow-hidden animate-pulse bg-card border border-border h-[300px] md:h-[400px]" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
                      <div className="aspect-video bg-secondary" />
                      <div className="p-4 space-y-2">
                        <div className="h-4 bg-secondary rounded w-3/4" />
                        <div className="h-3 bg-secondary rounded w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Featured post */}
                {featured && category === 'All' && !search && !tagParam && (
                  <PostCard post={featured} featured={true} />
                )}

                {/* Post count + active filter label */}
                {(category !== 'All' || search || tagParam) && (
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{filtered.length}</span> stor{filtered.length === 1 ? 'y' : 'ies'}
                      {category !== 'All' && <span> in <strong className="text-foreground">{category}</strong></span>}
                    </p>
                    <button onClick={() => { setSearch(''); setCategory('All'); }}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors">
                      Clear filter
                    </button>
                  </div>
                )}

                {/* Card grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-5">
                  <AnimatePresence mode="popLayout">
                    {filtered.length > 0 ? (
                      filtered.map((post, i) => <PostCard key={post.id} post={post} index={i} />)
                    ) : (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="col-span-full text-center py-20 text-muted-foreground">
                        <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="font-heading tracking-wider uppercase text-sm mb-2">No stories found</p>
                        <p className="text-xs mb-4">Try a different topic or clear your search.</p>
                        <button onClick={() => { setSearch(''); setCategory('All'); }}
                          className="text-xs text-primary hover:underline">Show all posts</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Write CTA */}
                <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-10 bg-card border border-primary/20 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                    <Camera className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-lg tracking-wider uppercase mb-1">Write for the Journal</h3>
                    <p className="text-sm text-muted-foreground">
                      Submit your story and earn <strong className="text-foreground">+500 Brotherhood Points</strong> on publication.
                    </p>
                  </div>
                  <Button asChild className="font-heading tracking-wider uppercase text-xs flex-shrink-0 w-full sm:w-auto"
                    style={{ background: FG }}>
                    <Link to="/journal/submit">Write for the Journal <ArrowRight className="w-3.5 h-3.5 ml-1.5" /></Link>
                  </Button>
                </motion.div>
              </>
            )}
          </div>

          {/* ── Desktop Sidebar ── */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-5">
              <Sidebar category={category} setCategory={setCategory} topics={topics} trending={trending} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
