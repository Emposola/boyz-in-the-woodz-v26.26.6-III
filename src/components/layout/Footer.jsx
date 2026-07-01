/* ============================================================
   FOOTER — BOYZ IN THE WOODZ — Premium Modern Design
   Zero Side Padding | 6-Column Layout | Enhanced UX
   Credits: Design & Dev by Emposola | emposola.co
   ============================================================ */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Instagram, Twitter, Youtube, Facebook, ArrowRight, 
  ExternalLink, Mail, CheckCircle, Loader2, 
  Leaf, Shield, Users, Compass, Scissors, TreePine,
  MapPin, Phone, Clock
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.09a8.22 8.22 0 004.78 1.52V7.15a4.85 4.85 0 01-1.01-.46z"/>
  </svg>
);

const SOCIALS = [
  { Icon: Instagram, href: 'https://instagram.com/boyzinthewoodz', label: 'Instagram' },
  { Icon: Twitter, href: 'https://twitter.com/boyzinthewoodz', label: 'X / Twitter' },
  { Icon: TikTokIcon, href: 'https://tiktok.com/@boyzinthewoodz', label: 'TikTok' },
  { Icon: Youtube, href: 'https://youtube.com/@boyzinthewoodz', label: 'YouTube' },
  { Icon: Facebook, href: 'https://facebook.com/boyzinthewoodz', label: 'Facebook' },
];

const FOREST_GREEN = '#2D5A27';
const SAND = '#D2B48C';

const COLUMNS = [
  {
    title: 'Explore',
    icon: Compass,
    links: [
      { label: 'The Experience', to: '/how-it-works' },
      { label: 'The Problem', to: '/the-problem' },
      { label: 'Who We Serve', to: '/who-we-serve' },
      { label: 'Survival Pack', to: '/shop/boyz' },
      { label: 'Brotherhood', to: '/about' },
      { label: 'The Code', to: '/the-code' },
      { label: 'Science', to: '/science' },
      { label: 'Journal', to: '/journal' },
    ]
  },
  {
    title: 'Brotherhood',
    icon: Users,
    links: [
      { label: 'Take the Pledge', to: '/the-code' },
      { label: 'Find a Chapter', to: '/locations' },
      { label: 'Brotherhood Map', to: '/locations' },
      { label: 'Proof Gallery', to: '/brotherhood/impact-stories' },
      { label: 'Virtual Campfire', to: '/studio' },
      { label: 'Confessions', to: '/journal' },
    ]
  },
  {
    title: 'Grooming',
    icon: Scissors,
    links: [
      { label: 'Book a Cut', to: '/barber/book' },
      { label: 'Services & Pricing', to: '/grooming-lodge' },
      { label: 'Our Barbers', to: '/barber/team' },
      { label: 'Membership', to: '/barber/membership' },
      { label: 'Walk-in Waitlist', to: '/waitlist' },
    ]
  },
  {
    title: 'Retreats',
    icon: TreePine,
    links: [
      { label: 'Upcoming Retreats', to: '/retreat-calendar' },
      { label: 'Apply Now', to: '/retreat/apply' },
      { label: 'Gear Loan', to: '/gear' },
      { label: 'Waitlist', to: '/retreat/waitlist' },
      { label: 'FAQ', to: '/about' },
      { label: 'Retreat Waiver', to: '/legal/retreat-waiver' },
    ]
  },
  {
    title: 'Contact',
    icon: Mail,
    links: [
      { label: 'Email Us', to: 'mailto:info@boyzinthewoodz.com', external: true },
      { label: 'Call Us', to: 'tel:+16033543034', external: true },
      { label: 'Find Us', to: '/locations' },
      { label: 'Support', to: '/contact' },
    ]
  },
];

