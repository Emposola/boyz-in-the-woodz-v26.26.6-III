/* ============================================================
   ACCOUNT DASHBOARD — Points balance, orders, referral link
   Unified user account for both businesses
   ============================================================ */
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Coins, ShoppingBag, Gift, Settings, Copy, Calendar, Trees, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { usePledge } from '@/lib/pledgeContext';

export default function Account() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { pledgeAccepted } = usePledge();

  /* --- Load user --- */
  useEffect(() => {
    base44.auth.me().then(u => { setUser(u); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  /* --- Fetch loyalty transactions for this user --- */
  const { data: transactions } = useQuery({
    queryKey: ['loyalty', user?.id],
    queryFn: () => base44.entities.LoyaltyTransaction.filter({ user_id: user.id }, '-created_date', 50),
    enabled: !!user?.id,
    initialData: [],
  });

  /* --- Fetch orders --- */
  const { data: orders } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: () => base44.entities.Order.filter({ user_id: user.id }, '-created_date', 20),
    enabled: !!user?.id,
    initialData: [],
  });

  /* --- Fetch appointments --- */
  const { data: appointments } = useQuery({
    queryKey: ['appointments', user?.id],
    queryFn: () => base44.entities.Appointment.filter({ user_id: user.id }, '-start_time', 20),
    enabled: !!user?.id,
    initialData: [],
  });

  /* --- Fetch retreat applications --- */
  const { data: retreatApps } = useQuery({
    queryKey: ['retreat-apps', user?.id],
    queryFn: () => base44.entities.RetreatApplication.filter({ user_id: user.id }, '-created_date', 10),
    enabled: !!user?.id,
    initialData: [],
  });

  /* --- Calculate points balance --- */
  const pointsBalance = transactions.reduce((sum, t) => sum + (t.points_amount || 0), 0);
  const dollarValue = (pointsBalance / 500) * 5;
  const referralLink = user ? `${window.location.origin}?ref=${user.id}` : '';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <h1 className="font-heading text-3xl tracking-wide uppercase mb-3">Join The Brotherhood</h1>
        <p className="text-sm text-muted-foreground mb-6">Sign in to track points, orders, and referrals.</p>
        <Button onClick={() => base44.auth.redirectToLogin()} className="font-heading tracking-wider uppercase">
          Sign In / Sign Up
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      {/* --- Header --- */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl tracking-wide uppercase">Welcome back</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        {pledgeAccepted && (
          <Badge className="bg-primary/10 text-primary">Pledge Accepted</Badge>
        )}
      </div>

      {/* --- Points Card --- */}
      <div className="bg-card border border-border rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-heading tracking-wider text-primary uppercase">Brotherhood Points</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-heading text-4xl md:text-5xl">{pointsBalance.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground">pts</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Value: ${dollarValue.toFixed(2)}</p>
          </div>
          <Coins className="w-10 h-10 text-primary/30" />
        </div>
      </div>

      {/* --- Tabs --- */}
      <Tabs defaultValue="appointments">
        <TabsList className="bg-secondary flex-wrap h-auto gap-1">
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="retreats">Retreats</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="points">Points</TabsTrigger>
          <TabsTrigger value="referral">Referral</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Appointments Tab */}
        <TabsContent value="appointments" className="mt-6 space-y-3">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-heading text-sm tracking-wider uppercase text-muted-foreground">My Appointments</h3>
            <Button asChild size="sm" className="font-heading tracking-wider uppercase text-xs">
              <a href="/barber/book"><Calendar className="w-3.5 h-3.5 mr-1.5" /> Book New</a>
            </Button>
          </div>
          {appointments.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">No appointments yet. Book your first cut!</p>
          ) : (
            appointments.map(apt => (
              <div key={apt.id} className="bg-card border border-border rounded-lg p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">{apt.service_name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {apt.barber_name} · {apt.start_time ? format(new Date(apt.start_time), 'MMM d, h:mm a') : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px]">{apt.status}</Badge>
                  {(apt.status === 'completed') && (
                    <Button asChild size="sm" variant="outline" className="text-xs font-heading tracking-wider uppercase">
                      <a href="/barber/book"><RotateCcw className="w-3 h-3 mr-1" /> Rebook</a>
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </TabsContent>

        {/* Retreats Tab */}
        <TabsContent value="retreats" className="mt-6 space-y-3">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-heading text-sm tracking-wider uppercase text-muted-foreground">My Retreats</h3>
            <Button asChild size="sm" className="font-heading tracking-wider uppercase text-xs">
              <a href="/retreat/apply"><Trees className="w-3.5 h-3.5 mr-1.5" /> Apply</a>
            </Button>
          </div>
          {retreatApps.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">No retreat applications yet. <a href="/retreat/apply" className="text-primary">Apply for a retreat</a>.</p>
          ) : (
            retreatApps.map(app => {
              const statusColors = { pending: 'text-amber-400', waitlist: 'text-blue-400', confirmed: 'text-green-400', attended: 'text-primary', cancelled: 'text-destructive' };
              return (
                <div key={app.id} className="bg-card border border-border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">{app.location_name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{app.requested_date}</p>
                  </div>
                  <span className={`text-xs font-heading tracking-wider uppercase ${statusColors[app.status] || 'text-muted-foreground'}`}>
                    {app.status}
                  </span>
                </div>
              );
            })
          )}
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="mt-6 space-y-3">
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">No orders yet. Time to shop!</p>
          ) : (
            orders.map(order => (
              <div key={order.id} className="bg-card border border-border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium">{order.items?.length || 0} items</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {order.created_date && format(new Date(order.created_date), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold">${order.total_amount?.toFixed(2)}</span>
                    <Badge variant="secondary" className="ml-2 text-[10px]">{order.status || 'pending'}</Badge>
                  </div>
                </div>
              </div>
            ))
          )}
        </TabsContent>

        {/* Points History Tab */}
        <TabsContent value="points" className="mt-6 space-y-2">
          {transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">No points activity yet.</p>
          ) : (
            transactions.map(t => (
              <div key={t.id} className="flex justify-between items-center bg-card border border-border rounded-lg p-3">
                <div>
                  <p className="text-sm">{t.description || t.source}</p>
                  <p className="text-xs text-muted-foreground">{t.created_date && format(new Date(t.created_date), 'MMM d, yyyy')}</p>
                </div>
                <span className={`font-heading text-lg ${t.type === 'earn' ? 'text-primary' : 'text-destructive'}`}>
                  {t.type === 'earn' ? '+' : ''}{t.points_amount}
                </span>
              </div>
            ))
          )}
        </TabsContent>

        {/* Referral Tab */}
        <TabsContent value="referral" className="mt-6">
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <Gift className="w-10 h-10 text-primary mx-auto mb-3" />
            <h3 className="font-heading text-xl tracking-wider uppercase">Refer a Brother</h3>
            <p className="text-xs text-muted-foreground mt-2 mb-4">Share your link. When they sign up, you both get 200 points.</p>
            <div className="flex gap-2 max-w-sm mx-auto">
              <Input value={referralLink} readOnly className="bg-secondary text-xs" />
              <Button size="icon" variant="outline" onClick={() => { navigator.clipboard.writeText(referralLink); toast.success('Link copied!'); }}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="mt-6">
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h3 className="font-heading text-lg tracking-wider uppercase flex items-center gap-2">
              <Settings className="w-4 h-4" /> Account Settings
            </h3>
            <div>
              <label className="text-xs text-muted-foreground">Email</label>
              <Input value={user.email} disabled className="bg-secondary mt-1" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Name</label>
              <Input value={user.full_name || ''} disabled className="bg-secondary mt-1" />
            </div>
            <Button variant="outline" className="text-xs" onClick={() => base44.auth.logout()}>
              Sign Out
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}