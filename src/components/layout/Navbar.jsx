/* ============================================================
   NAVBAR — BOYZ IN THE WOODZ — Premium Ultra Enhanced
   ============================================================ */
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, X, ShoppingBag, User, Calendar, ChevronDown, Search, Bell, 
  Instagram, Facebook, Youtube, Twitter, ArrowRight, ChevronRight, 
  Scissors, Trees, Compass, Users, BookOpen, Zap, LayoutDashboard,
  Home, Leaf, Shield, Heart, Trophy, Camera, Mail, Phone,
  Award, Clock, CheckCircle, Gift, Star, Sparkles, Crown
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/cartContext';
import { useAuth } from '@/lib/AuthContext';

// ============================================================
// BRAND CONSTANTS
// ============================================================
const LOGO_URL = '/images/logos/logo-navbar-about.jpg';
const LOGO_ALT = 'BOYZ IN THE WOODZ - Brotherhood. Freedom. Nature.';
const FG = '#2D5A27';
const SAND = '#D2B48C';
const GOLD = '#D4AF37';

// ============================================================
// SOCIAL LINKS
// ============================================================
const SOCIAL_LINKS = [
  { 
    href: 'https://instagram.com/boyzinthewoodz', 
    label: 'Follow us on Instagram', 
    icon: <Instagram className="w-3.5 h-3.5" aria-hidden="true" />, 
    brandColor: '#E4405F',
    hoverBg: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)' 
  },
  { 
    href: 'https://facebook.com/boyzinthewoodz', 
    label: 'Follow us on Facebook', 
    icon: <Facebook className="w-3.5 h-3.5" aria-hidden="true" />, 
    brandColor: '#1877F2',
    hoverBg: '#1877F2' 
  },
  { 
    href: 'https://twitter.com/boyzinthewoodz', 
    label: 'Follow us on X/Twitter', 
    icon: <Twitter className="w-3.5 h-3.5" aria-hidden="true" />, 
    brandColor: '#000000',
    hoverBg: '#000000' 
  },
  { 
    href: 'https://youtube.com/boyzinthewoodz', 
    label: 'Subscribe on YouTube', 
    icon: <Youtube className="w-3.5 h-3.5" aria-hidden="true" />, 
    brandColor: '#FF0000',
    hoverBg: '#FF0000' 
  },
  { 
    href: 'https://tiktok.com/@boyzinthewoodz', 
    label: 'Follow us on TikTok', 
    icon: <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.02a8.18 8.18 0 004.78 1.52V7.1a4.85 4.85 0 01-1.01-.41z"/></svg>, 
    brandColor: '#000000',
    hoverBg: '#000000' 
  },
];

// ============================================================
// TAGLINES
// ============================================================
const TAGLINES = [
  'Brotherhood. Freedom. Nature.',
  'Take a Brother. Leave Better.',
  'Wild at Heart. Strong in Spirit.',
  'Find Your Tribe. Find Yourself.',
];

// ============================================================
// TYPING ANIMATION HOOK
// ============================================================
function useTypewriter(strings) {
  const [display, setDisplay] = useState(strings[0]);
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState("typing");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    const full = strings[idx % strings.length];
    let timer;
    if (phase === "typing") {
      if (display.length < full.length) {
        timer = setTimeout(() => setDisplay(full.slice(0, display.length + 1)), 60);
      } else {
        timer = setTimeout(() => setPhase("pause"), 2000);
      }
    } else if (phase === "pause") {
      timer = setTimeout(() => setPhase("deleting"), 100);
    } else if (phase === "deleting") {
      if (display.length > 0) {
        timer = setTimeout(() => setDisplay(display.slice(0, -1)), 35);
      } else {
        setIdx(i => (i + 1) % strings.length);
        setPhase("typing");
      }
    }
    return () => clearTimeout(timer);
  }, [display, phase, idx, strings, isClient]);

  return display;
}

