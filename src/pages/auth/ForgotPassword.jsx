/* ============================================================
   FORGOT PASSWORD — Request password reset
   ============================================================ */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Home, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) throw error;
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
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
          
          <h2 className="font-heading text-2xl tracking-wide text-white">Check Your Email</h2>
          <p className="text-gray-400 text-sm mt-2">
            We've sent password reset instructions to <strong className="text-white">{email}</strong>
          </p>
          <Link 
            to="/auth/signin" 
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm mt-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Sign In
          </Link>
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
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/50 via-amber-500 to-amber-500/50" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
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
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                <Mail className="w-8 h-8 text-amber-500" />
              </div>
            </div>
            <h1 className="font-heading text-3xl tracking-wide uppercase text-white">Reset Password</h1>
            <p className="text-gray-400 text-sm mt-2">
              Enter your email and we'll send you a secure reset link
            </p>
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
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-gray-300 text-sm font-medium">Email Address</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-amber-500 focus:ring-amber-500/20 h-11"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-700 font-heading tracking-wider uppercase py-6 text-base h-12"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </span>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Link 
              to="/auth/signin" 
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Don't have an account?{' '}
              <Link to="/auth/signup" className="text-primary/70 hover:text-primary transition-colors">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}