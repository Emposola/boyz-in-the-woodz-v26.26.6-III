/* ============================================================
   ADMIN BLOG MANAGER — Approve/reject/edit posts
   URL: /admin/blog
   ============================================================ */
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/supabaseClient';
import { motion } from 'framer-motion';
import { Check, X, Eye, Edit, Trash2, Star, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const FG = '#2D5A27';
const STATUS_COLORS = { published: 'bg-green-900/40 text-green-400', pending: 'bg-yellow-900/40 text-yellow-400', rejected: 'bg-red-900/40 text-red-400', draft: 'bg-secondary text-muted-foreground' };

export default function AdminBlog() {
  const [statusFilter, setStatusFilter] = useState('pending');
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const qc = useQueryClient();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['admin-blog', statusFilter],
    queryFn: () => statusFilter === 'all'
      ? api.asServiceRole?.entities?.BlogPost?.list('-created_date', 50) ?? api.entities.BlogPost.list('-created_date', 50)
      : api.entities.BlogPost.filter({ status: statusFilter }, '-created_date', 50),
  });

  const updatePost = useMutation({
    mutationFn: ({ id, data }) => api.entities.BlogPost.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-blog'] }); toast.success('Post updated'); },
  });

  const deletePost = useMutation({
    mutationFn: (id) => api.entities.BlogPost.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-blog'] }); toast.success('Post deleted'); },
  });

  const approve = (post) => updatePost.mutate({ id: post.id, data: { status: 'published', featured: false } });
  const setFeatured = (post) => updatePost.mutate({ id: post.id, data: { featured: !post.featured } });
  const reject = () => {
    updatePost.mutate({ id: rejectModal.id, data: { status: 'rejected', rejection_reason: rejectReason } });
    setRejectModal(null); setRejectReason('');
  };

  const STATUSES = ['pending', 'published', 'rejected', 'draft', 'all'];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl tracking-wide uppercase">Blog Manager</h1>
            <p className="text-muted-foreground text-sm mt-1">Review, approve, and manage community posts</p>
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {STATUSES.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-4 py-1.5 rounded-full text-xs font-heading tracking-wider uppercase transition-all ${statusFilter === s ? 'text-white' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
              style={statusFilter === s ? { background: FG } : {}}>
              {s === 'all' ? 'All Posts' : s}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-16 text-muted-foreground">Loading posts...</div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-xl p-5 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span className={`text-[10px] font-heading tracking-wider uppercase px-2 py-0.5 rounded-full ${STATUS_COLORS[post.status] || STATUS_COLORS.draft}`}>
                      {post.status}
                    </span>
                    {post.featured && (
                      <span className="text-[10px] font-heading tracking-wider uppercase px-2 py-0.5 rounded-full bg-yellow-900/40 text-yellow-400">Featured</span>
                    )}
                    <span className="text-xs text-muted-foreground">{post.category}</span>
                  </div>
                  <h3 className="font-heading text-base tracking-wider uppercase truncate">{post.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{post.excerpt || post.body?.slice(0, 120)}</p>
                  {post.rejection_reason && (
                    <p className="text-xs text-red-400 mt-1">Rejected: {post.rejection_reason}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => setFeatured(post)} title="Toggle Featured"
                    className={`p-1.5 rounded-lg transition-colors ${post.featured ? 'text-yellow-400' : 'text-muted-foreground hover:text-yellow-400'}`}>
                    <Star className={`w-4 h-4 ${post.featured ? 'fill-current' : ''}`} />
                  </button>
                  {post.status === 'pending' && (
                    <>
                      <Button onClick={() => approve(post)} size="sm" className="font-heading tracking-wider uppercase text-xs h-8" style={{ background: FG }}>
                        <Check className="w-3.5 h-3.5" />
                      </Button>
                      <Button onClick={() => setRejectModal(post)} size="sm" variant="destructive" className="font-heading tracking-wider uppercase text-xs h-8">
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </>
                  )}
                  {post.status === 'published' && (
                    <Button onClick={() => updatePost.mutate({ id: post.id, data: { status: 'draft' } })} size="sm" variant="outline"
                      className="font-heading tracking-wider uppercase text-xs h-8">
                      Unpublish
                    </Button>
                  )}
                  <button onClick={() => deletePost.mutate(post.id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
            {posts.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <p className="font-heading tracking-wider uppercase">No {statusFilter} posts</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full">
            <h3 className="font-heading text-xl tracking-wider uppercase mb-2">Reject Post</h3>
            <p className="text-sm text-muted-foreground mb-4">"{rejectModal.title}"</p>
            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={3}
              placeholder="Reason for rejection (sent to the author)..."
              className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground resize-none mb-4 focus:outline-none" />
            <div className="flex gap-3">
              <Button onClick={reject} variant="destructive" className="font-heading tracking-wider uppercase flex-1">Reject Post</Button>
              <Button onClick={() => { setRejectModal(null); setRejectReason(''); }} variant="outline" className="font-heading tracking-wider uppercase flex-1">Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}