/* ============================================================
   WALK-IN WAITLIST (LIVE) — Real-time queue position
   User enters name/phone → sees live position in queue
   ============================================================ */
import React, { useState, useEffect } from 'react';
import { api } from '@/api/supabaseClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Clock, Users, Phone, ArrowRight, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

const SERVICES = ['Haircut', 'Beard Trim', 'Hot Towel Shave', "Kid's Cut", 'VIP Package'];

export default function WalkInWaitlistLive() {
  const [form, setForm] = useState({ name: '', phone_number: '', service_requested: 'Haircut', sms_opted_in: true });
  const [myEntry, setMyEntry] = useState(() => {
    const saved = localStorage.getItem('bitw_walkin');
    return saved ? JSON.parse(saved) : null;
  });
  const qc = useQueryClient();

  /* --- Fetch current queue --- */
  const { data: queue, isLoading } = useQuery({
    queryKey: ['waitlist-queue'],
    queryFn: () => api.entities.WaitlistQueue.filter({ status: 'waiting' }, 'created_date', 50),
    initialData: [],
    refetchInterval: 15000, // poll every 15s
  });

  /* --- Subscribe to real-time updates --- */
  useEffect(() => {
    const unsub = api.entities.WaitlistQueue.subscribe(() => {
      qc.invalidateQueries({ queryKey: ['waitlist-queue'] });
    });
    return unsub;
  }, [qc]);

  /* --- Join waitlist --- */
  const joinMutation = useMutation({
    mutationFn: () => api.entities.WaitlistQueue.create({
      ...form,
      position: queue.length + 1,
      estimated_wait_minutes: (queue.length + 1) * 20,
    }),
    onSuccess: (data) => {
      setMyEntry(data);
      localStorage.setItem('bitw_walkin', JSON.stringify(data));
      toast.success("You're on the list! We'll text you when ready.");
      qc.invalidateQueries({ queryKey: ['waitlist-queue'] });
    },
  });

  /* --- Leave queue --- */
  const leaveMutation = useMutation({
    mutationFn: () => api.entities.WaitlistQueue.update(myEntry.id, { status: 'left' }),
    onSuccess: () => {
      setMyEntry(null);
      localStorage.removeItem('bitw_walkin');
      toast.success('Removed from queue.');
      qc.invalidateQueries({ queryKey: ['waitlist-queue'] });
    },
  });

  /* --- Compute my position in live queue --- */
  const myPosition = myEntry ? queue.findIndex(q => q.id === myEntry.id) + 1 : null;
  const waitMins = myPosition ? myPosition * 20 : null;

  /* --- If I'm already in the queue, show status card --- */
  if (myEntry && myPosition !== null && myPosition > 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border border-border rounded-xl p-8 max-w-sm w-full text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
            <span className="font-heading text-4xl">{myPosition}</span>
          </div>
          <h2 className="font-heading text-2xl tracking-wider uppercase">Position in Queue</h2>
          <p className="text-sm text-muted-foreground mt-1">{myEntry.name} · {myEntry.service_requested}</p>
          <div className="mt-4 flex items-center justify-center gap-1 text-muted-foreground text-sm">
            <Clock className="w-4 h-4" />
            <span>~{waitMins} min estimated wait</span>
          </div>
          <div className="mt-4 flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <Users className="w-3.5 h-3.5" />
            <span>{queue.length} people ahead in total queue</span>
          </div>
          {myEntry.sms_opted_in && (
            <p className="text-xs text-primary mt-3">📱 We'll text {myEntry.phone_number} when you're up</p>
          )}
          <div className="mt-6 space-y-2">
            <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => qc.invalidateQueries({ queryKey: ['waitlist-queue'] })}>
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh Position
            </Button>
            <Button variant="destructive" size="sm" className="w-full text-xs" onClick={() => leaveMutation.mutate()}>
              <XCircle className="w-3.5 h-3.5 mr-1.5" /> Leave Queue
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (myEntry && myPosition === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <CheckCircle className="w-16 h-16 text-primary mb-4" />
        <h2 className="font-heading text-3xl tracking-wide uppercase">It's Your Turn!</h2>
        <p className="text-muted-foreground text-sm mt-2">Head to the chair — your barber is ready.</p>
        <Button className="mt-6 font-heading tracking-wider uppercase" onClick={() => { setMyEntry(null); localStorage.removeItem('bitw_walkin'); }}>Done</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* --- Hero --- */}
      <section className="py-14 bg-secondary/30 text-center">
        <Clock className="w-8 h-8 text-accent mx-auto mb-3" />
        <h1 className="font-heading text-4xl md:text-5xl tracking-wide uppercase">Walk-In Waitlist</h1>
        <p className="text-muted-foreground text-sm mt-2">
          {isLoading ? 'Loading queue...' : `${queue.length} ${queue.length === 1 ? 'person' : 'people'} currently waiting`}
        </p>
      </section>

      {/* --- Queue Overview --- */}
      {queue.length > 0 && (
        <section className="max-w-2xl mx-auto px-4 pt-8">
          <h3 className="font-heading text-sm tracking-wider uppercase text-muted-foreground mb-3">Current Queue</h3>
          <div className="space-y-2">
            {queue.slice(0, 5).map((entry, i) => (
              <div key={entry.id} className="bg-card border border-border rounded-lg p-3 flex items-center gap-3">
                <span className="font-heading text-2xl text-primary w-8">{i + 1}</span>
                <div className="flex-1">
                  <span className="text-sm font-medium">{entry.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">{entry.service_requested}</span>
                </div>
                <span className="text-xs text-muted-foreground">~{(i + 1) * 20}m</span>
              </div>
            ))}
            {queue.length > 5 && <p className="text-xs text-muted-foreground text-center">+{queue.length - 5} more in queue</p>}
          </div>
        </section>
      )}

      {/* --- Join Form --- */}
      <section className="max-w-md mx-auto px-4 py-8 pb-16">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-heading text-lg tracking-wider uppercase mb-5">Join the Queue</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider">Your Name</label>
              <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="First name" className="mt-1 bg-secondary" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider">Phone Number</label>
              <Input value={form.phone_number} onChange={e => setForm(p => ({ ...p, phone_number: e.target.value }))} placeholder="(555) 000-0000" className="mt-1 bg-secondary" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider">Service</label>
              <select value={form.service_requested} onChange={e => setForm(p => ({ ...p, service_requested: e.target.value }))}
                className="mt-1 w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground">
                {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.sms_opted_in} onChange={e => setForm(p => ({ ...p, sms_opted_in: e.target.checked }))} className="rounded" />
              <span className="text-muted-foreground text-xs">Text me when my turn is up</span>
            </label>
            <Button
              className="w-full font-heading tracking-wider uppercase"
              disabled={!form.name || !form.phone_number || joinMutation.isPending}
              onClick={() => joinMutation.mutate()}
            >
              Join Queue <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}