import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, Menu, ChevronRight } from 'lucide-react';
import { AGENCY_CREDENTIALS } from '@/pages/agency/agencyConfig';

const FG = '#2D5A27';

const NAV_ITEMS = [
  { label: 'Blog Manager', to: '/agency/blog', icon: BookOpen },
];

export default function AgencyLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem('agency_key');
    navigate('/agency/signin');
  };

  const isActive = (to) => location.pathname.startsWith(to);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-white/10">
        <Link to="/agency" className="block">
          <div className="font-heading text-xs tracking-[0.3em] uppercase text-white/40">Emposola</div>
          <div className="font-heading text-sm tracking-widest uppercase mt-0.5" style={{ color: FG }}>
            Agency Panel
          </div>
        </Link>
      </div>

      <div className="px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: FG }}>
            E
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-white truncate">Emposola Agency</p>
            <p className="text-[10px] text-white/40 truncate">{AGENCY_CREDENTIALS.email}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(item => {
          const active = isActive(item.to);
          return (
            <Link key={item.to} to={item.to} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active ? 'text-white' : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
              style={active ? { background: FG } : {}}>
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
              {active && <ChevronRight className="w-3 h-3 ml-auto opacity-60" />}
            </Link>
          );
        })}
      </nav>

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
      <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 border-r border-white/10" style={{ background: 'rgba(20,20,20,0.98)' }}>
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed left-0 top-0 bottom-0 z-50 w-56 flex flex-col border-r border-white/10 lg:hidden" style={{ background: 'rgba(20,20,20,0.99)' }}>
            <SidebarContent />
          </aside>
        </>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex items-center gap-4 px-4 md:px-6 h-14 border-b border-white/10"
          style={{ background: 'rgba(15,15,15,0.98)', backdropFilter: 'blur(12px)' }}>
          <button onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-white/50 hover:text-white transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 text-sm text-white/30 font-heading tracking-wider uppercase hidden sm:block">
            {NAV_ITEMS.find(i => isActive(i.to))?.label || 'Agency'}
          </div>
          <span className="text-[10px] font-heading tracking-widest uppercase px-2 py-1 rounded-full border" style={{ borderColor: `${FG}60`, color: FG }}>
            Agency
          </span>
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
