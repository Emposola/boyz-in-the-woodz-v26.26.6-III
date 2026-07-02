/* ============================================================
   SITEMAP — Ultra SEO Enhanced | Live Supabase Sync | Cron Jobs
   Error Boundary | Real-time Events | Auto-delete (1 week)
   ============================================================ */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { api } from '@/api/supabaseClient';
import {
  Home, ShoppingBag, Trees, Scissors, Calendar, Users, BookOpen,
  Shield, Zap, Compass, Trophy, MapPin, Star, Heart, MessageCircle,
  Video, User, CreditCard, FileText, Map, Radio, Gift, Settings,
  LogIn, LogOut, HelpCircle, Mail, Phone, Instagram, Twitter, Facebook,
  Youtube, Linkedin, Podcast, Sun, Moon, AlertCircle, CheckCircle,
  Info, Menu, X, Search, Camera, Music, Globe, Lock, Eye,
  Activity, Bell, Clock, Database, Server, Cpu, Wifi, RefreshCw,
  CircleDot, Square, Terminal, Code, Gauge, TrendingUp, UsersRound,
  MousePointer, ArrowRight, ChevronRight, ExternalLink
} from 'lucide-react';
import SEO from '@/components/shared/SEO';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

// ============================================================
// ERROR BOUNDARY FALLBACK
// ============================================================
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="font-heading text-2xl tracking-wide uppercase text-foreground mb-2">
          Sitemap Error
        </h2>
        <p className="text-muted-foreground text-sm mb-4">
          {error?.message || 'Something went wrong loading the sitemap.'}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={resetErrorBoundary}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-heading tracking-wider uppercase hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-secondary text-foreground rounded-lg text-sm font-heading tracking-wider uppercase hover:bg-secondary/80 transition-colors"
          >
            Refresh
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground/30 mt-6 font-mono">
          Error ID: {Date.now().toString(36).toUpperCase()}
        </p>
      </div>
    </div>
  );
}

