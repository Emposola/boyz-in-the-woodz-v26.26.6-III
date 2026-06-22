/* ============================================================
   CONTACT US PAGE — 7 sections: hero, form, FAQ, map, social,
   locations, and values
   ============================================================ */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LocationMap from '../components/home/LocationMap';
import { Mail, Phone, MapPin, MessageSquare, Clock, Trees, Scissors, Send, CheckCircle, Instagram, Twitter, Youtube, Facebook } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const FAQS = [
  { q: 'How do I book an appointment?', a: 'Go to /barber/book and follow the 5-step booking wizard. Same-day slots available.' },
  { q: 'How do I apply for a retreat?', a: 'Visit /retreat/apply, select your preferred retreat, complete the multi-step application. We review within 48 hours.' },
  { q: 'What is The Code?', a: 'Five non-negotiables: No Phones, Show Up Physically, Respect Everyone, No Ego, Leave Better. Every member accepts these before joining.' },
  { q: 'How do Brotherhood Points work?', a: 'Earn 10 points per $1 spent at either business. 500 points = $5 off anything.' },
  { q: 'Can I return my order?', a: '30-day Leave Better Guarantee. If any product doesn\'t make you feel like a better man, return it. No questions.' },
];

const LOCATIONS_DATA = [
  { city: 'Austin', type: 'Flagship Barbershop', address: '1234 South Congress Ave, Austin TX 78704', hours: 'Mon–Sat 9am–7pm', phone: '(512) 555-0100' },
  { city: 'Houston', type: 'Barbershop', address: '4567 Montrose Blvd, Houston TX 77006', hours: 'Tue–Sat 10am–6pm', phone: '(713) 555-0200' },
  { city: 'Dallas', type: 'Barbershop + Pop-Up', address: '890 Commerce St, Dallas TX 75202', hours: 'Wed–Sat 10am–7pm', phone: '(214) 555-0300' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    toast.success('Message sent! We\'ll respond within 24 hours.');
  };

  return (
    <div className="min-h-screen">
      {/* 1. Hero */}
      <section className="relative py-20 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1400&q=80)' }}>
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">Get In Touch</span>
            <h1 className="font-heading text-4xl md:text-6xl tracking-wide uppercase mt-2 mb-4">Contact The Brotherhood</h1>
            <p className="text-white/70 text-sm max-w-xl mx-auto">Got questions about gear, the chair, or your next retreat? We're here.</p>
          </motion.div>
        </div>
      </section>

      {/* 2. Contact Methods */}
      <section className="py-12 bg-secondary/30">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-3 gap-5">
          {[
            { icon: Mail, label: 'Email Us', value: 'hello@boyznthewoodz.com', sub: 'Response within 24 hours' },
            { icon: Phone, label: 'Call Us', value: '(512) 555-0100', sub: 'Mon–Sat, 9am–6pm CST' },
            { icon: MessageSquare, label: 'Live Chat', value: 'Available in-app', sub: 'Usually replies in minutes' },
          ].map(c => (
            <motion.div key={c.label} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="bg-card border border-border rounded-xl p-6 text-center hover:border-primary/40 transition-colors">
              <c.icon className="w-7 h-7 text-primary mx-auto mb-3" />
              <h3 className="font-heading text-base tracking-wider uppercase">{c.label}</h3>
              <p className="text-sm font-medium mt-1">{c.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{c.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Contact Form */}
      <section className="py-16 bg-background">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-heading text-3xl tracking-wider uppercase text-center mb-8">Send a Message</h2>
          {sent ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
              <h3 className="font-heading text-2xl uppercase">Message Received</h3>
              <p className="text-muted-foreground text-sm mt-2">We'll get back to you within 24 hours. Promise.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="text-xs text-muted-foreground uppercase tracking-wider">Name</label>
                  <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your name" className="mt-1 bg-secondary" required /></div>
                <div><label className="text-xs text-muted-foreground uppercase tracking-wider">Email</label>
                  <Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="your@email.com" className="mt-1 bg-secondary" required /></div>
              </div>
              <div><label className="text-xs text-muted-foreground uppercase tracking-wider">Subject</label>
                <select value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} className="mt-1 w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground">
                  <option value="">Select a topic</option>
                  <option>Order / Shipping</option><option>Retreat Application</option>
                  <option>Barbershop Booking</option><option>Brotherhood Points</option><option>Other</option>
                </select>
              </div>
              <div><label className="text-xs text-muted-foreground uppercase tracking-wider">Message</label>
                <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} rows={5} placeholder="Your message..."
                  className="mt-1 w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary" required />
              </div>
              <Button type="submit" className="w-full font-heading tracking-wider uppercase py-5"><Send className="w-4 h-4 mr-2" /> Send Message</Button>
            </form>
          )}
        </div>
      </section>

      {/* 4. Locations — Google Maps embed */}
      <div className="bg-secondary/30">
        <LocationMap compact={false} />
      </div>

      {/* 5. FAQ */}
      <section className="py-16 bg-background">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-heading text-3xl tracking-wider uppercase text-center mb-8">Common Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-xl p-5">
                <h4 className="font-medium text-sm">{faq.q}</h4>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Social */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl tracking-wider uppercase mb-3">Follow the Brotherhood</h2>
          <p className="text-muted-foreground text-sm mb-8">Daily field notes, barber moments, and brotherhood drops.</p>
          <div className="flex justify-center gap-4">
            {[
              { Icon: Instagram, label: '@boyznwoodz', color: 'hover:bg-pink-500' },
              { Icon: Twitter, label: '@BITW', color: 'hover:bg-sky-500' },
              { Icon: Youtube, label: 'BITW TV', color: 'hover:bg-red-500' },
              { Icon: Facebook, label: 'Facebook', color: 'hover:bg-blue-600' },
            ].map(s => (
              <motion.a key={s.label} href="#" whileHover={{ scale: 1.1, y: -3 }}
                className={`flex flex-col items-center gap-2 p-4 bg-card border border-border rounded-xl ${s.color} hover:border-transparent hover:text-white transition-all duration-300`}>
                <s.Icon className="w-6 h-6" />
                <span className="text-xs font-heading tracking-wider uppercase">{s.label}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Values closing */}
      <section className="py-16 bg-background border-t border-border">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading text-2xl md:text-3xl tracking-wider uppercase mb-4">We Stand Behind Every Interaction</h2>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Whether it's a question about a hoodie, a retreat application, or needing to reschedule a haircut —
            every message is answered by a real human who lives The Code.
          </p>
          <div className="grid grid-cols-3 gap-6 mt-10 max-w-lg mx-auto">
            {[{ v: '< 24h', l: 'Response time' }, { v: '100%', l: 'Real humans' }, { v: '5 ★', l: 'Avg. satisfaction' }].map(s => (
              <div key={s.l}><div className="font-heading text-2xl text-primary">{s.v}</div><p className="text-xs text-muted-foreground">{s.l}</p></div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}