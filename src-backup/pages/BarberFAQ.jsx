/* ============================================================
   BARBER FAQ — Accordion with 12 common questions
   Pricing, parking, products used, policies
   ============================================================ */
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Scissors } from 'lucide-react';

const FAQS = [
  { q: 'How much does a haircut cost?', a: 'A standard haircut is $35. Beard trims start at $20. Our VIP Package (cut + shave + massage) is $80.' },
  { q: 'Do I need an appointment?', a: 'We accept both appointments and walk-ins. Appointments get priority, but our digital waitlist makes walk-ins easy.' },
  { q: 'Where are you located?', a: 'Check our Locations page for the barbershop address, hours, and directions.' },
  { q: 'Is parking available?', a: 'Yes — free parking lot behind the building and street parking available.' },
  { q: 'What products do you use?', a: 'We use our own line of pomades and oils, all available for purchase in our Barber Merch shop.' },
  { q: 'Do you cut kids\' hair?', a: 'Absolutely. Kids\' cuts are $25 and we specialize in making first haircuts fun and stress-free.' },
  { q: 'What is the membership?', a: '$29/month gets you 1 free haircut, 15% off merch, priority booking, and 2x Brotherhood Points.' },
  { q: 'Can I tip my barber?', a: 'Tips are always appreciated but never expected. You can tip in cash or add it at checkout.' },
  { q: 'What are Brotherhood Points?', a: 'Every dollar spent earns 10 points. Points work across both The Chair and The Woodz. 500 points = $5 off.' },
  { q: 'Do you offer group bookings?', a: 'Coming soon in Phase 2! Groomsmen packages and private event bookings will be available.' },
  { q: 'What\'s the cancellation policy?', a: 'Cancel at least 2 hours before your appointment. Late cancellations may incur a small fee.' },
  { q: 'Are your barbers trained in wilderness stuff?', a: 'Some are! Barbers with the "Wilderness Certified" badge are trained retreat facilitators and first-aid certified.' },
];

export default function BarberFAQ() {
  return (
    <div className="min-h-screen">
      {/* --- Hero --- */}
      <section className="py-16 md:py-20 bg-secondary/30 text-center">
        <Scissors className="w-8 h-8 text-accent mx-auto mb-3" />
        <h1 className="font-heading text-4xl md:text-5xl tracking-wide uppercase">FAQ</h1>
        <p className="text-muted-foreground text-sm mt-2">Common questions about The Chair.</p>
      </section>

      {/* --- Accordion --- */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        <Accordion type="single" collapsible className="space-y-2">
          {FAQS.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="bg-card border border-border rounded-lg px-5">
              <AccordionTrigger className="text-sm font-medium text-left hover:text-primary py-4">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pb-4">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}