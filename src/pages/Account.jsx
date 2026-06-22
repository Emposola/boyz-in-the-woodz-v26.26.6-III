/* ============================================================
   ACCOUNT DASHBOARD — Points balance, orders, referral link
   Unified user account for both businesses
   ============================================================ */
import React, { useState, useEffect } from 'react';
import { api } from '@/api/supabaseClient';
import { useQuery } from '@tanstack/react-query';
import { 
  Coins, ShoppingBag, Gift, Settings, Copy, Calendar, 
  Trees, RotateCcw, User, Mail, LogOut, ChevronRight,
  Star, Clock, Package, Award, Users, Phone, MapPin,
  Shield, CreditCard, Heart, Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { usePledge } from '@/lib/pledgeContext';

// --- Skeleton Loader ---
const SkeletonLoader = () => (
  <div className="space-y-4">
    <div className="h-12 w-48 bg-gray-700/50 rounded animate-pulse" />
    <div className="h-32 bg-gray-700/50 rounded animate-pulse" />
    <div className="h-64 bg-gray-700/50 rounded animate-pulse" />
  </div>
);

// --- Points Card Component ---
const PointsCard = ({ pointsBalance, dollarValue }) => (
  <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-6 mb-8">
    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
    <div className="relative flex items-center justify-between">
      <div>
        <p className="text-xs font-heading tracking-wider text-primary uppercase flex items-center gap-2">
          <Coins className="w-4 h-4" />
          Brotherhood Points
        </p>
        <div className="flex items-baseline gap-3 mt-1">
          <span className="font-heading text-5xl md:text-6xl text-white">
            {pointsBalance.toLocaleString()}
          </span>
          <span className="text-sm text-gray-400">pts</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-400">Value: ${dollarValue.toFixed(2)}</span>
          <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
            <Star className="w-3 h-3 mr-1" />
            Active
          </Badge>
        </div>
      </div>
      <div className="hidden sm:flex flex-col items-center justify-center w-16 h-16 rounded-full bg-primary/20 border border-primary/30">
        <Crown className="w-6 h-6 text-primary" />
        <span className="text-[8px] font-heading tracking-wider text-primary uppercase mt-0.5">Member</span>
      </div>
    </div>
  </div>
);

// --- Stats Card Component ---
const StatsCard = ({ icon: Icon, label, value, color = 'text-primary' }) => (
  <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 text-center hover:border-primary/30 transition-all hover:bg-gray-800/50">
    <Icon className={`w-5 h-5 mx-auto mb-1 ${color}`} />
    <p className="text-xl font-bold text-white">{value}</p>
    <p className="text-xs text-gray-400">{label}</p>
  </div>
);

export default function Account() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { pledgeAccepted } = usePledge();

  // Load user
  useEffect(() => {
    api.auth.me()
      .then(u => { setUser(u); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Fetch user data
  const { data: transactions = [] } = useQuery({
    queryKey: ['loyalty', user?.id],
    queryFn: () => api.entities.LoyaltyTransaction.filter({ user_id: user.id }, '-created_date', 50),
    enabled: !!user?.id,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: () => api.entities.Order.filter({ user_id: user.id }, '-created_date', 20),
    enabled: !!user?.id,
  });

  const { data: appointments = [] } = useQuery({
    queryKey: ['appointments', user?.id],
    queryFn: () => api.entities.Appointment.filter({ user_id: user.id }, '-start_time', 20),
    enabled: !!user?.id,
  });

  const { data: retreatApps = [] } = useQuery({
    queryKey: ['retreat-apps', user?.id],
    queryFn: () => api.entities.RetreatApplication.filter({ user_id: user.id }, '-created_date', 10),
    enabled: !!user?.id,
  });

  // Calculate points
  const pointsBalance = transactions.reduce((sum, t) => sum + (t.points_amount || 0), 0);
  const dollarValue = (pointsBalance / 500) * 5;
  const referralLink = user ? `${window.location.origin}?ref=${user.id}` : '';

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 text-sm mt-4">Loading your account...</p>
        </div>
      </div>
    );
  }

  // Not logged in - Show login portal
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 text-center shadow-2xl">
            {/* Icon */}
            <div className="w-20 h-20 rounded-full bg-primary/20 mx-auto flex items-center justify-center mb-6 border border-primary/30">
              <Users className="w-10 h-10 text-primary" />
            </div>
            
            <h1 className="font-heading text-3xl tracking-wide uppercase text-white">Join The Brotherhood</h1>
            <p className="text-gray-400 text-sm mt-2 max-w-sm mx-auto">
              Sign in to track your points, orders, appointments, and retreat applications.
            </p>
            
            <div className="mt-8 space-y-3">
              <Button 
                onClick={() => api.auth.redirectToLogin()} 
                className="w-full bg-primary hover:bg-primary/90 font-heading tracking-wider uppercase py-6 text-base group"
              >
                Sign In
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gray-800/50 px-3 text-gray-500">or</span>
                </div>
              </div>
              
              <Button 
                onClick={() => window.location.href = '/auth/signup'} 
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700/50 font-heading tracking-wider uppercase py-6 text-base"
              >
                Create Account
              </Button>
            </div>
            
            <div className="mt-6 text-xs text-gray-500">
              <span>By continuing, you agree to our </span>
              <Link to="/terms" className="text-primary hover:underline">Terms</Link>
              <span> and </span>
              <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Logged in - Dashboard ---
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black px-4 py-8 md:py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl tracking-wide uppercase text-white flex items-center gap-3">
              Welcome back
              {pledgeAccepted && (
                <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px]">
                  <Shield className="w-3 h-3 mr-1" />
                  Pledge Accepted
                </Badge>
              )}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <Mail className="w-4 h-4 text-gray-500" />
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => api.auth.logout()}
            className="border-gray-600 text-gray-400 hover:text-white hover:bg-gray-700/50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
          <StatsCard icon={Coins} label="Points" value={pointsBalance.toLocaleString()} color="text-amber-400" />
          <StatsCard icon={Calendar} label="Appointments" value={appointments.length} color="text-blue-400" />
          <StatsCard icon={Trees} label="Retreats" value={retreatApps.length} color="text-green-400" />
          <StatsCard icon={Package} label="Orders" value={orders.length} color="text-purple-400" />
        </div>

        {/* Points Card */}
        <PointsCard pointsBalance={pointsBalance} dollarValue={dollarValue} />

        {/* Tabs */}
        <Tabs defaultValue="appointments">
          <TabsList className="bg-gray-800/50 border border-gray-700 rounded-xl p-1 flex-wrap h-auto gap-1">
            <TabsTrigger value="appointments" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <Calendar className="w-4 h-4 mr-1.5" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="retreats" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <Trees className="w-4 h-4 mr-1.5" />
              Retreats
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <Package className="w-4 h-4 mr-1.5" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="points" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <Coins className="w-4 h-4 mr-1.5" />
              Points History
            </TabsTrigger>
            <TabsTrigger value="referral" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <Gift className="w-4 h-4 mr-1.5" />
              Refer & Earn
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <Settings className="w-4 h-4 mr-1.5" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="mt-6 space-y-3">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-heading text-sm tracking-wider uppercase text-gray-400">My Appointments</h3>
              <Button asChild size="sm" className="bg-primary hover:bg-primary/90 font-heading tracking-wider uppercase text-xs">
                <a href="/barber/book">
                  <Calendar className="w-3.5 h-3.5 mr-1.5" /> Book New
                </a>
              </Button>
            </div>
            
            {appointments.length === 0 ? (
              <div className="text-center py-12 bg-gray-800/20 rounded-xl border border-gray-700/50">
                <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No appointments yet.</p>
                <Button asChild variant="outline" className="mt-3 border-gray-600">
                  <a href="/barber/book">Book your first cut</a>
                </Button>
              </div>
            ) : (
              appointments.map(apt => (
                <div key={apt.id} className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:border-primary/30 transition-all">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">{apt.service_name}</p>
                      <Badge variant="secondary" className="text-[10px] bg-gray-700/50">
                        {apt.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {apt.barber_name} · {apt.start_time ? format(new Date(apt.start_time), 'MMM d, h:mm a') : ''}
                    </p>
                  </div>
                  {apt.status === 'completed' && (
                    <Button asChild size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:border-primary">
                      <a href="/barber/book">
                        <RotateCcw className="w-3 h-3 mr-1" /> Rebook
                      </a>
                    </Button>
                  )}
                </div>
              ))
            )}
          </TabsContent>

          {/* Retreats Tab */}
          <TabsContent value="retreats" className="mt-6 space-y-3">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-heading text-sm tracking-wider uppercase text-gray-400">My Retreats</h3>
              <Button asChild size="sm" className="bg-primary hover:bg-primary/90 font-heading tracking-wider uppercase text-xs">
                <a href="/retreat/apply">
                  <Trees className="w-3.5 h-3.5 mr-1.5" /> Apply
                </a>
              </Button>
            </div>
            
            {retreatApps.length === 0 ? (
              <div className="text-center py-12 bg-gray-800/20 rounded-xl border border-gray-700/50">
                <Trees className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No retreat applications yet.</p>
                <Button asChild variant="outline" className="mt-3 border-gray-600">
                  <a href="/retreat/apply">Apply for a retreat</a>
                </Button>
              </div>
            ) : (
              retreatApps.map(app => {
                const statusColors = { 
                  pending: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
                  waitlist: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
                  confirmed: 'text-green-400 bg-green-400/10 border-green-400/20',
                  attended: 'text-primary bg-primary/10 border-primary/20',
                  cancelled: 'text-red-400 bg-red-400/10 border-red-400/20'
                };
                return (
                  <div key={app.id} className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:border-primary/30 transition-all">
                    <div>
                      <p className="text-sm font-medium text-white">{app.location_name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{app.requested_date}</p>
                    </div>
                    <Badge className={`${statusColors[app.status] || 'text-gray-400 bg-gray-700/50'} border`}>
                      {app.status}
                    </Badge>
                  </div>
                );
              })
            )}
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="mt-6 space-y-3">
            {orders.length === 0 ? (
              <div className="text-center py-12 bg-gray-800/20 rounded-xl border border-gray-700/50">
                <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No orders yet.</p>
                <Button asChild variant="outline" className="mt-3 border-gray-600">
                  <a href="/shop">Start Shopping</a>
                </Button>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 hover:border-primary/30 transition-all">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <p className="text-sm font-medium text-white">{order.items?.length || 0} items</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {order.created_date && format(new Date(order.created_date), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-white">${order.total_amount?.toFixed(2)}</span>
                      <Badge variant="secondary" className="text-[10px] bg-gray-700/50">
                        {order.status || 'pending'}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          {/* Points History Tab */}
          <TabsContent value="points" className="mt-6 space-y-2">
            {transactions.length === 0 ? (
              <div className="text-center py-12 bg-gray-800/20 rounded-xl border border-gray-700/50">
                <Coins className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No points activity yet.</p>
              </div>
            ) : (
              transactions.map(t => (
                <div key={t.id} className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-3 flex justify-between items-center hover:border-primary/30 transition-all">
                  <div>
                    <p className="text-sm text-white">{t.description || t.source}</p>
                    <p className="text-xs text-gray-400">{t.created_date && format(new Date(t.created_date), 'MMM d, yyyy')}</p>
                  </div>
                  <span className={`font-heading text-lg ${t.type === 'earn' ? 'text-green-400' : 'text-red-400'}`}>
                    {t.type === 'earn' ? '+' : ''}{t.points_amount}
                  </span>
                </div>
              ))
            )}
          </TabsContent>

          {/* Referral Tab */}
          <TabsContent value="referral" className="mt-6">
            <div className="bg-gradient-to-br from-primary/10 via-transparent to-transparent border border-primary/20 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 mx-auto flex items-center justify-center mb-4 border border-primary/30">
                <Gift className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-heading text-2xl tracking-wider uppercase text-white">Refer a Brother</h3>
              <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">
                Share your link. When they sign up, you both get <span className="text-primary font-bold">200 points</span>.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto mt-6">
                <Input 
                  value={referralLink} 
                  readOnly 
                  className="bg-gray-900/50 border-gray-600 text-white text-sm flex-1" 
                />
                <Button 
                  onClick={() => { 
                    navigator.clipboard.writeText(referralLink); 
                    toast.success('Link copied! Share it with your brothers.');
                  }}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-6">
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6 space-y-6">
              <h3 className="font-heading text-lg tracking-wider uppercase text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" /> Account Settings
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-gray-400 font-medium">Email Address</label>
                  <div className="flex items-center gap-2 mt-1.5 bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2.5">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-white">{user.email}</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-gray-400 font-medium">Full Name</label>
                  <div className="flex items-center gap-2 mt-1.5 bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2.5">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-white">{user.full_name || 'Not set'}</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-700/50 flex flex-col sm:flex-row gap-3">
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/10">
                  <Shield className="w-4 h-4 mr-2" />
                  Privacy Settings
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => api.auth.logout()}
                  className="border-gray-600 text-gray-300 hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}