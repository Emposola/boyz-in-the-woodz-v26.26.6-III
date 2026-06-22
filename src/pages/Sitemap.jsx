/* ============================================================
   SITEMAP — All pages organized by section
   ============================================================ */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home, ShoppingBag, Trees, Scissors, Calendar, Users, BookOpen,
  Shield, Zap, Compass, Trophy, MapPin, Star, Heart, MessageCircle,
  Video, User, CreditCard, FileText, Map, Radio
} from 'lucide-react';

const SECTIONS = [
  {
    title: 'Main',
    icon: Home,
    links: [
      { label: 'Home', to: '/' },
      { label: 'About Us', to: '/about' },
      { label: 'Contact Us', to: '/contact' },
      { label: 'Locations', to: '/locations' },
      { label: 'Events', to: '/events' },
      { label: 'Points & Rewards', to: '/points' },
      { label: 'Cart', to: '/cart' },
      { label: 'My Account', to: '/account' },
      { label: 'Welcome', to: '/welcome' },
    ],
  },
  {
    title: 'The Woodz — Shop',
    icon: ShoppingBag,
    links: [
      { label: 'Boyz In The Woodz Shop', to: '/shop/boyz' },
      { label: 'The Chair Merch Shop', to: '/shop/barber' },
    ],
  },
  {
    title: 'Brotherhood',
    icon: Trees,
    links: [
      { label: 'The Code', to: '/the-code' },
      { label: 'Science Snapshot', to: '/science' },
      { label: 'Archetypes', to: '/archetypes' },
      { label: 'Journal / Blog', to: '/journal' },
      { label: 'Case Studies', to: '/case-studies' },
      { label: 'Brotherhood Studio', to: '/studio' },
    ],
  },
  {
    title: 'Retreats',
    icon: Compass,
    links: [
      { label: 'Apply for Retreat', to: '/retreat/apply' },
      { label: 'Waitlist Status', to: '/retreat/waitlist' },
      { label: 'Retreat Confirmed', to: '/retreat/confirmed' },
      { label: 'Post-Retreat Survey', to: '/retreat/survey' },
    ],
  },
  {
    title: 'The Chair — Barbershop',
    icon: Scissors,
    links: [
      { label: 'Book Appointment', to: '/barber/book' },
      { label: 'Services & Pricing', to: '/barber/services' },
      { label: 'Meet The Team', to: '/barber/team' },
      { label: 'Barber Gallery', to: '/barber/gallery' },
      { label: 'Walk-In Waitlist', to: '/barber/walkin' },
      { label: 'Membership', to: '/barber/membership' },
      { label: 'FAQ', to: '/barber/faq' },
    ],
  },
  {
    title: 'Legal',
    icon: FileText,
    links: [
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms of Service', to: '/terms' },
      { label: 'Shipping Policy', to: '/shipping' },
      { label: 'Returns Policy', to: '/returns' },
      { label: 'Cookie Policy', to: '/cookies' },
    ],
  },
];

export default function Sitemap() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Map className="w-5 h-5 text-primary" />
            <span className="text-xs font-heading tracking-[0.4em] text-primary uppercase">Navigation</span>
          </div>
          <h1 className="font-heading text-5xl md:text-7xl tracking-wide uppercase">Site <span className="text-primary">Map</span></h1>
          <p className="text-muted-foreground text-sm mt-3 max-w-md mx-auto">Every page in the ecosystem — organized by section.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SECTIONS.map((section, i) => (
            <motion.div key={section.title}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <section.icon className="w-4 h-4 text-primary" />
                </div>
                <h2 className="font-heading text-sm tracking-wider uppercase">{section.title}</h2>
              </div>
              <ul className="space-y-1.5">
                {section.links.map(link => (
                  <li key={link.to}>
                    <Link to={link.to}
                      className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-150 inline-flex items-center gap-1.5 group">
                      <span className="w-1 h-1 rounded-full bg-border group-hover:bg-primary transition-colors" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="mt-12 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Boyz In The Woodz · All pages listed above</p>
        </motion.div>
      </div>
    </div>
  );
}