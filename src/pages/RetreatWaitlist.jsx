/* ============================================================
   RETREAT WAITLIST STATUS — User sees their position
   Referral boost: +2 spots per friend who applies
   ============================================================ */
import React, { useState, useEffect } from 'react';
import { api } from '@/api/supabaseClient';
import { useQuery } from '@tanstack/react-query';
import { Trees, Users, Link as LinkIcon, Copy, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const STATUS_CONFIG = {
  pending:   { color: 'bg-amber-900/30 text-amber-400', label: 'Under Review' },
  waitlist:  { color: 'bg-blue-900/30 text-blue-400',   label: 'On Waitlist'  },
  confirmed: { color: 'bg-green-900/30 text-green-400', label: 'Confirmed!'   },
  attended:  { color: 'bg-primary/20 text-primary',     label: 'Attended'     },
  cancelled: { color: 'bg-destructive/20 text-destructive', label: 'Cancelled' },
};

export default function RetreatWaitlist() {
  const [user, setUser] = useState(null);
  useEffect(() => { api.auth.me().then(setUser).catch(() => {}); }, []);

  const { data: applications } = useQuery({
    queryKey: ['retreat-apps', user?.id],
    queryFn: () => api.entities.RetreatApplication.filter({ user_id: user.id }, '-created_date', 10),
    enabled: !!user?.id,
    initialData: [],
  });

  const referralLink = user ? `${window.location.origin}/retreat/apply?ref=${user.id}` : '';

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <h1 className="font-heading text-3xl tracking-wide uppercase mb-3">Check Your Status</h1>
        <p className="text-sm text-muted-foreground mb-6">Sign in to see your retreat application status.</p>
        <Button onClick={() => api.auth.redirectToLogin('/retreat/waitlist')} className="font-heading tracking-wider uppercase">Sign In</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
      <div className="flex items-center gap-2 mb-2">
        <Trees className="w-5 h-5 text-primary" />
        <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">The Woodz</span>
      </div>
      <h1 className="font-heading text-3xl tracking-wide uppercase mb-8">My Retreat Applications</h1>

      {applications.length === 0 ? (
        <div className="text-center py-16">
          <Trees className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">No applications yet.</p>
          <Button asChild className="mt-4 font-heading tracking-wider uppercase">
            <a href="/retreat/apply">Apply for a Retreat</a>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app, i) => {
            const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
            return (
              <motion.div key={app.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-heading text-lg tracking-wider uppercase">{app.location_name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{app.requested_date}</p>
                  </div>
                  <Badge className={`${cfg.color} border-0 text-xs`}>{cfg.label}</Badge>
                </div>

                {app.status === 'waitlist' && app.waitlist_position && (
                  <div className="bg-secondary rounded-lg p-4 flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <span className="font-heading text-xl">{app.waitlist_position}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Position #{app.waitlist_position}</p>
                      <p className="text-xs text-muted-foreground">Refer friends to move up faster</p>
                    </div>
                    {app.referral_count > 0 && (
                      <div className="ml-auto flex items-center gap-1 text-primary text-xs">
                        <ArrowUp className="w-3 h-3" /> +{app.referral_count * 2} spots moved up
                      </div>
                    )}
                  </div>
                )}

                {app.status === 'confirmed' && (
                  <div className="bg-green-900/20 border border-green-800 rounded-lg p-3 text-xs text-green-400 mb-4">
                    🎉 You're confirmed! Check your email for the packing list and waiver.
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Referral Card */}
      <div className="mt-8 bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="font-heading text-lg tracking-wider uppercase">Bring a Brother</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">Share your link. For every friend who applies, you move up 2 spots on the waitlist.</p>
        <div className="flex gap-2">
          <Input value={referralLink} readOnly className="bg-secondary text-xs" />
          <Button size="icon" variant="outline" onClick={() => { navigator.clipboard.writeText(referralLink); toast.success('Link copied!'); }}>
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}