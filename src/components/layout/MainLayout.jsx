/* ============================================================
   MAIN LAYOUT — Wraps all public pages
   Includes cookie consent + marketing popup
   ============================================================ */
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import LeftSidebar from './LeftSidebar.jsx';
import BackToTop from './BackToTop';
import CookieConsent from '@/components/ui/CookieConsent';
import MarketingPopup from '@/components/ui/MarketingPopup';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <LeftSidebar />
      <main className="flex-1 pt-0 xl:ml-[48px]">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
      <CookieConsent />
      <MarketingPopup />
    </div>
  );
}