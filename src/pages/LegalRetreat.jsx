/* ============================================================
   LEGAL — Retreat-specific legal pages
   Routes: /legal/retreat-waiver, /legal/retreat-cancellation
           /legal/pledge-terms, /legal/chapter-terms, /legal/merchandise-safety
   ============================================================ */
import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Check, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SEO from '@/components/shared/SEO';

const FOREST_GREEN = '#2D5A27';

const PAGES = {
  '/legal/retreat-waiver': {
    title: 'Retreat Participation Waiver',
    subtitle: 'Assumption of Risk & Liability Release',
    sections: [
      {
        heading: 'Assumption of Risk',
        body: `By participating in a Boyz In The Woodz retreat, I voluntarily assume all risks associated with outdoor activities including but not limited to: hiking on uneven terrain, swimming in natural bodies of water, campfire activities, and exposure to weather conditions. I acknowledge these risks are inherent to the retreat experience.`,
      },
      {
        heading: 'Medical Release',
        body: `I authorize Boyz In The Woodz guides and staff to obtain emergency medical treatment on my behalf if I am unable to consent due to injury or incapacitation. I agree to provide accurate medical history information during the application process.`,
      },
      {
        heading: 'Photo & Media Release',
        body: `I grant Boyz In The Woodz permission to use photographs, video, and testimonials captured during retreats for marketing, social media, and promotional purposes. I waive any rights to compensation for such use.`,
      },
      {
        heading: 'Liability Release',
        body: `To the fullest extent permitted by law, I release, waive, and discharge Boyz In The Woodz, its owners, guides, and affiliated entities from any claims, demands, or causes of action arising out of or in connection with my participation, including claims resulting from negligence, injuries, accidents, or adverse weather conditions.`,
      },
    ],
    showSignature: true,
  },
  '/legal/retreat-cancellation': {
    title: 'Retreat Cancellation Policy',
    subtitle: 'Refunds, Transfers & Weather Policy',
    sections: [
      {
        heading: 'Cancellation Refund Schedule',
        body: `• 30+ days before retreat: Full refund minus $25 processing fee\n• 14–29 days before retreat: 50% refund\n• Less than 14 days: No refund\n• No-shows: No refund`,
      },
      {
        heading: 'Transfer Policy',
        body: `You may transfer your retreat spot to another person at any time up to 7 days before the retreat at no cost. Please notify us at hello@boyzinthewoodz.com with the new attendee's information.`,
      },
      {
        heading: 'Weather & Safety Cancellations',
        body: `If Boyz In The Woodz cancels a retreat due to dangerous weather, natural disasters, or safety concerns, all attendees will receive a full refund or the option to reschedule to any future retreat within 12 months at no additional cost.`,
      },
      {
        heading: 'No-Show Policy',
        body: `Failure to arrive at the designated meeting point within 2 hours of the scheduled start time without prior notice constitutes a no-show. No refund will be issued. If you're running late, contact us immediately.`,
      },
    ],
    showSignature: false,
  },
  '/legal/pledge-terms': {
    title: 'Brotherhood Pledge Terms',
    subtitle: 'What the Pledge Means & Your Responsibilities',
    sections: [
      {
        heading: 'The Five Rules of The Code',
        body: `1. No Phones — During retreat hours, devices stay packed.\n2. Show Up Physically — Your presence matters. Be present in body and mind.\n3. Respect Everyone — Every brother deserves dignity, regardless of background.\n4. No Ego — Leave your titles, status, and judgments at the trailhead.\n5. Leave Better — You leave the retreat, the campsite, and your brothers in a better state than you found them.`,
      },
      {
        heading: 'Consequences of Violating the Pledge',
        body: `Violations of The Code during a retreat may result in immediate removal from the retreat without refund. Serious violations may result in a permanent ban from future retreats and removal from the community.`,
      },
      {
        heading: 'Annual Pledge Renewal',
        body: `Brotherhood pledges are renewed annually. You will receive a reminder one year after your initial pledge. Renewal earns 100 Brotherhood Points and reaffirms your commitment to The Code.`,
      },
    ],
    showSignature: false,
  },
  '/legal/chapter-terms': {
    title: 'Chapter Leader Agreement',
    subtitle: 'Responsibilities, Conduct & Use of the BITW Brand',
    sections: [
      {
        heading: 'Chapter Leader Responsibilities',
        body: `Chapter leaders agree to: organize at least 2 chapter events per quarter, maintain a minimum of 5 active members, uphold The Code at all events, report event attendance to Boyz In The Woodz, and act as the primary point of contact for their region.`,
      },
      {
        heading: 'Code of Conduct for Chapter Events',
        body: `All chapter events must align with the values of Brotherhood, Freedom, and Nature. Events involving alcohol must ensure no member is driving impaired. Events must be welcoming to all men regardless of race, religion, or background. Violence, harassment, or discrimination will not be tolerated.`,
      },
      {
        heading: 'Chapter Termination',
        body: `A chapter may be terminated by Boyz In The Woodz for: 6+ months of inactivity, repeated Code violations, misuse of the brand, or failure to maintain minimum membership. Leaders will be given 30 days notice and an opportunity to respond.`,
      },
      {
        heading: 'Brand Usage',
        body: `Chapter leaders may use the "Boyz In The Woodz" name and provided logo assets for approved chapter events. Creation of merchandise, partnerships, or media using the brand requires written approval from Boyz In The Woodz.`,
      },
    ],
    showSignature: false,
  },
  '/legal/merchandise-safety': {
    title: 'Merchandise Safety & Care',
    subtitle: 'Product Care, Sourcing & Safety Information',
    sections: [
      {
        heading: 'Clothing Care Instructions',
        body: `To preserve color and prevent shrinkage:\n• Wash cold, inside out\n• Tumble dry low or hang dry\n• Do not bleach\n• Iron on low heat if needed\n• Avoid dryer heat for graphic prints`,
      },
      {
        heading: 'Material Sourcing',
        body: `Boyz In The Woodz is committed to responsible sourcing. Our hoodies and tees are made from 80% organic cotton / 20% recycled polyester blends. We partner with manufacturers who maintain fair labor standards and environmentally responsible production.`,
      },
      {
        heading: 'Recall Information',
        body: `There are currently no active product recalls. In the event of a safety recall, all affected customers will be notified via email and the recall will be posted at the top of our website. For safety concerns, contact hello@boyzinthewoodz.com immediately.`,
      },
    ],
    showSignature: false,
  },
};

