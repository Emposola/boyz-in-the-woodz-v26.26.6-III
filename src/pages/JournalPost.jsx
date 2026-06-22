/* ============================================================
   JOURNAL POST — Individual article page
   Full SEO: OG, Twitter Card, JSON-LD Article schema,
   canonical URL, reading progress bar, related posts,
   social share, author card
   ============================================================ */
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  Clock, ArrowLeft, Share2, Heart, Twitter, Facebook,
  Link as LinkIcon, BookOpen, ArrowRight, Trees, Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const FG = '#2D5A27';
const SAND = '#D2B48C';
const SITE_URL = 'https://boyzinthewoodz.com';
const SITE_NAME = 'Boyz In The Woodz';

/* ── SEO Head Manager ── */
function PostSEO({ post }) {
  useEffect(() => {
    if (!post) return;

    const title = `${post.title} — ${SITE_NAME}`;
    const description = post.excerpt || post.body?.slice(0, 155) || '';
    const url = `${SITE_URL}/journal/${post.slug}`;
    const image = post.image_url || `${SITE_URL}/images/logos/logo-welcome.png`;
    const author = post.author_name || SITE_NAME;
    const datePublished = post.created_date || new Date().toISOString();

    // Basic
    document.title = title;
    setMeta('description', description);

    // Canonical
    setLink('canonical', url);

    // Open Graph
    setMeta('og:type', 'article', true);
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:url', url, true);
    setMeta('og:image', image, true);
    setMeta('og:image:width', '1200', true);
    setMeta('og:image:height', '630', true);
    setMeta('og:site_name', SITE_NAME, true);
    setMeta('article:published_time', datePublished, true);
    setMeta('article:author', author, true);
    if (post.category) setMeta('article:section', post.category, true);
    if (post.tags?.length) {
      post.tags.forEach(tag => setMeta('article:tag', tag, true));
    }

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', image);
    setMeta('twitter:site', '@boyzinthewoodz');

    // JSON-LD Article structured data
    const existing = document.getElementById('json-ld-article');
    if (existing) existing.remove();
    const script = document.createElement('script');
    script.id = 'json-ld-article';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: description,
      image: [image],
      datePublished: datePublished,
      dateModified: post.updated_date || datePublished,
      author: {
        '@type': 'Person',
        name: author,
      },
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/images/logos/logo-navbar-about.jpg`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url,
      },
      articleSection: post.category,
      keywords: post.tags?.join(', '),
      wordCount: post.body?.split(' ').length || 0,
      timeRequired: `PT${post.read_time || 5}M`,
    });
    document.head.appendChild(script);

    return () => {
      const s = document.getElementById('json-ld-article');
      if (s) s.remove();
    };
  }, [post]);

  return null;
}

function setMeta(name, content, isProperty = false) {
  const attr = isProperty ? 'property' : 'name';
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel, href) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/* ── Reading progress bar ── */
function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-transparent">
      <motion.div
        className="h-full origin-left"
        style={{ background: FG, scaleX: progress / 100 }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: progress / 100 }}
        transition={{ duration: 0 }}
      />
    </div>
  );
}

/* ── Social share ── */
function ShareBar({ post }) {
  const url = `${window.location.origin}/journal/${post.slug}`;
  const text = encodeURIComponent(post.title);

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success('Link copied!');
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-muted-foreground font-heading tracking-wider uppercase">Share:</span>
      <a href={`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`}
        target="_blank" rel="noopener noreferrer"
        className="p-2 rounded-lg bg-secondary hover:bg-[#1DA1F2]/20 text-muted-foreground hover:text-[#1DA1F2] transition-all"
        aria-label="Share on Twitter">
        <Twitter className="w-4 h-4" />
      </a>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank" rel="noopener noreferrer"
        className="p-2 rounded-lg bg-secondary hover:bg-[#1877F2]/20 text-muted-foreground hover:text-[#1877F2] transition-all"
        aria-label="Share on Facebook">
        <Facebook className="w-4 h-4" />
      </a>
      <button onClick={copyLink}
        className="p-2 rounded-lg bg-secondary hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all"
        aria-label="Copy link">
        <LinkIcon className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ── Body renderer — handles plain text and basic markdown-like formatting ── */
function PostBody({ body }) {
  if (!body) return null;

  // Split into paragraphs, render HTML if it contains tags, otherwise plain
  const isHTML = /<[a-z][\s\S]*>/i.test(body);

  if (isHTML) {
    return (
      <div
        className="prose prose-invert prose-lg max-w-none
          prose-headings:font-heading prose-headings:tracking-wide prose-headings:uppercase
          prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
          prose-p:text-base prose-p:leading-relaxed prose-p:text-foreground/85
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-strong:text-foreground prose-strong:font-semibold
          prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
          prose-ul:space-y-1 prose-ol:space-y-1
          prose-img:rounded-xl"
        dangerouslySetInnerHTML={{ __html: body }}
      />
    );
  }

  // Plain text — split by double newline into paragraphs
  const paragraphs = body.split(/\n\n+/).filter(Boolean);
  return (
    <div className="space-y-5">
      {paragraphs.map((para, i) => {
        // Heading detection
        if (para.startsWith('## ')) {
          return <h2 key={i} className="font-heading text-2xl tracking-wide uppercase mt-10 mb-4" style={{ color: FG }}>{para.slice(3)}</h2>;
        }
        if (para.startsWith('# ')) {
          return <h2 key={i} className="font-heading text-3xl tracking-wide uppercase mt-10 mb-4" style={{ color: FG }}>{para.slice(2)}</h2>;
        }
        return (
          <p key={i} className="text-base leading-relaxed text-foreground/85">
            {para}
          </p>
        );
      })}
    </div>
  );
}

/* ── Main component ── */
export default function JournalPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [liked, setLiked] = useState(false);

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['journal-post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();
      if (error) throw error;
      return data;
    },
    retry: false,
  });

  // Increment view count
  useEffect(() => {
    if (!post?.id) return;
    supabase
      .from('blog_posts')
      .update({ views: (post.views || 0) + 1 })
      .eq('id', post.id)
      .then(() => {});
  }, [post?.id]);

  // Related posts — same category, exclude current
  const { data: related = [] } = useQuery({
    queryKey: ['journal-related', post?.category, post?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('blog_posts')
        .select('id, title, slug, image_url, category, read_time, excerpt, author_name')
        .eq('status', 'published')
        .eq('category', post.category)
        .neq('id', post.id)
        .limit(3);
      return data || [];
    },
    enabled: !!post?.category && !!post?.id,
  });

  const handleLike = async () => {
    if (liked || !post) return;
    setLiked(true);
    await supabase
      .from('blog_posts')
      .update({ likes: (post.likes || 0) + 1 })
      .eq('id', post.id);
    qc.invalidateQueries({ queryKey: ['journal-post', slug] });
    toast.success('❤️ Thanks for the love!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <BookOpen className="w-16 h-16 text-muted-foreground/20" />
        <h1 className="font-heading text-3xl tracking-wide uppercase">Story Not Found</h1>
        <p className="text-muted-foreground text-sm">This post may have been removed or the link is incorrect.</p>
        <Button onClick={() => navigate('/journal')} className="font-heading tracking-wider uppercase" style={{ background: FG }}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Journal
        </Button>
      </div>
    );
  }

  const readingDate = post.created_date
    ? format(new Date(post.created_date), 'MMMM d, yyyy')
    : '';

  return (
    <>
      <PostSEO post={post} />
      <ReadingProgress />

      <article className="min-h-screen">
        {/* Hero image */}
        <header className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          {post.image_url ? (
            <img src={post.image_url} alt={post.title}
              className="w-full h-full object-cover"
              loading="eager" />
          ) : (
            <div className="w-full h-full bg-secondary flex items-center justify-center">
              <Trees className="w-24 h-24 text-muted-foreground/10" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

          {/* Back button */}
          <div className="absolute top-6 left-4 md:left-8">
            <button onClick={() => navigate('/journal')}
              className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-heading tracking-wider uppercase transition-colors bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <ArrowLeft className="w-3.5 h-3.5" /> Journal
            </button>
          </div>

          {/* Category badge */}
          <div className="absolute top-6 right-4 md:right-8">
            <Badge className="text-[10px] font-heading tracking-wider uppercase"
              style={{ background: FG, color: '#fff', border: 'none' }}>
              {post.category}
            </Badge>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-4 -mt-20 relative z-10 pb-16">

          {/* Title block */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="font-heading text-3xl md:text-5xl tracking-wide uppercase leading-tight mb-4 text-foreground">
              {post.title}
            </h1>

            {/* Meta row */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap mb-6 pb-6 border-b border-border">
              {post.author_name && (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: FG }}>
                    {post.author_name[0]}
                  </div>
                  <span className="font-medium text-foreground">{post.author_name}</span>
                </div>
              )}
              {readingDate && <span>{readingDate}</span>}
              {post.read_time && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {post.read_time} min read
                </span>
              )}
              {post.views > 0 && (
                <span className="text-muted-foreground/60">{post.views.toLocaleString()} views</span>
              )}
            </div>

            {/* Excerpt / lead */}
            {post.excerpt && (
              <p className="text-lg text-muted-foreground leading-relaxed mb-8 font-light italic border-l-2 pl-4"
                style={{ borderColor: FG }}>
                {post.excerpt}
              </p>
            )}
          </motion.div>

          {/* Body */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <PostBody body={post.body} />
          </motion.div>

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-border">
              <Tag className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              {post.tags.map(tag => (
                <Link key={tag} to={`/journal?tag=${tag}`}
                  className="text-xs text-muted-foreground bg-secondary hover:bg-primary/10 hover:text-primary px-3 py-1 rounded-full transition-colors">
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* Like + Share bar */}
          <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-border flex-wrap">
            <button onClick={handleLike}
              disabled={liked}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-sm font-heading tracking-wider uppercase ${
                liked
                  ? 'border-red-500/30 bg-red-500/10 text-red-400'
                  : 'border-border text-muted-foreground hover:border-red-500/30 hover:text-red-400 hover:bg-red-500/10'
              }`}>
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
              {liked ? 'Liked' : 'Like'} {post.likes > 0 && `· ${post.likes + (liked ? 0 : 0)}`}
            </button>
            <ShareBar post={post} />
          </div>

          {/* Author card */}
          {post.author_name && (
            <div className="mt-10 bg-card border border-border rounded-2xl p-6 flex items-start gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
                style={{ background: FG }}>
                {post.author_name[0]}
              </div>
              <div>
                <p className="font-heading text-sm tracking-wider uppercase mb-1">Written by</p>
                <p className="font-medium text-foreground text-lg">{post.author_name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Member of the Boyz In The Woodz brotherhood. Stories from the field.
                </p>
              </div>
            </div>
          )}

          {/* CTA — retreat */}
          <div className="mt-10 rounded-2xl overflow-hidden relative"
            style={{ background: `linear-gradient(135deg, ${FG}dd, ${FG}88)` }}>
            <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-5">
              <Trees className="w-12 h-12 text-white/60 flex-shrink-0" />
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-heading text-xl tracking-wider uppercase text-white mb-1">
                  Ready to Live This?
                </h3>
                <p className="text-white/70 text-sm">
                  Stop reading about it. Apply for the next retreat and experience it.
                </p>
              </div>
              <Button asChild className="flex-shrink-0 font-heading tracking-wider uppercase bg-white text-foreground hover:bg-white/90">
                <Link to="/retreat/apply">Apply Now <ArrowRight className="w-4 h-4 ml-1.5" /></Link>
              </Button>
            </div>
          </div>

          {/* Related posts */}
          {related.length > 0 && (
            <div className="mt-14">
              <h2 className="font-heading text-xl tracking-wider uppercase mb-5 flex items-center gap-2">
                <BookOpen className="w-5 h-5" style={{ color: FG }} />
                More from the Journal
              </h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {related.map(r => (
                  <Link key={r.id} to={`/journal/${r.slug}`}
                    className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-all hover:-translate-y-0.5">
                    {r.image_url && (
                      <div className="aspect-video overflow-hidden">
                        <img src={r.image_url} alt={r.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy" />
                      </div>
                    )}
                    <div className="p-3">
                      <p className="text-xs text-muted-foreground mb-1">{r.category}</p>
                      <h3 className="font-heading text-sm tracking-wide uppercase leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {r.title}
                      </h3>
                      {r.read_time && (
                        <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {r.read_time} min
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back to journal */}
          <div className="mt-10 text-center">
            <Link to="/journal"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-heading tracking-wider uppercase">
              <ArrowLeft className="w-4 h-4" /> Back to Journal
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
