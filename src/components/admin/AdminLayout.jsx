/* ============================================================
   ADMIN LAYOUT — Shared sidebar + header for all admin pages
   ============================================================ */
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import {
  LayoutDashboard, Trees, ShoppingBag, BookOpen, Radio,
  CalendarDays, Users, Settings, LogOut, Menu, X,
  ChevronRight, AlertCircle, Mail, Scissors
} from 'lucide-react';
import { motion } from 'framer-motion';

const FG = '#2D5A27';
const SAND = '#D2B48C';

const NAV_ITEMS = [
  { label: 'Dashboard',     to: '/admin',                icon: LayoutDashboard },
  { label: 'Retreats',      to: '/admin/retreats',       icon: Trees },
  { label: 'Products',      to: '/admin/products',       icon: ShoppingBag },
  { label: 'Services',      to: '/admin/services',       icon: Scissors },
  { label: 'Orders',        to: '/admin/orders',         icon: ShoppingBag },
  { label: 'Blog',          to: '/admin/blog',           icon: BookOpen },
  { label: 'Studio',        to: '/admin/studio',         icon: Radio },
  { label: 'Bookings',      to: '/admin/calendar',       icon: CalendarDays },
  { label: 'Newsletter',    to: '/admin/newsletter',     icon: Mail },
  { label: 'Members',       to: '/admin/members',        icon: Users },
  { label: 'Settings',      to: '/admin/settings',       icon: Settings },
];

const VISIBLE = NAV_ITEMS.filter(i => !i.hide);

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/auth/signin');
  };

  const isActive = (to) => {
    if (to === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(to);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <Link to="/" className="block">
          <div className="font-heading text-sm tracking-widest uppercase" style={{ color: FG }}>
            BOYZ IN THE WOODZ
          </div>
          <div className="text-[10px] tracking-widest uppercase mt-0.5" style={{ color: SAND }}>
            Admin Panel
          </div>
        </Link>
      </div>

      {/* User badge */}
      <div className="px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: FG }}>
            {user?.full_name?.[0] || user?.email?.[0] || 'A'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-white truncate">
              {user?.full_name || 'Admin'}
            </p>
            <p className="text-[10px] text-white/40 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {VISIBLE.map(item => {
          const active = isActive(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
              style={active ? { background: FG } : {}}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
              {active && <ChevronRight className="w-3 h-3 ml-auto opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <Link to="/" onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all">
          <ChevronRight className="w-4 h-4 rotate-180" />
          View Site
        </Link>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-400/10 transition-all">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex" style={{ background: '#0f0f0f' }}>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 border-r border-white/10"
        style={{ background: 'rgba(20,20,20,0.98)' }}>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <motion.aside
            initial={{ x: -224 }} animate={{ x: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 z-50 w-56 flex flex-col border-r border-white/10 lg:hidden"
            style={{ background: 'rgba(20,20,20,0.99)' }}
          >
            <SidebarContent />
          </motion.aside>
        </>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-4 px-4 md:px-6 h-14 border-b border-white/10"
          style={{ background: 'rgba(15,15,15,0.98)', backdropFilter: 'blur(12px)' }}>
          <button onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-white/50 hover:text-white transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 text-sm text-white/30 font-heading tracking-wider uppercase hidden sm:block">
            {VISIBLE.find(i => isActive(i.to))?.label || 'Admin'}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-heading tracking-widest uppercase px-2 py-1 rounded-full border"
              style={{ borderColor: `${FG}60`, color: FG }}>
              Admin
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