export default function LegalRetreat() {
  const location = useLocation();
  const [signed, setSigned] = useState(false);
  const [sigName, setSigName] = useState('');

  const page = PAGES[location.pathname] || PAGES['/legal/retreat-waiver'];

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Retreat Legal — BOYZ IN THE WOODZ" description="Legal terms and conditions for retreat participation." canonical="/retreat/legal" />
      {/* Header */}
      <div className="relative py-16 overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(45,90,39,0.15) 0%, transparent 60%)' }}>
        <div className="max-w-4xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5" style={{ color: FOREST_GREEN }} />
              <span className="text-xs font-heading tracking-[0.3em] uppercase text-muted-foreground">Legal</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl tracking-wide uppercase text-foreground">{page.title}</h1>
            <p className="text-muted-foreground mt-2">{page.subtitle}</p>
            <p className="text-xs text-muted-foreground/50 mt-2">Last updated: June 2026</p>
          </motion.div>
        </div>
      </div>

      {/* Other legal pages nav */}
      <div className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 flex gap-1 overflow-x-auto py-2">
          {Object.entries(PAGES).map(([path, p]) => (
            <Link key={path} to={path}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-heading tracking-wider uppercase transition-all ${location.pathname === path ? 'text-white' : 'text-muted-foreground hover:text-foreground'}`}
              style={location.pathname === path ? { background: FOREST_GREEN } : {}}>
              {p.title.split(' ').slice(0, 2).join(' ')}
            </Link>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-8">
          {page.sections.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-heading text-lg tracking-wider uppercase mb-4" style={{ color: FOREST_GREEN }}>{s.heading}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{s.body}</p>
            </motion.div>
          ))}
        </div>

        {/* Electronic Signature (waiver only) */}
        {page.showSignature && (
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-10 bg-card border border-border rounded-xl p-6">
            <h3 className="font-heading text-lg tracking-wider uppercase mb-2" style={{ color: FOREST_GREEN }}>Electronic Signature</h3>
            <p className="text-sm text-muted-foreground mb-5">
              By typing your full name below, you confirm that you have read, understood, and agree to all terms of this waiver. This constitutes a legally binding electronic signature.
            </p>
            {signed ? (
              <div className="flex items-center gap-3 text-sm" style={{ color: FOREST_GREEN }}>
                <Check className="w-5 h-5" />
                <span className="font-heading tracking-wider">Waiver signed by {sigName}</span>
              </div>
            ) : (
              <div className="flex gap-3">
                <Input placeholder="Type your full legal name" value={sigName} onChange={e => setSigName(e.target.value)}
                  className="bg-secondary border-border" />
                <Button onClick={() => sigName.trim() && setSigned(true)} className="flex-shrink-0 font-heading tracking-wider uppercase"
                  style={{ background: FOREST_GREEN }} disabled={!sigName.trim()}>
                  Sign & Accept
                </Button>
              </div>
            )}
          </motion.div>
        )}

        <div className="mt-8 flex gap-4">
          <Button asChild variant="outline" className="font-heading tracking-wider uppercase">
            <Link to="/services"><ArrowRight className="w-4 h-4 mr-2" /> Back to Services</Link>
          </Button>
          <Button asChild className="font-heading tracking-wider uppercase" style={{ background: FOREST_GREEN }}>
            <Link to="/retreat/apply">Apply for a Retreat</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}