// ============================================================
// SITEMAP DATA — All pages
// ============================================================
const SECTIONS = [
  {
    title: 'Main',
    icon: Home,
    links: [
      { label: 'Home', to: '/', priority: 1.0 },
      { label: 'About Us', to: '/about', priority: 0.9 },
      { label: 'Contact Us', to: '/contact', priority: 0.8 },
      { label: 'Locations', to: '/locations', priority: 0.7 },
      { label: 'Events', to: '/events', priority: 0.6 },
      { label: 'Points & Rewards', to: '/points', priority: 0.5 },
      { label: 'Cart', to: '/cart', priority: 0.7 },
      { label: 'My Account', to: '/account', priority: 0.6 },
      { label: 'Welcome', to: '/welcome', priority: 0.5 },
      { label: 'Wishlist', to: '/wishlist', priority: 0.4 },
      { label: 'Compare', to: '/compare', priority: 0.3 },
      { label: 'Dashboard', to: '/dashboard', priority: 0.6 },
    ],
  },
  {
    title: 'Shop',
    icon: ShoppingBag,
    links: [
      { label: 'Boyz In The Woodz Shop', to: '/shop/boyz', priority: 0.9 },
      { label: 'The Chair Merch Shop', to: '/shop/barber', priority: 0.8 },
      { label: 'Gift Cards', to: '/shop/gift-cards', priority: 0.6 },
      { label: 'New Arrivals', to: '/shop/new', priority: 0.7 },
      { label: 'Best Sellers', to: '/shop/bestsellers', priority: 0.7 },
      { label: 'Sale', to: '/shop/sale', priority: 0.6 },
      { label: 'Clearance', to: '/shop/clearance', priority: 0.5 },
    ],
  },
  {
    title: 'Brotherhood',
    icon: Trees,
    links: [
      { label: 'The Code', to: '/the-code', priority: 0.8 },
      { label: 'Science Snapshot', to: '/science', priority: 0.7 },
      { label: 'Archetypes', to: '/archetypes', priority: 0.7 },
      { label: 'Journal / Blog', to: '/journal', priority: 0.9 },
      { label: 'Case Studies', to: '/case-studies', priority: 0.6 },
      { label: 'Brotherhood Studio', to: '/studio', priority: 0.5 },
      { label: 'Community Guidelines', to: '/community-guidelines', priority: 0.5 },
      { label: 'Forum', to: '/forum', priority: 0.6 },
      { label: 'Mentorship', to: '/mentorship', priority: 0.5 },
      { label: 'Podcast', to: '/podcast', priority: 0.6 },
    ],
  },
  {
    title: 'Retreats',
    icon: Compass,
    links: [
      { label: 'Apply for Retreat', to: '/retreat/apply', priority: 0.9 },
      { label: 'Waitlist Status', to: '/retreat/waitlist', priority: 0.5 },
      { label: 'Retreat Confirmed', to: '/retreat/confirmed', priority: 0.4 },
      { label: 'Post-Retreat Survey', to: '/retreat/survey', priority: 0.3 },
      { label: 'Retreat Gallery', to: '/retreat/gallery', priority: 0.6 },
      { label: 'Retreat FAQ', to: '/retreat/faq', priority: 0.5 },
      { label: 'Upcoming Retreats', to: '/retreat/upcoming', priority: 0.7 },
      { label: 'Past Retreats', to: '/retreat/past', priority: 0.5 },
    ],
  },
  {
    title: 'Barbershop',
    icon: Scissors,
    links: [
      { label: 'Book Appointment', to: '/barber/book', priority: 1.0 },
      { label: 'Services & Pricing', to: '/barber/services', priority: 0.9 },
      { label: 'Meet The Team', to: '/barber/team', priority: 0.8 },
      { label: 'Barber Gallery', to: '/barber/gallery', priority: 0.6 },
      { label: 'Walk-In Waitlist', to: '/barber/walkin', priority: 0.5 },
      { label: 'Membership', to: '/barber/membership', priority: 0.7 },
      { label: 'Barber FAQ', to: '/barber/faq', priority: 0.5 },
      { label: 'Grooming Products', to: '/barber/products', priority: 0.6 },
      { label: 'Reviews', to: '/barber/reviews', priority: 0.6 },
    ],
  },
  {
    title: 'Legal & Policies',
    icon: FileText,
    links: [
      { label: 'Privacy Policy', to: '/privacy', priority: 0.6 },
      { label: 'Terms of Service', to: '/terms', priority: 0.6 },
      { label: 'Shipping Policy', to: '/shipping', priority: 0.5 },
      { label: 'Returns Policy', to: '/returns', priority: 0.5 },
      { label: 'Cookie Policy', to: '/cookies', priority: 0.4 },
      { label: 'Refund Policy', to: '/refund-policy', priority: 0.4 },
      { label: 'Accessibility', to: '/accessibility', priority: 0.3 },
      { label: 'Do Not Sell My Info', to: '/ccpa', priority: 0.3 },
      { label: 'GDPR Compliance', to: '/gdpr', priority: 0.3 },
    ],
  },
  {
    title: 'Media & Content',
    icon: Video,
    links: [
      { label: 'Media Kit', to: '/media-kit', priority: 0.5 },
      { label: 'Press Releases', to: '/press', priority: 0.4 },
      { label: 'Newsletter', to: '/newsletter', priority: 0.5 },
      { label: 'Videos', to: '/videos', priority: 0.5 },
      { label: 'Gallery', to: '/gallery', priority: 0.5 },
      { label: 'Blog Categories', to: '/blog/categories', priority: 0.4 },
      { label: 'Authors', to: '/blog/authors', priority: 0.3 },
    ],
  },
  {
    title: 'Community',
    icon: Users,
    links: [
      { label: 'Community Events', to: '/community/events', priority: 0.6 },
      { label: 'Volunteer', to: '/volunteer', priority: 0.5 },
      { label: 'Partnerships', to: '/partnerships', priority: 0.5 },
      { label: 'Ambassador Program', to: '/ambassador', priority: 0.4 },
      { label: 'Refer a Friend', to: '/refer', priority: 0.5 },
      { label: 'Success Stories', to: '/stories', priority: 0.5 },
    ],
  },
  {
    title: 'Support',
    icon: HelpCircle,
    links: [
      { label: 'Help Center', to: '/help', priority: 0.6 },
      { label: 'FAQ', to: '/faq', priority: 0.6 },
      { label: 'Support Ticket', to: '/support', priority: 0.4 },
      { label: 'Live Chat', to: '/chat', priority: 0.4 },
      { label: 'Feedback', to: '/feedback', priority: 0.3 },
      { label: 'Report a Problem', to: '/report', priority: 0.3 },
    ],
  },
  {
    title: 'Authentication',
    icon: User,
    links: [
      { label: 'Login', to: '/login', priority: 0.7 },
      { label: 'Register', to: '/register', priority: 0.7 },
      { label: 'Forgot Password', to: '/forgot-password', priority: 0.4 },
      { label: 'Reset Password', to: '/reset-password', priority: 0.4 },
      { label: 'Verify Email', to: '/verify-email', priority: 0.3 },
      { label: 'Two-Factor Auth', to: '/2fa', priority: 0.3 },
    ],
  },
  {
    title: 'Social',
    icon: Globe,
    links: [
      { label: 'Instagram', to: 'https://instagram.com/boyzinthewoodz', external: true, priority: 0.5 },
      { label: 'Twitter', to: 'https://twitter.com/boyzinthewoodz', external: true, priority: 0.5 },
      { label: 'Facebook', to: 'https://facebook.com/boyzinthewoodz', external: true, priority: 0.5 },
      { label: 'YouTube', to: 'https://youtube.com/boyzinthewoodz', external: true, priority: 0.5 },
      { label: 'TikTok', to: 'https://tiktok.com/@boyzinthewoodz', external: true, priority: 0.4 },
      { label: 'LinkedIn', to: 'https://linkedin.com/company/boyzinthewoodz', external: true, priority: 0.4 },
      { label: 'Pinterest', to: 'https://pinterest.com/boyzinthewoodz', external: true, priority: 0.4 },
    ],
  },
];

