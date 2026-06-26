import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { Mail, Search, Download, Send, Plus, ChevronRight, Eye, Loader2, Users, FileText, Check, X, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const FG = '#2D5A27';
const EDGE_FN_URL = import.meta.env.VITE_SUPABASE_EDGE_FUNCTIONS_URL
  || 'https://pgwcfazhwuzxcqbqbjat.supabase.co/functions/v1';

function SubscribersTab() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const { data: subscribers = [], isLoading, error: queryError } = useQuery({
    queryKey: ['admin-newsletter-subs', filter],
    queryFn: async () => {
      let q = supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false });
      if (filter === 'active') q = q.eq('active', true);
      if (filter === 'inactive') q = q.eq('active', false);
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },
  });

  const filtered = subscribers.filter(s => {
    if (!search) return true;
    return s.email.toLowerCase().includes(search.toLowerCase());
  });

  const handleExport = () => {
    const csv = ['email,subscribed_date,source,active'];
    filtered.forEach(s => csv.push(`${s.email},${s.created_at || ''},${s.source || ''},${s.active}`));
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'newsletter-subscribers.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search emails..." className="pl-9 bg-secondary border-border" />
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          {[['all', `All (${subscribers.length})`], ['active', `Active (${subscribers.filter(s => s.active).length})`], ['inactive', `Inactive (${subscribers.filter(s => !s.active).length})`]].map(([key, label]) => (
            <button key={key} onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-full text-xs font-heading tracking-wider uppercase border transition-all ${filter === key ? 'text-white border-transparent' : 'border-border text-muted-foreground hover:border-primary/40'}`}
              style={filter === key ? { background: FG } : {}}>{label}</button>
          ))}
          <Button onClick={handleExport} variant="outline" size="sm" className="font-heading tracking-wider uppercase text-xs gap-1.5 ml-2">
            <Download className="w-3.5 h-3.5" /> CSV
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : queryError ? (
        <div className="text-center py-16 text-red-400">
          <p className="font-heading tracking-wider uppercase text-sm mb-1">Failed to load subscribers</p>
          <p className="text-xs text-muted-foreground">{queryError.message}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Mail className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="font-heading tracking-wider uppercase text-sm">No subscribers yet</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-xs font-heading tracking-wider uppercase">
                <th className="text-left px-5 py-3 font-medium">Email</th>
                <th className="text-left px-5 py-3 font-medium">Source</th>
                <th className="text-left px-5 py-3 font-medium">Date</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3 font-medium text-foreground">{s.email}</td>
                  <td className="px-5 py-3 text-muted-foreground text-xs">{s.source || '—'}</td>
                  <td className="px-5 py-3 text-muted-foreground text-xs">{s.created_at ? format(new Date(s.created_at), 'MMM d, yyyy') : '—'}</td>
                  <td className="px-5 py-3">
                    <span className={`text-[10px] font-heading tracking-wider uppercase px-2 py-0.5 rounded-full border ${s.active ? 'bg-green-900/40 text-green-400 border-green-800/40' : 'bg-red-900/40 text-red-400 border-red-800/40'}`}>
                      {s.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function CampaignsTab() {
  const qc = useQueryClient();
  const [showCompose, setShowCompose] = useState(false);
  const [subject, setSubject] = useState('');
  const [bodyHtml, setBodyHtml] = useState('');

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ['admin-newsletter-campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase.from('newsletter_campaigns')
        .select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const sendCampaign = useMutation({
    mutationFn: async (campaignId) => {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const res = await fetch(`${EDGE_FN_URL}/send-newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ action: 'broadcast', campaign_id: campaignId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || 'Failed to send');
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast({ title: `Sent to ${data.sent} subscribers` });
      qc.invalidateQueries({ queryKey: ['admin-newsletter-campaigns'] });
    },
    onError: (e) => toast({ variant: 'destructive', title: e.message }),
  });

  const saveDraft = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase.from('newsletter_campaigns').insert({
        subject, body_html: bodyHtml, status: 'draft', created_by: user?.id,
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: 'Draft saved' });
      setShowCompose(false); setSubject(''); setBodyHtml('');
      qc.invalidateQueries({ queryKey: ['admin-newsletter-campaigns'] });
    },
    onError: (e) => toast({ variant: 'destructive', title: e.message }),
  });

  if (showCompose) {
    return (
      <div className="max-w-3xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg tracking-wider uppercase">New Campaign</h3>
          <Button variant="outline" onClick={() => setShowCompose(false)} className="font-heading tracking-wider uppercase text-xs">Back</Button>
        </div>
        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Subject</label>
          <Input value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. New Survival Pack Drop" className="bg-secondary border-border" />
        </div>
        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Email Body (HTML)</label>
          <textarea value={bodyHtml} onChange={e => setBodyHtml(e.target.value)}
            placeholder="<h1>Your email content here...</h1>"
            className="w-full h-64 rounded-lg border border-border bg-secondary px-4 py-3 text-sm text-foreground font-mono resize-y focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <div className="flex gap-3">
          <Button onClick={() => saveDraft.mutate()} disabled={!subject || !bodyHtml || saveDraft.isPending}
            className="font-heading tracking-wider uppercase text-xs gap-2" style={{ background: FG }}>
            {saveDraft.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
            Save Draft
          </Button>
        </div>
        <div className="bg-secondary/50 border border-border rounded-xl p-4">
          <p className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-2">Preview</p>
          <div className="bg-white rounded-lg p-4 text-black text-sm max-w-md" dangerouslySetInnerHTML={{ __html: bodyHtml || '<p class="text-gray-400">Start typing to see preview...</p>' }} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-5">
        <Button onClick={() => setShowCompose(true)} className="font-heading tracking-wider uppercase text-xs gap-2" style={{ background: FG }}>
          <Plus className="w-3.5 h-3.5" /> New Campaign
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Send className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="font-heading tracking-wider uppercase text-sm">No campaigns yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {campaigns.map(c => (
            <div key={c.id} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-medium text-sm text-foreground truncate">{c.subject}</p>
                    <span className={`text-[10px] font-heading tracking-wider uppercase px-2 py-0.5 rounded-full border ${
                      c.status === 'sent' ? 'bg-green-900/40 text-green-400 border-green-800/40' :
                      c.status === 'sending' ? 'bg-blue-900/40 text-blue-400 border-blue-800/40' :
                      'bg-yellow-900/40 text-yellow-400 border-yellow-800/40'
                    }`}>
                      {c.status === 'sent' ? 'Sent' : c.status === 'sending' ? 'Sending' : 'Draft'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {c.recipient_count > 0 && <span>{c.recipient_count} recipients</span>}
                    {c.sent_at && <span>Sent {format(new Date(c.sent_at), 'MMM d, yyyy')}</span>}
                    <span>Created {format(new Date(c.created_at), 'MMM d, yyyy')}</span>
                  </div>
                </div>
                {c.status === 'draft' && (
                  <Button onClick={() => sendCampaign.mutate(c.id)} disabled={sendCampaign.isPending}
                    size="sm" className="font-heading tracking-wider uppercase text-xs gap-1.5 flex-shrink-0" style={{ background: FG }}>
                    {sendCampaign.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                    Send
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminNewsletter() {
  const [tab, setTab] = useState('subscribers');

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="font-heading text-3xl tracking-wide uppercase text-foreground flex items-center gap-2">
          <Mail className="w-7 h-7 text-primary" /> Newsletter
        </h1>
      </div>

      <div className="flex gap-1 bg-card border border-border rounded-xl p-1 mb-6 w-fit">
        {[
          { key: 'subscribers', icon: Users, label: 'Subscribers' },
          { key: 'campaigns', icon: Send, label: 'Campaigns' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-heading tracking-wider uppercase transition-all ${
              tab === t.key ? 'text-white' : 'text-muted-foreground hover:text-white'
            }`}
            style={tab === t.key ? { background: FG } : {}}>
            <t.icon className="w-3.5 h-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'subscribers' ? <SubscribersTab /> : <CampaignsTab />}
    </div>
  );
}
