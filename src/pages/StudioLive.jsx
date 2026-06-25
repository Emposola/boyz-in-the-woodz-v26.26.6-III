import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { format, formatDistanceToNow } from 'date-fns';
import {
  Radio, Play, Users, Clock, Calendar, Flame,
  ArrowRight, Eye, Zap, Shield, BookOpen, Mic,
  Video, Star, ChevronRight, Heart, Bell, Link
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link as RouterLink } from 'react-router-dom';
import { toast } from 'sonner';
import SEO from '@/components/shared/SEO';

const SESSION_TYPE_LABELS = {
  retreat_prep: { label: 'Retreat Prep', color: 'bg-green-900/40 text-green-400' },
  mens_circle: { label: "Men's Circle", color: 'bg-blue-900/40 text-blue-400' },
  barber_live: { label: 'Barber Live', color: 'bg-amber-900/40 text-amber-400' },
  campfire_talk: { label: 'Campfire Talk', color: 'bg-orange-900/40 text-orange-400' },
  q_and_a: { label: 'Q&A Session', color: 'bg-purple-900/40 text-purple-400' },
  announcement: { label: 'Announcement', color: 'bg-primary/20 text-primary' },
};

function LivePulse() {
  return (
    <span className="relative flex items-center gap-1.5">
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
      </span>
      <span className="text-[10px] font-heading tracking-widest uppercase text-red-400">Live Now</span>
    </span>
  );
}

