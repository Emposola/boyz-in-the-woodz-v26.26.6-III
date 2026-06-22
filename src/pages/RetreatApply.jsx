/* ============================================================
   RETREAT APPLICATION — Multi-step form
   Step 1: Select date/location, Step 2: Emergency contact,
   Step 3: Medical info, Step 4: Accept The Code, Step 5: Submit
   ============================================================ */
import React, { useState, useEffect } from 'react';
import { api } from '@/api/supabaseClient';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Trees, MapPin, Heart, Shield, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import SEO from '@/components/shared/SEO';

/* --- Fallback retreat events --- */
const FALLBACK_RETREATS = [
  { id: 'r1', title: 'Broken Bow Fall Retreat', location_name: 'Broken Bow, OK', requested_date: '2026-10-10', capacity: 12, spots_remaining: 4 },
  { id: 'r2', title: 'Big Bend Winter Basecamp', location_name: 'Big Bend, TX', requested_date: '2027-01-15', capacity: 10, spots_remaining: 2 },
  { id: 'r3', title: 'Hill Country Spring Retreat', location_name: 'Wimberley, TX', requested_date: '2027-04-05', capacity: 15, spots_remaining: 8 },
];

const STEPS = ['Retreat', 'Emergency Contact', 'Health Info', 'Accept The Code', 'Submit'];

const CODE_ITEMS = [
  'I will leave my phone away during activities',
  'I commit to showing up physically and mentally present',
  'I will respect every man in this space regardless of background',
  'I will check my ego at the trailhead',
  'I will leave better than I arrived',
];

