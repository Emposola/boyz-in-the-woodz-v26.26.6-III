import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Star, Trash2, Plus, Save, BookOpen, Eye, EyeOff, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const FG = '#2D5A27';

const FALLBACK_CATEGORIES = [
  'Brotherhood Stories', 'Mental Health', 'Nature & Adventure',
  'Retreat Recaps', 'Guest Posts', 'Science', 'Gear',
  'Field Notes', 'Culture', 'General',
];

const STATUS_COLORS = {
  published: 'bg-green-900/40 text-green-400 border-green-800/40',
  pending:   'bg-yellow-900/40 text-yellow-400 border-yellow-800/40',
  rejected:  'bg-red-900/40 text-red-400 border-red-800/40',
  draft:     'bg-secondary text-muted-foreground border-border',
};

const EMPTY_POST = {
  title: '', slug: '', excerpt: '', body: '', image_url: '',
  category: 'General', status: 'published', featured: false,
  author_name: '', tags: [],
};

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function PostForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(() => ({
    ...EMPTY_POST, ...initial,
    tags: Array.isArray(initial?.tags) ? initial.tags : [],
  }));
  const [tagInput, setTagInput] = useState('');
  const [slugLocked, setSlugLocked] = useState(!!initial?.id);

  useEffect(() => {
    if (initial) {
      setForm({ ...EMPTY_POST, ...initial, tags: Array.isArray(initial.tags) ? initial.tags : [] });
      setSlugLocked(true);
    }
  }, [initial?.id]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleTitleChange = (val) => {
    set('title', val);
    if (!slugLocked) set('slug', slugify(val));
    const words = form.body?.split(' ').length || 0;
    set('read_time', Math.max(1, Math.ceil(words / 200)));
  };

  const handleBodyChange = (val) => {
    set('body', val);
    const words = val.split(' ').filter(Boolean).length;
    set('read_time', Math.max(1, Math.ceil(words / 200)));
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (t && !form.tags.includes(t)) { set('tags', [...form.tags, t]); setTagInput(''); }
  };
  const removeTag = (t) => set('tags', form.tags.filter(x => x !== t));

  const handleSubmit = () => {
    if (!form.title) { toast.error('Title is required'); return; }
    if (!form.body) { toast.error('Body content is required'); return; }
    if (!form.slug) { toast.error('Slug is required'); return; }
    onSave(form);
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h3 className="font-heading text-sm tracking-wider uppercase">{initial?.id ? 'Edit Post' : 'New Post'}</h3>
        <Button onClick={onCancel} variant="ghost" size="sm" className="text-muted-foreground"><X className="w-4 h-4" /></Button>
      </div>
      <div className="p-5 space-y-4">
        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Title *</label>
          <Input value={form.title} onChange={e => handleTitleChange(e.target.value)} placeholder="Your post title..." className="bg-secondary border-border text-base" />
        </div>
        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">
            URL Slug * <span className="normal-case text-muted-foreground/60 ml-1">(/journal/{form.slug || '...'})</span>
          </label>
          <div className="flex gap-2">
            <Input value={form.slug} onChange={e => set('slug', slugify(e.target.value))} className="bg-secondary border-border font-mono text-sm" />
            <Button type="button" onClick={() => setSlugLocked(!slugLocked)} variant="outline" size="sm" className="flex-shrink-0 text-xs">
              {slugLocked ? 'Unlock' : 'Lock'}
            </Button>
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Author</label>
            <Input value={form.author_name || ''} onChange={e => set('author_name', e.target.value)} className="bg-secondary border-border" />
          </div>
          <div>
            <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Category *</label>
            <select value={form.category} onChange={e => set('category', e.target.value)}
              className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground">
              {(FALLBACK_CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Status</label>
            <select value={form.status} onChange={e => set('status', e.target.value)}
              className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground">
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending Review</option>
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Cover Image URL</label>
          <Input value={form.image_url || ''} onChange={e => set('image_url', e.target.value)} className="bg-secondary border-border" />
          {form.image_url && <img src={form.image_url} alt="Preview" className="mt-2 h-32 w-full object-cover rounded-lg border border-border" />}
        </div>
        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Excerpt</label>
          <textarea value={form.excerpt || ''} onChange={e => set('excerpt', e.target.value)} rows={2}
            className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-ring" />
        </div>
        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">
            Body * <span className="normal-case text-muted-foreground/60 ml-1">
              — {form.body?.split(' ').filter(Boolean).length || 0} words · ~{form.read_time || 1} min read
            </span>
          </label>
          <textarea value={form.body || ''} onChange={e => handleBodyChange(e.target.value)} rows={16}
            className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground resize-y focus:outline-none focus:ring-1 focus:ring-ring font-mono leading-relaxed min-h-[300px]" />
          <p className="text-[10px] text-muted-foreground mt-1">Use ## for headings. Double line break = new paragraph. HTML also supported.</p>
        </div>
        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Tags</label>
          <div className="flex gap-2">
            <Input value={tagInput} onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} className="bg-secondary border-border" />
            <Button type="button" onClick={addTag} variant="outline" size="sm">Add</Button>
          </div>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {form.tags.map(t => (
                <span key={t} className="flex items-center gap-1 bg-secondary text-xs px-2 py-1 rounded-full border border-border">
                  #{t} <button onClick={() => removeTag(t)} className="text-muted-foreground hover:text-red-400 ml-0.5 leading-none">×</button>
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-6 pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="accent-primary" />
            Featured post (hero on journal page)
          </label>
        </div>
        <div className="flex gap-3 pt-3 border-t border-border">
          <Button onClick={handleSubmit} disabled={saving}
            className="font-heading tracking-wider uppercase gap-2 flex-1" style={{ background: FG }}>
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : initial?.id ? 'Update Post' : 'Publish Post'}
          </Button>
          <Button onClick={onCancel} variant="outline" className="font-heading tracking-wider uppercase">Cancel</Button>
        </div>
      </div>
    </div>
  );
}

async function agencyFetch(action, data = {}) {
  const { data: result, error } = await supabase.functions.invoke('agency-blog', {
    body: { action, data },
  });
  if (error) throw new Error(error.message);
  return result;
}

export default function AgencyBlog() {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const qc = useQueryClient();

  const key = sessionStorage.getItem('agency_key');

  const { data: listResult = { posts: [], counts: {} }, isLoading } = useQuery({
    queryKey: ['agency-blog', statusFilter, key],
    queryFn: () => agencyFetch('list', { status: statusFilter }),
    enabled: !!key,
  });

  const posts = listResult.posts || [];
  const counts = listResult.counts || {};

  const invalidate = useCallback(() => {
    qc.invalidateQueries({ queryKey: ['agency-blog'] });
    qc.invalidateQueries({ queryKey: ['journal-posts'] });
  }, [qc]);

  useEffect(() => {
    if (!editId || !posts.length) return;
    const post = posts.find(p => p.id === editId);
    if (post) { setEditingPost(post); setShowForm(false); }
  }, [editId, posts]);

  const savePost = useMutation({
    mutationFn: async (form) => {
      if (form.id) {
        return agencyFetch('update', form);
      } else {
        return agencyFetch('create', form);
      }
    },
    onSuccess: () => { invalidate(); toast.success('Post saved'); setShowForm(false); setEditingPost(null); },
    onError: (e) => toast.error(e.message),
  });

  const updatePost = useMutation({
    mutationFn: async ({ id, data }) => agencyFetch('update', { id, ...data }),
    onSuccess: (_, vars) => {
      invalidate();
      if (vars.data?.status === 'published') toast.success('Approved! Author earned +500 points.');
      else toast.success('Updated');
    },
    onError: (e) => toast.error(e.message),
  });

  const deletePost = useMutation({
    mutationFn: async (id) => agencyFetch('delete', { id }),
    onSuccess: () => { invalidate(); toast.success('Post deleted'); },
    onError: (e) => toast.error(e.message),
  });

  const reject = () => {
    updatePost.mutate({ id: rejectModal.id, data: { status: 'rejected', rejection_reason: rejectReason } });
    setRejectModal(null); setRejectReason('');
  };

  const FILTERS = [
    { key: 'all', label: `All (${counts.all || 0})` },
    { key: 'published', label: `Published (${counts.published || 0})` },
    { key: 'pending', label: `Pending (${counts.pending || 0})` },
    { key: 'draft', label: `Draft (${counts.draft || 0})` },
    { key: 'rejected', label: `Rejected (${counts.rejected || 0})` },
  ];

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-heading text-3xl tracking-wide uppercase text-foreground flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-primary" /> Blog Manager
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Emposola Agency — independent blog management</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" className="font-heading tracking-wider uppercase text-xs gap-2">
            <Link to="/journal" target="_blank"><Eye className="w-3.5 h-3.5" /> View Journal</Link>
          </Button>
          <Button onClick={() => { setShowForm(true); setEditingPost(null); }}
            className="font-heading tracking-wider uppercase text-xs gap-2" style={{ background: FG }}>
            <Plus className="w-4 h-4" /> New Post
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {(showForm || editingPost) && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mb-6">
            <PostForm initial={editingPost} onSave={(form) => savePost.mutate(form)}
              onCancel={() => { setShowForm(false); setEditingPost(null); }} saving={savePost.isPending} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-2 mb-5 flex-wrap">
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => setStatusFilter(f.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-heading tracking-wider uppercase border transition-all ${
              statusFilter === f.key ? 'text-white border-transparent' : 'border-border text-muted-foreground hover:border-primary/40'
            }`}
            style={statusFilter === f.key ? { background: FG } : {}}>
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" /></div>
      ) : (
        <div className="space-y-3">
          {posts.map(post => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-xl p-4 flex items-start gap-4 hover:border-primary/20 transition-colors">
              {post.image_url && (
                <img src={post.image_url} alt={post.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0 hidden sm:block border border-border" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-[10px] font-heading tracking-wider uppercase px-2 py-0.5 rounded-full border ${STATUS_COLORS[post.status] || STATUS_COLORS.draft}`}>
                    {post.status}
                  </span>
                  {post.featured && (
                    <span className="text-[10px] font-heading tracking-wider uppercase px-2 py-0.5 rounded-full bg-yellow-900/40 text-yellow-400 border border-yellow-800/40">Featured</span>
                  )}
                  <span className="text-[10px] text-muted-foreground">{post.category}</span>
                  {post.author_name && <span className="text-[10px] text-muted-foreground">· {post.author_name}</span>}
                  {post.views > 0 && <span className="text-[10px] text-muted-foreground">· {post.views} views</span>}
                </div>
                <h3 className="font-medium text-sm truncate">{post.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{post.excerpt || post.body?.slice(0, 100)}</p>
                {post.slug && <p className="text-[10px] text-muted-foreground/50 mt-0.5 font-mono">/journal/{post.slug}</p>}
                {post.rejection_reason && <p className="text-xs text-red-400 mt-1">Rejected: {post.rejection_reason}</p>}
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap justify-end">
                {post.status === 'published' && post.slug && (
                  <Link to={`/journal/${post.slug}`} target="_blank"
                    className="p-1.5 text-muted-foreground hover:text-primary rounded-lg hover:bg-primary/10 transition-colors">
                    <Eye className="w-4 h-4" />
                  </Link>
                )}
                <button onClick={() => updatePost.mutate({ id: post.id, data: { featured: !post.featured } })}
                  className={`p-1.5 rounded-lg transition-colors ${post.featured ? 'text-yellow-400' : 'text-muted-foreground hover:text-yellow-400'}`}>
                  <Star className={`w-4 h-4 ${post.featured ? 'fill-current' : ''}`} />
                </button>
                {post.status === 'pending' && (
                  <>
                    <Button onClick={() => updatePost.mutate({ id: post.id, data: { status: 'published' } })}
                      size="sm" className="font-heading tracking-wider uppercase text-xs h-7 gap-1 px-2" style={{ background: FG }}>
                      <Check className="w-3 h-3" /> Approve
                    </Button>
                    <Button onClick={() => setRejectModal(post)} size="sm" variant="destructive"
                      className="font-heading tracking-wider uppercase text-xs h-7 px-2">
                      <X className="w-3 h-3" />
                    </Button>
                  </>
                )}
                {post.status === 'published' && (
                  <Button onClick={() => updatePost.mutate({ id: post.id, data: { status: 'draft' } })}
                    size="sm" variant="outline" className="font-heading tracking-wider uppercase text-xs h-7 px-2">
                    <EyeOff className="w-3 h-3" />
                  </Button>
                )}
                <button onClick={() => { setEditingPost(post); setShowForm(false); }}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => { if (confirm(`Delete "${post.title}"?`)) deletePost.mutate(post.id); }}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
          {posts.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p className="font-heading tracking-wider uppercase text-sm">No {statusFilter} posts</p>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {rejectModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-card border border-border rounded-2xl p-6 max-w-md w-full">
              <h3 className="font-heading text-xl tracking-wider uppercase mb-2">Reject Post</h3>
              <p className="text-sm text-muted-foreground mb-4">"{rejectModal.title}"</p>
              <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={3}
                placeholder="Reason (optional — shown to author)..."
                className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground resize-none mb-4 focus:outline-none" />
              <div className="flex gap-3">
                <Button onClick={reject} variant="destructive" className="font-heading tracking-wider uppercase flex-1">Reject</Button>
                <Button onClick={() => { setRejectModal(null); setRejectReason(''); }} variant="outline" className="font-heading tracking-wider uppercase flex-1">Cancel</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
