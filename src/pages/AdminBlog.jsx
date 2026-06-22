/* ============================================================
   ADMIN BLOG MANAGER — Approve/reject/edit/create posts
   ============================================================ */
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Star, Trash2, Plus, Save, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const FG = '#2D5A27';
const STATUS_COLORS = {
  published: 'bg-green-900/40 text-green-400 border-green-800/40',
  pending:   'bg-yellow-900/40 text-yellow-400 border-yellow-800/40',
  rejected:  'bg-red-900/40 text-red-400 border-red-800/40',
  draft:     'bg-secondary text-muted-foreground border-border',
};

const CATEGORIES = ['brotherhood', 'mental-health', 'nature', 'retreats', 'guest', 'general'];

const EMPTY_POST = {
  title: '', slug: '', excerpt: '', body: '',
  image_url: '', category: 'general', status: 'published',
  featured: false, author_name: 'Admin',
};

function PostForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial || EMPTY_POST);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // auto-generate slug from title
  const handleTitleChange = (val) => {
    set('title', val);
    if (!initial?.id) {
      set('slug', val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <h3 className="font-heading text-base tracking-wider uppercase">
        {initial?.id ? 'Edit Post' : 'New Post'}
      </h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Title *</label>
          <Input value={form.title} onChange={e => handleTitleChange(e.target.value)}
            placeholder="Post title..." className="bg-secondary border-border" />
        </div>
        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Slug</label>
          <Input value={form.slug || ''} onChange={e => set('slug', e.target.value)}
            placeholder="post-url-slug" className="bg-secondary border-border" />
        </div>
        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Author</label>
          <Input value={form.author_name || ''} onChange={e => set('author_name', e.target.value)}
            placeholder="Author name" className="bg-secondary border-border" />
        </div>
        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Category</label>
          <select value={form.category || 'general'} onChange={e => set('category', e.target.value)}
            className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Status</label>
          <select value={form.status || 'published'} onChange={e => set('status', e.target.value)}
            className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground">
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending Review</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Image URL</label>
          <Input value={form.image_url || ''} onChange={e => set('image_url', e.target.value)}
            placeholder="https://..." className="bg-secondary border-border" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Excerpt</label>
          <textarea value={form.excerpt || ''} onChange={e => set('excerpt', e.target.value)}
            rows={2} placeholder="Short summary..." className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-ring" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Body *</label>
          <textarea value={form.body || ''} onChange={e => set('body', e.target.value)}
            rows={8} placeholder="Post content..." className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-ring font-mono" />
        </div>
        <div>
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="accent-primary" />
            Featured post
          </label>
        </div>
      </div>
      <div className="flex gap-3 pt-3 border-t border-border">
        <Button onClick={() => onSave(form)} disabled={saving}
          className="font-heading tracking-wider uppercase gap-2 flex-1" style={{ background: FG }}>
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Post'}
        </Button>
        <Button onClick={onCancel} variant="outline" className="font-heading tracking-wider uppercase">Cancel</Button>
      </div>
    </div>
  );
}

export default function AdminBlog() {
  const [statusFilter, setStatusFilter] = useState('pending');
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const qc = useQueryClient();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['admin-blog', statusFilter],
    queryFn: async () => {
      let q = supabase.from('blog_posts').select('*').order('created_date', { ascending: false });
      if (statusFilter !== 'all') q = q.eq('status', statusFilter);
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },
  });

  const { data: counts = {} } = useQuery({
    queryKey: ['admin-blog-counts'],
    queryFn: async () => {
      const { data } = await supabase.from('blog_posts').select('status');
      const c = { all: data?.length || 0 };
      data?.forEach(r => { c[r.status] = (c[r.status] || 0) + 1; });
      return c;
    },
  });

  const savePost = useMutation({
    mutationFn: async (form) => {
      if (!form.title || !form.body) throw new Error('Title and body are required');
      if (form.id) {
        const { id, created_date, ...rest } = form;
        const { error } = await supabase.from('blog_posts').update(rest).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('blog_posts').insert(form);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-blog'] });
      qc.invalidateQueries({ queryKey: ['admin-blog-counts'] });
      toast.success('Post saved');
      setShowForm(false);
      setEditingPost(null);
    },
    onError: (e) => toast.error(e.message),
  });

  const updatePost = useMutation({
    mutationFn: async ({ id, data }) => {
      const { error } = await supabase.from('blog_posts').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-blog'] });
      qc.invalidateQueries({ queryKey: ['admin-blog-counts'] });
      toast.success('Post updated');
    },
    onError: (e) => toast.error(e.message),
  });

  const deletePost = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-blog'] });
      qc.invalidateQueries({ queryKey: ['admin-blog-counts'] });
      toast.success('Post deleted');
    },
    onError: (e) => toast.error(e.message),
  });

  const reject = () => {
    updatePost.mutate({ id: rejectModal.id, data: { status: 'rejected', rejection_reason: rejectReason } });
    setRejectModal(null);
    setRejectReason('');
  };

  const FILTERS = [
    { key: 'pending',   label: `Pending (${counts.pending || 0})` },
    { key: 'published', label: `Published (${counts.published || 0})` },
    { key: 'rejected',  label: `Rejected (${counts.rejected || 0})` },
    { key: 'draft',     label: `Draft (${counts.draft || 0})` },
    { key: 'all',       label: `All (${counts.all || 0})` },
  ];

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-heading text-3xl tracking-wide uppercase text-foreground flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-primary" /> Blog Manager
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Review, approve, and create posts</p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditingPost(null); }}
          className="font-heading tracking-wider uppercase text-xs gap-2" style={{ background: FG }}>
          <Plus className="w-4 h-4" /> New Post
        </Button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {(showForm || editingPost) && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} className="mb-6">
            <PostForm
              initial={editingPost}
              onSave={(form) => savePost.mutate(form)}
              onCancel={() => { setShowForm(false); setEditingPost(null); }}
              saving={savePost.isPending}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status filter */}
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
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map(post => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-xl p-5 flex items-start gap-4">
              {post.image_url && (
                <img src={post.image_url} alt={post.title}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0 hidden sm:block border border-border" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-[10px] font-heading tracking-wider uppercase px-2 py-0.5 rounded-full border ${STATUS_COLORS[post.status] || STATUS_COLORS.draft}`}>
                    {post.status}
                  </span>
                  {post.featured && (
                    <span className="text-[10px] font-heading tracking-wider uppercase px-2 py-0.5 rounded-full bg-yellow-900/40 text-yellow-400 border border-yellow-800/40">Featured</span>
                  )}
                  <span className="text-xs text-muted-foreground">{post.category}</span>
                  <span className="text-xs text-muted-foreground">· {post.author_name}</span>
                </div>
                <h3 className="font-medium text-sm truncate">{post.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{post.excerpt || post.body?.slice(0, 100)}</p>
                {post.rejection_reason && (
                  <p className="text-xs text-red-400 mt-1">Rejected: {post.rejection_reason}</p>
                )}
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap">
                <button onClick={() => updatePost.mutate({ id: post.id, data: { featured: !post.featured } })}
                  title="Toggle featured"
                  className={`p-1.5 rounded-lg transition-colors ${post.featured ? 'text-yellow-400' : 'text-muted-foreground hover:text-yellow-400'}`}>
                  <Star className={`w-4 h-4 ${post.featured ? 'fill-current' : ''}`} />
                </button>
                {post.status === 'pending' && (
                  <>
                    <Button onClick={() => updatePost.mutate({ id: post.id, data: { status: 'published' } })}
                      size="sm" className="font-heading tracking-wider uppercase text-xs h-8 gap-1" style={{ background: FG }}>
                      <Check className="w-3.5 h-3.5" /> Approve
                    </Button>
                    <Button onClick={() => setRejectModal(post)} size="sm" variant="destructive"
                      className="font-heading tracking-wider uppercase text-xs h-8 gap-1">
                      <X className="w-3.5 h-3.5" /> Reject
                    </Button>
                  </>
                )}
                {post.status === 'published' && (
                  <Button onClick={() => updatePost.mutate({ id: post.id, data: { status: 'draft' } })}
                    size="sm" variant="outline" className="font-heading tracking-wider uppercase text-xs h-8">
                    Unpublish
                  </Button>
                )}
                <button onClick={() => { setEditingPost(post); setShowForm(false); }}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                  <Save className="w-4 h-4" />
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

      {/* Reject Modal */}
      <AnimatePresence>
        {rejectModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-2xl p-6 max-w-md w-full">
              <h3 className="font-heading text-xl tracking-wider uppercase mb-2">Reject Post</h3>
              <p className="text-sm text-muted-foreground mb-4">"{rejectModal.title}"</p>
              <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={3}
                placeholder="Reason for rejection (optional — sent to author)..."
                className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground resize-none mb-4 focus:outline-none focus:ring-1 focus:ring-ring" />
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
