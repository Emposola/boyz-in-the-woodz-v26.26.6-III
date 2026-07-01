/* ============================================================
   LEFT SIDEBAR — Scatter Menu from Trigger Position
   Close button 
   ============================================================ */
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Menu } from 'lucide-react';
import {
  FiHome, FiShoppingBag, FiScissors, FiCalendar, FiUsers,
  FiBookOpen, FiAward, FiMapPin, FiShield, FiZap, FiStar, FiHeart
} from 'react-icons/fi';

// ============================================================
// ICON DATA — All navigation items
// ============================================================
const ICONS = [
  { icon: FiHome, to: '/', label: 'Home' },
  { icon: FiShoppingBag, to: '/shop/boyz', label: 'Shop' },
  { icon: FiScissors, to: '/grooming-lodge', label: 'Grooming' },
  { icon: FiCalendar, to: '/events', label: 'Events' },
  { icon: FiUsers, to: '/about', label: 'About' },
  { icon: FiBookOpen, to: '/journal', label: 'Journal' },
  { icon: FiAward, to: '/points', label: 'Points' },
  { icon: FiMapPin, to: '/locations', label: 'Locations' },
  { icon: FiShield, to: '/the-code', label: 'The Code' },
  { icon: FiHeart, to: '/retreat/apply', label: 'Retreats' },
  { icon: FiZap, to: '/science', label: 'Science' },
  { icon: FiStar, to: '/barber/membership', label: 'Membership' },
];

// ============================================================
// SCATTER POSITIONS
// ============================================================
const getScatterPosition = (index, total, triggerX) => {
  const startOffset = 60;
  const spacing = 60;
  
  const xPos = startOffset + index * spacing;
  
  const directions = [1, -1, 1, -1, 1, -1, 1, -1, 1, -1, 1, -1];
  const direction = directions[index % directions.length];
  const distance = 50 + Math.random() * 100;
  const extraOffset = (Math.random() - 0.5) * 30;
  
  const yPos = direction * (distance + extraOffset) - 20;
  
  return { x: xPos, y: yPos };
};

// ============================================================
// DESKTOP SCATTER MENU
// ============================================================
function ScatterMenu({ isOpen, onClose, triggerRef }) {
  const location = useLocation();
  const menuRef = useRef(null);
  const [triggerRect, setTriggerRect] = useState({ left: 0, top: 0 });

  useEffect(() => {
    if (triggerRef?.current && isOpen) {
      const rect = triggerRef.current.getBoundingClientRect();
      setTriggerRect({
        left: rect.left + rect.width / 2,
        top: rect.top + rect.height / 2 - 340,
      });
    }
  }, [triggerRef, isOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) && isOpen) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-40"
            onClick={onClose}
          />

          <motion.div
            ref={menuRef}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ 
              type: 'spring', 
              damping: 20, 
              stiffness: 300,
              duration: 0.4 
            }}
            className="fixed z-50 pointer-events-none"
            style={{
              left: triggerRect.left || '50%',
              top: triggerRect.top || '50%',
              transform: 'translate(0, -50%)',
              width: '50vw',
              height: '80vh',
            }}
          >
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-primary/40 via-primary/20 to-transparent" />
            
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-32 h-8 bg-primary/5 blur-xl" />

            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                delay: 0.02,
                type: 'spring',
                damping: 18,
                stiffness: 300
              }}
              className="absolute pointer-events-auto"
              style={{
                left: '0px',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <button
                onClick={onClose}
                className="w-14 h-14 rounded-full bg-destructive/20 border-2 border-destructive/50 flex items-center justify-center shadow-2xl shadow-destructive/30 hover:scale-105 transition-all duration-200 group z-20"
              >
                <X className="w-7 h-7 text-destructive" />
                <span className="absolute -bottom-7 text-[8px] font-heading tracking-wider uppercase text-destructive/60 whitespace-nowrap">
                  Close
                </span>
              </button>
            </motion.div>

            {ICONS.map(({ icon: Icon, to, label }, index) => {
              const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
              const pos = getScatterPosition(index, ICONS.length, triggerRect.left);
              
              return (
                <motion.div
                  key={to}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    delay: 0.05 + index * 0.025,
                    type: 'spring',
                    damping: 18,
                    stiffness: 300
                  }}
                  className="absolute pointer-events-auto"
                  style={{
                    left: `${pos.x}px`,
                    top: `calc(50% + ${pos.y}px)`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -left-2 w-1.5 h-1.5 rounded-full bg-primary/30" />
                  
                  <div 
                    className="absolute top-1/2 left-1/2 w-px bg-primary/10 -z-10"
                    style={{
                      height: `${Math.abs(pos.y + 20)}px`,
                      transform: `translateY(${pos.y + 20 > 0 ? '0' : '-100%'})`,
                    }}
                  />
                  
                  <Link
                    to={to}
                    onClick={onClose}
                    className={`group relative flex flex-col items-center gap-0.5 p-3 rounded-2xl transition-colors duration-200 ${
                      active 
                        ? 'bg-primary/25 text-primary border-2 border-primary/40 shadow-md shadow-primary/20' 
                        : 'bg-card/80 backdrop-blur-sm text-foreground/50 hover:text-primary/70 border border-white/10'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-[7px] font-heading tracking-wider uppercase opacity-70">
                      {label}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================================
// MAIN SIDEBAR COMPONENT
// ============================================================
export default function LeftSidebar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(false);
  const triggerRef = useRef(null);

  useEffect(() => {
    setDesktopOpen(false);
  }, [location]);

  return (
    <>
      {/* ─── DESKTOP: Trigger Button (COMMENTED OUT - FIX LATER) ─── */}
      {/* 
      <motion.button
        ref={triggerRef}
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 25 }}
        onClick={() => setDesktopOpen(!desktopOpen)}
        className="hidden xl:flex fixed left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-card/90 backdrop-blur-md border border-white/15 shadow-2xl flex items-center justify-center text-muted-foreground hover:text-primary transition-colors duration-200 hover:border-primary/30"
        aria-label="Open navigation"
      >
        <div className="relative">
          <Menu className="w-5 h-5" />
          {!desktopOpen && (
            <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          )}
        </div>
      </motion.button>
      */}

      {/* ─── DESKTOP: Scatter Menu ─── */}
      <ScatterMenu 
        isOpen={desktopOpen} 
        onClose={() => setDesktopOpen(false)} 
        triggerRef={triggerRef}
      />

      {/* ─── MOBILE: Trigger Button (Top Left - 69px + 7px = 76px from top, 6px from left) ─── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="xl:hidden fixed top-[76px] left-[6px] z-40 w-11 h-11 rounded-full bg-card/90 backdrop-blur-md border border-white/15 shadow-2xl flex items-center justify-center text-muted-foreground hover:text-primary transition-colors duration-200 hover:border-primary/30"
        aria-label="Open navigation"
      >
        <Menu size={19} />
      </button>

      {/* ─── MOBILE: Slide-up Drawer ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="xl:hidden fixed inset-0 bg-black/70 backdrop-blur-md z-50"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
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
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setMobileOpen(false)}
                      className={`flex flex-col items-center gap-1 py-3 rounded-xl transition-colors duration-200 ${
                        active ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-secondary'
                      }`}
                    >
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