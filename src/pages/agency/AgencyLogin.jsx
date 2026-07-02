import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { AGENCY_CREDENTIALS, AGENCY_API_KEY } from './agencyConfig';

const FG = '#2D5A27';

export default function AgencyLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate network delay
    await new Promise(r => setTimeout(r, 600));

    if (email === AGENCY_CREDENTIALS.email && password === AGENCY_CREDENTIALS.password) {
      sessionStorage.setItem('agency_key', AGENCY_API_KEY);
      navigate('/agency/blog', { replace: true });
    } else {
      setError('Invalid credentials');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="font-heading text-xs tracking-[0.3em] uppercase text-white/40 mb-2">Emposola</div>
          <h1 className="font-heading text-3xl tracking-wide uppercase mb-2" style={{ color: FG }}>Agency Login</h1>
          <p className="text-sm text-white/50">Sign in to manage the Boyz in The Woodz blog</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1.5 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="emposola@boyzinthewoodz.com" required
                className="pl-10 bg-secondary border-border h-11" />
            </div>
          </div>

          <div>
            <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1.5 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required
                className="pl-10 bg-secondary border-border h-11" />
            </div>
          </div>

          <Button type="submit" disabled={loading}
            className="w-full font-heading tracking-wider uppercase h-11 text-sm" style={{ background: FG }}>
            {loading ? 'Signing in...' : <span className="flex items-center gap-2">Sign In <ArrowRight className="w-4 h-4" /></span>}
          </Button>

          <p className="text-[11px] text-muted-foreground text-center pt-1">
            Emposola Agency Portal — no client access required
          </p>
        </form>
      </div>
    </div>
  );
}