function StreamCard({ session, featured = false }) {
  const typeConfig = SESSION_TYPE_LABELS[session.session_type] || { label: session.session_type, color: 'bg-secondary text-muted-foreground' };
  const detailLink = `/studio/${session.slug || session.id}`;

  if (featured) {
    return (
      <RouterLink to={detailLink}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl overflow-hidden bg-card border border-border group cursor-pointer">
          <div className="relative aspect-video md:aspect-[21/9]">
            <img src={session.thumbnail_url || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&q=85'} alt={session.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
            {session.status === 'live' && (
              <div className="absolute top-4 left-4 flex items-center gap-3">
                <LivePulse />
                <span className="text-xs text-white/70 flex items-center gap-1"><Eye className="w-3 h-3" /> {session.viewer_count?.toLocaleString() || 0} watching</span>
              </div>
            )}
            {session.status === 'recorded' && (
              <div className="absolute top-4 left-4 bg-black/60 text-white/80 text-[10px] font-heading tracking-wider uppercase px-3 py-1 rounded-full flex items-center gap-1.5">
                <Video className="w-3 h-3" /> Recorded · {session.viewer_count?.toLocaleString() || 0} views
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-300">
                <Play className="w-9 h-9 text-primary-foreground ml-1" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 p-6 md:p-10 max-w-2xl">
              <span className={`text-[9px] font-heading tracking-widest uppercase px-2.5 py-1 rounded-full ${typeConfig.color}`}>{typeConfig.label}</span>
              <h2 className="font-heading text-2xl md:text-4xl tracking-wide uppercase text-white leading-tight mt-2 mb-2">{session.title}</h2>
              <p className="text-white/65 text-sm mb-4 line-clamp-2">{session.description}</p>
              <div className="flex items-center gap-4 text-white/60 text-xs">
                <span className="flex items-center gap-1"><Mic className="w-3.5 h-3.5" /> {session.host_name}</span>
                {session.duration_minutes && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {session.duration_minutes}min</span>}
              </div>
            </div>
          </div>
        </motion.div>
      </RouterLink>
    );
  }

  return (
    <RouterLink to={detailLink}>
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
        <div className="relative aspect-video overflow-hidden">
          <img src={session.thumbnail_url || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=85'} alt={session.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          {session.status === 'live' && (
            <div className="absolute top-2 left-2"><LivePulse /></div>
          )}
          {session.status === 'upcoming' && (
            <div className="absolute top-2 left-2 bg-secondary/80 text-muted-foreground text-[9px] font-heading tracking-wider uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
              <Calendar className="w-2.5 h-2.5" /> Upcoming
            </div>
          )}
          {session.status === 'recorded' && (
            <div className="absolute top-2 left-2 bg-black/50 text-white/70 text-[9px] font-heading tracking-wider uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
              <Video className="w-2.5 h-2.5" /> Recorded
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center shadow-xl">
              <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
            </div>
          </div>
          <div className="absolute bottom-2 right-2">
            {session.duration_minutes && <span className="bg-black/70 text-white text-[9px] rounded px-1.5 py-0.5 font-heading">{session.duration_minutes}m</span>}
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[9px] font-heading tracking-widest uppercase px-2 py-0.5 rounded-full ${typeConfig.color}`}>{typeConfig.label}</span>
            {session.viewer_count > 0 && (
              <span className="text-[9px] text-muted-foreground flex items-center gap-0.5"><Eye className="w-2.5 h-2.5" /> {session.viewer_count?.toLocaleString()}</span>
            )}
          </div>
          <h3 className="font-heading text-sm tracking-wide uppercase leading-tight group-hover:text-primary transition-colors line-clamp-2 mb-1">{session.title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{session.description}</p>
          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><Mic className="w-2.5 h-2.5" /> {session.host_name}</span>
            {session.scheduled_at && (
              <span>{session.status === 'upcoming' ? format(new Date(session.scheduled_at), 'MMM d · h:mma') : formatDistanceToNow(new Date(session.scheduled_at), { addSuffix: true })}</span>
            )}
          </div>
          {session.status === 'upcoming' && (
            <Button onClick={e => { e.preventDefault(); e.stopPropagation(); toast.success('Reminder set! We\'ll notify you when this goes live.'); }} size="sm" variant="outline"
              className="w-full mt-3 font-heading tracking-wider uppercase text-[10px] gap-1">
              <Bell className="w-3 h-3" /> Set Reminder
            </Button>
          )}
        </div>
      </motion.div>
    </RouterLink>
  );
}

export default function StudioLive() {
  const [filter, setFilter] = useState('all');

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['studio-sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('studio_sessions')
        .select('*')
        .eq('active', true)
        .order('scheduled_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data || [];
    },
  });

  const liveSessions = sessions.filter(s => s.status === 'live');
  const upcomingSessions = sessions.filter(s => s.status === 'upcoming');
  const recordedSessions = sessions.filter(s => s.status === 'recorded');
  const featuredLive = liveSessions[0] || sessions.find(s => s.featured) || sessions[0];

  const FILTERS = [
    { v: 'all', l: 'All Sessions' },
    { v: 'live', l: '🔴 Live' },
    { v: 'recorded', l: 'Recorded' },
    { v: 'upcoming', l: 'Upcoming' },
  ];

  const displayed = filter === 'all' ? sessions : sessions.filter(s => s.status === filter);
  const hasContent = sessions.length > 0;

  return (
    <div className="min-h-screen pb-20">
      <SEO
        title="Brotherhood Studio — Live Sessions & Campfire Talks | BOYZ IN THE WOODZ"
        description="Live sessions, recorded circles, barber chair conversations, and campfire talks — from the studio, the shop, and the woods. Watch. Listen. Feel something real."
        canonical="/studio"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Brotherhood Studio',
          description: 'Live and recorded sessions from the BOYZ IN THE WOODZ brotherhood.',
          publisher: { '@type': 'Organization', name: 'BOYZ IN THE WOODZ' },
        }}
      />

      {/* ── HERO ── */}
      <section className="relative py-16 overflow-hidden border-b border-border bg-secondary/20">
        <div className="absolute inset-0 opacity-5">
          <img src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1600&q=20" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Radio className="w-5 h-5 text-primary" />
              <LivePulse />
            </div>
            <h1 className="font-heading text-5xl md:text-7xl tracking-wide uppercase mb-3">Brotherhood <span className="text-primary">Studio</span></h1>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto mb-6">
              Live sessions, recorded circles, barber chair conversations, and campfire talks — from the studio, the shop, and the woods. Watch. Listen. Feel something real.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {[
                { icon: Radio, v: sessions.filter(s => s.status === 'live').length, l: 'Live Now' },
                { icon: Video, v: sessions.filter(s => s.status === 'recorded').length, l: 'On Demand' },
                { icon: Calendar, v: sessions.filter(s => s.status === 'upcoming').length, l: 'Upcoming' },
              ].map(s => (
                <div key={s.l} className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full text-sm">
                  <s.icon className="w-4 h-4 text-primary" />
                  <span className="font-heading tracking-wider uppercase text-xs">{s.v} {s.l}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : !hasContent ? (
          <div className="text-center py-20">
            <Radio className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
            <h2 className="font-heading text-2xl tracking-wide uppercase text-muted-foreground">No Sessions Yet</h2>
            <p className="text-sm text-muted-foreground/60 mt-2 max-w-md mx-auto">
              The campfire is being prepped. Check back soon for live sessions, recorded talks, and brotherhood conversations.
            </p>
          </div>
        ) : (
          <>
            {/* ── FEATURED LIVE / HERO SESSION ── */}
            {featuredLive && (
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-4">
                  {liveSessions.length > 0 ? <LivePulse /> : <span className="text-xs font-heading tracking-widest uppercase text-muted-foreground">Featured Session</span>}
                  {liveSessions.length > 0 && (
                    <span className="text-xs text-muted-foreground">{liveSessions[0].viewer_count?.toLocaleString() || 0} people watching now</span>
                  )}
                </div>
                <StreamCard session={featuredLive} featured />
              </div>
            )}

            {/* ── LIVE NOW ── */}
            {liveSessions.length > 1 && (
              <section className="mb-12">
                <h2 className="font-heading text-2xl tracking-wide uppercase mb-5 flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" /><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" /></span>
                  More Live Sessions
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {liveSessions.slice(1).map(s => <StreamCard key={s.id} session={s} />)}
                </div>
              </section>
            )}

            {/* ── UPCOMING ── */}
            {upcomingSessions.length > 0 && (
              <section className="mb-12">
                <h2 className="font-heading text-2xl tracking-wide uppercase mb-5 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" /> Upcoming Sessions
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {upcomingSessions.map(s => <StreamCard key={s.id} session={s} />)}
                </div>
              </section>
            )}

            {/* ── FILTERS + ALL ── */}
            <section>
              <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <h2 className="font-heading text-2xl tracking-wide uppercase flex items-center gap-2">
                  <Video className="w-5 h-5 text-primary" /> Session Archive
                </h2>
                <div className="flex gap-2 flex-wrap">
                  {FILTERS.map(f => (
                    <button key={f.v} onClick={() => setFilter(f.v)}
                      className={`px-4 py-1.5 rounded-full text-xs font-heading tracking-wider uppercase border transition-all ${filter === f.v ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}>
                      {f.l}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {displayed.map(s => <StreamCard key={s.id} session={s} />)}
              </div>
            </section>
          </>
        )}

        {/* ── SUBSCRIBE CTA ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-16 rounded-2xl border border-primary/30 bg-primary/5 p-8 md:p-12 text-center">
          <Flame className="w-10 h-10 text-primary mx-auto mb-4" />
          <h3 className="font-heading text-3xl md:text-4xl tracking-wide uppercase mb-3">Never Miss a Session</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-lg mx-auto">
            Brotherhood members get notified first — 30 minutes before every live session, exclusive to the community. Earn +20 points every time you watch live.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="font-heading tracking-wider uppercase gap-2">
              <RouterLink to="/retreat/apply">Join the Brotherhood <ArrowRight className="w-4 h-4" /></RouterLink>
            </Button>
            <Button variant="outline" className="font-heading tracking-wider uppercase gap-2"
              onClick={() => toast.success('You\'ll be notified before every live session.')}>
              <Bell className="w-4 h-4" /> Get Notified
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-8 mt-8 pt-8 border-t border-border/50">
            {[
              { icon: Shield, v: 'Free', l: 'Always Free to Watch' },
              { icon: Star, v: '+20pts', l: 'Per Live Session Watched' },
              { icon: Users, v: '800+', l: 'Average Live Viewers' },
            ].map(s => (
              <div key={s.l} className="text-center">
                <s.icon className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="font-heading text-xl text-foreground">{s.v}</p>
                <p className="text-xs text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
