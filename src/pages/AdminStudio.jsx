import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
  Radio, Plus, Pencil, Trash2, Eye, Video, Calendar,
  Clock, Mic, Save, CheckCircle2, Shield, Users, Tags, Image
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const FG = '#2D5A27';

const SESSION_TYPES = [
  { value: 'retreat_prep',  label: 'Retreat Prep' },
  { value: 'mens_circle',   label: "Men's Circle" },
  { value: 'barber_live',   label: 'Barber Live' },
  { value: 'campfire_talk', label: 'Campfire Talk' },
  { value: 'q_and_a',       label: 'Q&A Session' },
  { value: 'announcement',  label: 'Announcement' },
];

const STATUS_CONFIG = {
  live:     { label: 'Live Now',  color: 'bg-red-900/30 text-red-400 border-red-800/40' },
  upcoming: { label: 'Upcoming', color: 'bg-secondary text-muted-foreground border-border' },
  recorded: { label: 'Recorded', color: 'bg-secondary text-muted-foreground border-border' },
};

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80);
}

const EMPTY_FORM = {
  title: '', description: '', host_name: '', session_type: 'campfire_talk',
  scheduled_at: '', duration_minutes: 60, meeting_url: '', recording_url: '',
  thumbnail_url: '', max_participants: 100, current_participants: 0,
  viewer_count: 0, featured: false, active: true, slug: '',
};

function SessionForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [status, setStatus] = useState(initial?.status || 'upcoming');
  const [slugEdited, setSlugEdited] = useState(!!initial?.slug);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleTitleChange = (val) => {
    set('title', val);
    if (!slugEdited) set('slug', slugify(val));
  };

  const handleSave = () => {
    if (!form.title || !form.host_name) { toast.error('Title and host are required'); return; }
    if (!form.slug) { toast.error('Slug is required for the session page URL'); return; }
    onSave({ ...form, status });
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <h3 className="font-heading text-base tracking-wider uppercase">
        {initial?.id ? 'Edit Session' : 'New Session'}
      </h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Title *</label>
          <Input value={form.title} onChange={e => handleTitleChange(e.target.value)}
            placeholder="Live from Broken Bow..." className="bg-secondary border-border" />
        </div>
        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Slug *</label>
          <Input value={form.slug} onChange={e => { set('slug', slugify(e.target.value)); setSlugEdited(true); }}
            placeholder="live-from-broken-bow" className="bg-secondary border-border font-mono text-xs" />
          <p className="text-[10px] text-muted-foreground mt-1">URL: /studio/{form.slug || '...'}</p>
        </div>
        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Host *</label>
          <Input value={form.host_name} onChange={e => set('host_name', e.target.value)}
            placeholder="Coach Mike" className="bg-secondary border-border" />
        </div>
        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)}
            className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground">
            <option value="upcoming">Upcoming</option>
            <option value="live">Live Now</option>
            <option value="recorded">Recorded</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Session Type</label>
          <select value={form.session_type} onChange={e => set('session_type', e.target.value)}
            className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground">
            {SESSION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Scheduled At</label>
          <Input type="datetime-local" value={form.scheduled_at?.slice(0, 16) || ''}
            onChange={e => set('scheduled_at', e.target.value ? new Date(e.target.value).toISOString() : '')}
            className="bg-secondary border-border" />
        </div>
        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Duration (min)</label>
          <Input type="number" value={form.duration_minutes}
            onChange={e => set('duration_minutes', parseInt(e.target.value) || 60)}
            className="bg-secondary border-border" />
        </div>
        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Viewer Count</label>
          <Input type="number" value={form.viewer_count || 0}
            onChange={e => set('viewer_count', parseInt(e.target.value) || 0)}
            className="bg-secondary border-border" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Description</label>
          <textarea value={form.description || ''} onChange={e => set('description', e.target.value)}
            rows={2} placeholder="Session description..."
            className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-ring" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block flex items-center gap-1.5">
            <Image className="w-3 h-3" /> Thumbnail Image URL
          </label>
          <Input value={form.thumbnail_url || ''} onChange={e => set('thumbnail_url', e.target.value)}
            placeholder="https://images.unsplash.com/photo-...?w=1200&q=85"
            className="bg-secondary border-border" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Meeting / Stream URL</label>
          <Input value={form.meeting_url || ''} onChange={e => set('meeting_url', e.target.value)}
            placeholder="https://www.youtube.com/embed/... or Zoom/Streamyard link"
            className="bg-secondary border-border" />
          <p className="text-[10px] text-muted-foreground mt-1">Use YouTube embed URL for public playback integration</p>
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Recording URL (after session ends)</label>
          <Input value={form.recording_url || ''} onChange={e => set('recording_url', e.target.value)}
            placeholder="https://www.youtube.com/embed/..."
            className="bg-secondary border-border" />
        </div>
        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Max Participants</label>
          <Input type="number" value={form.max_participants || ''}
            onChange={e => set('max_participants', parseInt(e.target.value) || null)}
            className="bg-secondary border-border" />
        </div>
        <div className="flex items-end gap-6 pb-1">
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="accent-primary" />
            Featured
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} className="accent-primary" />
            Active (visible)
          </label>
        </div>
      </div>
      <div className="flex gap-3 pt-3 border-t border-border">
        <Button onClick={handleSave} disabled={saving}
          className="font-heading tracking-wider uppercase gap-2 flex-1" style={{ background: FG }}>
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Session'}
        </Button>
        <Button onClick={onCancel} variant="outline" className="font-heading tracking-wider uppercase">Cancel</Button>
      </div>
    </div>
  );
}