const THE_CODE = ['No Phones', 'Show Up Physically', 'Respect Everyone', 'No Ego', 'Leave Better'];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email?.trim()) return;
    setSubscribing(true);
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email: email.trim(), source: 'footer' });
      if (error) {
        if (error.code === '23505') {
          setSubscribed(true);
          toast.success('Already subscribed, brother.');
        } else {
          throw error;
        }
      }
      setSubscribed(true);
      setEmail('');
    } catch (err) {
      console.error('Subscribe error:', err);
      toast.error('Something went wrong. Try again.');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="mt-auto pb-20 lg:pb-0">
      <div className="w-full overflow-hidden" style={{
        background: 'rgba(18,18,18,0.98)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        
        {/* ─── THE CODE STRIP ─── */}
        <div className="border-b border-white/5 py-3 bg-white/3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-center gap-2 sm:gap-6">
            <span className="text-[10px] font-heading tracking-[0.3em] uppercase" style={{ color: FOREST_GREEN }}>
              The Code
            </span>
            <span className="w-px h-4 bg-white/10" />
            {THE_CODE.map((rule, i) => (
              <React.Fragment key={rule}>
                <span className="text-[10px] tracking-wide uppercase text-white/40 hover:text-white/70 transition-colors">
                  {rule}
                </span>
                {i < THE_CODE.length - 1 && <span className="text-white/10">·</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ─── MAIN FOOTER ─── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          
          {/* ─── TOP SECTION: Brand + Contact + Social + Newsletter ─── */}
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 mb-10 lg:mb-14">
            {/* Brand - Left */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-3">
                <img 
                  src="/images/logos/favicon-logo__2.png" 
                  alt="BOYZ IN THE WOODZ" 
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <div className="font-heading text-xl tracking-wider" style={{ color: FOREST_GREEN }}>
                    BOYZ IN THE WOODZ
                  </div>
                  <div className="text-[10px] tracking-[0.2em] uppercase" style={{ color: SAND }}>
                    Brotherhood. Freedom. Nature.
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-white/40 leading-relaxed max-w-md">
                A brotherhood movement and outdoor brand for men who need space to breathe — 
                and brothers to breathe with.
              </p>
            </div>

            {/* ─── CONTACT + SOCIAL + NEWSLETTER ─── */}
            <div className="lg:col-span-3 space-y-4">
              
              {/* Contact - Email & Phone side by side */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <a 
                  href="mailto:info@boyzinthewoodz.com" 
                  className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors group"
                >
                  <Mail className="w-4 h-4 text-white/20 group-hover:text-primary transition-colors" />
                  <span>info@boyzinthewoodz.com</span>
                </a>
                <span className="hidden sm:block w-px h-4 bg-white/10" />
                <a 
                  href="tel:+16033543034" 
                  className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors group"
                >
                  <Phone className="w-4 h-4 text-white/20 group-hover:text-primary transition-colors" />
                  <span>+1 603-354-3034</span>
                </a>
              </div>

              {/* Contact + Social + Newsletter Row */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
                
                {/* Social Icons */}
                <div className="flex-shrink-0">
                  <p className="text-[9px] text-white/20 font-heading tracking-wider uppercase mb-1.5">
                    Follow Us
                  </p>
                  <div className="flex gap-2">
                    {SOCIALS.map(({ Icon: SIcon, href, label }) => (
                      <motion.a 
                        key={label} 
                        href={href} 
                        aria-label={label} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        whileHover={{ y: -3, scale: 1.1 }} 
                        transition={{ type: 'spring', stiffness: 400 }}
                        className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 border border-white/5 hover:border-primary/30"
                        style={{ background: 'rgba(255,255,255,0.04)', color: SAND }}
                      >
                        <SIcon className="w-4 h-4" />
                      </motion.a>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden sm:block w-px h-10 bg-white/5" />

                {/* Newsletter */}
                <div className="flex-1 w-full sm:max-w-xs">
                  <p className="text-[9px] text-white/20 font-heading tracking-wider uppercase mb-1.5">
                    Join the Brotherhood
                  </p>
                  {subscribed ? (
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-primary/5 border border-primary/20">
                      <CheckCircle className="w-4 h-4" style={{ color: FOREST_GREEN }} />
                      <p className="text-sm font-heading" style={{ color: FOREST_GREEN }}>Welcome to the brotherhood.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubscribe} className="flex gap-2">
                      <Input 
                        type="email" 
                        placeholder="Your email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        required
                        className="bg-white/5 border-white/10 text-white text-sm placeholder:text-white/20 focus-visible:ring-0 focus-visible:ring-primary/30 h-9"
                      />
                      <Button 
                        type="submit" 
                        size="icon" 
                        disabled={subscribing} 
                        className="flex-shrink-0 transition-all duration-300 hover:scale-105 h-9 w-9"
                        style={{ background: FOREST_GREEN }}
                      >
                        {subscribing ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <ArrowRight className="w-4 h-4 text-white" />}
                      </Button>
                    </form>
                  )}
                  <p className="text-[8px] text-white/15 mt-1">No spam. Only brotherhood drops.</p>
                </div>
              </div>
            </div>
          </div>

          {/* ─── COLUMNS GRID ─── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8 border-t border-white/5 pt-8">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <div className="flex items-center gap-2 mb-3">
                  <col.icon className="w-3.5 h-3.5" style={{ color: FOREST_GREEN }} />
                  <h4 className="text-[9px] font-heading tracking-[0.25em] uppercase" style={{ color: SAND }}>
                    {col.title}
                  </h4>
                </div>
                <div className="space-y-2">
                  {col.links.map((link) => (
                    link.external ? (
                      <a
                        key={link.label}
                        href={link.to}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-white/40 hover:text-white/70 transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        key={link.label}
                        to={link.to}
                        className="block text-sm text-white/40 hover:text-white/70 transition-colors"
                      >
                        {link.label}
                      </Link>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── CREDITS ─── */}
        <div className="border-t border-white/5 bg-white/3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-white/20">
            <span>© {new Date().getFullYear()} Boyz In The Woodz. All rights reserved.</span>
            
            <div className="flex items-center gap-3">
              <Link to="/privacy" className="hover:text-white/40 transition-colors">Privacy</Link>
              <span className="w-px h-2 bg-white/10" />
              <Link to="/terms" className="hover:text-white/40 transition-colors">Terms</Link>
              <span className="w-px h-2 bg-white/10" />
              <Link to="/sitemap" className="hover:text-white/40 transition-colors">Sitemap</Link>
            </div>

            <span className="flex items-center gap-1.5">
              Design by{' '}
              <a href="https://emposola.com" target="_blank" rel="noopener noreferrer"
                className="hover:text-white/40 transition-colors flex items-center gap-1" style={{ color: SAND }}>
                emposola <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}