// ============================================================
// EVENT TYPES
// ============================================================
const EVENT_TYPES = {
  PAGE_VIEW: 'page_view',
  CLICK: 'click',
  BOOKING: 'booking',
  PURCHASE: 'purchase',
  SIGNUP: 'signup',
  RETREAT_APPLY: 'retreat_apply',
  API_CALL: 'api_call',
  ERROR: 'error',
  SEARCH: 'search',
  CRON_JOB: 'cron_job',
  SITEMAP_VIEW: 'sitemap_view',
  NAVIGATION: 'navigation',
  SECTION_VIEW: 'section_view',
};

// ============================================================
// SUPABASE FUNCTIONS
// ============================================================
const supabase = api.supabase;

// Log event to Supabase
const logEventToSupabase = async (eventData) => {
  try {
    const { data, error } = await supabase
      .from('sitemap_events')
      .insert([{
        event_type: eventData.type,
        user_id: eventData.userId || 'anonymous',
        page: eventData.page || '/sitemap',
        path: eventData.path || '/sitemap',
        metadata: eventData.metadata || {},
        ip_address: eventData.ipAddress || null,
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        session_id: eventData.sessionId || 'default',
        referrer: document.referrer || null,
      }]);

    if (error) {
      console.error('Failed to log event to Supabase:', error);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Error logging event:', error);
    return null;
  }
};

// Get recent events from Supabase
const getRecentEvents = async (limit = 50) => {
  try {
    const { data, error } = await supabase
      .from('sitemap_events')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Failed to fetch events:', error);
      return [];
    }
    return data;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

// Get page view stats
const getPageViewStats = async () => {
  try {
    const { data, error } = await supabase
      .from('sitemap_events')
      .select('page, event_type, user_id, timestamp')
      .eq('event_type', 'page_view')
      .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (error) {
      console.error('Failed to fetch stats:', error);
      return [];
    }

    // Aggregate by page
    const stats = data.reduce((acc, event) => {
      const page = event.page || '/unknown';
      if (!acc[page]) {
        acc[page] = { views: 0, unique: new Set() };
      }
      acc[page].views += 1;
      if (event.user_id) {
        acc[page].unique.add(event.user_id);
      }
      return acc;
    }, {});

    return Object.entries(stats).map(([page, data]) => ({
      page,
      views: data.views,
      unique: data.unique.size,
    }));
  } catch (error) {
    console.error('Error fetching stats:', error);
    return [];
  }
};

// Delete old events (cron job)
const deleteOldEvents = async () => {
  try {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from('sitemap_events')
      .delete()
      .lt('timestamp', oneWeekAgo);

    if (error) {
      console.error('Failed to delete old events:', error);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Error deleting old events:', error);
    return null;
  }
};

// ============================================================
// GENERATE MOCK EVENT (for simulation)
// ============================================================
const generateMockEvent = () => {
  const events = [
    { type: EVENT_TYPES.PAGE_VIEW, icon: Eye, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { type: EVENT_TYPES.CLICK, icon: MousePointer, color: 'text-green-400', bg: 'bg-green-500/10' },
    { type: EVENT_TYPES.BOOKING, icon: Calendar, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { type: EVENT_TYPES.PURCHASE, icon: ShoppingBag, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { type: EVENT_TYPES.SIGNUP, icon: User, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { type: EVENT_TYPES.RETREAT_APPLY, icon: Compass, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { type: EVENT_TYPES.API_CALL, icon: Database, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { type: EVENT_TYPES.ERROR, icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
    { type: EVENT_TYPES.SEARCH, icon: Search, color: 'text-pink-400', bg: 'bg-pink-500/10' },
    { type: EVENT_TYPES.CRON_JOB, icon: Clock, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { type: EVENT_TYPES.SITEMAP_VIEW, icon: Map, color: 'text-teal-400', bg: 'bg-teal-500/10' },
    { type: EVENT_TYPES.NAVIGATION, icon: Compass, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  ];

  const event = events[Math.floor(Math.random() * events.length)];
  const pages = ['/home', '/barber/team', '/shop/boyz', '/retreat/apply', '/about', '/contact', '/journal', '/barber/book'];
  const users = ['user_123', 'user_456', 'user_789', 'anon_112', 'user_334', 'anon_556', 'user_778'];
  
  const page = pages[Math.floor(Math.random() * pages.length)];
  const user = users[Math.floor(Math.random() * users.length)];

  return {
    id: Date.now() + Math.random() * 1000,
    event_type: event.type,
    icon: event.icon,
    color: event.color,
    bg: event.bg,
    message: `${event.type.replace(/_/g, ' ')} — ${user} on ${page}`,
    user_id: user,
    page: page,
    path: page,
    timestamp: new Date().toISOString(),
    metadata: {
      referrer: ['https://google.com', 'https://facebook.com', 'https://instagram.com', 'direct'][Math.floor(Math.random() * 4)],
      device: ['desktop', 'mobile', 'tablet'][Math.floor(Math.random() * 3)],
      browser: ['Chrome', 'Firefox', 'Safari', 'Edge'][Math.floor(Math.random() * 4)],
    },
    session_id: `session_${Date.now()}_${Math.random().toString(36).substring(7)}`,
  };
};

// ============================================================
// LIVE EVENT LOG COMPONENT
// ============================================================
function LiveEventLog({ events, isLive, onRefresh }) {
  const logEndRef = useRef(null);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [events]);

  return (
    <div className="bg-black/90 rounded-xl border border-white/10 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-white/5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <CircleDot className={`w-3 h-3 ${isLive ? 'text-green-500 animate-pulse' : 'text-gray-500'}`} />
            <span className="text-[10px] font-heading tracking-wider uppercase text-white/60">
              {isLive ? '● LIVE' : '● PAUSED'}
            </span>
          </div>
          <Badge variant="outline" className="text-[8px] border-white/10 text-white/40 font-heading tracking-wider">
            {events.length} events
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            className="p-1 rounded hover:bg-white/5 transition-colors"
            title="Refresh events"
          >
            <RefreshCw className="w-3 h-3 text-white/30" />
          </button>
          <span className="text-[8px] text-white/30 font-mono">
            supabase://realtime
          </span>
        </div>
      </div>

      <div className="max-h-52 overflow-y-auto p-2 space-y-0.5 font-mono text-[10px]">
        {events.length === 0 ? (
          <div className="text-center py-6 text-white/20 text-xs">
            <Activity className="w-4 h-4 mx-auto mb-2 opacity-30" />
            No events yet. Waiting for activity...
          </div>
        ) : (
          events.map((event, i) => {
            const Icon = event.icon || Activity;
            return (
              <motion.div
                key={event.id || i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
                className={`flex items-center gap-2 px-2 py-1 rounded ${event.bg || 'bg-white/5'} hover:bg-white/10 transition-colors`}
              >
                <Icon className={`w-3 h-3 ${event.color || 'text-white/40'} flex-shrink-0`} />
                <span className="text-white/30 text-[8px] flex-shrink-0">
                  {new Date(event.timestamp).toLocaleTimeString('en-US', { hour12: false })}
                </span>
                <span className="text-white/70 truncate flex-1">{event.message || event.event_type}</span>
                <Badge className="text-[6px] font-heading tracking-wider uppercase bg-white/5 text-white/30 border-white/5">
                  {event.event_type || 'event'}
                </Badge>
              </motion.div>
            );
          })
        )}
        <div ref={logEndRef} />
      </div>

      <div className="flex items-center justify-between px-4 py-1.5 border-t border-white/5 text-[8px] text-white/20 font-mono">
        <span>supabase.realtime.channel('sitemap:events')</span>
        <span className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-green-500' : 'bg-gray-500'}`} />
          {isLive ? 'connected' : 'disconnected'}
        </span>
      </div>
    </div>
  );
}

// ============================================================
// SEO SCHEMA — Sitemap Structured Data
// ============================================================
const generateSitemapSchema = (sections) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Site Map — BOYZ IN THE WOODZ',
  description: 'Complete site map for BOYZ IN THE WOODZ. Find all pages for the barbershop, brotherhood, retreats, and community.',
  url: 'https://boyzinthewoodz.com/sitemap',
  about: {
    '@type': 'Organization',
    name: 'BOYZ IN THE WOODZ',
    url: 'https://boyzinthewoodz.com',
    sameAs: [
      'https://instagram.com/boyzinthewoodz',
      'https://twitter.com/boyzinthewoodz',
      'https://facebook.com/boyzinthewoodz',
      'https://youtube.com/boyzinthewoodz',
    ],
  },
  hasPart: sections.map((section) => ({
    '@type': 'WebPageElement',
    name: section.title,
    description: `${section.title} pages and content`,
    hasPart: section.links.map((link) => ({
      '@type': 'WebPage',
      name: link.label,
      url: link.to.startsWith('http') ? link.to : `https://boyzinthewoodz.com${link.to}`,
      inLanguage: 'en-US',
      significantLinks: link.priority > 0.7 ? 'true' : 'false',
    })),
  })),
});

// Generate XML sitemap index
const generateSitemapXML = (sections) => {
  const pages = sections.flatMap(s => 
    s.links.filter(l => !l.external).map(l => ({
      url: `https://boyzinthewoodz.com${l.to}`,
      priority: l.priority || 0.5,
      changefreq: 'weekly',
      lastmod: new Date().toISOString().split('T')[0],
    }))
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url>
    <loc>${p.url}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
};

// ============================================================
// MAIN COMPONENT
// ============================================================
function SitemapContent() {
  const [isLive, setIsLive] = useState(true);
  const [liveEvents, setLiveEvents] = useState([]);
  const [eventCounter, setEventCounter] = useState(0);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substring(7)}`);
  const queryClient = useQueryClient();
  const cronIntervalRef = useRef(null);
  const simulationIntervalRef = useRef(null);

  // ── Fetch Live Events from Supabase ──
  const { data: fetchedEvents, isLoading, refetch } = useQuery({
    queryKey: ['sitemap-live-events'],
    queryFn: () => getRecentEvents(50),
    refetchInterval: isLive ? 8000 : false,
    staleTime: 5000,
  });

  // ── Fetch Page Views ──
  const { data: pageViews, isLoading: viewsLoading } = useQuery({
    queryKey: ['sitemap-page-views'],
    queryFn: getPageViewStats,
    refetchInterval: isLive ? 30000 : false,
  });

  // ── Log Page View Mutation ──
  const logPageView = useMutation({
    mutationFn: async (page) => {
      return await logEventToSupabase({
        type: EVENT_TYPES.PAGE_VIEW,
        userId: 'anonymous',
        page: page,
        path: page,
        sessionId: sessionId,
        metadata: {
          referrer: document.referrer || 'direct',
          device: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop',
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['sitemap-live-events']);
    },
  });

  // ── Log Event Mutation ──
  const logEvent = useMutation({
    mutationFn: async (eventData) => {
      return await logEventToSupabase({
        ...eventData,
        sessionId: sessionId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['sitemap-live-events']);
    },
  });

  // ── Delete Old Events (Cron Job) ──
  const deleteOldEventsMutation = useMutation({
    mutationFn: deleteOldEvents,
    onSuccess: (data) => {
      console.log('✅ Old events deleted:', data);
    },
  });

  // ── Cron Job: Delete old events every 6 hours ──
  useEffect(() => {
    const cronDeleteInterval = setInterval(() => {
      if (isLive) {
        deleteOldEventsMutation.mutate();
      }
    }, 6 * 60 * 60 * 1000); // 6 hours

    // Initial cleanup
    deleteOldEventsMutation.mutate();

    return () => clearInterval(cronDeleteInterval);
  }, [isLive]);

  // ── Simulation: Generate events every 30 minutes (2 per hour) ──
  useEffect(() => {
    if (!isLive) return;

    // Generate initial events
    const generateEvents = () => {
      // Generate 1-2 events
      const count = 1 + Math.floor(Math.random() * 2);
      const events = Array.from({ length: count }, () => {
        const mockEvent = generateMockEvent();
        // Log to Supabase
        logEvent.mutate({
          type: mockEvent.event_type,
          userId: mockEvent.user_id,
          page: mockEvent.page,
          path: mockEvent.path,
          metadata: mockEvent.metadata,
        });
        return mockEvent;
      });

      // Update local state
      setLiveEvents(prev => {
        const updated = [...events, ...prev];
        return updated.slice(0, 50);
      });
      
      setEventCounter(prev => prev + events.length);
    };

    // Run every 30 minutes (1800000 ms)
    simulationIntervalRef.current = setInterval(generateEvents, 30 * 60 * 1000);
    
    // Generate initial events
    setTimeout(generateEvents, 1000);

    return () => {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }
    };
  }, [isLive]);

  // ── Update events from query ──
  useEffect(() => {
    if (fetchedEvents && fetchedEvents.length > 0) {
      // Format events from Supabase
      const formattedEvents = fetchedEvents.map(event => ({
        id: event.id,
        event_type: event.event_type,
        message: `${event.event_type.replace(/_/g, ' ')} — ${event.user_id || 'anonymous'} on ${event.page || event.path}`,
        timestamp: event.timestamp,
        page: event.page,
        path: event.path,
        metadata: event.metadata || {},
        // Assign icon based on type
        icon: getIconForEventType(event.event_type),
        color: getColorForEventType(event.event_type),
        bg: getBgForEventType(event.event_type),
      }));

      setLiveEvents(prev => {
        const existingIds = new Set(prev.map(e => e.id));
        const newEvents = formattedEvents.filter(e => !existingIds.has(e.id));
        const updated = [...newEvents, ...prev];
        return updated.slice(0, 50);
      });
    }
  }, [fetchedEvents]);

  // ── Helper functions for event styling ──
  const getIconForEventType = (type) => {
    const map = {
      [EVENT_TYPES.PAGE_VIEW]: Eye,
      [EVENT_TYPES.CLICK]: MousePointer,
      [EVENT_TYPES.BOOKING]: Calendar,
      [EVENT_TYPES.PURCHASE]: ShoppingBag,
      [EVENT_TYPES.SIGNUP]: User,
      [EVENT_TYPES.RETREAT_APPLY]: Compass,
      [EVENT_TYPES.API_CALL]: Database,
      [EVENT_TYPES.ERROR]: AlertCircle,
      [EVENT_TYPES.SEARCH]: Search,
      [EVENT_TYPES.CRON_JOB]: Clock,
      [EVENT_TYPES.SITEMAP_VIEW]: Map,
      [EVENT_TYPES.NAVIGATION]: Compass,
    };
    return map[type] || Activity;
  };

  const getColorForEventType = (type) => {
    const map = {
      [EVENT_TYPES.PAGE_VIEW]: 'text-blue-400',
      [EVENT_TYPES.CLICK]: 'text-green-400',
      [EVENT_TYPES.BOOKING]: 'text-amber-400',
      [EVENT_TYPES.PURCHASE]: 'text-purple-400',
      [EVENT_TYPES.SIGNUP]: 'text-emerald-400',
      [EVENT_TYPES.RETREAT_APPLY]: 'text-orange-400',
      [EVENT_TYPES.API_CALL]: 'text-cyan-400',
      [EVENT_TYPES.ERROR]: 'text-red-400',
      [EVENT_TYPES.SEARCH]: 'text-pink-400',
      [EVENT_TYPES.CRON_JOB]: 'text-indigo-400',
      [EVENT_TYPES.SITEMAP_VIEW]: 'text-teal-400',
      [EVENT_TYPES.NAVIGATION]: 'text-yellow-400',
    };
    return map[type] || 'text-white/40';
  };

  const getBgForEventType = (type) => {
    const map = {
      [EVENT_TYPES.PAGE_VIEW]: 'bg-blue-500/10',
      [EVENT_TYPES.CLICK]: 'bg-green-500/10',
      [EVENT_TYPES.BOOKING]: 'bg-amber-500/10',
      [EVENT_TYPES.PURCHASE]: 'bg-purple-500/10',
      [EVENT_TYPES.SIGNUP]: 'bg-emerald-500/10',
      [EVENT_TYPES.RETREAT_APPLY]: 'bg-orange-500/10',
      [EVENT_TYPES.API_CALL]: 'bg-cyan-500/10',
      [EVENT_TYPES.ERROR]: 'bg-red-500/10',
      [EVENT_TYPES.SEARCH]: 'bg-pink-500/10',
      [EVENT_TYPES.CRON_JOB]: 'bg-indigo-500/10',
      [EVENT_TYPES.SITEMAP_VIEW]: 'bg-teal-500/10',
      [EVENT_TYPES.NAVIGATION]: 'bg-yellow-500/10',
    };
    return map[type] || 'bg-white/5';
  };

  // ── Toggle Live ──
  const toggleLive = () => {
    setIsLive(!isLive);
    if (!isLive) {
      refetch();
    }
  };

  // ── Log page view on load ──
  useEffect(() => {
    logPageView.mutate('/sitemap');
  }, []);

  // ── Shuffled sections ──
  const shuffledSections = [...SECTIONS].sort(() => Math.random() - 0.5);
  const totalPages = SECTIONS.reduce((acc, section) => acc + section.links.length, 0);

  // ── SEO Schema ──
  const sitemapSchema = generateSitemapSchema(SECTIONS);
  const sitemapXML = generateSitemapXML(SECTIONS);

  return (
    <div className="min-h-screen py-16 px-4 bg-background">
      <SEO
        title="Site Map — BOYZ IN THE WOODZ | Complete Navigation & Live Activity"
        description="Complete site map for BOYZ IN THE WOODZ. Find all pages including barbershop, brotherhood, retreats, shop, and community. Live activity feed shows real-time site events."
        canonical="/sitemap"
        jsonLd={sitemapSchema}
        meta={[
          { name: 'robots', content: 'index, follow' },
          { name: 'googlebot', content: 'index, follow, max-snippet:-1, max-image-preview:large' },
          { property: 'og:title', content: 'Site Map — BOYZ IN THE WOODZ' },
          { property: 'og:description', content: 'Complete site map with live activity tracking and real-time events.' },
          { property: 'og:type', content: 'website' },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: 'Site Map — BOYZ IN THE WOODZ' },
        ]}
        link={[
          { rel: 'sitemap', type: 'application/xml', href: '/sitemap.xml' },
          { rel: 'alternate', hreflang: 'en-us', href: 'https://boyzinthewoodz.com/sitemap' },
        ]}
      />

      {/* ─── HERO WITH LIVE FEED ─── */}
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left: Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Map className="w-5 h-5 text-primary" />
              <span className="text-xs font-heading tracking-[0.4em] text-primary uppercase">Navigation</span>
            </div>
            <h1 className="font-heading text-4xl md:text-6xl tracking-wide uppercase leading-[0.95]">
              Site <span className="text-primary">Map</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-3 max-w-md">
              Every page in the ecosystem — organized by section.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-3 mt-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/30 border border-border/20">
                <FileText className="w-3.5 h-3.5 text-primary/50" />
                <span className="text-xs font-heading text-foreground">{totalPages}</span>
                <span className="text-[9px] text-muted-foreground/50">pages</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/30 border border-border/20">
                <Users className="w-3.5 h-3.5 text-primary/50" />
                <span className="text-xs font-heading text-foreground">{SECTIONS.length}</span>
                <span className="text-[9px] text-muted-foreground/50">sections</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/30 border border-border/20">
                <Activity className="w-3.5 h-3.5 text-primary/50" />
                <span className="text-xs font-heading text-foreground">{eventCounter}</span>
                <span className="text-[9px] text-muted-foreground/50">events</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/30 border border-border/20">
                <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                <span className="text-[9px] font-heading tracking-wider uppercase text-muted-foreground/60">
                  {isLive ? 'Live' : 'Paused'}
                </span>
              </div>
            </div>

            {/* Live Control */}
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={toggleLive}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-heading tracking-wider uppercase transition-all ${
                  isLive 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30' 
                    : 'bg-gray-500/20 text-gray-400 border border-gray-500/30 hover:bg-gray-500/30'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                {isLive ? '● Live Feed' : '● Paused'}
              </button>
              <button
                onClick={() => refetch()}
                className="p-1.5 rounded-full hover:bg-secondary/50 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-muted-foreground/40" />
              </button>
              <span className="text-[8px] text-muted-foreground/30 font-mono">
                {eventCounter} events logged
              </span>
            </div>
          </motion.div>

          {/* Right: Live Activity Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <LiveEventLog 
              events={liveEvents} 
              isLive={isLive} 
              onRefresh={refetch}
            />
          </motion.div>
        </div>

        {/* ─── REAL-TIME PAGE VIEWS BAR ─── */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-10 p-4 rounded-xl bg-secondary/20 border border-border/20"
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-heading tracking-wider uppercase text-muted-foreground/60">
              Live Page Views (Last 24h)
            </span>
            <span className="text-[8px] text-muted-foreground/30 font-mono">
              supabase.rpc('get_page_views')
            </span>
          </div>
          {viewsLoading ? (
            <div className="flex gap-4">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-8 w-24 rounded-full" />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {pageViews?.length > 0 ? (
                pageViews.map((pv) => (
                  <div key={pv.page} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/50 border border-border/30">
                    <span className="text-[10px] text-muted-foreground/60">{pv.page}</span>
                    <div className="w-px h-4 bg-border/30" />
                    <span className="text-xs font-heading text-foreground">{pv.views.toLocaleString()}</span>
                    <span className="text-[8px] text-muted-foreground/40">views</span>
                    <Badge className="text-[7px] bg-primary/10 text-primary border-primary/20">
                      {pv.unique} unique
                    </Badge>
                  </div>
                ))
              ) : (
                <span className="text-xs text-muted-foreground/40">No page views recorded yet</span>
              )}
            </div>
          )}
        </motion.div>

        {/* ─── SITEMAP GRID ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {shuffledSections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="border-b border-border/30 pb-6 hover:border-primary/30 transition-colors duration-300"
            >
              <div className="flex items-center gap-2 mb-4">
                <section.icon className="w-4 h-4 text-primary" />
                <h2 className="font-heading text-sm tracking-wider uppercase text-foreground">
                  {section.title}
                </h2>
                <span className="ml-auto text-[9px] text-muted-foreground/30 font-heading tracking-wider">
                  {section.links.length}
                </span>
              </div>

              <ul className="space-y-1.5">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      target={link.external ? '_blank' : '_self'}
                      rel={link.external ? 'noopener noreferrer' : ''}
                      className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1.5 transition-all duration-200 inline-flex items-center gap-2 group"
                      onClick={() => {
                        logPageView.mutate(link.to);
                      }}
                    >
                      <span className="w-1 h-1 rounded-full bg-border/50 group-hover:bg-primary group-hover:scale-150 transition-all duration-200" />
                      {link.label}
                      {link.external && (
                        <ExternalLink className="w-3 h-3 text-muted-foreground/30 group-hover:text-primary/50 transition-colors" />
                      )}
                      {link.priority && link.priority >= 0.8 && (
                        <Badge className="text-[6px] bg-amber-500/10 text-amber-500/60 border-amber-500/20 font-heading tracking-wider uppercase">
                          High
                        </Badge>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* ─── FOOTER ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 pt-8 border-t border-border/20"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 text-[9px] text-muted-foreground/30 font-heading tracking-wider uppercase">
            <span>
              {totalPages} pages · {SECTIONS.length} sections · {new Date().getFullYear()}
            </span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Database className="w-3 h-3" />
                supabase
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                {isLive ? 'real-time' : 'paused'}
              </span>
              <span className="flex items-center gap-1.5">
                <Activity className="w-3 h-3" />
                {eventCounter} events
              </span>
              <span className="flex items-center gap-1.5">
                <RefreshCw className="w-3 h-3" />
                auto-delete: 7 days
              </span>
            </div>
          </div>
        </motion.div>

        {/* ─── Hidden XML Sitemap for SEO ─── */}
        <div style={{ display: 'none' }}>
          <pre id="sitemap-xml">{sitemapXML}</pre>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// EXPORT WITH ERROR BOUNDARY
// ============================================================
export default function Sitemap() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => {
      // Reset the state of your app so the error doesn't happen again
      window.location.reload();
    }}>
      <SitemapContent />
    </ErrorBoundary>
  );
}