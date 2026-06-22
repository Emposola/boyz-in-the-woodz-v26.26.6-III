/* ============================================================
   ADMIN MEMBERS — View all users, toggle admin, award points
   ============================================================ */
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/AuthContext';
import { format } from 'date-fns';
import { Users, Search, Shield, ShieldOff, Plus, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const FG = '#2D5A27';

export default function AdminMembers() {
  const { user: currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const [awardingPoints, setAwardingPoints] = useState(null); // member id
  const [pointsAmount, setPointsAmount] = useState('');
  const [pointsNote, setPointsNote] = useState('');
  const qc = useQueryClient();

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['admin-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const toggleAdmin = useMutation({
    mutationFn: async ({ id, is_admin }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['admin-members'] });
      toast.success(vars.is_admin ? 'Admin access granted' : 'Admin access removed');
    },
    onError: (e) => toast.error(e.message),
  });

  const awardPoints = useMutation({
    mutationFn: async ({ userId, amount, note }) => {
      const pts = parseInt(amount);
      if (!pts || pts <= 0) throw new Error('Enter a valid points amount');

      // Insert loyalty transaction
      const { error: txError } = await supabase
        .from('loyalty_transactions')
        .insert({
          user_id: userId,
          points_amount: pts,
          type: 'credit',
          source: 'admin_award',
          description: note || 'Admin points award',
        });
      if (txError) throw txError;

      // Update profile loyalty_points
      const member = members.find(m => m.id === userId);
      const newTotal = (member?.loyalty_points || 0) + pts;
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ loyalty_points: newTotal })
        .eq('id', userId);
      if (profileError) throw profileError;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-members'] });
      toast.success('Points awarded successfully');
      setAwardingPoints(null);
      setPointsAmount('');
      setPointsNote('');
    },
    onError: (e) => toast.error(e.message),
  });

  const filtered = members.filter(m => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      m.full_name?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-heading text-3xl tracking-wide uppercase text-foreground flex items-center gap-2">
            <Users className="w-7 h-7 text-primary" /> Members
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{members.length} registered members</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email..." className="pl-9 bg-secondary border-border" />
      </div>

      {/* Note on making admins */}
      <div className="mb-5 p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs text-muted-foreground flex items-start gap-2">
        <Shield className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
        <span>
          Admins get full access to this panel. You can grant or revoke admin access here. 
          You cannot remove your own admin access.
        </span>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-xs font-heading tracking-wider uppercase text-muted-foreground">Member</th>
                  <th className="text-left px-4 py-3 text-xs font-heading tracking-wider uppercase text-muted-foreground hidden sm:table-cell">Joined</th>
                  <th className="text-left px-4 py-3 text-xs font-heading tracking-wider uppercase text-muted-foreground">Points</th>
                  <th className="text-left px-4 py-3 text-xs font-heading tracking-wider uppercase text-muted-foreground hidden md:table-cell">Role</th>
                  <th className="px-4 py-3 text-xs font-heading tracking-wider uppercase text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(m => (
                  <React.Fragment key={m.id}>
                    <tr className="hover:bg-white/2 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                            style={{ background: m.is_admin ? '#7c3aed' : FG }}>
                            {m.full_name?.[0] || m.email?.[0] || '?'}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate">{m.full_name || '—'}</p>
                            <p className="text-xs text-muted-foreground truncate">{m.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                        {m.created_at ? format(new Date(m.created_at), 'MMM d, yyyy') : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-heading text-sm" style={{ color: FG }}>
                          {m.loyalty_points ?? 0}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        {m.is_admin ? (
                          <span className="text-[10px] font-heading tracking-wider uppercase px-2 py-0.5 rounded-full bg-purple-900/40 text-purple-400 border border-purple-800/40">
                            Admin
                          </span>
                        ) : m.is_barber ? (
                          <span className="text-[10px] font-heading tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-900/40 text-amber-400 border border-amber-800/40">
                            Barber
                          </span>
                        ) : (
                          <span className="text-[10px] font-heading tracking-wider uppercase px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
                            Member
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 justify-end">
                          {/* Award points */}
                          <button
                            onClick={() => setAwardingPoints(awardingPoints === m.id ? null : m.id)}
                            title="Award points"
                            className="p-1.5 text-muted-foreground hover:text-yellow-400 rounded-lg hover:bg-yellow-400/10 transition-colors">
                            <Award className="w-4 h-4" />
                          </button>
                          {/* Toggle admin — can't change own */}
                          {m.id !== currentUser?.id && (
                            <button
                              onClick={() => {
                                if (!confirm(m.is_admin
                                  ? `Remove admin access from ${m.full_name || m.email}?`
                                  : `Grant admin access to ${m.full_name || m.email}?`
                                )) return;
                                toggleAdmin.mutate({ id: m.id, is_admin: !m.is_admin });
                              }}
                              title={m.is_admin ? 'Remove admin' : 'Make admin'}
                              className={`p-1.5 rounded-lg transition-colors ${
                                m.is_admin
                                  ? 'text-purple-400 hover:text-red-400 hover:bg-red-400/10'
                                  : 'text-muted-foreground hover:text-purple-400 hover:bg-purple-400/10'
                              }`}>
                              {m.is_admin ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Award points inline form */}
                    {awardingPoints === m.id && (
                      <tr>
                        <td colSpan={5} className="px-4 pb-4">
                          <div className="bg-secondary rounded-xl p-4 flex flex-wrap items-end gap-3">
                            <div>
                              <label className="text-[10px] font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Points Amount</label>
                              <Input type="number" min="1" value={pointsAmount}
                                onChange={e => setPointsAmount(e.target.value)}
                                placeholder="100" className="w-28 bg-card border-border" />
                            </div>
                            <div className="flex-1 min-w-40">
                              <label className="text-[10px] font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Note (optional)</label>
                              <Input value={pointsNote} onChange={e => setPointsNote(e.target.value)}
                                placeholder="e.g. Retreat bonus" className="bg-card border-border" />
                            </div>
                            <Button
                              onClick={() => awardPoints.mutate({ userId: m.id, amount: pointsAmount, note: pointsNote })}
                              disabled={awardPoints.isPending}
                              className="font-heading tracking-wider uppercase text-xs gap-1.5"
                              style={{ background: FG }}>
                              <Plus className="w-3.5 h-3.5" />
                              {awardPoints.isPending ? 'Awarding...' : 'Award'}
                            </Button>
                            <Button onClick={() => setAwardingPoints(null)} variant="outline" size="sm"
                              className="font-heading tracking-wider uppercase text-xs">
                              Cancel
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p className="text-sm">No members found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
