/* ============================================================
   NAVBAR — Boyz In The Woodz — Floating + Mega Menus
   ============================================================ */
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Leaf, ShoppingBag, ChevronDown, ArrowRight, Home, Trees, Compass, Users, BookOpen, Zap, LayoutDashboard } from 'lucide-react';
import { FiShoppingBag, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { useCart } from '@/lib/cartContext';
import { useAuth } from '@/lib/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const LOGO_URL = '/images/logos/logo-navbar-about.jpg';
const FG = '#2D5A27';
const SAND = '#D2B48C';

const NAV_MENUS = [
  {
    label: 'Shop',
    icon: ShoppingBag,
    mega: true,
    columns: [
      {
        heading: 'Apparel',
        links: [
          { label: 'Hoodies', to: '/shop/hoodies' },
          { label: 'Tees', to: '/shop/tees' },
          { label: 'Crewnecks', to: '/shop/crewnecks' },
          { label: 'Caps', to: '/shop/caps' },
          { label: 'Beanies', to: '/shop/beanies' },
          { label: 'Jackets', to: '/shop/jackets' },
          { label: 'Accessories', to: '/shop/accessories' },
        ],
      },
      {
        heading: 'Gear',
        links: [
          { label: 'Water Bottles', to: '/shop/water-bottles' },
          { label: 'Patches', to: '/shop/patches' },
          { label: 'Journals', to: '/shop/journals' },
          { label: 'Stickers', to: '/shop/stickers' },
          { label: 'Towels', to: '/shop/towels' },
          { label: 'Flasks', to: '/shop/flasks' },
          { label: 'Keychains', to: '/shop/keychains' },
        ],
      },
      {
        heading: 'Bundles & More',
        links: [
          { label: 'Survival Kits', to: '/shop/bundles' },
          { label: 'Brotherhood Bundles', to: '/shop/bundles' },
          { label: 'Sale Items', to: '/shop/sale' },
          { label: 'Limited Edition', to: '/shop/limited-edition' },
          { label: 'Gift Cards', to: '/shop/gift-cards' },
          { label: 'New Arrivals', to: '/shop/new' },
        ],
      },
    ],
    cta: { label: 'View All Products', to: '/shop' },
  },
  {
    label: 'The Experience',
    icon: Compass,
    links: [
      { label: 'How It Works', to: '/how-it-works' },
      { label: 'Weekend Reset (2 days)', to: '/retreat/weekend-reset' },
      { label: 'Deep Dive (3 days)', to: '/retreat/deep-dive' },
      { label: 'Expedition (5 days)', to: '/retreat/expedition' },
      { label: 'Custom Retreats', to: '/retreat/custom' },
      { label: 'Retreat Calendar', to: '/retreat-calendar' },
      { label: 'Virtual Tour', to: '/retreat/virtual-tour' },
      { label: 'What to Expect', to: '/retreat/what-to-expect' },
      { label: 'Packing List', to: '/retreat/packing-list' },
    ],
  },
  {
    label: 'Brotherhood',
    icon: Users,
    links: [
      { label: 'Take the Pledge', to: '/the-code' },
      { label: 'Pledge Wall', to: '/brotherhood/directory' },
      { label: 'Brotherhood Map', to: '/locations' },
      { label: 'Chapters', to: '/locations' },
      { label: 'Start a Chapter', to: '/retreat/apply' },
      { label: 'Virtual Campfire', to: '/studio' },
      { label: 'Brother Directory', to: '/brotherhood/directory' },
      { label: 'Leaderboard', to: '/brotherhood/leaderboard' },
    ],
  },
  {
    label: 'Science',
    icon: Zap,
    links: [
      { label: 'The Problem', to: '/the-problem' },
      { label: 'Who We Serve', to: '/who-we-serve' },
      { label: 'The Research', to: '/science' },
      { label: 'Cortisol & Nature', to: '/science/cortisol' },
      { label: 'Loneliness Epidemic', to: '/science/loneliness' },
      { label: "Men's Mental Health", to: '/science/mental-health' },
      { label: 'Testimonials', to: '/science/testimonials' },
      { label: 'Case Studies', to: '/case-studies' },
    ],
  },
  {
    label: 'Journal',
    icon: BookOpen,
    links: [
      { label: 'All Posts', to: '/journal' },
      { label: 'Brotherhood Stories', to: '/journal/category/brotherhood' },
      { label: 'Mental Health', to: '/journal/category/mental-health' },
      { label: 'Nature & Adventure', to: '/journal/category/nature' },
      { label: 'Retreat Recaps', to: '/journal/category/retreats' },
      { label: 'Guest Posts', to: '/journal/category/guest' },
      { label: 'Write for Us', to: '/journal/submit' },
    ],
  },
];

const MOBILE_NAV = [
  { label: 'Home', icon: Home, to: '/' },
  { label: 'Shop', icon: ShoppingBag, to: '/shop', highlight: true },
  { label: 'Experience', icon: Trees, to: '/how-it-works' },
  { label: 'Brotherhood', icon: Users, to: '/about' },
  { label: 'Dashboard', icon: LayoutDashboard, to: '/account' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const { itemCount } = useCart();
  const { user } = useAuth();
  const location = useLocation();
  const timeoutRef = useRef(null);

  useEffect(() => { setOpenMenu(null); setMobileOpen(false); }, [location.pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const enter = (label) => { clearTimeout(timeoutRef.current); setOpenMenu(label); };
  const leave = () => { timeoutRef.current = setTimeout(() => setOpenMenu(null), 180); };

  return (
    <>
      {/* Floating Nav - Full Width with 10px padding */}
      <div className="sticky top-0 z-50 px-[10px]">
        <nav className="w-full rounded-[32px] px-6 h-16 lg:h-[76px] flex items-center justify-between"
          style={{ background: 'rgba(28,28,28,0.96)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.14)', boxShadow: '0 4px 32px rgba(0,0,0,0.5)' }}>

          {/* Logo - Larger */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <img src={LOGO_URL} alt="BITW" className="h-12 lg:h-14 w-auto rounded-xl" />
            <div className="hidden sm:block">
              <div className="font-heading text-[21px] lg:text-[24px] leading-none tracking-wider" style={{ color: FG }}>BOYZ IN THE WOODZ</div>
              <div className="text-[10px] lg:text-[11px] tracking-widest" style={{ color: SAND }}>Brotherhood. Freedom. Nature.</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {NAV_MENUS.map(menu => (
              <div key={menu.label} className="relative" onMouseEnter={() => enter(menu.label)} onMouseLeave={leave}>
                <button
                  className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors duration-200 ${openMenu === menu.label ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/8'}`}
                  style={openMenu === menu.label ? { color: SAND } : {}}
                >
                  {menu.label}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openMenu === menu.label ? 'rotate-180' : ''}`} />
                </button>
              </div>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-1">
            <button className="hidden lg:flex p-2 text-white/60 hover:text-white rounded-xl hover:bg-white/10 transition-all">
              <Search size={18} />
            </button>
            <Link to="/account" className="p-2 text-white/60 hover:text-white rounded-xl hover:bg-white/10 transition-all">
              <FiUser size={18} />
            </Link>
            <Link to="/cart" className="relative p-2 text-white/60 hover:text-white rounded-xl hover:bg-white/10 transition-all">
              <FiShoppingBag size={18} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center" style={{ background: FG, color: '#fff' }}>{itemCount}</span>
              )}
            </Link>
            <div className="hidden sm:flex p-2 text-white/20 rounded-xl" title="Pledge Status">
              <Leaf size={18} />
            </div>
            {user?.is_admin && (
              <Link to="/admin"
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-heading tracking-wider uppercase transition-all text-white/60 hover:text-white hover:bg-white/10"
                title="Admin Panel">
                <LayoutDashboard size={15} />
                <span className="hidden lg:inline">Admin</span>
              </Link>
            )}
            <button className="lg:hidden p-2 text-white/70" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mega / Dropdown Panel - Full Width */}
        <AnimatePresence>
          {openMenu && (
            <motion.div
              key={openMenu}
              initial={{ opacity: 0, y: -6, scale: 0.99 }}
              animate={{ opacity: 1, y: 4, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.99 }}
              transition={{ duration: 0.15 }}
              className="absolute left-[10px] right-[10px] mt-0"
              style={{ top: '76px' }}
              onMouseEnter={() => enter(openMenu)}
              onMouseLeave={leave}
            >
              {NAV_MENUS.filter(m => m.label === openMenu).map(menu => (
                <div key={menu.label} className="rounded-2xl shadow-2xl overflow-hidden"
                  style={{ background: 'rgba(22,22,22,0.98)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)' }}>
                  {menu.mega ? (
                    <div className="p-6">
                      <div className="grid grid-cols-3 gap-8 mb-5">
                        {menu.columns.map(col => (
                          <div key={col.heading}>
                            <p className="text-[10px] font-heading tracking-[0.25em] uppercase mb-3 pb-1 border-b border-white/10" style={{ color: SAND }}>{col.heading}</p>
                            <ul className="space-y-1">
                              {col.links.map(link => (
                                <li key={link.label}>
                                  <Link to={link.to} onClick={() => setOpenMenu(null)}
                                    className="flex items-center gap-2 py-1.5 px-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/8 transition-all group">
                                    <span className="flex-1">{link.label}</span>
                                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-white/10 pt-4 flex items-center gap-4">
                        <Link to={menu.cta.to} onClick={() => setOpenMenu(null)}
                          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-heading tracking-wider uppercase text-white transition-all"
                          style={{ background: FG }}>
                          {menu.cta.label} <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <div className="flex gap-3 text-xs text-white/40">
                          {['New Arrivals', 'Bestsellers', 'Sale'].map(c => (
                            <Link key={c} to="/shop" onClick={() => setOpenMenu(null)} className="hover:text-white transition-colors">{c}</Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 grid grid-cols-2 gap-1">
                      {menu.links.map(link => (
                        <Link key={link.label} to={link.to} onClick={() => setOpenMenu(null)}
                          className="flex items-center gap-2 py-2 px-3 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/8 transition-all group">
                          <span className="flex-1">{link.label}</span>
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="fixed top-[80px] left-[7px] right-[7px] z-40 rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: 'rgba(22,22,22,0.98)', border: '1px solid rgba(255,255,255,0.14)' }}>
            <div className="p-4 space-y-0.5">
              {NAV_MENUS.map(menu => (
                <div key={menu.label} className="border-b border-white/5 last:border-0 pb-1 last:pb-0">
                  <p className="text-[10px] font-heading tracking-[0.2em] uppercase px-3 pt-2 pb-1" style={{ color: SAND }}>{menu.label}</p>
                  <div className="grid grid-cols-2 gap-0.5">
                    {(menu.mega ? menu.columns.flatMap(c => c.links) : menu.links).slice(0, 6).map(link => (
                      <Link key={link.label} to={link.to} onClick={() => setMobileOpen(false)}
                        className="px-3 py-2 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-3 left-[7px] right-[7px] z-50 rounded-[32px] shadow-2xl overflow-hidden"
        style={{ background: 'rgba(22,22,22,0.97)', border: '1px solid rgba(255,255,255,0.14)', backdropFilter: 'blur(20px)' }}>
        <div className="flex items-center justify-around py-2">
          {MOBILE_NAV.map(item => {
            const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
            return (
              <Link key={item.label} to={item.to}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all ${isActive ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
                style={item.highlight ? { filter: isActive ? `drop-shadow(0 0 8px ${SAND})` : undefined } : {}}>
                <item.icon className="w-5 h-5" style={isActive ? { color: FG } : item.highlight ? { color: SAND } : {}} />
                <span className="text-[9px] font-heading tracking-wide uppercase" style={item.highlight && !isActive ? { color: SAND } : {}}>{item.label}</span>
                {isActive && <div className="w-1 h-1 rounded-full" style={{ background: FG }} />}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}