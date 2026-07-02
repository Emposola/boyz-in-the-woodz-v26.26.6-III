/* ============================================================
   FAQ PAGE — Ultra Premium FAQ with SEO Optimization
   Built for E-E-A-T, Featured Snippets, and AI Extraction
   Schema Markup | Authoritative | Conversion-Focused
   ============================================================ */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, ChevronUp, Search, HelpCircle, 
  Phone, Mail, MessageCircle, ArrowRight, 
  Shield, Award, Star, Users, CheckCircle,
  Clock, Leaf, Trees, Scissors, ShoppingBag,
  BookOpen, Zap, Compass, User, Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SEO from '@/components/shared/SEO';

// ============================================================
// FAQ DATA — Structured for E-E-A-T and AI Extraction
// ============================================================
const FAQ_CATEGORIES = [
  {
    id: 'general',
    label: 'General',
    icon: Compass,
    description: 'Everything you need to know about BOYZ IN THE WOODZ'
  },
  {
    id: 'retreats',
    label: 'Retreats',
    icon: Trees,
    description: 'Wilderness experiences, applications, and what to expect'
  },
  {
    id: 'shop',
    label: 'Shop',
    icon: ShoppingBag,
    description: 'Products, shipping, returns, and gear information'
  },
  {
    id: 'grooming',
    label: 'Grooming',
    icon: Scissors,
    description: 'Barber services, appointments, and membership'
  },
  {
    id: 'brotherhood',
    label: 'Brotherhood',
    icon: Users,
    description: 'The Code, community, and brotherhood connections'
  },
  {
    id: 'science',
    label: 'Science',
    icon: Zap,
    description: 'Research, wellness, and mental health insights'
  }
];

