/* ============================================================
   MAIN LAYOUT  
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
      
      <main className="flex-1 pt-[70px] lg:pt-[135px]">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
      <CookieConsent />
      <MarketingPopup />
    </div>
  );
}