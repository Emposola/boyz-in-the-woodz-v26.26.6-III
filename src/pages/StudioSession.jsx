import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  Calendar, Clock, Mic, Eye, ArrowLeft, Video,
  Play, Users, Radio, Bell, ArrowRight, Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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

export default function StudioSession() {
  const { slug } = useParams();

  const { data: session, isLoading } = useQuery({
    queryKey: ['studio-session', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('studio_sessions')
        .select('*')
        .eq('slug', slug)
        .eq('active', true)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: related = [] } = useQuery({
    queryKey: ['studio-sessions-related', slug],
    queryFn: async () => {
      if (!session) return [];
      const { data, error } = await supabase
        .from('studio_sessions')
        .select('*')
        .eq('active', true)
        .neq('slug', slug)
        .eq('session_type', session.session_type)
        .order('scheduled_at', { ascending: false })
        .limit(3);
      if (error) return [];
      return data || [];
    },
    enabled: !!session,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Video className="w-16 h-16 text-muted-foreground/20" />
        <h1 className="font-heading text-2xl tracking-wide uppercase text-muted-foreground">Session Not Found</h1>
        <Button asChild className="font-heading tracking-wider uppercase">
          <Link to="/studio">Back to Studio</Link>
        </Button>
      </div>
    );
  }

  const typeConfig = SESSION_TYPE_LABELS[session.session_type] || { label: session.session_type, color: 'bg-secondary text-muted-foreground' };
  const streamUrl = session.status === 'live' ? session.meeting_url : session.recording_url || session.meeting_url;

  return (
    <div className="min-h-screen pb-20">
      <SEO
        title={`${session.title} — Brotherhood Studio | BOYZ IN THE WOODZ`}
        description={session.description || `Watch ${session.title} with ${session.host_name} on the Brotherhood Studio.`}
        canonical={`/studio/${session.slug}`}
        ogImage={session.thumbnail_url}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'VideoObject',
          name: session.title,
          description: session.description,
          thumbnailUrl: session.thumbnail_url,
          uploadDate: session.scheduled_at,
          duration: session.duration_minutes ? `PT${session.duration_minutes}M` : undefined,
          author: { '@type': 'Person', name: session.host_name },
          publisher: { '@type': 'Organization', name: 'BOYZ IN THE WOODZ' },
        }}
      />

      <div className="max-w-5xl mx-auto px-4 pt-6">
        {/* Back link */}
        <Link to="/studio" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary font-heading tracking-wider uppercase transition-colors mb-6">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Studio
        </Link>

        {/* Video player */}
        {streamUrl ? (
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl mb-6">
            <iframe
              src={streamUrl}
              className="w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title={session.title}
            />
            {session.status === 'live' && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
                <span className="text-[10px] font-heading tracking-widest uppercase text-red-400">Live</span>
              </div>
            )}
          </div>
        ) : (
          <div className="aspect-video rounded-2xl bg-secondary flex flex-col items-center justify-center gap-4 mb-6 border border-border">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Video className="w-10 h-10 text-primary/40" />
            </div>
            <p className="text-muted-foreground text-sm">{session.status === 'upcoming' ? 'Stream starts at scheduled time' : 'Stream link not available'}</p>
            {session.status === 'upcoming' && session.scheduled_at && (
              <p className="text-xs text-muted-foreground/60">{format(new Date(session.scheduled_at), 'EEEE, MMMM d · h:mm a')}</p>
            )}
          </div>
        )}

        {/* Session details */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`text-[9px] font-heading tracking-widest uppercase px-2.5 py-1 rounded-full ${typeConfig.color}`}>{typeConfig.label}</span>
              {session.status === 'live' && (
                <span className="text-[9px] font-heading tracking-widest uppercase text-red-400 bg-red-900/30 px-2 py-1 rounded-full">Live</span>
              )}
              {session.status === 'recorded' && (
                <span className="text-[9px] font-heading tracking-widest uppercase text-muted-foreground bg-secondary px-2 py-1 rounded-full">Recorded</span>
              )}
              {session.status === 'upcoming' && (
                <span className="text-[9px] font-heading tracking-widest uppercase text-muted-foreground bg-secondary px-2 py-1 rounded-full">Upcoming</span>
              )}
            </div>
            <h1 className="font-heading text-3xl md:text-4xl tracking-wide uppercase leading-tight mb-3">{session.title}</h1>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">{session.description}</p>

            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><Mic className="w-4 h-4 text-primary" /> {session.host_name}</span>
              {session.scheduled_at && (
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary" /> {format(new Date(session.scheduled_at), 'MMM d, yyyy · h:mm a')}</span>
              )}
              {session.duration_minutes && (
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" /> {session.duration_minutes} minutes</span>
              )}
              {session.viewer_count > 0 && (
                <span className="flex items-center gap-1.5"><Eye className="w-4 h-4 text-primary" /> {session.viewer_count.toLocaleString()} views</span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {session.status === 'upcoming' && (
              <Button className="w-full font-heading tracking-wider uppercase gap-2"
                onClick={() => toast.success('Reminder set! We\'ll notify you before this session.')}>
                <Bell className="w-4 h-4" /> Set Reminder
              </Button>
            )}
            <Button variant="outline" className="w-full font-heading tracking-wider uppercase gap-2"
              onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success('Link copied!'); }}>
              <Share2 className="w-4 h-4" /> Share Session
            </Button>
          </div>
        </div>

        {/* Related sessions */}
        {related.length > 0 && (
          <section className="mt-14 pt-10 border-t border-border">
            <h2 className="font-heading text-xl tracking-wide uppercase mb-5 flex items-center gap-2">
              <Radio className="w-5 h-5 text-primary" /> More {typeConfig.label} Sessions
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map(s => (
                <Link key={s.id} to={`/studio/${s.slug || s.id}`}>
                  <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-all">
                    <div className="relative aspect-video overflow-hidden">
                      <img src={s.thumbnail_url || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=85'} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute bottom-2 right-2">
                        {s.duration_minutes && <span className="bg-black/70 text-white text-[9px] rounded px-1.5 py-0.5 font-heading">{s.duration_minutes}m</span>}
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-heading text-xs tracking-wide uppercase leading-tight group-hover:text-primary transition-colors line-clamp-2">{s.title}</h3>
                      <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1"><Mic className="w-2.5 h-2.5" /> {s.host_name}</p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Brotherhood CTA */}
        <div className="mt-14 rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center">
          <Users className="w-8 h-8 text-primary mx-auto mb-3" />
          <h3 className="font-heading text-xl tracking-wide uppercase mb-2">Join the Brotherhood</h3>
          <p className="text-muted-foreground text-sm mb-4 max-w-md mx-auto">
            Get notified before every live session, earn points for watching, and connect with men who show up.
          </p>
          <Button asChild className="font-heading tracking-wider uppercase gap-2">
            <Link to="/retreat/apply">Take the Pledge <ArrowRight className="w-4 h-4" /></Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
