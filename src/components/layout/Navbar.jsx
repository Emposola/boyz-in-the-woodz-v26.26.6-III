/* ============================================================
   NAVBAR — Boyz In The Woodz — Floating + Mega Menus
   ============================================================ */
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Leaf, ShoppingBag, ChevronDown, ArrowRight, Home, Trees, Compass, Users, BookOpen, Zap, LayoutDashboard, Camera, Trophy, Heart, Shield } from 'lucide-react';
import { FiShoppingBag, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { useCart } from '@/lib/cartContext';
import { useAuth } from '@/lib/AuthContext';
import { useCategories, CATEGORY_META, GROUP_ORDER } from '@/lib/journalCategories';

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
          { label: 'All Apparel',    to: '/shop/apparel' },
          { label: 'Hoodies',        to: '/shop/hoodies' },
          { label: 'Tees',           to: '/shop/tees' },
          { label: 'Crewnecks',      to: '/shop/crewnecks' },
          { label: 'Caps',           to: '/shop/caps' },
          { label: 'Jackets',        to: '/shop/jackets' },
          { label: 'Accessories',    to: '/shop/accessories' },
        ],
      },
      {
        heading: 'Gear',
        links: [
          { label: 'All Gear',       to: '/shop/gear' },
          { label: 'Water Bottles',  to: '/shop/water-bottles' },
          { label: 'Journals',       to: '/shop/journals' },
          { label: 'Patches',        to: '/shop/patches' },
          { label: 'Stickers',       to: '/shop/stickers' },
          { label: 'Flasks',         to: '/shop/flasks' },
          { label: 'Keychains',      to: '/shop/keychains' },
        ],
      },
      {
        heading: 'Collections',
        links: [
          { label: 'New Arrivals',   to: '/shop/new' },
          { label: 'Featured',       to: '/shop' },
          { label: 'Bundles',        to: '/shop/bundles' },
          { label: 'Sale',           to: '/shop/sale' },
          { label: 'Limited Edition',to: '/shop/limited-edition' },
        ],
      },
    ],
    cta: { label: 'Shop All Products', to: '/shop' },
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
    label: 'Our Story',
    icon: Users,
    to: '/about',
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
    mega: true,
    dynamic: true,
    cta: { label: 'Read All Stories', to: '/journal' },
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
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const { itemCount } = useCart();
  const { user } = useAuth();
  const location = useLocation();
  const timeoutRef = useRef(null);
  const lastClosedRef = useRef(0);

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    setOpenMenu(null);
    setMobileOpen(false);
    setMobileExpanded(null);
  }, [location.pathname, location.search, location.key]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    if (!openMenu) return;
    const close = () => { clearTimeout(timeoutRef.current); setOpenMenu(null); lastClosedRef.current = Date.now(); };
    const onKeyDown = (e) => { if (e.key === 'Escape') close(); };
    const onScroll = () => close();
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { document.removeEventListener('keydown', onKeyDown); window.removeEventListener('scroll', onScroll); };
  }, [openMenu]);

  const enter = (label) => {
    if (Date.now() - lastClosedRef.current < 300) return;
    clearTimeout(timeoutRef.current);
    setOpenMenu(label);
  };
  const leave = () => { timeoutRef.current = setTimeout(() => setOpenMenu(null), 180); };
  const closeMenu = () => { clearTimeout(timeoutRef.current); setOpenMenu(null); lastClosedRef.current = Date.now(); };

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
              menu.to ? (
                <Link key={menu.label} to={menu.to} onClick={() => setOpenMenu(null)}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/8 transition-all">
                  {menu.label}
                </Link>
              ) : (
              <div key={menu.label} className="relative" onMouseEnter={() => enter(menu.label)} onMouseLeave={leave}>
                <button
                  className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors duration-200 ${openMenu === menu.label ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/8'}`}
                  style={openMenu === menu.label ? { color: SAND } : {}}
                >
                  {menu.label}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openMenu === menu.label ? 'rotate-180' : ''}`} />
                </button>
              </div>
              )
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
        {openMenu && (
          <div className="absolute left-[10px] right-[10px] mt-0"
            style={{ top: '76px' }}
            onMouseEnter={() => enter(openMenu)}
            onMouseLeave={leave}
          >
            {NAV_MENUS.filter(m => m.label === openMenu).map(menu => (
              <div key={menu.label} className="rounded-2xl shadow-2xl overflow-hidden"
                style={{ background: 'rgba(22,22,22,0.98)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)' }}>
                {menu.mega ? (
                  menu.dynamic ? (
                    <JournalMegaMenu onClose={closeMenu} />
                  ) : (
                  <div className="p-6">
                    <div className="grid grid-cols-3 gap-8 mb-5">
                      {menu.columns.map(col => (
                        <div key={col.heading}>
                          <p className="text-[10px] font-heading tracking-[0.25em] uppercase mb-3 pb-1 border-b border-white/10" style={{ color: SAND }}>{col.heading}</p>
                          <ul className="space-y-1">
                            {col.links.map(link => (
                              <li key={link.label}>
                                <Link to={link.to} onClick={closeMenu}
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
                    {menu.cta && (
                    <div className="border-t border-white/10 pt-4 flex items-center gap-4">
                      <Link to={menu.cta.to} onClick={closeMenu}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-heading tracking-wider uppercase text-white transition-all"
                        style={{ background: FG }}>
                        {menu.cta.label} <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <div className="flex gap-3 text-xs text-white/40">
                        {['New Arrivals', 'Bestsellers', 'Sale'].map(c => (
                          <Link key={c} to="/shop" onClick={closeMenu} className="hover:text-white transition-colors">{c}</Link>
                        ))}
                      </div>
                    </div>
                    )}
                  </div>
                  )
                ) : (
                  <div className="p-5 grid grid-cols-2 gap-1">
                    {menu.links.map(link => (
                      <Link key={link.label} to={link.to} onClick={closeMenu}
                        className="flex items-center gap-2 py-2 px-3 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/8 transition-all group">
                        <span className="flex-1">{link.label}</span>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile drawer backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 lg:hidden" onClick={() => { setMobileOpen(false); setMobileExpanded(null); }} />
      )}

      {/* Mobile Drawer — Accordion style */}
      {mobileOpen && (
        <div className="fixed top-[80px] left-[7px] right-[7px] z-40 rounded-2xl overflow-hidden shadow-2xl"
          style={{ background: 'rgba(22,22,22,0.98)', border: '1px solid rgba(255,255,255,0.14)' }}>
          <div className="max-h-[70vh] overflow-y-auto p-4 space-y-1">
            {NAV_MENUS.map(menu => {
              if (menu.to) {
                return (
                  <Link key={menu.label} to={menu.to} onClick={() => setMobileOpen(false)}
                    className="flex items-center px-3 py-3 rounded-xl text-sm font-heading tracking-wider uppercase text-white/80 hover:text-white hover:bg-white/10 transition-all">
                    {menu.label}
                  </Link>
                );
              }
              const isOpen = mobileExpanded === menu.label;
              const links = menu.dynamic
                ? [{ label: 'All Stories', to: '/journal' }, { label: 'Field Notes', to: '/journal/category/Field%20Notes' }, { label: 'Retreat Recaps', to: '/journal/category/Retreat%20Recaps' }, { label: 'Brotherhood Stories', to: '/journal/category/Brotherhood%20Stories' }, { label: 'Write for the Journal', to: '/journal/submit' }]
                : menu.mega ? menu.columns.flatMap(c => c.links) : menu.links;
              return (
                <div key={menu.label}>
                  <button onClick={() => setMobileExpanded(isOpen ? null : menu.label)}
                    className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-heading tracking-wider uppercase text-white/80 hover:text-white hover:bg-white/10 transition-all">
                    <span>{menu.label}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="overflow-hidden">
                      <div className="pl-3 pb-2 space-y-0.5">
                        {links.map(link => (
                          <Link key={link.label} to={link.to} onClick={() => setMobileOpen(false)}
                            className="block px-3 py-2 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all">
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {/* Extra links */}
            <div className="border-t border-white/10 pt-3 mt-2 space-y-1">
              <Link to="/account" onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all">
                My Account
              </Link>
              {user?.is_admin && (
                <Link to="/admin" onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all">
                  Admin Panel
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

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

/* ── Journal Mega Menu — categories fetched from DB ── */
const ICON_MAP = {
  Camera, Trophy, Heart, Shield, Trees, BookOpen, Zap, Users,
};

function JournalMegaMenu({ onClose }) {
  const { data: categories = [] } = useCategories();

  const groups = { browse: [], topics: [] };
  categories.forEach(cat => {
    const meta = CATEGORY_META[cat];
    if (!meta) return;
    if (groups[meta.group]) groups[meta.group].push({ value: cat, ...meta });
  });

  const contributeLinks = [
    { label: 'Write for the Journal', to: '/journal/submit' },
  ];

  return (
    <div className="p-6">
      <div className="grid grid-cols-3 gap-8 mb-5">
        {Object.entries(GROUP_ORDER).sort((a,b) => a[1].order - b[1].order).map(([key, config]) => {
          const items = groups[key];
          const IconComp = ICON_MAP[CATEGORY_META[items[0]?.value]?.icon] || BookOpen;
          return (
            <div key={key}>
              <p className="text-[10px] font-heading tracking-[0.25em] uppercase mb-3 pb-1 border-b border-white/10" style={{ color: SAND }}>
                {config.heading}
              </p>
              <ul className="space-y-1">
                {items.map(item => {
                  const CatIcon = ICON_MAP[item.icon] || BookOpen;
                  return (
                    <li key={item.value}>
                      <Link to={`/journal/category/${encodeURIComponent(item.value)}`} onClick={onClose}
                        className="flex items-center gap-2 py-1.5 px-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/8 transition-all group">
                        <CatIcon className="w-3.5 h-3.5 opacity-50" />
                        <span className="flex-1">{item.display}</span>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
        {/* Contribute column (static) */}
        <div>
          <p className="text-[10px] font-heading tracking-[0.25em] uppercase mb-3 pb-1 border-b border-white/10" style={{ color: SAND }}>
            Contribute
          </p>
          <ul className="space-y-1">
            {contributeLinks.map(link => (
              <li key={link.label}>
                <Link to={link.to} onClick={onClose}
                  className="flex items-center gap-2 py-1.5 px-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/8 transition-all group">
                  <Camera className="w-3.5 h-3.5 opacity-50" />
                  <span className="flex-1">{link.label}</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 pt-4 flex items-center gap-4">
        <Link to="/journal" onClick={onClose}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-heading tracking-wider uppercase text-white transition-all"
          style={{ background: FG }}>
          Read All Stories <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