export default function AdminStudio() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const qc = useQueryClient();

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['admin-studio-sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('studio_sessions')
        .select('*')
        .order('scheduled_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const saveSession = useMutation({
    mutationFn: async (form) => {
      if (form.id) {
        const { id, created_date, ...rest } = form;
        const { error } = await supabase.from('studio_sessions').update({
          ...rest,
          updated_at: new Date().toISOString(),
        }).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('studio_sessions').insert({
          ...form,
          created_date: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-studio-sessions'] });
      toast.success('Session saved');
      setShowForm(false);
      setEditing(null);
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteSession = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('studio_sessions').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-studio-sessions'] });
      toast.success('Session deleted');
    },
    onError: (e) => toast.error(e.message),
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }) => {
      const { error } = await supabase.from('studio_sessions').update({
        status,
        updated_at: new Date().toISOString(),
      }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-studio-sessions'] }),
    onError: (e) => toast.error(e.message),
  });

  const displayed = filterStatus === 'all' ? sessions : sessions.filter(s => s.status === filterStatus);
  const liveCount     = sessions.filter(s => s.status === 'live').length;
  const upcomingCount = sessions.filter(s => s.status === 'upcoming').length;
  const recordedCount = sessions.filter(s => s.status === 'recorded').length;

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-heading text-3xl tracking-wide uppercase text-foreground flex items-center gap-2">
            <Radio className="w-7 h-7 text-primary" /> Studio Manager
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Manage live sessions, schedule, and recordings</p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline" className="font-heading tracking-wider uppercase text-xs gap-2">
            <Link to="/studio"><Eye className="w-3.5 h-3.5" /> View Live Page</Link>
          </Button>
          <Button onClick={() => { setShowForm(!showForm); setEditing(null); }}
            className="font-heading tracking-wider uppercase text-xs gap-2" style={{ background: FG }}>
            <Plus className="w-4 h-4" /> New Session
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { icon: Radio,    color: 'text-red-400',    bg: 'bg-red-900/20',   v: liveCount,     l: 'Live Now' },
          { icon: Calendar, color: 'text-primary',    bg: 'bg-primary/10',   v: upcomingCount, l: 'Upcoming' },
          { icon: Video,    color: 'text-muted-foreground', bg: 'bg-secondary', v: recordedCount, l: 'Recorded' },
        ].map(s => (
          <div key={s.l} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className={`font-heading text-2xl ${s.color}`}>{s.v}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-heading">{s.l}</p>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {(showForm || editing) && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} className="mb-6">
            <SessionForm
              initial={editing}
              onSave={(form) => saveSession.mutate(form)}
              onCancel={() => { setShowForm(false); setEditing(null); }}
              saving={saveSession.isPending}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-2 mb-5 flex-wrap">
        {[
          { v: 'all',      l: `All (${sessions.length})` },
          { v: 'live',     l: `🔴 Live (${liveCount})` },
          { v: 'upcoming', l: `Upcoming (${upcomingCount})` },
          { v: 'recorded', l: `Recorded (${recordedCount})` },
        ].map(f => (
          <button key={f.v} onClick={() => setFilterStatus(f.v)}
            className={`px-4 py-1.5 rounded-full text-xs font-heading tracking-wider uppercase border transition-all ${
              filterStatus === f.v ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/40'
            }`}>
            {f.l}
          </button>
        ))}
      </div>

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
          {displayed.map(s => {
            const statusCfg = STATUS_CONFIG[s.status] || STATUS_CONFIG.recorded;
            return (
              <motion.div key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-xl p-4 flex items-start gap-4 hover:border-primary/30 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-[9px] font-heading tracking-widest uppercase px-2 py-0.5 rounded-full border ${statusCfg.color}`}>
                      {statusCfg.label}
                    </span>
                    <span className="text-[9px] font-heading tracking-wider uppercase text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                      {s.session_type}
                    </span>
                    {s.featured && (
                      <span className="text-[9px] font-heading tracking-wider uppercase text-primary bg-primary/10 px-2 py-0.5 rounded-full">Featured</span>
                    )}
                    {s.slug && (
                      <span className="text-[9px] font-heading tracking-wider uppercase text-muted-foreground/50 px-2 py-0.5 rounded-full font-mono">/{s.slug}</span>
                    )}
                  </div>
                  <h4 className="font-heading text-sm tracking-wide uppercase leading-tight">{s.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{s.description}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-0.5"><Mic className="w-2.5 h-2.5" /> {s.host_name}</span>
                    {s.viewer_count > 0 && (
                      <span className="flex items-center gap-0.5"><Eye className="w-2.5 h-2.5" /> {s.viewer_count?.toLocaleString()}</span>
                    )}
                    {s.scheduled_at && (
                      <span className="flex items-center gap-0.5"><Calendar className="w-2.5 h-2.5" /> {format(new Date(s.scheduled_at), 'MMM d, h:mm a')}</span>
                    )}
                    {s.duration_minutes && (
                      <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" /> {s.duration_minutes}m</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <select value={s.status} onChange={e => updateStatus.mutate({ id: s.id, status: e.target.value })}
                    className="text-[10px] bg-secondary border border-border rounded px-2 py-1 font-heading uppercase tracking-wider focus:outline-none text-foreground">
                    <option value="upcoming">Upcoming</option>
                    <option value="live">Live</option>
                    <option value="recorded">Recorded</option>
                  </select>
                  <button onClick={() => { setEditing(s); setShowForm(false); }}
                    className="p-1.5 text-muted-foreground hover:text-primary rounded-lg hover:bg-primary/10 transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => { if (confirm(`Delete "${s.title}"?`)) deleteSession.mutate(s.id); }}
                    className="p-1.5 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="mt-10 bg-primary/5 border border-primary/20 rounded-xl p-5">
        <h3 className="font-heading text-sm tracking-wider uppercase text-primary mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4" /> Studio Tips
        </h3>
        <ul className="space-y-2 text-xs text-muted-foreground">
          {[
            'Set status to "Live" only when actively streaming — this shows the live pulse on the public page.',
            'Paste a YouTube embed URL (youtube.com/embed/VIDEO_ID) in Meeting URL for instant playback.',
            'After a session ends, paste the recording URL and change status to "Recorded" so it archives.',
            'Mark a session as "Featured" to pin it as the hero on the Studio page.',
            'The slug auto-generates from the title. Edit it manually for custom URLs like /studio/my-session-name.',
            'Add a thumbnail URL for the session card hero image. Unsplash images work great.',
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />{tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
