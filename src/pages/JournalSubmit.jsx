/* ============================================================
   JOURNAL SUBMIT — User blog submission with admin workflow
   URL: /journal/submit
   ============================================================ */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PenLine, Upload, Check, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/api/supabaseClient';
import { toast } from 'sonner';

const FG = '#2D5A27';
const CATEGORIES = ['Brotherhood Stories', 'Mental Health', 'Nature & Adventure', 'Retreat Recaps', 'Guest Posts', 'Science', 'Gear', 'General'];

export default function JournalSubmit() {
  const [form, setForm] = useState({ title: '', category: '', body: '', tags: '', excerpt: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.body || !form.category) { toast.error('Please fill in all required fields.'); return; }
    setLoading(true);
    await api.entities.BlogPost.create({
      title: form.title,
      body: form.body,
      excerpt: form.excerpt || form.body.slice(0, 200),
      category: form.category,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      status: 'pending',
      read_time: Math.ceil(form.body.split(' ').length / 200),
    });
    setLoading(false);
    setSubmitted(true);
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
          <p className="text-muted-foreground mb-3">Your post is under review. If approved, you'll earn <strong className="text-foreground">500 Brotherhood Points</strong> and the "Guest Author" badge.</p>
          <p className="text-xs text-muted-foreground mb-6">Average review time: 2–3 business days.</p>
          <Button className="font-heading tracking-wider uppercase" style={{ background: FG }}
            onClick={() => { setSubmitted(false); setForm({ title: '', category: '', body: '', tags: '', excerpt: '' }); }}>
            Write Another Post
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-14 overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(45,90,39,0.1) 0%, transparent 60%)' }}>
        <div className="max-w-3xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs font-heading tracking-[0.3em] uppercase block mb-2" style={{ color: '#D2B48C' }}>Share Your Story</span>
            <h1 className="font-heading text-5xl tracking-wide uppercase text-foreground mb-3">Write for the Journal</h1>
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
              <label className="block text-xs font-heading tracking-wider uppercase text-muted-foreground mb-2">Post Title *</label>
              <Input placeholder="What's your story?" value={form.title} onChange={e => set('title', e.target.value)}
                className="bg-secondary border-border text-foreground text-base h-12" required />
            </div>

            <div>
              <label className="block text-xs font-heading tracking-wider uppercase text-muted-foreground mb-2">Category *</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} required
                className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="">Select a category...</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-heading tracking-wider uppercase text-muted-foreground mb-2">Short Excerpt (optional)</label>
              <Input placeholder="One-line summary shown on the blog grid..." value={form.excerpt} onChange={e => set('excerpt', e.target.value)}
                className="bg-secondary border-border text-foreground" />
            </div>

            <div>
              <label className="block text-xs font-heading tracking-wider uppercase text-muted-foreground mb-2">Your Story *</label>
              <textarea value={form.body} onChange={e => set('body', e.target.value)} required
                rows={14}
                placeholder="Write your story here. Be honest. Be human. No performance needed.&#10;&#10;Minimum 200 words."
                className="w-full bg-secondary border border-border rounded-md px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none leading-relaxed" />
              <p className="text-xs text-muted-foreground mt-1">{form.body.split(' ').filter(Boolean).length} words</p>
            </div>

            <div>
              <label className="block text-xs font-heading tracking-wider uppercase text-muted-foreground mb-2">Tags (comma separated)</label>
              <Input placeholder="e.g. brotherhood, mental-health, broken-bow" value={form.tags} onChange={e => set('tags', e.target.value)}
                className="bg-secondary border-border text-foreground" />
            </div>

            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-2">Submission Guidelines</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Be authentic and honest — no marketing fluff</li>
                <li>• Minimum 200 words</li>
                <li>• No hate speech, discrimination, or explicit content</li>
                <li>• Your story may be lightly edited for clarity</li>
                <li>• By submitting, you grant Boyz In The Woodz publishing rights</li>
              </ul>
            </div>

            <Button type="submit" size="lg" disabled={loading}
              className="w-full font-heading tracking-wider uppercase" style={{ background: FG }}>
              {loading ? 'Submitting...' : <><PenLine className="w-4 h-4 mr-2" /> Submit for Review</>}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}