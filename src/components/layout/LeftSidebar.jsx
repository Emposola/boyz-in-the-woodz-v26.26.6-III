/* ============================================================
   LEFT SIDEBAR — Icon rail on xl desktop + slide-up drawer on mobile
   ============================================================ */
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import {
  FiHome, FiShoppingBag, FiScissors, FiCalendar, FiUsers,
  FiBookOpen, FiAward, FiMapPin, FiShield, FiZap, FiStar, FiHeart, FiMenu
} from 'react-icons/fi';

const ICONS = [
  { icon: FiHome, to: '/', label: 'Home' },
  { icon: FiShoppingBag, to: '/shop/boyz', label: 'Shop' },
  { icon: FiScissors, to: '/barber/book', label: 'Book Cut' },
  { icon: FiCalendar, to: '/events', label: 'Events' },
  { icon: FiUsers, to: '/about', label: 'About' },
  { icon: FiMapPin, to: '/locations', label: 'Locations' },
  { icon: FiBookOpen, to: '/journal', label: 'Journal' },
  { icon: FiAward, to: '/points', label: 'Points' },
  { icon: FiShield, to: '/the-code', label: 'The Code' },
  { icon: FiHeart, to: '/retreat/apply', label: 'Retreats' },
  { icon: FiZap, to: '/science', label: 'Science' },
  { icon: FiStar, to: '/barber/membership', label: 'Membership' },
];

export default function LeftSidebar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ── Desktop: fixed left vertical rail (xl+) ── */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 25 }}
        className="hidden xl:flex fixed left-1 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-0.5 bg-card/80 backdrop-blur-md border border-white/10 rounded-xl py-2 px-1 shadow-2xl"
      >
        <div className="w-4 h-0.5 rounded-full mb-1.5 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-gradient-x" />
        {ICONS.map(({ icon: Icon, to, label }) => {
          const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
          return (
            <Link key={to} to={to} className="group relative flex items-center justify-center">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200
                ${active ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30' : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'}`}>
                <Icon size={13} />
              </div>
              <span className="absolute left-10 bg-card border border-border text-xs font-heading tracking-wider uppercase px-2 py-1 rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 text-foreground z-50">
                {label}
              </span>
              {active && <div className="absolute -left-0.5 w-0.5 h-4 bg-primary rounded-r-full" />}
            </Link>
          );
        })}
        <div className="w-4 h-0.5 rounded-full mt-1.5 bg-gradient-to-r from-accent via-primary to-accent bg-[length:200%_100%] animate-gradient-x" />
      </motion.div>

      {/* ── Mobile: floating trigger button (bottom-left, above bottom nav) ── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="xl:hidden fixed left-4 bottom-24 z-40 w-10 h-10 rounded-full bg-card border border-white/10 shadow-2xl flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
        aria-label="Open navigation"
      >
        <FiMenu size={18} />
      </button>

      {/* ── Mobile: slide-up drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="xl:hidden fixed inset-0 bg-black/60 z-50"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="xl:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-white/10 rounded-t-2xl pb-safe pt-2 shadow-2xl"
            >
              <div className="w-10 h-1 rounded-full bg-border mx-auto mb-4" />
              <div className="flex items-center justify-between px-4 mb-3">
                <span className="text-xs font-heading tracking-[0.25em] uppercase text-primary">Navigate</span>
                <button onClick={() => setMobileOpen(false)} className="p-1.5 text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-1 px-3 pb-6">
                {ICONS.map(({ icon: Icon, to, label }) => {
                  const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
                  return (
                    <Link key={to} to={to} onClick={() => setMobileOpen(false)}
                      className={`flex flex-col items-center gap-1 py-3 rounded-xl transition-all ${active ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-secondary'}`}>
                      <Icon size={18} />
                      <span className="text-[9px] font-heading tracking-wider uppercase text-center leading-tight">{label}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}