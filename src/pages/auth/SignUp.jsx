/* ============================================================
   SIGN UP — Secure registration page
   ============================================================ */
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle,
  Home, Shield, Eye, EyeOff, Check
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const queryParams = new URLSearchParams(location.search);
  const redirectTo = queryParams.get('redirect') || '/welcome';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service');
      return;
    }
    
    setLoading(true);
    
    try {
      await signUp(formData.email, formData.password, { 
        full_name: formData.fullName 
      });
      setSuccess(true);
      toast.success('Account created! Please check your email to verify.');
      setTimeout(() => navigate(`/auth/signin?redirect=${encodeURIComponent(redirectTo)}`), 3000);
    } catch (err) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-800/60 backdrop-blur-xl p-8 rounded-2xl border border-gray-700/50 max-w-md w-full text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500/50 via-green-500 to-green-500/50" />
          
          <div className="w-20 h-20 rounded-full bg-green-500/20 mx-auto flex items-center justify-center mb-6 border border-green-500/30">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          
          <h2 className="font-heading text-2xl tracking-wide text-white">Verify Your Email</h2>
          <p className="text-gray-400 text-sm mt-2">
            We've sent a verification link to <strong className="text-white">{formData.email}</strong>
          </p>
          <p className="text-gray-500 text-xs mt-4">
            Redirecting to sign in...
          </p>
          <div className="mt-4 w-full h-1 bg-gray-700 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 3 }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4 py-12">
      {/* Security Badge */}
      <div className="fixed top-4 right-4 flex items-center gap-2 text-xs text-gray-500">
        <Shield className="w-3.5 h-3.5" />
        <span>256-bit encrypted</span>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl p-8 relative overflow-hidden">
          {/* Decorative gradient */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          {/* Home Button */}
          <div className="absolute top-4 left-4">
            <Link 
              to="/" 
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors group"
            >
              <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </div>

          <div className="text-center mb-8 mt-4">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30">
                <User className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="font-heading text-3xl tracking-wide uppercase text-white">Create Account</h1>
            <p className="text-gray-400 text-sm mt-2">Join the Brotherhood securely</p>
          </div>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl mb-4 text-sm flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullName" className="text-gray-300 text-sm font-medium">Full Name</Label>
              <div className="relative mt-1.5">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="pl-10 bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-primary focus:ring-primary/20 h-11"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email" className="text-gray-300 text-sm font-medium">Email Address</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-primary focus:ring-primary/20 h-11"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="password" className="text-gray-300 text-sm font-medium">
                Password <span className="text-gray-500 text-xs font-normal">(min 6 characters)</span>
              </Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10 bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-primary focus:ring-primary/20 h-11"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="confirmPassword" className="text-gray-300 text-sm font-medium">Confirm Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-10 pr-10 bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-primary focus:ring-primary/20 h-11"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-gray-600 bg-gray-900/50 text-primary focus:ring-primary/20 cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-gray-400 cursor-pointer">
                I agree to the{' '}
                <Link to="/terms" className="text-primary/70 hover:text-primary transition-colors">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-primary/70 hover:text-primary transition-colors">Privacy Policy</Link>
              </label>
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 font-heading tracking-wider uppercase py-6 text-base h-12"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/auth/signin" className="text-primary hover:text-primary/80 font-medium transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}