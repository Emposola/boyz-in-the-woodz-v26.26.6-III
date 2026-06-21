/* ============================================================
   ADMIN STUDIO — Manage live sessions, schedule, upload recordings
   Admin-only dashboard for Brotherhood Studio
   ============================================================ */
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
  Radio, Plus, Pencil, Trash2, Eye, Video, Calendar,
  Clock, Mic, Save, X, CheckCircle2, AlertCircle, Flame,
  ArrowRight, Shield, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const SESSION_TYPES = [
  { value: 'retreat_prep', label: 'Retreat Prep' },
  { value: 'mens_circle', label: "Men's Circle" },
  { value: 'barber_live', label: 'Barber Live' },
  { value: 'campfire_talk', label: 'Campfire Talk' },
  { value: 'q_and_a', label: 'Q&A Session' },
  { value: 'announcement', label: 'Announcement' },
];

const STATUS_CONFIG = {
  live: { label: 'Live Now', color: 'bg-red-900/30 text-red-400 border-red-800/40' },
  upcoming: { label: 'Upcoming', color: 'bg-secondary text-muted-foreground border-border' },
  recorded: { label: 'Recorded', color: 'bg-secondary text-muted-foreground border-border' },
};

const EMPTY_FORM = {
  title: '', description: '', host: '', status: 'upcoming',
  stream_url: '', thumbnail_url: '', session_type: 'campfire_talk',
  scheduled_at: '', duration_minutes: 60, viewer_count: 0,
  featured: false, active: true, tags: [],
};

function SessionForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [tagInput, setTagInput] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addTag = () => {
    if (tagInput.trim() && !form.tags?.includes(tagInput.trim())) {
      set('tags', [...(form.tags || []), tagInput.trim()]);
      setTagInput('');
    }
  };
  const removeTag = (t) => set('tags', (form.tags || []).filter(x => x !== t));

  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Session Title *</label>
          <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Live from Broken Bow..." className="bg-secondary border-border" />
        </div>
        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Host *</label>
          <Input value={form.host} onChange={e => set('host', e.target.value)} placeholder="Coach Mike" className="bg-secondary border-border" />
        </div>
      </div>
      <div>
        <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Description</label>
        <textarea value={form.description} onChange={e => set('description', e.target.value)}
          placeholder="What's happening in this session..." rows={3}
          className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none" />
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Status</label>
          <select value={form.status} onChange={e => set('status', e.target.value)}
            className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
            <option value="upcoming">Upcoming</option>
            <option value="live">Live Now</option>
            <option value="recorded">Recorded</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Session Type</label>
          <select value={form.session_type} onChange={e => set('session_type', e.target.value)}
            className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
            {SESSION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Duration (min)</label>
          <Input type="number" value={form.duration_minutes} onChange={e => set('duration_minutes', +e.target.value)} className="bg-secondary border-border" />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Scheduled At</label>
          <Input type="datetime-local" value={form.scheduled_at?.slice(0, 16) || ''} onChange={e => set('scheduled_at', new Date(e.target.value).toISOString())} className="bg-secondary border-border" />
        </div>
        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Viewer Count</label>
          <Input type="number" value={form.viewer_count} onChange={e => set('viewer_count', +e.target.value)} className="bg-secondary border-border" />
        </div>
      </div>
      <div>
        <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Stream / Embed URL</label>
        <Input value={form.stream_url} onChange={e => set('stream_url', e.target.value)} placeholder="https://www.youtube.com/embed/..." className="bg-secondary border-border" />
        <p className="text-[10px] text-muted-foreground mt-1">Use YouTube, Vimeo, or any iframeable embed URL.</p>
      </div>
      <div>
        <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Thumbnail URL</label>
        <Input value={form.thumbnail_url} onChange={e => set('thumbnail_url', e.target.value)} placeholder="https://images.unsplash.com/..." className="bg-secondary border-border" />
        {form.thumbnail_url && <img src={form.thumbnail_url} alt="thumb" className="mt-2 h-20 rounded-lg object-cover" />}
      </div>
      <div>
        <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Tags</label>
        <div className="flex gap-2">
          <Input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTag()} placeholder="Add tag..." className="bg-secondary border-border" />
          <Button type="button" onClick={addTag} variant="outline" size="sm">Add</Button>
        </div>
        {form.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {form.tags.map(t => (
              <span key={t} className="flex items-center gap-1 bg-secondary text-xs px-2 py-1 rounded-full">
                #{t} <button onClick={() => removeTag(t)} className="text-muted-foreground hover:text-destructive ml-1">×</button>
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer text-sm">
          <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="accent-primary" />
          Featured Session
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-sm">
          <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} className="accent-primary" />
          Active (visible)
        </label>
      </div>
      <div className="flex gap-3 pt-2 border-t border-border">
        <Button onClick={() => onSave(form)} className="font-heading tracking-wider uppercase gap-2 flex-1">
          <Save className="w-4 h-4" /> Save Session
        </Button>
        <Button onClick={onCancel} variant="outline" className="font-heading tracking-wider uppercase">Cancel</Button>
      </div>
    </div>
  );
}

function SessionRow({ session, onEdit, onDelete, onToggleStatus }) {
  const statusCfg = STATUS_CONFIG[session.status] || STATUS_CONFIG.recorded;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-4 flex items-start gap-4 hover:border-primary/30 transition-colors">
      <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-secondary">
        {session.thumbnail_url ? (
          <img src={session.thumbnail_url} alt={session.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><Video className="w-5 h-5 text-muted-foreground/40" /></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className={`text-[9px] font-heading tracking-widest uppercase px-2 py-0.5 rounded-full border ${statusCfg.color}`}>{statusCfg.label}</span>
          <span className="text-[9px] font-heading tracking-wider uppercase text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{session.session_type}</span>
          {session.featured && <span className="text-[9px] font-heading tracking-wider uppercase text-primary bg-primary/10 px-2 py-0.5 rounded-full">Featured</span>}
        </div>
        <h4 className="font-heading text-sm tracking-wide uppercase leading-tight line-clamp-1">{session.title}</h4>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{session.description}</p>
        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-0.5"><Mic className="w-2.5 h-2.5" /> {session.host}</span>
          {session.viewer_count > 0 && <span className="flex items-center gap-0.5"><Eye className="w-2.5 h-2.5" /> {session.viewer_count?.toLocaleString()}</span>}
          {session.scheduled_at && <span className="flex items-center gap-0.5"><Calendar className="w-2.5 h-2.5" /> {format(new Date(session.scheduled_at), 'MMM d, h:mm a')}</span>}
          {session.duration_minutes && <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" /> {session.duration_minutes}m</span>}
        </div>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <select value={session.status}
          onChange={e => onToggleStatus(session, e.target.value)}
          className="text-[10px] bg-secondary border border-border rounded px-2 py-1 font-heading uppercase tracking-wider focus:outline-none">
          <option value="upcoming">Upcoming</option>
          <option value="live">Live</option>
          <option value="recorded">Recorded</option>
        </select>
        <button onClick={() => onEdit(session)} className="p-1.5 text-muted-foreground hover:text-primary rounded-lg hover:bg-primary/10 transition-colors">
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => onDelete(session)} className="p-1.5 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

export default function AdminStudio() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const queryClient = useQueryClient();

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['admin-studio-sessions'],
    queryFn: () => base44.entities.StudioSession.list('-scheduled_at', 100),
  });

  const createMutation = useMutation({
    mutationFn: data => base44.entities.StudioSession.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-studio-sessions'] }); toast.success('Session created!'); setShowForm(false); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.StudioSession.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-studio-sessions'] }); toast.success('Session updated!'); setEditing(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: id => base44.entities.StudioSession.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-studio-sessions'] }); toast.success('Session deleted.'); },
  });

  const handleSave = (form) => {
    if (!form.title || !form.host) { toast.error('Title and Host are required.'); return; }
    if (editing) { updateMutation.mutate({ id: editing.id, data: form }); }
    else { createMutation.mutate(form); }
  };

  const handleEdit = (session) => { setEditing(session); setShowForm(false); };
  const handleDelete = (session) => { if (confirm(`Delete "${session.title}"?`)) deleteMutation.mutate(session.id); };
  const handleToggleStatus = (session, newStatus) => updateMutation.mutate({ id: session.id, data: { status: newStatus } });

  const displayed = filterStatus === 'all' ? sessions : sessions.filter(s => s.status === filterStatus);
  const liveCount = sessions.filter(s => s.status === 'live').length;
  const upcomingCount = sessions.filter(s => s.status === 'upcoming').length;
  const recordedCount = sessions.filter(s => s.status === 'recorded').length;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Radio className="w-5 h-5 text-primary" />
              <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">Admin Dashboard</span>
            </div>
            <h1 className="font-heading text-3xl md:text-4xl tracking-wide uppercase">Studio Manager</h1>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline" className="font-heading tracking-wider uppercase text-xs gap-2">
              <Link to="/studio"><Eye className="w-3.5 h-3.5" /> View Live Page</Link>
            </Button>
            <Button onClick={() => { setShowForm(!showForm); setEditing(null); }} className="font-heading tracking-wider uppercase text-xs gap-2">
              <Plus className="w-4 h-4" /> New Session
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: Radio, color: 'text-red-400', bg: 'bg-red-900/20', v: liveCount, l: 'Live Now' },
            { icon: Calendar, color: 'text-primary', bg: 'bg-primary/10', v: upcomingCount, l: 'Upcoming' },
            { icon: Video, color: 'text-muted-foreground', bg: 'bg-secondary', v: recordedCount, l: 'Recorded' },
          ].map(s => (
            <div key={s.l} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className={`font-heading text-2xl ${s.color}`}>{s.v}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-heading">{s.l}</p>
              </div>
            </div>
          ))}
        </div>

        {/* New Session Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-8">
              <p className="text-xs font-heading tracking-[0.2em] uppercase text-primary mb-3">New Session</p>
              <SessionForm initial={null} onSave={handleSave} onCancel={() => setShowForm(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit form */}
        <AnimatePresence>
          {editing && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-8">
              <p className="text-xs font-heading tracking-[0.2em] uppercase text-primary mb-3">Editing: {editing.title}</p>
              <SessionForm initial={editing} onSave={handleSave} onCancel={() => setEditing(null)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {[
            { v: 'all', l: `All (${sessions.length})` },
            { v: 'live', l: `🔴 Live (${liveCount})` },
            { v: 'upcoming', l: `Upcoming (${upcomingCount})` },
            { v: 'recorded', l: `Recorded (${recordedCount})` },
          ].map(f => (
            <button key={f.v} onClick={() => setFilterStatus(f.v)}
              className={`px-4 py-1.5 rounded-full text-xs font-heading tracking-wider uppercase border transition-all ${filterStatus === f.v ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}>
              {f.l}
            </button>
          ))}
        </div>

        {/* Session list */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Video className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">No sessions yet. Create your first studio session above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayed.map(s => (
              <SessionRow key={s.id} session={s} onEdit={handleEdit} onDelete={handleDelete} onToggleStatus={handleToggleStatus} />
            ))}
          </div>
        )}

        {/* Tips */}
        <div className="mt-10 bg-primary/5 border border-primary/20 rounded-xl p-5">
          <h3 className="font-heading text-sm tracking-wider uppercase text-primary mb-3 flex items-center gap-2"><Shield className="w-4 h-4" /> Studio Tips</h3>
          <ul className="space-y-2 text-xs text-muted-foreground">
            {[
              'Set status to "Live" only when you are actively streaming — this shows the live pulse on the public page.',
              'Paste a YouTube embed URL (youtube.com/embed/VIDEO_ID) for instant playback integration.',
              'Mark a session as "Featured" to pin it as the hero session on the Studio page.',
              'Change status to "Recorded" after a session ends so it becomes part of the archive.',
              'Add tags like "retreat", "barber", "q-and-a" to help with future search filtering.',
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}