export default function RetreatApply() {
  const [step, setStep] = useState(0);
  const [user, setUser] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    retreat: null,
    emergency_contact_name: '',
    emergency_contact_phone: '',
    medical_notes: '',
    code_accepted: false,
    code_items_checked: [],
  });

  useEffect(() => { api.auth.me().then(setUser).catch(() => {}); }, []);

  const { data: events } = useQuery({
    queryKey: ['retreat-events'],
    queryFn: () => api.entities.Event.filter({ type: 'retreat', active: true }, 'start_date', 10),
    initialData: [],
  });

  const retreats = events.length > 0 ? events : FALLBACK_RETREATS;

  const toggleCodeItem = (item) => {
    setForm(p => ({
      ...p,
      code_items_checked: p.code_items_checked.includes(item)
        ? p.code_items_checked.filter(i => i !== item)
        : [...p.code_items_checked, item],
    }));
  };

  const allCodeChecked = form.code_items_checked.length === CODE_ITEMS.length;

  const handleSubmit = async () => {
    if (!user) { api.auth.redirectToLogin('/retreat/apply'); return; }
    setSubmitting(true);
    await api.entities.RetreatApplication.create({
      user_id: user.id,
      user_email: user.email,
      user_name: user.full_name,
      location_name: form.retreat?.location_name || form.retreat?.title,
      requested_date: form.retreat?.requested_date || form.retreat?.start_date,
      status: 'pending',
      emergency_contact_name: form.emergency_contact_name,
      emergency_contact_phone: form.emergency_contact_phone,
      medical_notes: form.medical_notes,
      code_accepted: true,
    });
    setSubmitting(false);
    setSubmitted(true);
    toast.success('Application submitted! You\'ll hear back within 48 hours.');
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <CheckCircle className="w-16 h-16 text-primary mb-4" />
        <h1 className="font-heading text-4xl tracking-wide uppercase">Application Received</h1>
        <p className="text-muted-foreground text-sm mt-2 mb-2 max-w-md">
          We review every application personally. You'll receive an email within 48 hours with your status.
        </p>
        <Button className="mt-6 font-heading tracking-wider uppercase" onClick={() => window.location.href = '/retreat/waitlist'}>
          Check Waitlist Status
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-2xl mx-auto px-4 py-8 md:py-12">
      <SEO
        title="Apply for a Retreat"
        description="Apply for a Boyz In The Woodz wilderness retreat. Emergency contact, health info, and acceptance of The Code required. Spots fill fast."
        canonical="/retreat/apply"
      />

      <div className="flex items-center gap-2 mb-2">
        <Trees className="w-5 h-5 text-primary" />
        <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">The Woodz</span>
      </div>
      <h1 className="font-heading text-3xl md:text-4xl tracking-wide uppercase mb-6">Apply for a Retreat</h1>

      {/* Step Indicator */}
      <div className="flex items-center gap-1 mb-8">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className={`flex items-center gap-1 ${i <= step ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border flex-shrink-0 ${i < step ? 'bg-primary border-primary text-primary-foreground' : i === step ? 'border-primary text-primary' : 'border-border text-muted-foreground'}`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className="text-xs hidden md:inline">{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`flex-1 h-px ${i < step ? 'bg-primary' : 'bg-border'}`} />}
          </React.Fragment>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>

          {/* STEP 0: Choose Retreat */}
          {step === 0 && (
            <div className="space-y-3">
              <h2 className="font-heading text-xl tracking-wider uppercase mb-4">Select a Retreat</h2>
              {retreats.map(r => {
                const spots = r.spots_remaining ?? r.capacity;
                return (
                  <button key={r.id} onClick={() => setForm(p => ({ ...p, retreat: r }))}
                    className={`w-full text-left bg-card border rounded-lg p-5 transition-colors ${form.retreat?.id === r.id ? 'border-primary' : 'border-border hover:border-primary/40'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{r.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{r.location_name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{r.requested_date || r.start_date}</p>
                      </div>
                      <span className={`text-xs font-heading tracking-wider uppercase px-2 py-1 rounded ${spots <= 3 ? 'bg-destructive/20 text-destructive' : 'bg-primary/10 text-primary'}`}>
                        {spots} spots left
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* STEP 1: Emergency Contact */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-heading text-xl tracking-wider uppercase mb-4">Emergency Contact</h2>
              <p className="text-xs text-muted-foreground">Required for all retreat participants. This person will be contacted if there's an emergency on the trail.</p>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider">Contact Name</label>
                <Input value={form.emergency_contact_name} onChange={e => setForm(p => ({ ...p, emergency_contact_name: e.target.value }))} placeholder="Full name" className="mt-1 bg-secondary" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider">Contact Phone</label>
                <Input value={form.emergency_contact_phone} onChange={e => setForm(p => ({ ...p, emergency_contact_phone: e.target.value }))} placeholder="(555) 000-0000" className="mt-1 bg-secondary" />
              </div>
            </div>
          )}

          {/* STEP 2: Medical Info */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-heading text-xl tracking-wider uppercase mb-4">Health Information</h2>
              <p className="text-xs text-muted-foreground">This stays private. Our first-aid certified facilitators need to know about any conditions that could affect your safety outdoors.</p>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider">Medical conditions, allergies, or medications (optional)</label>
                <textarea value={form.medical_notes} onChange={e => setForm(p => ({ ...p, medical_notes: e.target.value }))}
                  placeholder="None" rows={4}
                  className="mt-1 w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div className="bg-card border border-border rounded-lg p-4 text-xs text-muted-foreground">
                <Heart className="w-4 h-4 text-primary mb-2" />
                All retreat facilitators carry first-aid kits and are trained in wilderness emergency response.
              </div>
            </div>
          )}

          {/* STEP 3: Accept The Code */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-heading text-xl tracking-wider uppercase mb-2">Accept The Code</h2>
              <p className="text-xs text-muted-foreground mb-4">Check each item to confirm your commitment to the brotherhood.</p>
              {CODE_ITEMS.map(item => (
                <label key={item} className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={form.code_items_checked.includes(item)} onChange={() => toggleCodeItem(item)}
                    className="mt-0.5 rounded border-border" />
                  <span className={`text-sm ${form.code_items_checked.includes(item) ? 'text-foreground' : 'text-muted-foreground'}`}>{item}</span>
                </label>
              ))}
            </div>
          )}

          {/* STEP 4: Review & Submit */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="font-heading text-xl tracking-wider uppercase mb-4">Review & Submit</h2>
              <div className="bg-card border border-border rounded-lg p-5 space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Retreat</span><span className="font-medium">{form.retreat?.title}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Location</span><span>{form.retreat?.location_name}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span>{form.retreat?.requested_date || form.retreat?.start_date}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Emergency Contact</span><span>{form.emergency_contact_name}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">The Code</span><span className="text-primary">✓ Accepted</span></div>
              </div>
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-xs text-primary">
                <Shield className="w-4 h-4 mb-1" />
                Applications are reviewed within 48 hours. You'll receive an email with your status.
              </div>
              <Button onClick={handleSubmit} disabled={submitting} className="w-full font-heading tracking-wider uppercase py-6 text-base">
                {submitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Nav Buttons */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 0} className="font-heading tracking-wider uppercase text-xs">
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back
        </Button>
        {step < 4 && (
          <Button onClick={() => setStep(s => s + 1)}
            disabled={
              (step === 0 && !form.retreat) ||
              (step === 1 && (!form.emergency_contact_name || !form.emergency_contact_phone)) ||
              (step === 3 && !allCodeChecked)
            }
            className="font-heading tracking-wider uppercase text-xs">
            Next <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        )}
      </div>
    </div>
  );
}