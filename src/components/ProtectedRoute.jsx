import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { AGENCY_API_KEY } from '@/pages/agency/agencyConfig';

const DefaultFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
  </div>
);

export default function ProtectedRoute({ children, requiredRole, fallback = <DefaultFallback /> }) {
  const { user, isAuthenticated, isLoadingAuth, authChecked } = useAuth();

  // Still resolving session
  if (isLoadingAuth || !authChecked) {
    return fallback;
  }

  // Authenticated but profile not yet loaded — wait for it
  // This happens in the brief window between onAuthStateChange firing
  // and fetchOrCreateUserProfile completing
  if (isAuthenticated && !user) {
    return fallback;
  }

  // Not logged in at all — allow agency routes to bypass Supabase auth
  if (!isAuthenticated && requiredRole !== 'agency') {
    const returnTo = encodeURIComponent(window.location.pathname + window.location.search);
    return <Navigate to={`/auth/signin?redirect=${returnTo}`} replace />;
  }

  if (!isAuthenticated && requiredRole === 'agency' && !sessionStorage.getItem('agency_key')) {
    return <Navigate to="/agency/signin" replace />;
  }

  // Logged in but wrong role
  if (requiredRole === 'admin' && !user?.is_admin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-4xl tracking-wide uppercase mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You don't have permission to access this page.</p>
          <a href="/" className="text-primary hover:underline">Go Home</a>
        </div>
      </div>
    );
  }

  if (requiredRole === 'agency') {
    const agencyKey = sessionStorage.getItem('agency_key');
    if (!agencyKey || agencyKey !== AGENCY_API_KEY) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-heading text-4xl tracking-wide uppercase mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-6">Agency credentials required.</p>
            <a href="/agency/signin" className="text-primary hover:underline">Agency Login</a>
          </div>
        </div>
      );
    }
  }

  return children;
}