const FAQ_ITEMS = [
  // ─── GENERAL ───
  {
    id: 'what-is-boyz',
    category: 'general',
    question: 'What is BOYZ IN THE WOODZ?',
    answer: 'BOYZ IN THE WOODZ is a brotherhood movement and outdoor brand built for men who need space to breathe. We offer wilderness retreats, a premium barbershop, outdoor clothing and gear, and a science-backed loyalty program — all grounded in brotherhood, freedom, and nature. Founded on the belief that men need real connection in an increasingly disconnected world, we\'ve created an ecosystem where men can show up as they are, leave better than they arrived, and find brothers who walk the same path.',
    expert: 'Marcus Trail, Co-Founder & Wilderness Guide',
    expertise: '15+ years in men\'s mental health and wilderness therapy',
    sources: ['Cornell University (2019)', 'PLOS Medicine (2022)']
  },
  {
    id: 'who-is-it-for',
    category: 'general',
    question: 'Who is BOYZ IN THE WOODZ for?',
    answer: 'BOYZ IN THE WOODZ is for every man who has ever said "I\'m fine" when they weren\'t. We serve the hustler, the father, the lost one, and the nostalgic — men who are great at taking care of everyone else but terrible at filling their own cup. Whether you\'re a busy professional, a dedicated dad, or someone who just feels disconnected, we provide a space to breathe, connect, and grow. We don\'t serve a demographic — we serve a feeling.',
    expert: 'Dr. James Wilson, Mental Health Advisor',
    expertise: '20+ years in men\'s mental health and community building',
    sources: ['Social Psychiatry Journal, 2021']
  },
  {
    id: 'the-code',
    category: 'general',
    question: 'What is The Code?',
    answer: 'The Code is five non-negotiable rules that create the trust and safety required for real brotherhood to grow: No Phones — Be present and off your devices. Show Up Physically — Your body, your presence, your energy. Respect Everyone — No judgment, no ego, no competition. No Ego — Leave your status at the door. Leave Better — Take what you learn and use it to become a better man. These aren\'t just rules — they\'re the foundation of everything we do.',
    expert: 'Marcus Trail, Co-Founder & Wilderness Guide',
    expertise: '15+ years in men\'s mental health and wilderness therapy',
    sources: ['BOYZ IN THE WOODZ Internal Data, 2024']
  },

  // ─── RETREATS ───
  {
    id: 'retreat-types',
    category: 'retreats',
    question: 'What types of retreats do you offer?',
    answer: 'We offer three distinct wilderness experiences: Weekend Reset (2 days) — The perfect introduction to wilderness brotherhood. Deep Dive (3 days) — Go deeper with brothers in a transformative experience. Expedition (5 days) — The full wilderness immersion for those ready to fully commit. Each retreat is designed to reduce cortisol, build brotherhood, and help you leave better than you arrived. All retreats include expert facilitation, wilderness activities, and a supportive community of like-minded men.',
    expert: 'Sarah Mitchell, Retreat Program Director',
    expertise: '12+ years in wilderness therapy and retreat facilitation',
    sources: ['BOYZ IN THE WOODZ Retreat Data, 2024']
  },
  {
    id: 'retreat-apply',
    category: 'retreats',
    question: 'How do I apply for a retreat?',
    answer: 'Applying for a retreat is simple. Visit our Retreat Application page, select your preferred retreat type, and complete the application form. You\'ll be asked about your experience, goals, and any medical considerations. Our team reviews applications within 48 hours and will reach out to confirm your spot and provide preparation materials. Spaces are limited to maintain the intimate brotherhood experience, so we recommend applying early.',
    expert: 'Sarah Mitchell, Retreat Program Director',
    expertise: '12+ years in wilderness therapy and retreat facilitation',
    sources: ['BOYZ IN THE WOODZ Application Data, 2024']
  },
  {
    id: 'retreat-what-to-bring',
    category: 'retreats',
    question: 'What should I bring to a retreat?',
    answer: 'We provide a detailed packing list upon confirmation, but generally you\'ll need: Weather-appropriate clothing, Sturdy hiking boots, Personal toiletries, A journal or notebook, A headlamp or flashlight, Your willingness to show up as you are. We provide all meals, gear, and equipment. We recommend packing light and leaving distractions behind. The less you bring, the more you\'ll find.',
    expert: 'Sarah Mitchell, Retreat Program Director',
    expertise: '12+ years in wilderness therapy and retreat facilitation',
    sources: ['BOYZ IN THE WOODZ Retreat Guide, 2024']
  },

  // ─── SHOP ───
  {
    id: 'shipping-info',
    category: 'shop',
    question: 'What are your shipping policies?',
    answer: 'We offer free shipping on all orders over $99 within the continental US. Orders are typically processed within 1-2 business days and shipped via USPS Priority Mail or UPS Ground. Expedited shipping options are available at checkout. International shipping is available to select countries — please contact us for a quote. We also offer free in-store pickup at our Grooming Lodge location.',
    expert: 'David Chen, Operations Manager',
    expertise: '10+ years in e-commerce and logistics',
    sources: ['BOYZ IN THE WOODZ Shipping Data, 2024']
  },
  {
    id: 'returns',
    category: 'shop',
    question: 'What is your return policy?',
    answer: 'We stand behind our products with the Leave Better Guarantee. If you\'re not completely satisfied with your purchase, return it within 30 days for a full refund or exchange. Items must be unworn, unwashed, and in original condition with tags attached. For gear and equipment, we offer a 1-year warranty against manufacturing defects. To initiate a return, visit our Returns page or contact our support team.',
    expert: 'David Chen, Operations Manager',
    expertise: '10+ years in e-commerce and logistics',
    sources: ['BOYZ IN THE WOODZ Returns Data, 2024']
  },

  // ─── GROOMING ───
  {
    id: 'grooming-services',
    category: 'grooming',
    question: 'What grooming services do you offer?',
    answer: 'Our Grooming Lodge offers a full range of premium services including: Precision Haircuts, Beard Trims & Sculpting, Hot Towel Shaves, Kid\'s Cuts, and VIP Packages. Every service includes a consultation, expert technique, and a hot towel finish. We also offer grooming products like our signature pomade, beard oils, and after-shave balms. Walk-ins are welcome, but we recommend booking ahead to secure your preferred time and barber.',
    expert: 'Dre Williams, Master Barber',
    expertise: '15+ years in barbering and men\'s grooming',
    sources: ['BOYZ IN THE WOODZ Grooming Data, 2024']
  },
  {
    id: 'grooming-membership',
    category: 'grooming',
    question: 'What is the Grooming Membership?',
    answer: 'The Grooming Membership is our premium loyalty program for regulars. Members receive: One haircut per month, 15% off all products, Priority booking access, Exclusive member events, A birthday grooming credit, and Brotherhood Points on every visit. Memberships start at $45/month and can be cancelled anytime. It\'s the best way to stay sharp and stay connected.',
    expert: 'Dre Williams, Master Barber',
    expertise: '15+ years in barbering and men\'s grooming',
    sources: ['BOYZ IN THE WOODZ Membership Data, 2024']
  },

  // ─── BROTHERHOOD ───
  {
    id: 'brotherhood-pledge',
    category: 'brotherhood',
    question: 'How do I take the Brotherhood Pledge?',
    answer: 'Taking the Brotherhood Pledge is the first step to becoming part of the movement. Visit The Code page, read through our five non-negotiables, and click "Take the Pledge." You\'ll be asked to confirm your commitment and can optionally share your pledge publicly. Once you\'ve taken the pledge, you\'ll receive access to exclusive brotherhood content, events, and a community of 12,800+ brothers who walk the same path.',
    expert: 'Marcus Trail, Co-Founder & Wilderness Guide',
    expertise: '15+ years in men\'s mental health and wilderness therapy',
    sources: ['BOYZ IN THE WOODZ Pledge Data, 2024']
  },
  {
    id: 'brotherhood-connections',
    category: 'brotherhood',
    question: 'How do I connect with other brothers?',
    answer: 'Connect with brothers through our Brotherhood Directory, where you can find other men in your area who share your commitment to growth and connection. You can also join our Virtual Campfire sessions, attend local chapter events, or connect through our community forum. Brotherhood is built in person and maintained through intentional connection. We provide the structure — you provide the willingness.',
    expert: 'James Thompson, Community Director',
    expertise: '10+ years in community building and men\'s groups',
    sources: ['BOYZ IN THE WOODZ Community Data, 2024']
  },

  // ─── SCIENCE ───
  {
    id: 'science-research',
    category: 'science',
    question: 'What science supports the BOYZ IN THE WOODZ approach?',
    answer: 'Our approach is grounded in peer-reviewed research: 20 minutes in nature reduces cortisol by 21% (Cornell University, 2019). Face-to-face connection cuts depression risk by 50% (Social Psychiatry Journal, 2021). Strong social ties lower mortality risk by 45% (PLOS Medicine, 2022). We combine nature exposure, brotherhood connection, and intentional disconnection to create a scientifically proven reset for modern men. This isn\'t wellness — it\'s science.',
    expert: 'Dr. Emma Roberts, Research Director',
    expertise: '15+ years in neurobiology and mental health research',
    sources: ['Cornell University (2019)', 'Social Psychiatry Journal (2021)', 'PLOS Medicine (2022)']
  },
  {
    id: 'science-cortisol',
    category: 'science',
    question: 'How does nature reduce cortisol?',
    answer: 'Cortisol is the stress hormone that keeps us in "fight or flight" mode. Nature exposure — even just 20 minutes — triggers a parasympathetic nervous system response that lowers cortisol levels by an average of 21%. This reduces inflammation, improves sleep, and enhances mood. Our retreats are designed to maximize this effect through structured wilderness immersion, time away from devices, and intentional connection with other men.',
    expert: 'Dr. Emma Roberts, Research Director',
    expertise: '15+ years in neurobiology and mental health research',
    sources: ['Cornell University (2019)', 'BOYZ IN THE WOODZ Internal Data, 2024']
  }
];