// ============================================================
// NAVIGATION LINKS
// ============================================================
const NAV_LINKS = [
  { label: 'Home', href: '/', icon: Home, title: 'Home - BOYZ IN THE WOODZ' },
  {
    label: 'Shop', 
    href: '/shop',
    icon: ShoppingBag,
    previewImg: '/images/unsplash/hiking-backpack.webp',
    previewTitle: 'Survival Pack 01',
    previewDesc: 'Gear forged in the woods. Worn as proof.',
    previewBtn: 'Shop All',
    title: 'Shop Outdoor Gear & Apparel',
    children: [
      { label: 'All Products', href: '/shop', desc: 'Browse the collection' },
      { label: 'Apparel', href: '/shop/apparel', desc: 'Hoodies, tees & more' },
      { label: 'Gear', href: '/shop/gear', desc: 'Journals, bottles & patches' },
      { label: 'Limited Edition', href: '/shop/limited-edition', desc: 'Exclusive drops' },
      { label: 'Bundles', href: '/shop/bundles', desc: 'Save on collections' },
      { label: 'Gift Cards', href: '/gift', desc: 'Give the gift of brotherhood' },
    ]
  },
  {
    label: 'Men\'s Grooming', 
    href: '/grooming-lodge',
    icon: Scissors,
    previewImg: '/images/unsplash/camp-stove.webp',
    previewTitle: 'The Grooming Lodge',
    previewDesc: 'Precision cuts. Brotherhood talks.',
    previewBtn: 'Book Now',
    title: 'Men\'s Grooming & Barbershop',
    children: [
      { label: 'Book a Cut', href: '/barber/book', desc: 'Reserve your spot' },
      { label: 'Services & Pricing', href: '/grooming-lodge', desc: 'See what we offer' },
      { label: 'Our Barbers', href: '/barber/team', desc: 'Meet the team' },
      { label: 'Membership', href: '/barber/membership', desc: 'Exclusive perks' },
      { label: 'Walk-in Waitlist', href: '/waitlist', desc: 'Join the queue' },
    ]
  },
  {
    label: 'The Experience', 
    href: '/how-it-works',
    icon: Trees,
    previewImg: '/images/unsplash/camp-stove.webp',
    previewTitle: 'Find Your Reset',
    previewDesc: 'Weekend Reset • Deep Dive • Expedition',
    previewBtn: 'Explore Retreats',
    title: 'Men\'s Retreats & Wellness Experiences',
    children: [
      { label: 'How It Works', href: '/how-it-works', desc: 'Your journey to brotherhood' },
      { label: 'Weekend Reset (2 days)', href: '/retreat/weekend-reset', desc: 'The perfect introduction' },
      { label: 'Deep Dive (3 days)', href: '/retreat/deep-dive', desc: 'Go deeper with brothers' },
      { label: 'Expedition (5 days)', href: '/retreat/expedition', desc: 'The full wilderness experience' },
      { label: 'Retreat Calendar', href: '/retreat-calendar', desc: 'Upcoming dates & locations' },
      { label: 'Apply Now', href: '/retreat/apply', desc: 'Reserve your spot' },
    ]
  },
  {
    label: 'Brotherhood', 
    href: '/about',
    icon: Users,
    previewImg: '/images/unsplash/hiking-backpack.webp',
    previewTitle: 'Join the Brotherhood',
    previewDesc: 'Take the pledge. Find your tribe.',
    previewBtn: 'Take the Pledge',
    title: 'The Brotherhood - Men\'s Community',
    children: [
      { label: 'Take the Pledge', href: '/the-code', desc: 'Commit to the brotherhood' },
      { label: 'Brother Directory', href: '/brotherhood/directory', desc: 'Find brothers near you' },
      { label: 'Brotherhood Map', href: '/locations', desc: 'See where we are' },
      { label: 'Leaderboard', href: '/brotherhood/leaderboard', desc: 'Top brothers' },
      { label: 'Virtual Campfire', href: '/studio', desc: 'Connect online' },
      { label: 'Impact Stories', href: '/brotherhood/impact-stories', desc: 'Real brotherhood moments' },
    ]
  },
  {
    label: 'Science', 
    href: '/the-problem',
    icon: Zap,
    previewImg: '/images/unsplash/camp-stove.webp',
    previewTitle: 'The Science',
    previewDesc: 'Cortisol. Connection. Mental health.',
    previewBtn: 'Learn More',
    title: 'The Science Behind Men\'s Wellness',
    children: [
      { label: 'The Problem', href: '/the-problem', desc: 'Why we exist' },
      { label: 'Who We Serve', href: '/who-we-serve', desc: 'For the modern man' },
      { label: 'Cortisol & Nature', href: '/science/cortisol', desc: 'How nature heals' },
      { label: "Men's Mental Health", href: '/science/mental-health', desc: 'Breaking the silence' },
      { label: 'Testimonials', href: '/science/testimonials', desc: 'Real stories of change' },
    ]
  },
  {
    label: 'Journal', 
    href: '/journal',
    icon: BookOpen,
    previewImg: '/images/unsplash/hiking-backpack.webp',
    previewTitle: 'The Journal',
    previewDesc: 'Field notes. Stories. Brotherhood.',
    previewBtn: 'Read All Stories',
    title: 'The Journal - Stories & Field Notes',
    children: [
      { label: 'All Stories', href: '/journal', desc: 'Browse the journal' },
      { label: 'Field Notes', href: '/journal/category/Field%20Notes', desc: 'Retreat dispatches' },
      { label: 'Brotherhood Stories', href: '/journal/category/Brotherhood%20Stories', desc: 'Real brotherhood moments' },
      { label: 'Science', href: '/journal/category/Science', desc: 'The research behind it all' },
      { label: 'Write for Us', href: '/journal/submit', desc: 'Share your story' },
    ]
  },
];

