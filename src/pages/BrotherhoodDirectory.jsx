import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Users, UserPlus, Check, Shield, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';
import SEO from '@/components/shared/SEO';

const FG = '#2D5A27';

export default function BrotherhoodDirectory() {
  const { user, isAuthenticated } = useAuth();
  const [search, setSearch] = useState('');
  const [brothers, setBrothers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectedIds, setConnectedIds] = useState(new Set());
  const [pendingIds, setPendingIds] = useState(new Set());

  useEffect(() => {
    supabase
      .from('profiles')
      .select(`
        id, full_name, city, archetype, bio, interests,
        retreats:retreat_applications(location_name)
      `)
      .eq('directory_opt_in', true)
      .then(({ data, error }) => {
        if (!error && data) {
          setBrothers(data.map(b => ({
            id: b.id,
            name: b.full_name || 'Anonymous Brother',
            city: b.city || null,
            archetype: b.archetype || null,
            bio: b.bio || null,
            interests: b.interests || [],
            retreats: [...new Set((b.retreats || []).map(r => r.location_name).filter(Boolean))],
            avatar: (b.full_name || 'A').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
          })));
        }
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      supabase
        .from('connections')
        .select('recipient_id, status')
        .eq('requester_id', user.id)
        .then(({ data }) => {
          if (data) {
            const accepted = new Set();
            const pending = new Set();
            data.forEach(c => {
              if (c.status === 'accepted') accepted.add(c.recipient_id);
              else if (c.status === 'pending') pending.add(c.recipient_id);
            });
            setConnectedIds(accepted);
            setPendingIds(pending);
          }
        });
    }
  }, [isAuthenticated, user]);

  const handleConnect = async (brotherId) => {
    if (!isAuthenticated) return;
    const { error } = await supabase.from('connections').insert({
      requester_id: user.id,
      recipient_id: brotherId,
      status: 'pending',
    });
    if (!error) {
      setPendingIds(prev => new Set(prev).add(brotherId));
      supabase.from('activity_feed').insert({
        user_id: user.id,
        action_type: 'connection_sent',
        description: `Sent a connection request`,
        metadata: { recipient_id: brotherId },
      }).catch(() => {});
    }
  };

  const filtered = brothers.filter(b =>
    !search || b.name.toLowerCase().includes(search.toLowerCase()) ||
    (b.city && b.city.toLowerCase().includes(search.toLowerCase())) ||
    b.interests.some(i => typeof i === 'string' && i.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Brotherhood Directory" description="Find brothers near you. Connect with the brotherhood in your area." canonical="/brotherhood/directory" />
      <section className="relative py-16 overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(45,90,39,0.1) 0%, transparent 60%)' }}>
        <div className="max-w-4xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs font-heading tracking-[0.3em] uppercase block mb-2" style={{ color: '#D2B48C' }}>The Brotherhood</span>
            <h1 className="font-heading text-5xl tracking-wide uppercase text-foreground mb-3">Brother Directory</h1>
            <p className="text-muted-foreground mb-6">Find brothers in your city. Connect after a shared retreat. Opt-in only — privacy first.</p>

            <div className="relative max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by name, city, or interest..." value={search} onChange={e => setSearch(e.target.value)}
                className="pl-10 bg-secondary border-border" />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-card border border-border rounded-xl p-4 mb-6 flex items-center gap-3">
            <Shield className="w-5 h-5 flex-shrink-0" style={{ color: FG }} />
            <p className="text-sm text-muted-foreground">This directory is opt-in only. Brothers choose to be visible. Connection requests require approval. Names and locations are approximate.</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
              {filtered.map((brother, i) => {
                const isConnected = connectedIds.has(brother.id);
                const isPending = pendingIds.has(brother.id);
                const isMe = user?.id === brother.id;

                return (
                  <motion.div key={brother.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                    className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center font-heading text-lg text-white" style={{ background: FG }}>
                          {brother.avatar}
                        </div>
                        <div>
                          <p className="font-heading text-base tracking-wider uppercase">{isMe ? 'You' : brother.name}</p>
                          {brother.city && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3" />{brother.city}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {brother.archetype && (
                      <div className="mb-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-heading tracking-wider uppercase">
                          {brother.archetype}
                        </span>
                      </div>
                    )}

                    {brother.retreats.length > 0 && (
                      <div className="mb-3">
                        <p className="text-[10px] font-heading tracking-wider uppercase text-muted-foreground mb-1">Retreats Attended</p>
                        <div className="flex flex-wrap gap-1">
                          {brother.retreats.map(r => (
                            <span key={r} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{r}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {brother.interests.length > 0 && (
                      <div className="mb-4">
                        <p className="text-[10px] font-heading tracking-wider uppercase text-muted-foreground mb-1">Interests</p>
                        <div className="flex flex-wrap gap-1">
                          {brother.interests.map(interest => (
                            <span key={interest} className="text-[10px] px-2 py-0.5 rounded-full border border-border text-muted-foreground">{interest}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {brother.bio && (
                      <p className="text-xs text-muted-foreground mb-4 italic line-clamp-2">{brother.bio}</p>
                    )}

                    {isMe ? (
                      <p className="text-xs text-muted-foreground text-center font-heading tracking-wider uppercase">This is you</p>
                    ) : isConnected ? (
                      <div className="flex items-center gap-2 text-xs font-heading tracking-wider justify-center" style={{ color: FG }}>
                        <Check className="w-4 h-4" /> Connected
                      </div>
                    ) : isPending ? (
                      <div className="flex items-center gap-2 text-xs font-heading tracking-wider justify-center text-muted-foreground">
                        <MessageCircle className="w-4 h-4" /> Request Sent
                      </div>
                    ) : isAuthenticated ? (
                      <Button onClick={() => handleConnect(brother.id)} size="sm" variant="outline"
                        className="w-full font-heading tracking-wider uppercase text-xs">
                        <UserPlus className="w-3.5 h-3.5 mr-1" /> Connect
                      </Button>
                    ) : (
                      <Button asChild size="sm" variant="outline" className="w-full font-heading tracking-wider uppercase text-xs">
                        <Link to="/auth/signin"><UserPlus className="w-3.5 h-3.5 mr-1" /> Sign in to Connect</Link>
                      </Button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-heading tracking-wider uppercase">No brothers found</p>
              <p className="text-xs mt-2">Try a different search term, or check back when more brothers opt in.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
