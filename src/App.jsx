/* ============================================================
   APP ROUTER — Boyz In The Woodz + Barbershop Ecosystem
   Phase 1 + Phase 2: Booking, Retreats, Waitlist, Events
   ============================================================ */
import React, { Suspense } from 'react';

/* --- Auth Pages --- */
import { SignIn, SignUp, ForgotPassword, ResetPassword } from './pages/auth';
import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { CartProvider } from '@/lib/cartContext';
import { PledgeProvider } from '@/lib/pledgeContext';
import ProtectedRoute from './components/ProtectedRoute';

/* --- Layout --- */
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/admin/AdminLayout';

/* --- Lazy loaded pages --- */
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const AdminRetreats = React.lazy(() => import('./pages/admin/AdminRetreats'));
const AdminProducts = React.lazy(() => import('./pages/admin/AdminProducts'));
const AdminMembers = React.lazy(() => import('./pages/admin/AdminMembers'));
const AdminOrders = React.lazy(() => import('./pages/admin/AdminOrders'));
const AdminSettings = React.lazy(() => import('./pages/admin/AdminSettings'));
const AdminNewsletter = React.lazy(() => import('./pages/admin/AdminNewsletter'));
const Home = React.lazy(() => import('./pages/Home'));
const Shop = React.lazy(() => import('./pages/Shop'));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'));
const TheCode = React.lazy(() => import('./pages/TheCode'));
const Science = React.lazy(() => import('./pages/Science'));
const Archetypes = React.lazy(() => import('./pages/Archetypes'));
const Journal = React.lazy(() => import('./pages/Journal'));
const JournalPost = React.lazy(() => import('./pages/JournalPost'));
const Points = React.lazy(() => import('./pages/Points'));
const Cart = React.lazy(() => import('./pages/Cart'));
const Locations = React.lazy(() => import('./pages/Locations'));
const About = React.lazy(() => import('./pages/About'));
const BarberServices = React.lazy(() => import('./pages/BarberServices'));
const BarberTeam = React.lazy(() => import('./pages/BarberTeam'));
const BarberGallery = React.lazy(() => import('./pages/BarberGallery'));
const Membership = React.lazy(() => import('./pages/Membership'));
const BarberFAQ = React.lazy(() => import('./pages/BarberFAQ'));
const BookAppointment = React.lazy(() => import('./pages/BookAppointment'));
const GroomingLodge = React.lazy(() => import('./pages/GroomingLodge'));
const WalkInWaitlistLive = React.lazy(() => import('./pages/WalkInWaitlistLive'));
const BarberProfile = React.lazy(() => import('./pages/BarberProfile'));
const AdminBookingCalendar = React.lazy(() => import('./pages/AdminBookingCalendar'));
const RetreatApply = React.lazy(() => import('./pages/RetreatApply'));
const RetreatWaitlist = React.lazy(() => import('./pages/RetreatWaitlist'));
const RetreatConfirmed = React.lazy(() => import('./pages/RetreatConfirmed'));
const RetreatSurvey = React.lazy(() => import('./pages/RetreatSurvey'));
const Events = React.lazy(() => import('./pages/Events'));
const Account = React.lazy(() => import('./pages/Account'));
const Legal = React.lazy(() => import('./pages/Legal'));
const TheProblem = React.lazy(() => import('./pages/TheProblem'));
const WhoWeServe = React.lazy(() => import('./pages/WhoWeServe'));
const HowItWorks = React.lazy(() => import('./pages/HowItWorks'));
const Welcome = React.lazy(() => import('./pages/Welcome'));
const Contact = React.lazy(() => import('./pages/Contact'));
const CaseStudies = React.lazy(() => import('./pages/CaseStudies'));
const StudioLive = React.lazy(() => import('./pages/StudioLive'));
const StudioSession = React.lazy(() => import('./pages/StudioSession'));
const AdminStudio = React.lazy(() => import('./pages/AdminStudio'));
const Sitemap = React.lazy(() => import('./pages/Sitemap'));
const NewsletterUnsubscribe = React.lazy(() => import('./pages/NewsletterUnsubscribe'));
const Services = React.lazy(() => import('./pages/Services'));
const RetreatCalendar = React.lazy(() => import('./pages/RetreatCalendar'));
const LegalRetreat = React.lazy(() => import('./pages/LegalRetreat'));
const GearLoan = React.lazy(() => import('./pages/GearLoan'));
const ShopMain = React.lazy(() => import('./pages/ShopMain'));
const RetreatDetail = React.lazy(() => import('./pages/RetreatDetail'));
const RetreatPages = React.lazy(() => import('./pages/RetreatPages'));
const BrotherhoodDirectory = React.lazy(() => import('./pages/BrotherhoodDirectory'));
const BrotherhoodHub = React.lazy(() => import('./pages/BrotherhoodHub'));
const ScienceHub = React.lazy(() => import('./pages/ScienceHub'));
const JournalSubmit = React.lazy(() => import('./pages/JournalSubmit'));
const AdminBlog = React.lazy(() => import('./pages/AdminBlog'));
const ImpactStories = React.lazy(() => import('./pages/ImpactStories'));
const BrotherhoodLetters = React.lazy(() => import('./pages/BrotherhoodLetters'));
const BreathingTool = React.lazy(() => import('./pages/BreathingTool'));
const DailyReset = React.lazy(() => import('./pages/DailyReset'));
const BadgesPage = React.lazy(() => import('./pages/BadgesPage'));
const MonthlyChallenge = React.lazy(() => import('./pages/MonthlyChallenge'));
const LimitedDrops = React.lazy(() => import('./pages/LimitedDrops'));
const TimeCapsule = React.lazy(() => import('./pages/TimeCapsule'));
const MoodTracker = React.lazy(() => import('./pages/MoodTracker'));

const PageLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-4 rounded-full border-primary/30 border-t-primary animate-spin" />
      <p className="text-xs font-heading tracking-wider uppercase text-muted-foreground animate-pulse">Loading...</p>
    </div>
  </div>
);

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'auth_required') { 
      navigateToLogin(); 
      return null; 
    }
  }

  return (
    <CartProvider>
      <PledgeProvider>
        <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ── Auth Routes (no layout) ── */}
          <Route path="/auth/signin" element={<SignIn />} />
          <Route path="/auth/signup" element={<SignUp />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          <Route path="/newsletter/unsubscribe" element={<NewsletterUnsubscribe />} />

          {/* ── Protected Routes with Layout ── */}
          <Route element={<MainLayout />}>
            {/* ── Brand Pages ── */}
            <Route path="/the-problem" element={<TheProblem />} />
            <Route path="/who-we-serve" element={<WhoWeServe />} />
            <Route path="/how-it-works" element={<HowItWorks />} />

            {/* ── Shared ── */}
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/about" element={<About />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/points" element={<Points />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/events" element={<Events />} />

            {/* ── Boyz In The Woodz ── */}
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/the-code" element={<TheCode />} />
            <Route path="/science" element={<Science />} />
            <Route path="/archetypes" element={<Archetypes />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/journal/submit" element={<ProtectedRoute><JournalSubmit /></ProtectedRoute>} />
            <Route path="/journal/category/:cat" element={<Journal />} />
            <Route path="/journal/:slug" element={<JournalPost />} />
            <Route path="/blog" element={<Journal />} />

            {/* ── Retreats ── */}
            <Route path="/retreat/apply" element={<ProtectedRoute><RetreatApply /></ProtectedRoute>} />
            <Route path="/retreat/waitlist" element={<RetreatWaitlist />} />
            <Route path="/retreat/confirmed" element={<ProtectedRoute><RetreatConfirmed /></ProtectedRoute>} />
            <Route path="/retreat/survey" element={<ProtectedRoute><RetreatSurvey /></ProtectedRoute>} />

            {/* ── Barbershop Phase 1 ── */}
            <Route path="/barber/services" element={<BarberServices />} />
            <Route path="/barber/team" element={<BarberTeam />} />
            <Route path="/barber/gallery" element={<BarberGallery />} />
            <Route path="/barber/membership" element={<Membership />} />
            <Route path="/barber/faq" element={<BarberFAQ />} />

            {/* ── Barbershop Phase 2 ── */}
            <Route path="/grooming-lodge" element={<GroomingLodge />} />
            <Route path="/barber/book" element={<ProtectedRoute><BookAppointment /></ProtectedRoute>} />
            <Route path="/barber/walkin" element={<WalkInWaitlistLive />} />
            <Route path="/barber/profile/:id" element={<BarberProfile />} />

            {/* ── New Features ── */}
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/studio" element={<StudioLive />} />
            <Route path="/studio/:slug" element={<StudioSession />} />

            {/* ── Shop ── */}
            <Route path="/shop" element={<ShopMain />} />
            <Route path="/shop/boyz" element={<Shop />} />
            <Route path="/shop/:category" element={<ShopMain />} />

            {/* ── New Brand Pages ── */}
            <Route path="/services" element={<Services />} />
            <Route path="/retreat-calendar" element={<RetreatCalendar />} />
            <Route path="/gear" element={<GearLoan />} />

            {/* ── Retreat Detail Pages ── */}
            <Route path="/retreat/weekend-reset" element={<RetreatDetail />} />
            <Route path="/retreat/deep-dive" element={<RetreatDetail />} />
            <Route path="/retreat/expedition" element={<RetreatDetail />} />
            <Route path="/retreat/custom" element={<RetreatPages />} />
            <Route path="/retreat/virtual-tour" element={<RetreatPages />} />
            <Route path="/retreat/what-to-expect" element={<RetreatPages />} />
            <Route path="/retreat/packing-list" element={<RetreatPages />} />

            {/* ── Brotherhood Hub ── */}
            <Route path="/brotherhood/directory" element={<BrotherhoodDirectory />} />
            <Route path="/brotherhood/leaderboard" element={<BrotherhoodHub />} />
            <Route path="/brotherhood/challenges" element={<BrotherhoodHub />} />
            <Route path="/brotherhood/statistics" element={<BrotherhoodHub />} />
            <Route path="/brotherhood/map" element={<Locations />} />

            {/* ── Science Pages ── */}
            <Route path="/science/cortisol" element={<ScienceHub />} />
            <Route path="/science/loneliness" element={<ScienceHub />} />
            <Route path="/science/mental-health" element={<ScienceHub />} />
            <Route path="/science/testimonials" element={<ScienceHub />} />

            {/* ── Journal ── */}

            {/* ── New Premium Pages ── */}
            <Route path="/brotherhood/impact-stories" element={<ImpactStories />} />
            <Route path="/brotherhood/letters" element={<BrotherhoodLetters />} />
            <Route path="/wellness/breathing-tool" element={<BreathingTool />} />
            <Route path="/wellness/daily-reset" element={<DailyReset />} />
            <Route path="/wellness/mood-tracker" element={<MoodTracker />} />
            <Route path="/dashboard/badges" element={<BadgesPage />} />
            <Route path="/community/challenge" element={<MonthlyChallenge />} />
            <Route path="/shop/limited-edition" element={<LimitedDrops />} />
            <Route path="/community/time-capsule" element={<TimeCapsule />} />

          {/* ── Legal ── */}
            <Route path="/legal/retreat-waiver" element={<LegalRetreat />} />
            <Route path="/legal/retreat-cancellation" element={<LegalRetreat />} />
            <Route path="/legal/pledge-terms" element={<LegalRetreat />} />
            <Route path="/legal/chapter-terms" element={<LegalRetreat />} />
            <Route path="/legal/merchandise-safety" element={<LegalRetreat />} />

            {/* ── Account ── */}
            <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />

            {/* ── Legal ── */}
            <Route path="/privacy" element={<Legal />} />
            <Route path="/terms" element={<Legal />} />
            <Route path="/shipping" element={<Legal />} />
            <Route path="/returns" element={<Legal />} />
            <Route path="/cookies" element={<Legal />} />

            <Route path="/sitemap" element={<Sitemap />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>

          {/* ── Admin Panel (AdminLayout — separate from MainLayout) ── */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout><AdminDashboard /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/retreats" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout><AdminRetreats /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/products" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout><AdminProducts /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout><AdminOrders /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/blog" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout><AdminBlog /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/blog/pending" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout><AdminBlog /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/studio" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout><AdminStudio /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/calendar" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout><AdminBookingCalendar /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/members" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout><AdminMembers /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout><AdminSettings /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/newsletter" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout><AdminNewsletter /></AdminLayout>
            </ProtectedRoute>
          } />
        </Routes>
        </Suspense>
      </PledgeProvider>
    </CartProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;