// ============================================================
// DROPDOWN MENU COMPONENT
// ============================================================
function DropdownMenu({ items, isOpen, previewImg, previewTitle, previewDesc, previewBtn, onClose }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [currentPreview, setCurrentPreview] = useState(previewImg);

  const handleItemHover = (index, item) => {
    setHoveredIndex(index);
    if (item.previewImg) {
      setCurrentPreview(item.previewImg);
    } else {
      setCurrentPreview(previewImg);
    }
  };

  const handleItemLeave = () => {
    setHoveredIndex(null);
    setCurrentPreview(previewImg);
  };

  const handleItemClick = () => {
    if (onClose) onClose();
  };

  const handleViewClick = () => {
    if (onClose) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -5, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -5, scale: 0.98 }}
          transition={{ duration: 0.15 }}
          className="flex w-[820px] max-w-[92vw]"
          style={{
            background: 'rgba(10,10,10,0.98)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.25)',
            boxShadow: '0 30px 80px -15px rgba(0,0,0,0.9)',
            overflow: 'hidden',
            minHeight: '280px',
          }}
          role="menu"
          aria-label="Navigation dropdown"
        >
          <div className="flex-1 p-4 min-w-[380px]">
            <div className="grid grid-cols-2 gap-1 h-full">
              {items.map((item, idx) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={handleItemClick}
                  className="group flex flex-col justify-center px-4 py-3 rounded-xl transition-all duration-200 hover:bg-white/5 min-h-[56px]"
                  onMouseEnter={() => handleItemHover(idx, item)}
                  onMouseLeave={handleItemLeave}
                  role="menuitem"
                  title={item.title || item.label}
                >
                  <span className="text-sm text-white font-medium group-hover:text-[#D2B48C] transition-colors">
                    {item.label}
                  </span>
                  {item.desc && (
                    <span className="text-[11px] text-white/40 group-hover:text-white/60 transition-colors mt-0.5">
                      {item.desc}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div className="w-64 flex-shrink-0 relative overflow-hidden" style={{ minHeight: '280px', height: '100%' }}>
            <div className="absolute inset-0">
              <img 
                src={currentPreview} 
                alt={previewTitle} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h4 className="text-white font-heading text-lg mb-1" style={{ color: '#D2B48C' }}>{previewTitle}</h4>
                <p className="text-white/50 text-xs mb-3">{previewDesc}</p>
                <Link
                  to={items[0]?.href || '/'}
                  onClick={handleViewClick}
                  className="inline-flex items-center gap-2 text-[11px] font-semibold text-white px-4 py-2 rounded-full hover:scale-105 transition-all duration-300"
                  style={{ background: '#2D5A27' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#D4AF37'; e.currentTarget.style.color = '#000'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#2D5A27'; e.currentTarget.style.color = '#fff'; }}
                >
                  {previewBtn} <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================
// MOBILE NAV LINK COMPONENT
// ============================================================
function MobileNavLink({ link, onClose }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = link.children && link.children.length > 0;

  if (!hasChildren) {
    return (
      <Link
        to={link.href}
        onClick={onClose}
        className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-white/80 hover:bg-white/10 transition-colors duration-200"
        title={link.title || link.label}
      >
        {link.icon && <link.icon className="w-4 h-4" style={{ color: '#D2B48C' }} aria-hidden="true" />}
        {link.label}
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-semibold text-white/80 hover:bg-white/10 transition-colors duration-200"
        aria-expanded={isExpanded}
        aria-label={`Toggle ${link.label} menu`}
      >
        <span className="flex items-center gap-3">
          {link.icon && <link.icon className="w-4 h-4" style={{ color: '#D2B48C' }} aria-hidden="true" />}
          {link.label}
        </span>
        <ChevronDown className={`w-4 h-4 text-white/40 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pl-4 pb-1 border-l border-white/5 ml-3 space-y-0.5">
              {link.children.map((child) => (
                <Link
                  key={child.href}
                  to={child.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-white/60 hover:text-white hover:bg-white/8 transition-colors duration-200 w-full"
                  title={child.title || child.label}
                >
                  <span style={{ color: '#D2B48C' }}>
                    {link.icon ? <link.icon className="w-3.5 h-3.5" aria-hidden="true" /> : <Trees className="w-3.5 h-3.5" aria-hidden="true" />}
                  </span>
                  <span>{child.label}</span>
                  <ChevronRight className="w-3 h-3 ml-auto opacity-30" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// SOCIAL ICONS COMPONENT
// ============================================================
function SocialIcons({ className = '', isMobile = false }) {
  return (
    <div 
      className={`flex items-center justify-center gap-2 ${isMobile ? 'px-3 py-1.5' : 'px-4 py-2'} rounded-full ${className}`} 
      style={{
        background: isMobile ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.25)',
        width: isMobile ? '100%' : 'auto',
        maxWidth: isMobile ? '100%' : 'none',
      }}
      role="group"
      aria-label="Social media links"
    >
      {SOCIAL_LINKS.map((s, idx) => (
        <a 
          key={idx} 
          href={s.href} 
          target="_blank" 
          rel="noopener noreferrer" 
          aria-label={s.label}
          className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{ 
            color: '#ffffff',
            background: isMobile ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
          onMouseEnter={e => { 
            e.currentTarget.style.background = s.hoverBg; 
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.boxShadow = `0 0 25px ${s.brandColor}30`;
            e.currentTarget.style.borderColor = s.brandColor;
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={e => { 
            e.currentTarget.style.background = isMobile ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)'; 
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {s.icon}
        </a>
      ))}
    </div>
  );
}

// ============================================================
// MAIN NAVBAR COMPONENT
// ============================================================
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState({});
  const { itemCount } = useCart();
  const { user } = useAuth();
  const location = useLocation();
  const navRef = useRef(null);
  const headerRef = useRef(null);
  const navigate = useNavigate();
  const dropdownTimeout = useRef(null);
  const tagline = useTypewriter(TAGLINES);

  const [dropdownCoords, setDropdownCoords] = useState({});

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
    setMobileExpanded({});
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    if (openDropdown && headerRef.current) {
      const rect = headerRef.current.getBoundingClientRect();
      const navbarCenter = rect.left + rect.width / 2;
      const dropdownLeft = navbarCenter - 410;
      
      setDropdownCoords(prev => ({
        ...prev,
        [openDropdown]: {
          top: rect.bottom + 0.5,
          left: dropdownLeft
        }
      }));
    }
  }, [openDropdown]);

  const handleDropdownEnter = (dropdown) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setOpenDropdown(dropdown);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  const handleDropdownClose = () => {
    setOpenDropdown(null);
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
  };

  const toggleMobileExpanded = (key) => {
    setMobileExpanded(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <>
      {/* ─── NAVBAR ─── */}
      <header ref={headerRef} className="fixed top-0 left-0 right-0 z-40 flex flex-col items-center" style={{ padding: '1px 5px' }} role="banner" aria-label="Main navigation">
        <motion.nav
          ref={navRef}
          animate={{
            background: scrolled ? 'rgba(8,8,8,0.96)' : 'rgba(8,8,8,0.88)',
          }}
          transition={{ duration: 0.3 }}
          style={{
            width: '100%',
            borderRadius: '28px',
            border: '1px solid rgba(255,255,255,0.25)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
          }}
          role="navigation"
          aria-label="Main menu"
        >
          {/* ── DESKTOP LAYOUT ── */}
          <div className="hidden lg:flex flex-col w-full">
            <div className="flex items-center justify-between px-6 py-1 border-b border-white/5">
              <div className="flex items-center gap-3">
                <a href="tel:+16033543034" className="flex items-center gap-1.5 text-white/40 hover:text-white text-[10px] transition-colors" aria-label="Call us">
                  <Phone className="w-3 h-3" aria-hidden="true" />
                  <span>+1 603-354-3034</span>
                </a>
                <span className="text-white/10" aria-hidden="true">|</span>
                <a href="mailto:hello@boyzinthewoodz.com" className="flex items-center gap-1.5 text-white/40 hover:text-white text-[10px] transition-colors" aria-label="Email us">
                  <Mail className="w-3 h-3" aria-hidden="true" />
                  <span>hello@boyzinthewoodz.com</span>
                </a>
              </div>

              <div className="text-[10px] tracking-widest uppercase text-white/40 font-light flex items-center gap-1">
                <Leaf className="w-3 h-3" style={{ color: FG }} aria-hidden="true" />
                <span>{tagline}</span>
                <span className="inline-block w-0.5 h-2.5" style={{ background: FG }} aria-hidden="true" />
              </div>

              <SocialIcons />
            </div>

            <div className="flex items-center justify-between w-full px-5 py-1.5">
              <Link to="/" className="flex items-center gap-3 shrink-0 group" aria-label="BOYZ IN THE WOODZ - Home">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden flex items-center justify-center shrink-0 shadow-md hover:shadow-lg transition-shadow">
                  <img 
                    src={LOGO_URL} 
                    alt={LOGO_ALT} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    width="56"
                    height="56"
                    loading="eager"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading text-xl md:text-2xl tracking-wider leading-tight">
                    <span style={{ color: FG }}>BOYZ</span>
                    <span style={{ color: '#fff' }}> IN THE </span>
                    <span style={{ color: SAND }}>WOODZ</span>
                  </span>
                  <span className="text-[7px] md:text-[8px] tracking-[0.2em] uppercase text-white/40 font-light">
                    Brotherhood • Freedom • Nature
                  </span>
                </div>
              </Link>

              <div className="flex items-center gap-0.5">
                {NAV_LINKS.map((link) => {
                  const hasChildren = link.children && link.children.length > 0;
                  const dropdownKey = link.label.toLowerCase().replace(/\s+/g, '');
                  const isActive = location.pathname === link.href || location.pathname.startsWith(link.href + '/');
                  
                  return (
                    <div
                      key={link.href}
                      className="relative"
                      onMouseEnter={() => hasChildren && handleDropdownEnter(dropdownKey)}
                      onMouseLeave={hasChildren ? handleDropdownLeave : undefined}
                    >
                      {hasChildren ? (
                        <button
                          className="flex items-center gap-1 text-[10px] font-medium tracking-wide uppercase px-2.5 py-1 rounded-lg transition-all hover:bg-white/5 whitespace-nowrap"
                          style={{
                            color: isActive ? SAND : 'rgba(255,255,255,0.8)',
                          }}
                          aria-expanded={openDropdown === dropdownKey}
                          aria-haspopup="true"
                          title={link.title || link.label}
                        >
                          {link.label}
                          <ChevronDown className="w-2 h-2 opacity-60" aria-hidden="true" />
                        </button>
                      ) : (
                        <Link
                          to={link.href}
                          className="text-[10px] font-medium tracking-wide uppercase px-2.5 py-1 rounded-lg transition-all hover:bg-white/5 whitespace-nowrap"
                          style={{
                            color: isActive ? SAND : 'rgba(255,255,255,0.8)',
                          }}
                          title={link.title || link.label}
                        >
                          {link.label}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <div className="relative flex items-center" role="search">
                  <Search className="absolute left-2.5 w-3 h-3" style={{ color: SAND }} aria-hidden="true" />
                  <input
                    placeholder="Search..."
                    onFocus={() => { setSearchFocused(true); navigate('/search'); }}
                    onBlur={() => setSearchFocused(false)}
                    readOnly
                    className="pl-7 pr-3 py-1 text-xs text-white placeholder:text-white/30 outline-none transition-all duration-300 cursor-pointer"
                    style={{
                      width: searchFocused ? '140px' : '90px',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '40px',
                      border: searchFocused ? `1px solid ${SAND}` : '1px solid rgba(255,255,255,0.06)',
                      transition: 'all 0.3s ease',
                    }}
                    aria-label="Search the site"
                  />
                </div>

                <button className="text-white/40 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/5 relative" aria-label="Notifications">
                  <Bell className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full" style={{ background: FG }} aria-hidden="true" />
                </button>
                <Link to="/cart" className="text-white/40 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/5 relative" aria-label="Shopping cart">
                  <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
                  {itemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center text-white" style={{ background: FG }} aria-label={`${itemCount} items in cart`}>
                      {itemCount}
                    </span>
                  )}
                </Link>
                <Link to="/account" className="text-white/40 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/5" aria-label="My account">
                  <User className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>

                <Link to="/retreat/apply">
                  <Button
                    className="font-heading text-[10px] tracking-wider px-3 py-1 text-white border-0 ml-1 rounded-full shadow-lg hover:shadow-xl transition-all"
                    style={{ background: FG }}
                    onMouseEnter={e => { e.currentTarget.style.background = GOLD; e.currentTarget.style.color = '#000'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = FG; e.currentTarget.style.color = '#fff'; }}
                    aria-label="Apply for a retreat"
                  >
                    <Trees className="w-3 h-3 mr-1.5" aria-hidden="true" />
                    APPLY NOW
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* ── MOBILE LAYOUT ── */}
          <div className="flex lg:hidden items-center justify-between w-full px-4" style={{ height: '56px' }}>
            <Link to="/" className="flex items-center gap-2" aria-label="BOYZ IN THE WOODZ - Home">
              <div className="w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center shrink-0 shadow-md">
                <img 
                  src={LOGO_URL} 
                  alt={LOGO_ALT} 
                  className="w-full h-full object-cover"
                  width="36"
                  height="36"
                  loading="eager"
                />
              </div>
              <span className="font-heading text-xs tracking-wider leading-tight">
                <span style={{ color: FG }}>BOYZ</span>
                <span style={{ color: '#fff' }}> IN THE </span>
                <span style={{ color: SAND }}>WOODZ</span>
              </span>
            </Link>
            <div className="flex items-center gap-0.5">
              <button className="text-white/70 p-1.5" onClick={() => navigate('/search')} aria-label="Search">
                <Search className="w-4 h-4" aria-hidden="true" />
              </button>
              <Link to="/cart" className="text-white/70 p-1.5 relative" aria-label="Shopping cart">
                <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center text-white" style={{ background: FG }}>
                    {itemCount}
                  </span>
                )}
              </Link>
              <Link to="/account" className="text-white/70 p-1.5" aria-label="My account">
                <User className="w-4 h-4" aria-hidden="true" />
              </Link>
              <button 
                className="text-white p-1" 
                onClick={() => setMobileOpen(!mobileOpen)} 
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
              </button>
            </div>
          </div>
        </motion.nav>
      </header>

      {/* ─── DESKTOP DROPDOWNS ─── */}
      <AnimatePresence>
        {NAV_LINKS.map((link) => {
          const hasChildren = link.children && link.children.length > 0;
          const dropdownKey = link.label.toLowerCase().replace(/\s+/g, '');
          
          if (!hasChildren || openDropdown !== dropdownKey) return null;
          
          return (
            <div
              key={dropdownKey}
              className="fixed z-50"
              style={{
                top: (dropdownCoords[dropdownKey]?.top || 76) + 'px',
                left: (dropdownCoords[dropdownKey]?.left || '50%') + (typeof dropdownCoords[dropdownKey]?.left === 'number' ? 'px' : ''),
                transform: dropdownCoords[dropdownKey]?.left ? 'none' : 'translateX(-50%)',
              }}
              onMouseEnter={() => { if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current); }}
              onMouseLeave={handleDropdownLeave}
            >
              <DropdownMenu 
                items={link.children} 
                isOpen={true}
                previewImg={link.previewImg}
                previewTitle={link.previewTitle}
                previewDesc={link.previewDesc}
                previewBtn={link.previewBtn}
                onClose={handleDropdownClose}
              />
            </div>
          );
        })}
      </AnimatePresence>

      {/* ─── MOBILE SIDEBAR ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
              role="button"
              aria-label="Close menu"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed top-0 left-0 bottom-0 w-[80vw] max-w-[360px] bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] z-50 lg:hidden flex flex-col"
              role="dialog"
              aria-label="Mobile navigation menu"
              style={{ paddingBottom: '80px' }}
            >
              {/* Mobile Header */}
              <div className="relative px-4 pt-3 pb-2.5 border-b border-white/10 flex-shrink-0">
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{
                  background: `linear-gradient(90deg, transparent, ${FG}, ${SAND}, ${FG}, transparent)`,
                  backgroundSize: '200% auto',
                  animation: 'shimmer 3s linear infinite',
                }} />
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 shadow-md">
                    <img 
                      src={LOGO_URL} 
                      alt={LOGO_ALT} 
                      className="w-full h-full object-cover"
                      width="40"
                      height="40"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-bold text-white text-sm leading-tight">BOYZ IN THE WOODZ</p>
                    <p className="text-[#D2B48C] text-[7px] font-semibold tracking-wider mt-0.5 truncate">
                      {tagline}
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setMobileOpen(false)} 
                  className="absolute top-2 right-2 w-7 h-7 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-[#D2B48C] hover:text-black transition-all duration-200 z-10"
                  aria-label="Close menu"
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>

              {/* Mobile Navigation */}
              <div className="flex-1 overflow-y-auto py-2 px-2">
                {NAV_LINKS.map((link) => (
                  <MobileNavLink 
                    key={link.href} 
                    link={link} 
                    onClose={() => setMobileOpen(false)} 
                  />
                ))}
              </div>

              {/* ─── MOBILE BUTTONS ─── */}
              <div className="px-3 py-1.5 border-t border-white/10 flex-shrink-0 bg-gradient-to-t from-[#0a0a0a] to-transparent">
                <div className="flex flex-row gap-2">
                  <Link to="/retreat/apply" onClick={() => setMobileOpen(false)} className="flex-1">
                    <Button 
                      className="w-full font-heading tracking-wider text-white rounded-full py-1.5 shadow-lg hover:shadow-xl transition-all relative overflow-hidden group text-[10px]"
                      style={{ background: FG }}
                      onMouseEnter={e => { e.currentTarget.style.background = GOLD; e.currentTarget.style.color = '#000'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = FG; e.currentTarget.style.color = '#fff'; }}
                      aria-label="Apply for a retreat"
                    >
                      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      <Trees className="w-3 h-3 mr-1" aria-hidden="true" />
                      RETREAT
                    </Button>
                  </Link>
                  <Link to="/barber/book" onClick={() => setMobileOpen(false)} className="flex-1">
                    <Button 
                      variant="outline" 
                      className="w-full font-heading tracking-wider rounded-full py-1.5 transition-all relative overflow-hidden group text-[10px]"
                      style={{ 
                        border: `1px solid ${FG}66`,
                        background: 'rgba(255,255,255,0.05)',
                        color: '#fff'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = GOLD;
                        e.currentTarget.style.color = '#000';
                        e.currentTarget.style.borderColor = GOLD;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                        e.currentTarget.style.color = '#fff';
                        e.currentTarget.style.borderColor = `${FG}66`;
                      }}
                      aria-label="Book a haircut"
                    >
                      <Scissors className="w-3 h-3 mr-1" aria-hidden="true" />
                      BOOK CUT
                    </Button>
                  </Link>
                </div>
              </div>

              {/* ─── MOBILE SOCIAL ICONS ─── */}
              {/* Full width - aligns with buttons */}
              <div className="px-3 py-1.5 border-t border-white/10 flex-shrink-0 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]">
                <SocialIcons isMobile={true} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── MOBILE BOTTOM NAV ─── */}
      <div className="lg:hidden fixed bottom-3 left-[4px] right-[4px] z-50 rounded-[32px] shadow-2xl overflow-hidden"
        style={{ 
          background: 'rgba(22,22,22,0.97)', 
          border: '1px solid rgba(255,255,255,0.25)', 
          backdropFilter: 'blur(20px)',
          paddingBottom: '3px'
        }}
        role="navigation"
        aria-label="Mobile bottom navigation"
      >
        <div className="flex items-center justify-around py-1.5">
          <Link to="/" className="flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-2xl transition-all text-white/40 hover:text-white/70" aria-label="Home">
            <Home className="w-4 h-4" aria-hidden="true" />
            <span className="text-[8px] font-heading tracking-wide uppercase">Home</span>
          </Link>
          <Link to="/shop" className="flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-2xl transition-all text-white/40 hover:text-white/70" aria-label="Shop">
            <ShoppingBag className="w-4 h-4" style={{ color: SAND }} aria-hidden="true" />
            <span className="text-[8px] font-heading tracking-wide uppercase" style={{ color: SAND }}>Shop</span>
          </Link>
          <Link to="/how-it-works" className="flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-2xl transition-all text-white/40 hover:text-white/70" aria-label="Experience">
            <Trees className="w-4 h-4" aria-hidden="true" />
            <span className="text-[8px] font-heading tracking-wide uppercase">Experience</span>
          </Link>
          <Link to="/about" className="flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-2xl transition-all text-white/40 hover:text-white/70" aria-label="Brotherhood">
            <Users className="w-4 h-4" aria-hidden="true" />
            <span className="text-[8px] font-heading tracking-wide uppercase">Brotherhood</span>
          </Link>
          <Link to="/account" className="flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-2xl transition-all text-white/40 hover:text-white/70" aria-label="Dashboard">
            <LayoutDashboard className="w-4 h-4" aria-hidden="true" />
            <span className="text-[8px] font-heading tracking-wide uppercase">Dashboard</span>
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </>
  );
}