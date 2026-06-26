/* ============================================================
   ADMIN DASHBOARD — Live overview of all activity
   ============================================================ */
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import {
  Trees, ShoppingBag, Users, BookOpen, CalendarDays,
  Radio, Clock, CheckCircle, AlertCircle, ArrowRight,
  TrendingUp, Package, DollarSign, Mail
} from 'lucide-react';

const FG = '#2D5A27';
const SAND = '#D2B48C';

function StatCard({ icon: Icon, label, value, sub, color, to }) {
  const card = (
    <div className="bg-card border border-border rounded-xl p-5 flex items-start gap-4 hover:border-primary/40 transition-colors group">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}22` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="font-heading text-2xl font-bold text-foreground">{value ?? '—'}</p>
        <p className="text-xs font-heading tracking-wider uppercase text-muted-foreground">{label}</p>
        {sub && <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>}
      </div>
      {to && <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto self-center opacity-0 group-hover:opacity-100 transition-opacity" />}
    </div>
  );
  return to ? <Link to={to}>{card}</Link> : card;
}

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      const [
        { count: totalMembers },
        { count: pendingApps },
        { count: totalOrders },
        { count: pendingPosts },
        { count: todayBookings },
        { count: activeProducts },
        { data: recentApps },
        { data: recentMembers },
        { count: pendingPayments },
        { count: newsletterSubs },
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('retreat_applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('appointments').select('*', { count: 'exact', head: true })
          .eq('status', 'booked')
          .gte('start_time', new Date().toISOString().split('T')[0]),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('active', true),
        supabase.from('retreat_applications')
          .select('id, status, created_date, responses')
          .order('created_date', { ascending: false })
          .limit(5),
        supabase.from('profiles')
          .select('id, full_name, email, created_at, loyalty_points')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('payment_status', 'pending'),
        supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true }),
      ]);

      return {
        totalMembers, pendingApps, totalOrders, pendingPosts,
        todayBookings, activeProducts, recentApps, recentMembers, pendingPayments, newsletterSubs,
      };
    },
    refetchInterval: 30000,
  });

  const statCards = [
    { icon: Users,       label: 'Total Members',    value: stats?.totalMembers,    color: '#6366f1', to: '/admin/members' },
    { icon: Trees,       label: 'Pending Retreat Apps', value: stats?.pendingApps, color: FG,        to: '/admin/retreats' },
    { icon: Package,     label: 'Total Orders',      value: stats?.totalOrders,     color: SAND,      to: '/admin/orders' },
    { icon: BookOpen,    label: 'Posts Pending',      value: stats?.pendingPosts,    color: '#f59e0b', to: '/admin/blog' },
    { icon: CalendarDays,label: "Today's Bookings",  value: stats?.todayBookings,   color: '#06b6d4', to: '/admin/calendar' },
    { icon: ShoppingBag, label: 'Active Products',   value: stats?.activeProducts,  color: '#ec4899', to: '/admin/products' },
    { icon: DollarSign,  label: 'Pending Payments',   value: stats?.pendingPayments, color: '#22c55e', to: '/admin/orders?payment_status=pending' },
    { icon: Mail,        label: 'Newsletter Subs',    value: stats?.newsletterSubs,  color: '#f97316', to: '/admin/newsletter' },
  ];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl tracking-wide uppercase text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {format(new Date(), "EEEE, MMMM d, yyyy")}
        </p>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {statCards.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Two-column activity feed */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Recent retreat applications */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-heading text-sm tracking-wider uppercase flex items-center gap-2">
              <Trees className="w-4 h-4 text-primary" /> Recent Applications
            </h2>
            <Link to="/admin/retreats" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {stats?.recentApps?.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No applications yet</p>
            )}
            {stats?.recentApps?.map(app => (
              <div key={app.id} className="px-5 py-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {app.responses?.user_name || 'Unknown'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {app.responses?.retreat_title || app.responses?.location_name || '—'}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <span className={`text-[10px] font-heading tracking-wider uppercase px-2 py-0.5 rounded-full ${
                    app.status === 'pending'   ? 'bg-yellow-900/40 text-yellow-400' :
                    app.status === 'approved'  ? 'bg-green-900/40 text-green-400' :
                    app.status === 'waitlist'  ? 'bg-blue-900/40 text-blue-400' :
                    'bg-red-900/40 text-red-400'
                  }`}>{app.status}</span>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {app.created_date ? format(new Date(app.created_date), 'MMM d') : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent members */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-heading text-sm tracking-wider uppercase flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" /> New Members
            </h2>
            <Link to="/admin/members" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {stats?.recentMembers?.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No members yet</p>
            )}
            {stats?.recentMembers?.map(m => (
              <div key={m.id} className="px-5 py-3 flex items-center gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: FG }}>
                  {m.full_name?.[0] || m.email?.[0] || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{m.full_name || '—'}</p>
                  <p className="text-xs text-muted-foreground truncate">{m.email}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-heading" style={{ color: FG }}>{m.loyalty_points ?? 0} pts</p>
                  <p className="text-[10px] text-muted-foreground">
                    {m.created_at ? format(new Date(m.created_at), 'MMM d') : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Add Product',     to: '/admin/products?new=1',   icon: ShoppingBag },
          { label: 'New Event',       to: '/admin/retreats?tab=events', icon: Trees },
          { label: 'View Orders',     to: '/admin/orders',            icon: Package },
          { label: 'View Site',       to: '/',                       icon: ArrowRight },
        ].map(q => (
          <Link key={q.label} to={q.to}
            className="flex items-center gap-2 px-4 py-3 bg-card border border-border rounded-xl text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all group">
            <q.icon className="w-4 h-4 text-primary" />
            {q.label}
            <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>
    </div>
  );
}
