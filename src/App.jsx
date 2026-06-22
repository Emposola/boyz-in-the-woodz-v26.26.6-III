/* ============================================================
   APP ROUTER — Boyz In The Woodz + Barbershop Ecosystem
   Phase 1 + Phase 2: Booking, Retreats, Waitlist, Events
   ============================================================ */

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

/* --- Phase 1: Public Pages --- */
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import TheCode from './pages/TheCode';
import Science from './pages/Science';
import Archetypes from './pages/Archetypes';
import Journal from './pages/Journal';
import Points from './pages/Points';
import Cart from './pages/Cart';
import Locations from './pages/Locations';
import About from './pages/About';

/* --- Phase 1: Barber Pages --- */
import BarberServices from './pages/BarberServices';
import BarberTeam from './pages/BarberTeam';
import BarberGallery from './pages/BarberGallery';
import Membership from './pages/Membership';
import BarberFAQ from './pages/BarberFAQ';

/* --- Phase 2: Barber Booking --- */
import BookAppointment from './pages/BookAppointment';
import WalkInWaitlistLive from './pages/WalkInWaitlistLive';
import BarberProfile from './pages/BarberProfile';
import AdminBookingCalendar from './pages/AdminBookingCalendar';

/* --- Phase 2: Retreats --- */
import RetreatApply from './pages/RetreatApply';
import RetreatWaitlist from './pages/RetreatWaitlist';
import RetreatConfirmed from './pages/RetreatConfirmed';
import RetreatSurvey from './pages/RetreatSurvey';

/* --- Phase 2: Events --- */
import Events from './pages/Events';

/* --- Account & Legal --- */
import Account from './pages/Account';
import Legal from './pages/Legal';

/* --- Brand Pages --- */
import TheProblem from './pages/TheProblem';
import WhoWeServe from './pages/WhoWeServe';
import HowItWorks from './pages/HowItWorks';

/* --- Phase 3: New Pages --- */
import Welcome from './pages/Welcome';
import Contact from './pages/Contact';
import CaseStudies from './pages/CaseStudies';
import StudioLive from './pages/StudioLive';
import AdminStudio from './pages/AdminStudio';
import Sitemap from './pages/Sitemap';

/* --- New Brand Pages --- */
import Services from './pages/Services';
import RetreatCalendar from './pages/RetreatCalendar';
import LegalRetreat from './pages/LegalRetreat';
import GearLoan from './pages/GearLoan';
import ShopMain from './pages/ShopMain';
import RetreatDetail from './pages/RetreatDetail';
import RetreatPages from './pages/RetreatPages';
import BrotherhoodDirectory from './pages/BrotherhoodDirectory';
import BrotherhoodHub from './pages/BrotherhoodHub';
import ScienceHub from './pages/ScienceHub';
import JournalSubmit from './pages/JournalSubmit';
import AdminBlog from './pages/AdminBlog';
import ImpactStories from './pages/ImpactStories';
import BrotherhoodLetters from './pages/BrotherhoodLetters';
import BreathingTool from './pages/BreathingTool';
import DailyReset from './pages/DailyReset';
import BadgesPage from './pages/BadgesPage';
import MonthlyChallenge from './pages/MonthlyChallenge';
import LimitedDrops from './pages/LimitedDrops';
import TimeCapsule from './pages/TimeCapsule';
import MoodTracker from './pages/MoodTracker';

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
        <Routes>
          {/* ── Auth Routes (no layout) ── */}
          <Route path="/auth/signin" element={<SignIn />} />
          <Route path="/auth/signup" element={<SignUp />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />

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
            <Route path="/barber/book" element={<ProtectedRoute><BookAppointment /></ProtectedRoute>} />
            <Route path="/barber/walkin" element={<WalkInWaitlistLive />} />
            <Route path="/barber/profile/:id" element={<BarberProfile />} />

            {/* ── New Features ── */}
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/studio" element={<StudioLive />} />
            <Route path="/admin/studio" element={<ProtectedRoute requiredRole="admin"><AdminStudio /></ProtectedRoute>} />

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
            <Route path="/journal/submit" element={<ProtectedRoute><JournalSubmit /></ProtectedRoute>} />
            <Route path="/journal/category/:cat" element={<Journal />} />

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

            {/* ── Admin ── */}
            <Route path="/admin/blog" element={<ProtectedRoute requiredRole="admin"><AdminBlog /></ProtectedRoute>} />
            <Route path="/admin/blog/pending" element={<ProtectedRoute requiredRole="admin"><AdminBlog /></ProtectedRoute>} />

            {/* ── Legal ── */}
            <Route path="/legal/retreat-waiver" element={<LegalRetreat />} />
            <Route path="/legal/retreat-cancellation" element={<LegalRetreat />} />
            <Route path="/legal/pledge-terms" element={<LegalRetreat />} />
            <Route path="/legal/chapter-terms" element={<LegalRetreat />} />
            <Route path="/legal/merchandise-safety" element={<LegalRetreat />} />

            {/* ── Admin ── */}
            <Route path="/admin/calendar" element={<ProtectedRoute requiredRole="admin"><AdminBookingCalendar /></ProtectedRoute>} />

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
        </Routes>
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