/* ============================================================
   JOURNAL SUBMIT — Community post submission
   Submits as 'pending', admin reviews in AdminBlog
   Awards +500 points on publication
   ============================================================ */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PenLine, Check, ArrowRight, Star, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/AuthContext';
import { toast } from 'sonner';
import SEO from '@/components/shared/SEO';

const FG = '#2D5A27';
const SAND = '#D2B48C';

const CATEGORIES = [
  'Brotherhood Stories', 'Mental Health', 'Nature & Adventure',
  'Retreat Recaps', 'Guest Posts', 'Science', 'Gear', 'Field Notes',
  'Culture', 'General',
];

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    + '-' + Date.now().toString(36);
}

export default function JournalSubmit() {
  const { user } = useAuth();
  const [form, setForm] = useState({ title: '', category: '', body: '', tags: '', excerpt: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const wordCount = form.body.split(' ').filter(Boolean).length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.body || !form.category) {
      toast.error('Please fill in title, category, and body.');
      return;
    }
    if (wordCount < 100) {
      toast.error('Your story needs at least 100 words.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('blog_posts').insert({
        title: form.title,
        slug: slugify(form.title),
        body: form.body,
        excerpt: form.excerpt || form.body.slice(0, 200),
        category: form.category,
        tags: form.tags ? form.tags.split(',').map(t => t.trim().toLowerCase().replace(/\s+/g, '-')).filter(Boolean) : [],
        status: 'pending',
        author_id: user?.id || null,
        author_name: user?.full_name || user?.email?.split('@')[0] || 'Community Member',
        read_time: Math.max(1, Math.ceil(wordCount / 200)),
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      toast.error(err.message || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border rounded-2xl p-10 max-w-lg w-full text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: FG }}>
            <Check className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-heading text-3xl tracking-wide uppercase mb-3">Submitted!</h2>
          <p className="text-muted-foreground mb-3">
            Your post is under review. If approved, you'll earn{' '}
            <strong className="text-foreground">+500 Brotherhood Points</strong> and the "Guest Author" badge.
          </p>
          <p className="text-xs text-muted-foreground mb-6">Average review time: 2–3 business days.</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => { setSubmitted(false); setForm({ title: '', category: '', body: '', tags: '', excerpt: '' }); }}
              className="font-heading tracking-wider uppercase" style={{ background: FG }}>
              Write Another
            </Button>
            <Button asChild variant="outline" className="font-heading tracking-wider uppercase">
              <a href="/journal">View Journal</a>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Submit Your Story — Journal · Boyz In The Woodz"
        description="Share your story with the brotherhood. Submit your field notes, survival wisdom, and proof of nature."
        canonical="/journal/submit"
      />

      {/* Hero */}
      <section className="relative py-14 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(45,90,39,0.1) 0%, transparent 60%)' }}>
        <div className="max-w-3xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5" style={{ color: FG }} />
              <span className="text-xs font-heading tracking-[0.3em] uppercase" style={{ color: SAND }}>Share Your Story</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl tracking-wide uppercase text-foreground mb-4">
              Write for the Journal
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Star className="w-4 h-4" style={{ color: FG }} /> +500 points on approval</div>
              <div className="flex items-center gap-2"><Star className="w-4 h-4" style={{ color: FG }} /> "Guest Author" badge</div>
              <div className="flex items-center gap-2"><Star className="w-4 h-4" style={{ color: FG }} /> Featured on homepage</div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="block text-xs font-heading tracking-wider uppercase text-muted-foreground mb-2">
                Post Title *
              </label>
              <Input placeholder="What's your story?" value={form.title}
                onChange={e => set('title', e.target.value)}
                className="bg-secondary border-border text-base h-12" required />
            </div>

            <div>
              <label className="block text-xs font-heading tracking-wider uppercase text-muted-foreground mb-2">
                Category *
              </label>
              <select value={form.category} onChange={e => set('category', e.target.value)} required
                className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="">Select a category...</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-heading tracking-wider uppercase text-muted-foreground mb-2">
                Short Excerpt <span className="normal-case text-muted-foreground/60">(shown in the grid)</span>
              </label>
              <Input placeholder="One or two lines that hook the reader..."
                value={form.excerpt} onChange={e => set('excerpt', e.target.value)}
                className="bg-secondary border-border" />
            </div>

            <div>
              <label className="block text-xs font-heading tracking-wider uppercase text-muted-foreground mb-2">
                Your Story * <span className="normal-case text-muted-foreground/60 ml-1">{wordCount} words</span>
              </label>
              <textarea value={form.body} onChange={e => set('body', e.target.value)} required rows={16}
                placeholder={`Write your story here. Be honest. Be human. No performance needed.\n\nMinimum 100 words.`}
                className="w-full bg-secondary border border-border rounded-md px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none leading-relaxed" />
              <div className={`text-xs mt-1 ${wordCount > 0 && wordCount < 100 ? 'text-red-400' : 'text-muted-foreground'}`}>
                {wordCount < 100 ? `${100 - wordCount} more words needed` : `~${Math.max(1, Math.ceil(wordCount / 200))} min read`}
              </div>
            </div>

            <div>
              <label className="block text-xs font-heading tracking-wider uppercase text-muted-foreground mb-2">
                Tags <span className="normal-case text-muted-foreground/60">(comma separated)</span>
              </label>
              <Input placeholder="e.g. brotherhood, mental-health, broken-bow"
                value={form.tags} onChange={e => set('tags', e.target.value)}
                className="bg-secondary border-border" />
            </div>

            {/* Guidelines */}
            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-3">Submission Guidelines</p>
              <ul className="text-sm text-muted-foreground space-y-1.5">
                <li>• Be authentic and honest — no marketing fluff</li>
                <li>• Minimum 100 words</li>
                <li>• No hate speech, discrimination, or explicit content</li>
                <li>• Your story may be lightly edited for clarity</li>
                <li>• By submitting, you grant Boyz In The Woodz publishing rights</li>
              </ul>
            </div>

            <Button type="submit" size="lg" disabled={loading || wordCount < 100}
              className="w-full font-heading tracking-wider uppercase h-12" style={{ background: FG }}>
              {loading ? 'Submitting...' : (
                <span className="flex items-center gap-2">
                  <PenLine className="w-4 h-4" /> Submit for Review
                </span>
              )}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