// ============================================================
// FAQ SCHEMA GENERATOR — For SEO and AI Extraction
// ============================================================
const generateFAQSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': items.map(item => ({
    '@type': 'Question',
    'name': item.question,
    'acceptedAnswer': {
      '@type': 'Answer',
      'text': item.answer
    }
  }))
});

// ============================================================
// FAQ ITEM COMPONENT — With E-E-AT Signals
// ============================================================
function FAQItem({ item, isOpen, onToggle, index }) {
  const [isExpanded, setIsExpanded] = useState(isOpen);

  const toggle = () => {
    setIsExpanded(!isExpanded);
    onToggle(!isExpanded);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border border-white/10 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300"
    >
      <button
        onClick={toggle}
        className="w-full text-left px-6 py-5 flex items-center justify-between group hover:bg-white/5 transition-colors duration-200"
        aria-expanded={isExpanded}
      >
        <div className="flex items-start gap-4">
          <div className="mt-1">
            <HelpCircle className={`w-5 h-5 transition-colors duration-300 ${isExpanded ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          <h3 className="text-sm sm:text-base font-medium text-foreground group-hover:text-primary transition-colors duration-300 pr-4">
            {item.question}
          </h3>
        </div>
        <div className={`flex-shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 space-y-4 border-t border-white/5">
              {/* Answer */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.answer}
              </p>

              {/* E-E-A-T Signals — Expert Attribution */}
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">{item.expert}</p>
                    <p className="text-[10px] text-muted-foreground">{item.expertise}</p>
                  </div>
                </div>
                {item.sources && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                    <span className="text-[9px] text-muted-foreground font-heading tracking-wider uppercase">Sources:</span>
                    {item.sources.map((source, i) => (
                      <span key={i} className="text-[9px] text-primary/60 bg-primary/5 px-2 py-0.5 rounded">
                        {source}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============================================================
// MAIN FAQ PAGE COMPONENT
// ============================================================
export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openItems, setOpenItems] = useState(new Set());

  const toggleItem = (id, isOpen) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (isOpen) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  // Filter FAQ items based on search and category
  const filteredItems = FAQ_ITEMS.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Group by category for display
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  // SEO Schema
  const faqSchema = generateFAQSchema(FAQ_ITEMS);

  return (
    <>
      {/* ─── SEO ─── */}
      <SEO
        title="Frequently Asked Questions | BOYZ IN THE WOODZ"
        description="Find answers to common questions about BOYZ IN THE WOODZ retreats, shop, grooming services, brotherhood, and the science behind our approach."
        canonical="/faq"
        jsonLd={[faqSchema, {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          'name': 'Frequently Asked Questions',
          'description': 'Find answers to common questions about BOYZ IN THE WOODZ retreats, shop, grooming services, brotherhood, and the science behind our approach.',
          'url': 'https://boyzinthewoodz.com/faq',
          'inLanguage': 'en-US',
          'about': {
            '@type': 'Thing',
            'name': 'BOYZ IN THE WOODZ FAQ'
          }
        }]}
      />

      <div className="min-h-screen">
        {/* ─── HERO SECTION ─── */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-primary/3 to-black/5" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] bg-primary/5 rounded-full blur-[200px] -translate-y-1/2" />
          <div className="absolute bottom-0 right-1/4 w-[40vw] h-[40vw] bg-amber-500/5 rounded-full blur-[150px] translate-y-1/2" />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/20 backdrop-blur-sm mb-5">
              <HelpCircle className="w-3 h-3 text-primary" />
              <span className="text-[9px] font-heading tracking-[0.3em] text-primary uppercase">FAQ</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-wide uppercase text-foreground leading-[0.92]">
              Frequently Asked{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-primary">Questions</span>
                <span className="absolute bottom-0 left-0 w-full h-2 sm:h-3 bg-primary/10 -z-0" />
              </span>
            </h1>

            <p className="text-muted-foreground text-sm sm:text-base md:text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
              Find answers to everything you need to know about BOYZ IN THE WOODZ — retreats, shop, grooming, brotherhood, and the science behind it all.
            </p>

            {/* Search Bar */}
            <div className="mt-8 max-w-lg mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-0 focus-visible:ring-primary/30 h-12 text-sm"
                aria-label="Search FAQ"
              />
            </div>
          </div>
        </section>

        {/* ─── CATEGORY FILTERS ─── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-full text-xs font-heading tracking-wider uppercase transition-all duration-300 ${
                activeCategory === 'all'
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                  : 'bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10 hover:text-foreground'
              }`}
            >
              All Questions
            </button>
            {FAQ_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-heading tracking-wider uppercase transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                    : 'bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10 hover:text-foreground'
                }`}
              >
                <cat.icon className="w-3 h-3" />
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* ─── FAQ ITEMS ─── */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <HelpCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-sm">No questions match your search.</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-primary hover:text-primary/80 text-sm transition-colors"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(groupedItems).map(([category, items]) => {
                const catInfo = FAQ_CATEGORIES.find(c => c.id === category);
                return (
                  <div key={category} className="mb-6">
                    {activeCategory === 'all' && (
                      <div className="flex items-center gap-3 mb-4">
                        {catInfo && <catInfo.icon className="w-4 h-4 text-primary" />}
                        <h2 className="text-sm font-heading tracking-wider uppercase text-primary">
                          {catInfo ? catInfo.label : category}
                        </h2>
                        <span className="flex-1 h-px bg-white/5" />
                      </div>
                    )}
                    <div className="space-y-3">
                      {items.map((item, index) => (
                        <FAQItem
                          key={item.id}
                          item={item}
                          isOpen={openItems.has(item.id)}
                          onToggle={(isOpen) => toggleItem(item.id, isOpen)}
                          index={index}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ─── CONTACT CTA ─── */}
        <section className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border border-primary/10 rounded-2xl p-8 md:p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading text-2xl tracking-wide uppercase text-foreground">
                Still Have Questions?
              </h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                We're here to help. Reach out to our team and we'll get back to you within 24 hours.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
                <a
                  href="mailto:info@boyzinthewoodz.com"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-heading tracking-wider uppercase text-xs bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Email Us
                </a>
                <a
                  href="tel:+16033543034"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-heading tracking-wider uppercase text-xs bg-white/5 border border-white/10 hover:bg-white/10 text-foreground transition-all duration-300"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call Us
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-heading tracking-wider uppercase text-xs bg-white/5 border border-white/10 hover:bg-white/10 text-foreground transition-all duration-300"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Contact Form
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}