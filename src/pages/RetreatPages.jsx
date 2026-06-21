/* ============================================================
   RETREAT SUPPORT PAGES — Custom, Virtual Tour, What to Expect, Packing
   Routes handled by type param
   ============================================================ */
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ChevronDown, ArrowRight, Download, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const FG = '#2D5A27';
const SAND = '#D2B48C';

/* ─── CUSTOM RETREAT ─── */
function CustomRetreat() {
  const [form, setForm] = useState({ name: '', email: '', groupSize: '', dates: '', location: '', notes: '' });
  const [sent, setSent] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-16" style={{ background: 'linear-gradient(135deg, rgba(45,90,39,0.1) 0%, transparent 60%)' }}>
        <div className="max-w-3xl mx-auto px-4">
          <span className="text-xs font-heading tracking-[0.3em] uppercase block mb-2" style={{ color: SAND }}>Group Experience</span>
          <h1 className="font-heading text-5xl tracking-wide uppercase text-foreground mb-3">Custom Retreats</h1>
          <p className="text-muted-foreground">Minimum 6 people · $250/person/day · All inclusive</p>
        </div>
      </section>
      <div className="max-w-3xl mx-auto px-4 py-10">
        {sent ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: FG }}>
              <Check className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-heading text-2xl uppercase mb-2">Request Received</h2>
            <p className="text-muted-foreground">We'll be in touch within 48 hours with your custom quote.</p>
          </div>
        ) : (
          <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div><label className="block text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1.5">Your Name</label><Input value={form.name} onChange={e => set('name', e.target.value)} className="bg-secondary border-border" required /></div>
              <div><label className="block text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1.5">Email</label><Input type="email" value={form.email} onChange={e => set('email', e.target.value)} className="bg-secondary border-border" required /></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div><label className="block text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1.5">Group Size (min 6)</label><Input type="number" min={6} value={form.groupSize} onChange={e => set('groupSize', e.target.value)} className="bg-secondary border-border" required /></div>
              <div><label className="block text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1.5">Preferred Dates</label><Input placeholder="e.g. October 2026" value={form.dates} onChange={e => set('dates', e.target.value)} className="bg-secondary border-border" /></div>
            </div>
            <div><label className="block text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1.5">Location Preference</label><Input placeholder="e.g. Oklahoma, Arkansas, open to suggestions" value={form.location} onChange={e => set('location', e.target.value)} className="bg-secondary border-border" /></div>
            <div><label className="block text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1.5">Notes</label><textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={4} placeholder="Tell us about your group, goals, or any special requests..." className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none resize-none" /></div>
            <Button type="submit" size="lg" className="w-full font-heading tracking-wider uppercase" style={{ background: FG }}>Request a Quote <ArrowRight className="w-4 h-4 ml-2" /></Button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ─── VIRTUAL TOUR ─── */
function VirtualTour() {
  const hotspots = [
    { label: 'Camp Setup Area', desc: 'This is where we pitch tents and learn shelter basics.' },
    { label: 'The Main Trail', desc: '4-mile loop through old-growth forest. Used for guided hikes.' },
    { label: 'The Swimming Hole', desc: 'Natural spring-fed swimming hole. Deep Dive retreat exclusive.' },
    { label: 'Fire Circle', desc: 'Where the fire ceremony happens. Where everything changes.' },
  ];
  const [active, setActive] = useState(null);
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-14" style={{ background: 'linear-gradient(135deg, rgba(45,90,39,0.1) 0%, transparent 60%)' }}>
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-xs font-heading tracking-[0.3em] uppercase block mb-2" style={{ color: SAND }}>See It First</span>
          <h1 className="font-heading text-5xl tracking-wide uppercase text-foreground mb-2">Virtual Tour</h1>
          <p className="text-muted-foreground">Explore the retreat location before you arrive.</p>
        </div>
      </section>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="relative rounded-2xl overflow-hidden mb-8 aspect-video bg-secondary">
          <img src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&q=80" alt="Retreat Location" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-3 border border-white/30">
                <div className="w-0 h-0 border-t-8 border-b-8 border-l-14 border-transparent" style={{ borderLeftColor: 'white', marginLeft: '3px' }} />
              </div>
              <p className="font-heading tracking-wider uppercase text-sm">Play 360° Tour</p>
            </div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {hotspots.map((h, i) => (
            <button key={i} onClick={() => setActive(active === i ? null : i)}
              className={`text-left p-4 rounded-xl border transition-all ${active === i ? 'border-primary/60 bg-primary/10' : 'border-border hover:border-border/80 bg-card'}`}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-heading mb-2" style={{ background: FG }}>{i + 1}</div>
              <p className="font-heading text-sm tracking-wider uppercase text-foreground">{h.label}</p>
              {active === i && <p className="text-xs text-muted-foreground mt-2">{h.desc}</p>}
            </button>
          ))}
        </div>
        <div className="text-center">
          <Button asChild size="lg" className="font-heading tracking-wider uppercase" style={{ background: FG }}>
            <Link to="/retreat/apply">See It In Person — Apply Now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ─── WHAT TO EXPECT ─── */
function WhatToExpect() {
  const sections = [
    { title: 'Before You Arrive', items: ['You\'ll receive a detailed email 2 weeks out with directions, parking, and what to bring.', 'Meet-up point is always at the trailhead — carpool coordinates are shared in the group chat.', 'Get your gear sorted. If you don\'t have it, rent from us.'] },
    { title: 'Day of Arrival', items: ['Arrive within your check-in window (usually 3–5 PM).', 'We do a gear check — your guides confirm you have essentials.', 'Camp setup. We help first-timers.', 'Opening circle that evening — every man shares one word for why he\'s here.'] },
    { title: 'During the Retreat', items: ['No phones during camp hours. Stored in a sealed bag you hold onto.', 'Mornings start early — usually a sunrise activity.', 'Food is real and plentiful. We don\'t let you go hungry.', 'You\'ll have structured time and free time.', 'The fire ceremony happens on the last night.'] },
    { title: 'What NOT to Bring', items: ['Your phone (it stays in your bag or tent)', 'Alcohol or substances', 'A full agenda', 'The need to perform', 'Ego'] },
  ];
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-14" style={{ background: 'linear-gradient(135deg, rgba(45,90,39,0.1) 0%, transparent 60%)' }}>
        <div className="max-w-3xl mx-auto px-4">
          <span className="text-xs font-heading tracking-[0.3em] uppercase block mb-2" style={{ color: SAND }}>First Timer Guide</span>
          <h1 className="font-heading text-5xl tracking-wide uppercase text-foreground mb-2">What to Expect</h1>
          <p className="text-muted-foreground">Everything you need to know before your first retreat.</p>
        </div>
      </section>
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        {sections.map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-heading text-xl tracking-wider uppercase mb-4" style={{ color: FG }}>{s.title}</h2>
            <ul className="space-y-3">
              {s.items.map((item, j) => (
                <li key={j} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center text-[10px] text-white font-heading" style={{ background: FG }}>{j + 1}</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
        <div className="text-center pt-4">
          <Button asChild size="lg" className="font-heading tracking-wider uppercase" style={{ background: FG }}>
            <Link to="/retreat/apply">Ready? Apply Now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ─── PACKING LIST ─── */
function PackingList() {
  const [season, setSeason] = useState('summer');
  const [checked, setChecked] = useState([]);
  const toggle = (item) => setChecked(c => c.includes(item) ? c.filter(x => x !== item) : [...c, item]);

  const lists = {
    summer: { provided: ['Tent', 'Sleeping pad', 'All meals', 'Filtered water', 'Group first aid kit'], bring: ['Hiking shoes/trail runners', 'Lightweight layers', 'Rain jacket', 'Sunscreen + bug spray', 'Headlamp', 'Water bottle (or buy ours)', 'Journal', 'Personal medications', 'Cash for tips', 'Swimwear (Deep Dive/Expedition)'] },
    winter: { provided: ['Tent (4-season)', 'Sleeping pad', 'All meals', 'Filtered water', 'Group first aid kit', 'Emergency blanket'], bring: ['Waterproof hiking boots', 'Thermal base layers (2 sets)', 'Insulated mid-layer', 'Waterproof outer shell', 'Warm hat + gloves', 'Hand warmers', 'Headlamp', 'Water bottle (insulated)', 'Personal medications', 'Cash for tips'] },
  };
  const list = lists[season];

  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-14" style={{ background: 'linear-gradient(135deg, rgba(45,90,39,0.1) 0%, transparent 60%)' }}>
        <div className="max-w-3xl mx-auto px-4">
          <span className="text-xs font-heading tracking-[0.3em] uppercase block mb-2" style={{ color: SAND }}>Be Prepared</span>
          <h1 className="font-heading text-5xl tracking-wide uppercase text-foreground mb-2">Packing List</h1>
          <p className="text-muted-foreground">Check off items as you pack. Saves to your dashboard.</p>
        </div>
      </section>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex gap-3 mb-8">
          {['summer', 'winter'].map(s => (
            <button key={s} onClick={() => setSeason(s)}
              className={`px-4 py-2 rounded-full text-xs font-heading tracking-wider uppercase transition-all ${season === s ? 'text-white' : 'bg-secondary text-muted-foreground'}`}
              style={season === s ? { background: FG } : {}}>
              {s === 'summer' ? '☀️ Summer' : '❄️ Winter'}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-8">
          <div>
            <h3 className="font-heading text-sm tracking-[0.2em] uppercase mb-4 flex items-center gap-2" style={{ color: FG }}>
              <Check className="w-4 h-4" /> We Provide
            </h3>
            <ul className="space-y-2">
              {list.provided.map(item => (
                <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 flex-shrink-0" style={{ color: FG }} /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-heading text-sm tracking-[0.2em] uppercase mb-4" style={{ color: SAND }}>You Bring</h3>
            <ul className="space-y-2">
              {list.bring.map(item => (
                <li key={item}>
                  <button onClick={() => toggle(item)}
                    className={`flex items-center gap-3 w-full text-left p-2 rounded-lg transition-all ${checked.includes(item) ? 'opacity-50' : 'hover:bg-secondary/30'}`}>
                    <div className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition-all ${checked.includes(item) ? 'border-primary bg-primary' : 'border-border'}`}>
                      {checked.includes(item) && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`text-sm ${checked.includes(item) ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{item}</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground mt-3">{checked.length}/{list.bring.length} packed</p>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Button variant="outline" className="font-heading tracking-wider uppercase flex items-center gap-2">
            <Download className="w-4 h-4" /> Download PDF
          </Button>
          <Button asChild className="font-heading tracking-wider uppercase" style={{ background: FG }}>
            <Link to="/retreat/apply">Apply for Retreat</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ─── ROUTER ─── */
export default function RetreatPages() {
  const location = useLocation();
  if (location.pathname.includes('/custom')) return <CustomRetreat />;
  if (location.pathname.includes('/virtual-tour')) return <VirtualTour />;
  if (location.pathname.includes('/what-to-expect')) return <WhatToExpect />;
  if (location.pathname.includes('/packing-list')) return <PackingList />;
  return <WhatToExpect />;
}