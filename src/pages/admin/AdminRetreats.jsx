/* ============================================================
   ADMIN RETREATS — Manage retreat events + review applications
   ============================================================ */
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import {
  Trees, Plus, Pencil, Trash2, Check, X, Eye,
  MapPin, Calendar, Users, ChevronDown, ChevronUp, Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

const FG = '#2D5A27';
const TABS = ['applications', 'events'];

const APP_STATUS_COLORS = {
  pending:  'bg-yellow-900/40 text-yellow-400 border-yellow-800/40',
  approved: 'bg-green-900/40 text-green-400 border-green-800/40',
  waitlist: 'bg-blue-900/40 text-blue-400 border-blue-800/40',
  rejected: 'bg-red-900/40 text-red-400 border-red-800/40',
};

const EMPTY_EVENT = {
  title: '', type: 'retreat', location_name: '', start_date: '',
  spots_remaining: 12, capacity: 12, active: true, featured: false,
  full_price: 297, deposit_amount: 100, difficulty: 'Easy',
  duration: '2-day', description: '', image_url: '',
};

/* ── Application Row ─────────────────────────────────────── */
function AppRow({ app, onUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const r = app.responses || {};

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Summary row */}
      <div className="px-5 py-4 flex items-center gap-4 cursor-pointer hover:bg-white/2 transition-colors"
        onClick={() => setExpanded(e => !e)}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <p className="font-medium text-sm">{r.user_name || 'Unknown'}</p>
            <span className={`text-[10px] font-heading tracking-wider uppercase px-2 py-0.5 rounded-full border ${APP_STATUS_COLORS[app.status] || APP_STATUS_COLORS.pending}`}>
              {app.status}
            </span>
            {r.waitlist_position && app.status === 'waitlist' && (
              <span className="text-[10px] text-muted-foreground">#{r.waitlist_position} on waitlist</span>
            )}
            {app.payment_pending && !app.deposit_paid && (
              <span className="text-[10px] font-heading tracking-wider uppercase px-2 py-0.5 rounded-full bg-orange-900/40 text-orange-400 border border-orange-800/40">
                Payment Pending
              </span>
            )}
            {app.deposit_paid && (
              <span className="text-[10px] font-heading tracking-wider uppercase px-2 py-0.5 rounded-full bg-green-900/40 text-green-400 border border-green-800/40">
                Deposit Paid ✓
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{r.location_name || '—'}</span>
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{r.requested_date || '—'}</span>
            <span>{r.user_email}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <p className="text-[10px] text-muted-foreground hidden sm:block">
            {app.created_date ? format(new Date(app.created_date), 'MMM d, yyyy') : ''}
          </p>
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="px-5 pb-5 border-t border-border pt-4">
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-[10px] font-heading tracking-wider uppercase text-muted-foreground mb-1">Emergency Contact</p>
                  <p className="text-sm">{r.emergency_contact_name || '—'}</p>
                  <p className="text-xs text-muted-foreground">{r.emergency_contact_phone || ''}</p>
                </div>
                <div>
                  <p className="text-[10px] font-heading tracking-wider uppercase text-muted-foreground mb-1">Medical Notes</p>
                  <p className="text-sm">{r.medical_notes || 'None provided'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-heading tracking-wider uppercase text-muted-foreground mb-1">The Code</p>
                  <p className="text-sm">{r.code_accepted ? '✓ Accepted all items' : '✗ Not accepted'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-heading tracking-wider uppercase text-muted-foreground mb-1">Waiver</p>
                  <p className="text-sm">{r.waiver_signed ? `Signed ${r.waiver_signed_date ? format(new Date(r.waiver_signed_date), 'MMM d') : ''}` : 'Not signed'}</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2">
                {app.payment_pending && !app.deposit_paid && (
                  <Button onClick={() => onUpdate(app.id, 'deposit_paid')} size="sm"
                    className="font-heading tracking-wider uppercase text-xs gap-1.5 bg-orange-600 hover:bg-orange-500 text-white">
                    ✓ Mark Deposit Paid
                  </Button>
                )}
                {app.status !== 'approved' && (
                  <Button onClick={() => onUpdate(app.id, 'approved')} size="sm"
                    className="font-heading tracking-wider uppercase text-xs gap-1.5" style={{ background: FG }}>
                    <Check className="w-3.5 h-3.5" /> Approve
                  </Button>
                )}
                {app.status !== 'waitlist' && (
                  <Button onClick={() => onUpdate(app.id, 'waitlist')} size="sm" variant="outline"
                    className="font-heading tracking-wider uppercase text-xs gap-1.5">
                    <Users className="w-3.5 h-3.5" /> Waitlist
                  </Button>
                )}
                {app.status !== 'rejected' && (
                  <Button onClick={() => onUpdate(app.id, 'rejected')} size="sm" variant="destructive"
                    className="font-heading tracking-wider uppercase text-xs gap-1.5">
                    <X className="w-3.5 h-3.5" /> Reject
                  </Button>
                )}
                {app.status !== 'pending' && (
                  <Button onClick={() => onUpdate(app.id, 'pending')} size="sm" variant="outline"
                    className="font-heading tracking-wider uppercase text-xs">
                    Reset to Pending
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Event Form ──────────────────────────────────────────── */
function EventForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY_EVENT);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Title *</label>
          <Input value={form.title} onChange={e => set('title', e.target.value)}
            placeholder="Broken Bow Fall Retreat" className="bg-secondary border-border" />
        </div>
        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Location</label>
          <Input value={form.location_name} onChange={e => set('location_name', e.target.value)}
            placeholder="Broken Bow, OK" className="bg-secondary border-border" />
        </div>
        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Start Date *</label>
          <Input type="datetime-local" value={form.start_date?.slice(0, 16) || ''}
            onChange={e => set('start_date', new Date(e.target.value).toISOString())}
            className="bg-secondary border-border" />
        </div>
        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Full Price ($) *</label>
          <Input type="number" min="0" step="1" value={form.full_price || ''}
            onChange={e => set('full_price', parseFloat(e.target.value) || 0)}
            placeholder="297" className="bg-secondary border-border" />
        </div>
        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Deposit Amount ($) *</label>
          <Input type="number" min="0" step="1" value={form.deposit_amount || ''}
            onChange={e => set('deposit_amount', parseFloat(e.target.value) || 0)}
            placeholder="100" className="bg-secondary border-border" />
          {form.full_price > 0 && form.deposit_amount > 0 && (
            <p className="text-[10px] text-muted-foreground mt-1">
              Balance due on approval: ${(form.full_price - form.deposit_amount).toFixed(0)}
            </p>
          )}
        </div>
        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Capacity</label>
          <Input type="number" min="1" value={form.capacity || form.spots_remaining || ''}
            onChange={e => { const v = parseInt(e.target.value) || 0; set('capacity', v); set('spots_remaining', v); }}
            className="bg-secondary border-border" />
        </div>
        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Spots Remaining</label>
          <Input type="number" min="0" value={form.spots_remaining ?? ''}
            onChange={e => set('spots_remaining', parseInt(e.target.value) || 0)}
            className="bg-secondary border-border" />
        </div>
        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Difficulty</label>
          <select value={form.difficulty || 'Easy'} onChange={e => set('difficulty', e.target.value)}
            className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground">
            <option value="Easy">Easy</option>
            <option value="Moderate">Moderate</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Duration</label>
          <select value={form.duration || '2-day'} onChange={e => set('duration', e.target.value)}
            className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground">
            <option value="2-day">2-Day (Weekend Reset)</option>
            <option value="3-day">3-Day (Deep Dive)</option>
            <option value="5-day">5-Day (Expedition)</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Type</label>
          <select value={form.type || 'retreat'} onChange={e => set('type', e.target.value)}
            className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground">
            <option value="retreat">Retreat</option>
            <option value="event">Event</option>
            <option value="workshop">Workshop</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Image URL</label>
          <Input value={form.image_url || ''} onChange={e => set('image_url', e.target.value)}
            placeholder="https://images.unsplash.com/..." className="bg-secondary border-border" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Description</label>
          <textarea value={form.description || ''} onChange={e => set('description', e.target.value)}
            rows={2} placeholder="What makes this retreat special..."
            className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-ring" />
        </div>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} className="accent-primary" />
            Active
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="accent-primary" />
            Featured
          </label>
        </div>
      </div>
      <div className="flex gap-3 pt-2 border-t border-border">
        <Button onClick={() => onSave(form)} className="font-heading tracking-wider uppercase gap-2 flex-1" style={{ background: FG }}>
          <Save className="w-4 h-4" /> Save Event
        </Button>
        <Button onClick={onCancel} variant="outline" className="font-heading tracking-wider uppercase">Cancel</Button>
      </div>
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────── */
export default function AdminRetreats() {
  const [tab, setTab] = useState('applications');
  const [appStatusFilter, setAppStatusFilter] = useState('pending');
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const qc = useQueryClient();

  /* Applications */
  const { data: applications = [], isLoading: appsLoading } = useQuery({
    queryKey: ['admin-retreat-apps', appStatusFilter],
    queryFn: async () => {
      let q = supabase.from('retreat_applications')
        .select('*')
        .order('created_date', { ascending: false });
      if (appStatusFilter !== 'all') q = q.eq('status', appStatusFilter);
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },
  });

  /* Events */
  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['admin-retreat-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  /* Counts per status */
  const { data: appCounts = {} } = useQuery({
    queryKey: ['admin-retreat-app-counts'],
    queryFn: async () => {
      const { data } = await supabase
        .from('retreat_applications')
        .select('status');
      const counts = { all: data?.length || 0 };
      data?.forEach(r => { counts[r.status] = (counts[r.status] || 0) + 1; });
      return counts;
    },
  });

  const updateApp = useMutation({
    mutationFn: async ({ id, status }) => {
      if (status === 'deposit_paid') {
        const { error } = await supabase
          .from('retreat_applications')
          .update({ deposit_paid: true, payment_pending: false })
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('retreat_applications')
          .update({ status })
          .eq('id', id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-retreat-apps'] });
      qc.invalidateQueries({ queryKey: ['admin-retreat-app-counts'] });
      qc.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
      toast({ title: 'Application updated' });
    },
    onError: (e) => toast({ variant: 'destructive', title: 'Error', description: e.message }),
  });

  const durationDays = { '2-day': 2, '3-day': 3, '5-day': 5 };

  const saveEvent = useMutation({
    mutationFn: async (form) => {
      if (!form.title || !form.start_date) throw new Error('Title and date are required');
      const start = new Date(form.start_date);
      const days = durationDays[form.duration] || 2;
      const endDate = new Date(start.getTime() + days * 86400000).toISOString();
      const payload = { ...form, end_date: endDate, spots_remaining: form.spots_remaining ?? form.capacity ?? 0 };
      if (form.id) {
        const { error } = await supabase.from('events').update(payload).eq('id', form.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('events').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-retreat-events'] });
      toast({ title: 'Event saved' });
      setShowEventForm(false);
      setEditingEvent(null);
    },
    onError: (e) => toast({ variant: 'destructive', title: 'Error', description: e.message }),
  });

  const deleteEvent = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-retreat-events'] });
      toast({ title: 'Event deleted' });
    },
    onError: (e) => toast({ variant: 'destructive', title: 'Error', description: e.message }),
  });

  const APP_FILTERS = [
    { key: 'pending',  label: `Pending (${appCounts.pending || 0})` },
    { key: 'approved', label: `Approved (${appCounts.approved || 0})` },
    { key: 'waitlist', label: `Waitlist (${appCounts.waitlist || 0})` },
    { key: 'rejected', label: `Rejected (${appCounts.rejected || 0})` },
    { key: 'all',      label: `All (${appCounts.all || 0})` },
  ];

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-heading text-3xl tracking-wide uppercase text-foreground flex items-center gap-2">
            <Trees className="w-7 h-7 text-primary" /> Retreats
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Manage retreat events and review applications</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-secondary rounded-xl mb-6 w-fit">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-heading tracking-wider uppercase transition-all ${
              tab === t ? 'text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
            style={tab === t ? { background: FG } : {}}>
            {t}
          </button>
        ))}
      </div>

      {/* ── APPLICATIONS TAB ── */}
      {tab === 'applications' && (
        <div>
          {/* Status filter pills */}
          <div className="flex gap-2 flex-wrap mb-5">
            {APP_FILTERS.map(f => (
              <button key={f.key} onClick={() => setAppStatusFilter(f.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-heading tracking-wider uppercase border transition-all ${
                  appStatusFilter === f.key
                    ? 'text-white border-transparent'
                    : 'border-border text-muted-foreground hover:border-primary/40'
                }`}
                style={appStatusFilter === f.key ? { background: FG } : {}}>
                {f.label}
              </button>
            ))}
          </div>

          {appsLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Trees className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p className="font-heading tracking-wider uppercase text-sm">No {appStatusFilter} applications</p>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map(app => (
                <AppRow key={app.id} app={app}
                  onUpdate={(id, status) => updateApp.mutate({ id, status })} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── EVENTS TAB ── */}
      {tab === 'events' && (
        <div>
          <div className="flex justify-end mb-4">
            <Button onClick={() => { setShowEventForm(true); setEditingEvent(null); }}
              className="font-heading tracking-wider uppercase text-xs gap-2" style={{ background: FG }}>
              <Plus className="w-4 h-4" /> New Event
            </Button>
          </div>

          <AnimatePresence>
            {(showEventForm || editingEvent) && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} className="mb-5">
                <EventForm
                  initial={editingEvent}
                  onSave={(form) => saveEvent.mutate(form)}
                  onCancel={() => { setShowEventForm(false); setEditingEvent(null); }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {eventsLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Calendar className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p className="font-heading tracking-wider uppercase text-sm">No events yet</p>
              <p className="text-xs mt-1">Create your first retreat event above</p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map(ev => (
                <div key={ev.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-medium text-sm">{ev.title}</p>
                      {ev.featured && (
                        <span className="text-[10px] font-heading tracking-wider uppercase px-2 py-0.5 rounded-full bg-yellow-900/40 text-yellow-400">Featured</span>
                      )}
                      <span className={`text-[10px] font-heading tracking-wider uppercase px-2 py-0.5 rounded-full ${ev.active ? 'bg-green-900/40 text-green-400' : 'bg-secondary text-muted-foreground'}`}>
                        {ev.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
<span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{ev.location_name || '—'}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />
                        {ev.start_date ? format(new Date(ev.start_date), 'MMM d, yyyy') : '—'}
                      </span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{ev.spots_remaining ?? 0} spots</span>
                      {ev.full_price > 0 && (
                        <span className="font-heading" style={{ color: FG }}>${ev.full_price} (${ev.deposit_amount ?? 0} deposit)</span>
                      )}
                      {ev.difficulty && <span>{ev.difficulty} · {ev.duration}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => { setEditingEvent(ev); setShowEventForm(false); }}
                      className="p-1.5 text-muted-foreground hover:text-primary rounded-lg hover:bg-primary/10 transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => {
                      if (confirm(`Delete "${ev.title}"?`)) deleteEvent.mutate(ev.id);
                    }} className="p-1.5 text-muted-foreground hover:text-red-400 rounded-lg hover:bg-red-400/10 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
