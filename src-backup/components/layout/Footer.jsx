/* ============================================================
   FOOTER — Boyz In The Woodz — Floating 5-Column Design
   Credits: Design & Dev by Emposola | emposola.co
   ============================================================ */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Youtube, Facebook, ArrowRight, ExternalLink, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.09a8.22 8.22 0 004.78 1.52V7.15a4.85 4.85 0 01-1.01-.46z"/>
  </svg>
);

const SOCIALS = [
  { Icon: Instagram, href: '#', label: 'Instagram' },
  { Icon: Twitter, href: '#', label: 'X / Twitter' },
  { Icon: TikTokIcon, href: '#', label: 'TikTok' },
  { Icon: Youtube, href: '#', label: 'YouTube' },
  { Icon: Facebook, href: '#', label: 'Facebook' },
];

const FOREST_GREEN = '#2D5A27';
const SAND = '#D2B48C';

const COLUMN_EXPLORE = [
  { label: 'The Experience', to: '/services' },
  { label: 'Survival Pack', to: '/shop/boyz' },
  { label: 'Brotherhood', to: '/about' },
  { label: 'The Code', to: '/the-code' },
  { label: 'Science', to: '/science' },
  { label: 'Journal', to: '/journal' },
];

const COLUMN_BROTHERHOOD = [
  { label: 'Take the Pledge', to: '/pledge-wall' },
  { label: 'Find a Chapter', to: '/chapters' },
  { label: 'Brotherhood Map', to: '/locations' },
  { label: 'Proof Gallery', to: '/proofs' },
  { label: 'Virtual Campfire', to: '/studio' },
  { label: 'Confessions', to: '/journal' },
];

const COLUMN_RETREATS = [
  { label: 'Upcoming Retreats', to: '/retreat-calendar' },
  { label: 'Apply Now', to: '/retreat/apply' },
  { label: 'Gear Loan', to: '/gear' },
  { label: 'Waitlist', to: '/retreat/waitlist' },
  { label: 'FAQ', to: '/about' },
  { label: 'Retreat Waiver', to: '/legal/retreat-waiver' },
];

const COLUMN_LEGAL = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Service', to: '/terms' },
  { label: 'Retreat Cancellation', to: '/legal/retreat-cancellation' },
  { label: 'Returns', to: '/returns' },
  { label: 'Accessibility', to: '/privacy' },
];

const THE_CODE = ['No Phones', 'Show Up Physically', 'Respect Everyone', 'No Ego', 'Leave Better'];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); }
  };

  return (
    <footer className="pb-20 lg:pb-4 px-4 mt-12">
      <div
        className="rounded-[28px] overflow-hidden"
        style={{
          background: 'rgba(28,28,28,0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {/* The Code Strip */}
        <div className="border-b border-white/10 py-3 bg-white/5">
          <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-3 md:gap-8">
            <span className="text-xs font-heading tracking-widest uppercase" style={{ color: FOREST_GREEN }}>The Code</span>
            {THE_CODE.map((rule, i) => (
              <React.Fragment key={rule}>
                <span className="text-xs tracking-wide uppercase text-white/50">{rule}</span>
                {i < THE_CODE.length - 1 && <span className="text-white/20 hidden sm:inline">·</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main 5-column grid */}
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">

          {/* Col 1 – Brand */}
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-1">
            <div className="font-heading text-xl tracking-wider mb-1" style={{ color: FOREST_GREEN }}>
              BOYZ IN THE WOODZ
            </div>
            <div className="text-xs tracking-widest mb-3" style={{ color: SAND }}>
              Brotherhood. Freedom. Nature.
            </div>
            <p className="text-sm text-white/50 leading-relaxed mb-5">
              A brotherhood movement and outdoor clothing brand for men who need space to breathe — and brothers to breathe with.
            </p>
            <div className="flex gap-2 flex-wrap mb-5">
              {SOCIALS.map(({ Icon: SIcon, href, label }) => (
                <motion.a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.15 }} transition={{ type: 'spring', stiffness: 400 }}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                  style={{ background: 'rgba(255,255,255,0.08)', color: SAND }}>
                  <SIcon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
            {/* Newsletter */}
            {subscribed ? (
              <p className="text-sm font-heading" style={{ color: FOREST_GREEN }}>Welcome to the brotherhood.</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <Input type="email" placeholder="Your email" value={email} onChange={e => setEmail(e.target.value)}
                  className="bg-white/10 border-white/20 text-white text-sm placeholder:text-white/30 focus-visible:ring-0" />
                <Button type="submit" size="icon" className="flex-shrink-0" style={{ background: FOREST_GREEN }}>
                  <ArrowRight className="w-4 h-4 text-white" />
                </Button>
              </form>
            )}
            <p className="text-xs text-white/30 mt-2">No spam, only brotherhood drops.</p>
          </div>

          {/* Col 2 – Explore */}
          <div>
            <h4 className="text-xs font-heading tracking-[0.25em] uppercase mb-4" style={{ color: FOREST_GREEN }}>Explore</h4>
            <div className="space-y-2.5">
              {COLUMN_EXPLORE.map(link => (
                <Link key={link.label} to={link.to}
                  className="block text-sm text-white/50 hover:text-white transition-colors">{link.label}</Link>
              ))}
            </div>
          </div>

          {/* Col 3 – Brotherhood */}
          <div>
            <h4 className="text-xs font-heading tracking-[0.25em] uppercase mb-4" style={{ color: FOREST_GREEN }}>Brotherhood</h4>
            <div className="space-y-2.5">
              {COLUMN_BROTHERHOOD.map(link => (
                <Link key={link.label} to={link.to}
                  className="block text-sm text-white/50 hover:text-white transition-colors">{link.label}</Link>
              ))}
            </div>
          </div>

          {/* Col 4 – Retreats */}
          <div>
            <h4 className="text-xs font-heading tracking-[0.25em] uppercase mb-4" style={{ color: FOREST_GREEN }}>Retreats</h4>
            <div className="space-y-2.5">
              {COLUMN_RETREATS.map(link => (
                <Link key={link.label} to={link.to}
                  className="block text-sm text-white/50 hover:text-white transition-colors">{link.label}</Link>
              ))}
            </div>
          </div>

          {/* Col 5 – Legal & Contact */}
          <div>
            <h4 className="text-xs font-heading tracking-[0.25em] uppercase mb-4" style={{ color: FOREST_GREEN }}>Legal & Contact</h4>
            <div className="space-y-2.5">
              {COLUMN_LEGAL.map(link => (
                <Link key={link.label} to={link.to}
                  className="block text-sm text-white/50 hover:text-white transition-colors">{link.label}</Link>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <a href="mailto:hello@boyzinthewoodz.com"
                className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
                <Mail className="w-3.5 h-3.5" />
                hello@boyzinthewoodz.com
              </a>
            </div>
          </div>
        </div>

        {/* Credits */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-white/30">
            <span>© {new Date().getFullYear()} Boyz In The Woodz. All rights reserved.</span>
            <span className="flex items-center gap-1.5">
              Website Design & Development by{' '}
              <a href="https://emposola.co" target="_blank" rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1" style={{ color: SAND }}>
                emposola <ExternalLink className="w-3 h-3" />
              </a>
              {' '}| emposola.co
            </span>
            <span style={{ color: SAND }}>Take a brother. Leave better.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}