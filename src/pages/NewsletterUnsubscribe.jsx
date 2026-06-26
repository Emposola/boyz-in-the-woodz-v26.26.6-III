import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FG = '#2D5A27';

export default function NewsletterUnsubscribe() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    if (!email) { setStatus('no-email'); return; }
    (async () => {
      try {
        await supabase.from('newsletter_unsubscribes').insert({ email });
        await supabase.from('newsletter_subscribers').update({ active: false }).eq('email', email);
        setStatus('done');
      } catch { setStatus('error'); }
    })();
  }, [email]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0f0f0f' }}>
      <div className="max-w-md w-full text-center">
        {status === 'processing' && (
          <div>
            <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" style={{ color: FG }} />
            <p className="text-white/60">Processing...</p>
          </div>
        )}
        {status === 'done' && (
          <div>
            <X className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h1 className="font-heading text-2xl tracking-wide uppercase text-white mb-2">Unsubscribed</h1>
            <p className="text-white/60 text-sm mb-6">{email} has been removed from our list.</p>
            <Button asChild className="font-heading tracking-wider uppercase text-xs" style={{ background: FG }}>
              <Link to="/">Return Home</Link>
            </Button>
          </div>
        )}
        {status === 'no-email' && (
          <div>
            <X className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-white/60">No email provided. Use the link from the email.</p>
          </div>
        )}
        {status === 'error' && (
          <div>
            <X className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-white/60">Something went wrong. Try again.</p>
          </div>
        )}
      </div>
    </div>
  );
}
