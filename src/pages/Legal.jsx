/* ============================================================
   LEGAL PAGES — Privacy, Terms, Shipping, Returns, Cookies
   URL param determines which legal page to show
   ============================================================ */
import React from 'react';
import { Shield } from 'lucide-react';
import SEO from '@/components/shared/SEO';

/* --- Legal content by type --- */
const LEGAL_CONTENT = {
  privacy: {
    title: 'Privacy Policy',
    sections: [
      { heading: 'Information We Collect', body: 'We collect information you provide directly: name, email, shipping address, and payment details for order processing. We also collect usage data through cookies and analytics.' },
      { heading: 'How We Use Your Information', body: 'Your data is used to process orders, manage your Brotherhood Points account, send order updates, and improve our services. We never sell your personal information.' },
      { heading: 'Data Security', body: 'We use industry-standard encryption and security measures to protect your data. Payment processing is handled by trusted third-party providers.' },
      { heading: 'Your Rights', body: 'You can request to view, update, or delete your personal data at any time by contacting us at privacy@boyzinthewoodz.com.' },
    ],
  },
  terms: {
    title: 'Terms of Service',
    sections: [
      { heading: 'Acceptance', body: 'By using our website and services, you agree to these terms. The Code (our five non-negotiables) applies to all retreat participants.' },
      { heading: 'Accounts', body: 'You are responsible for maintaining the security of your account. Brotherhood Points are non-transferable and have no cash value outside our ecosystem.' },
      { heading: 'Purchases', body: 'All prices are in USD. We reserve the right to modify pricing. The Leave Better Guarantee allows returns within 30 days for a full refund.' },
      { heading: 'Retreat Liability', body: 'Retreat participants must sign a liability waiver. We are not responsible for injuries sustained during outdoor activities. All participants must disclose medical conditions.' },
    ],
  },
  shipping: {
    title: 'Shipping Policy',
    sections: [
      { heading: 'Processing Time', body: 'Orders are processed within 1-2 business days. You will receive a tracking number via email once shipped.' },
      { heading: 'Shipping Rates', body: 'Standard shipping: $9.99. Free shipping on orders over $99. Express shipping available at checkout.' },
      { heading: 'Delivery', body: 'Standard delivery: 5-7 business days. Express delivery: 2-3 business days. We ship within the continental US.' },
    ],
  },
  returns: {
    title: 'Returns & Exchanges',
    sections: [
      { heading: 'Leave Better Guarantee', body: 'If a product doesn\'t make you feel like a better man, return it within 30 days for a full refund. No questions asked.' },
      { heading: 'How to Return', body: 'Email returns@boyzinthewoodz.com with your order number. We\'ll send a prepaid return label within 24 hours.' },
      { heading: 'Refund Processing', body: 'Refunds are processed within 5-7 business days after we receive your return. Brotherhood Points earned on the order will be deducted.' },
    ],
  },
  cookies: {
    title: 'Cookie Policy',
    sections: [
      { heading: 'What Are Cookies', body: 'Cookies are small text files stored on your device that help us provide a better experience.' },
      { heading: 'Essential Cookies', body: 'Required for cart functionality, user sessions, and security. These cannot be disabled.' },
      { heading: 'Analytics Cookies', body: 'Help us understand how visitors interact with our site. You can opt out via browser settings.' },
      { heading: 'Marketing Cookies', body: 'Used for newsletter targeting and retargeting. You can opt out at any time in your account settings.' },
    ],
  },
};

export default function Legal() {
  const path = window.location.pathname.replace('/', '');
  const content = LEGAL_CONTENT[path] || LEGAL_CONTENT.privacy;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
      <SEO title="Legal — BOYZ IN THE WOODZ" description="Terms, privacy policy, and legal information for BOYZ IN THE WOODZ." canonical="/legal" />
      <div className="flex items-center gap-2 mb-6">
        <Shield className="w-5 h-5 text-primary" />
        <h1 className="font-heading text-3xl tracking-wide uppercase">{content.title}</h1>
      </div>
      <p className="text-xs text-muted-foreground mb-8">Last updated: January 2025</p>

      <div className="space-y-8">
        {content.sections.map((section, i) => (
          <div key={i}>
            <h2 className="font-heading text-lg tracking-wider uppercase mb-2">{section.heading}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}