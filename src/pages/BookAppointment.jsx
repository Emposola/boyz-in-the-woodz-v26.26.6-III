/* ============================================================
   BOOK APPOINTMENT — 5-step booking wizard
   Step 1: Service, Step 2: Date/Time, Step 3: Barber,
   Step 4: Add-ons, Step 5: Confirm
   ============================================================ */
import React, { useState, useEffect } from 'react';
import { api } from '@/api/supabaseClient';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, Calendar, User, Plus, CheckCircle, ArrowLeft, ArrowRight, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { format, addDays, setHours, setMinutes, isBefore, startOfDay } from 'date-fns';

/* --- Static services (replace with DB in later phase) --- */
const SERVICES = [
  { id: 's1', name: 'Haircut', price: 35, duration_minutes: 45, description: 'Precision cut + hot towel finish' },
  { id: 's2', name: 'Beard Trim', price: 20, duration_minutes: 20, description: 'Shape, line-up, and condition' },
  { id: 's3', name: 'Hot Towel Shave', price: 45, duration_minutes: 40, description: 'Old-school straight razor experience' },
  { id: 's4', name: "Kid's Cut", price: 25, duration_minutes: 30, description: 'Patient and fun for all ages' },
  { id: 's5', name: 'VIP Package', price: 80, duration_minutes: 90, description: 'Cut + shave + shoulder massage + cold drink', featured: true },
];

const ADDONS = [
  { id: 'a1', name: 'Shampoo & Condition', price: 8 },
  { id: 'a2', name: 'Hold Steady Pomade', price: 12 },
  { id: 'a3', name: 'Beard Oil Treatment', price: 10 },
  { id: 'a4', name: 'Scalp Massage (10 min)', price: 15 },
];

/* --- Generate time slots for a date --- */
function generateSlots(date) {
  const slots = [];
  const start = 9; // 9am
  const end = 19;  // 7pm
  for (let h = start; h < end; h++) {
    for (let m = 0; m < 60; m += 30) {
      const slot = setMinutes(setHours(new Date(date), h), m);
      if (!isBefore(slot, new Date())) slots.push(slot);
    }
  }
  return slots;
}

const STEPS = ['Service', 'Date & Time', 'Barber', 'Add-ons', 'Confirm'];

export default function BookAppointment() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState({ service: null, date: null, time: null, barber: null, addons: [] });
  const [user, setUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [booked, setBooked] = useState(false);

  useEffect(() => { api.auth.me().then(setUser).catch(() => {}); }, []);

  const { data: barbers } = useQuery({
    queryKey: ['barbers-active'],
    queryFn: () => api.entities.Barber.filter({ active: true }),
    initialData: [],
  });

  /* --- Generate calendar days (next 14 days, skip Sunday) --- */
  const calendarDays = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i + 1))
    .filter(d => d.getDay() !== 0);

  const slots = selected.date ? generateSlots(selected.date) : [];

  const totalPrice = (selected.service?.price || 0) + selected.addons.reduce((s, a) => s + a.price, 0);

  const toggleAddon = (addon) => {
    setSelected(prev => ({
      ...prev,
      addons: prev.addons.find(a => a.id === addon.id)
        ? prev.addons.filter(a => a.id !== addon.id)
        : [...prev.addons, addon],
    }));
  };

  const handleBook = async () => {
    if (!user) { api.auth.redirectToLogin('/barber/book'); return; }
    setSubmitting(true);
    const startTime = selected.time;
    const endTime = new Date(startTime.getTime() + selected.service.duration_minutes * 60000);
    await api.entities.Appointment.create({
      user_id: user.id,
      user_email: user.email,
      user_name: user.full_name,
      barber_id: selected.barber?.id || 'any',
      barber_name: selected.barber?.name || 'Any Available',
      service_id: selected.service.id,
      service_name: selected.service.name,
      service_price: totalPrice,
      service_duration: selected.service.duration_minutes,
      addons: selected.addons,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      status: 'booked',
      is_first_visit: true,
    });
    setSubmitting(false);
    setBooked(true);
    toast.success('Appointment booked! +50 Brotherhood Points earned.');
  };

  if (booked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <CheckCircle className="w-16 h-16 text-primary mb-4" />
        <h1 className="font-heading text-4xl tracking-wide uppercase">You're Booked</h1>
        <p className="text-muted-foreground text-sm mt-2 mb-2">
          {selected.service?.name} with {selected.barber?.name || 'your barber'} on{' '}
          {selected.time && format(selected.time, 'EEEE, MMM d')} at {selected.time && format(selected.time, 'h:mm a')}
        </p>
        <p className="text-primary text-xs">+50 Brotherhood Points added to your account</p>
        <Button className="mt-6 font-heading tracking-wider uppercase" onClick={() => window.location.href = '/account'}>
          View My Appointments
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-2xl mx-auto px-4 py-8 md:py-12">
      {/* --- Header --- */}
      <div className="flex items-center gap-2 mb-2">
        <Scissors className="w-5 h-5 text-accent" />
        <span className="text-xs font-heading tracking-[0.3em] text-accent uppercase">The Chair</span>
      </div>
      <h1 className="font-heading text-3xl md:text-4xl tracking-wide uppercase mb-6">Book Appointment</h1>

      {/* --- Step Indicator --- */}
      <div className="flex items-center gap-1 mb-8">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className={`flex items-center gap-1.5 ${i <= step ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${i < step ? 'bg-primary border-primary text-primary-foreground' : i === step ? 'border-primary text-primary' : 'border-border text-muted-foreground'}`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className="text-xs hidden sm:inline">{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`flex-1 h-px ${i < step ? 'bg-primary' : 'bg-border'}`} />}
          </React.Fragment>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>

          {/* STEP 0: Choose Service */}
          {step === 0 && (
            <div className="space-y-3">
              <h2 className="font-heading text-xl tracking-wider uppercase mb-4">Choose Your Service</h2>
              {SERVICES.map(svc => (
                <button key={svc.id} onClick={() => setSelected(p => ({ ...p, service: svc }))}
                  className={`w-full text-left bg-card border rounded-lg p-4 flex justify-between items-center transition-colors ${selected.service?.id === svc.id ? 'border-accent' : 'border-border hover:border-accent/50'}`}>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{svc.name}</span>
                      {svc.featured && <span className="bg-accent/20 text-accent text-[10px] font-heading tracking-wider uppercase px-2 py-0.5 rounded">Popular</span>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{svc.description}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1"><Clock className="w-3 h-3" /> {svc.duration_minutes} min</p>
                  </div>
                  <span className="font-heading text-xl flex-shrink-0">${svc.price}</span>
                </button>
              ))}
            </div>
          )}

          {/* STEP 1: Date & Time */}
          {step === 1 && (
            <div>
              <h2 className="font-heading text-xl tracking-wider uppercase mb-4">Pick a Date & Time</h2>
              {/* Date Picker */}
              <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
                {calendarDays.map(day => (
                  <button key={day.toISOString()} onClick={() => setSelected(p => ({ ...p, date: day, time: null }))}
                    className={`flex-shrink-0 flex flex-col items-center p-3 rounded-lg border min-w-[56px] transition-colors ${selected.date?.toDateString() === day.toDateString() ? 'border-accent bg-accent/10 text-accent' : 'border-border hover:border-accent/50'}`}>
                    <span className="text-[10px] font-heading tracking-wider uppercase">{format(day, 'EEE')}</span>
                    <span className="font-heading text-xl">{format(day, 'd')}</span>
                    <span className="text-[10px] text-muted-foreground">{format(day, 'MMM')}</span>
                  </button>
                ))}
              </div>
              {/* Time Slots */}
              {selected.date && (
                <div className="grid grid-cols-4 gap-2">
                  {slots.map((slot, i) => (
                    <button key={i} onClick={() => setSelected(p => ({ ...p, time: slot }))}
                      className={`text-sm py-2 rounded-lg border transition-colors ${selected.time?.getTime() === slot.getTime() ? 'border-accent bg-accent/10 text-accent' : 'border-border hover:border-accent/50'}`}>
                      {format(slot, 'h:mm a')}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Choose Barber */}
          {step === 2 && (
            <div>
              <h2 className="font-heading text-xl tracking-wider uppercase mb-4">Choose Your Barber</h2>
              {/* Any Available */}
              <button onClick={() => setSelected(p => ({ ...p, barber: null }))}
                className={`w-full text-left bg-card border rounded-lg p-4 mb-3 transition-colors ${!selected.barber ? 'border-accent' : 'border-border hover:border-accent/50'}`}>
                <span className="font-medium">Any Available Barber</span>
                <p className="text-xs text-muted-foreground mt-0.5">We'll assign the best available</p>
              </button>
              {barbers.length > 0 ? barbers.map(b => (
                <button key={b.id} onClick={() => setSelected(p => ({ ...p, barber: b }))}
                  className={`w-full text-left bg-card border rounded-lg p-4 mb-3 flex gap-4 items-center transition-colors ${selected.barber?.id === b.id ? 'border-accent' : 'border-border hover:border-accent/50'}`}>
                  <div className="w-12 h-12 rounded-full bg-secondary overflow-hidden flex-shrink-0">
                    {b.image_url && <img src={b.image_url} alt={b.name} className="w-full h-full object-cover" />}
                  </div>
                  <div>
                    <span className="font-medium">{b.name}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">{b.specialties?.join(', ')}</p>
                  </div>
                </button>
              )) : (
                <p className="text-sm text-muted-foreground text-center py-8">Barber profiles coming soon.</p>
              )}
            </div>
          )}

          {/* STEP 3: Add-ons */}
          {step === 3 && (
            <div>
              <h2 className="font-heading text-xl tracking-wider uppercase mb-4">Add-ons (Optional)</h2>
              <div className="grid grid-cols-2 gap-3">
                {ADDONS.map(addon => {
                  const isSelected = selected.addons.find(a => a.id === addon.id);
                  return (
                    <button key={addon.id} onClick={() => toggleAddon(addon)}
                      className={`text-left bg-card border rounded-lg p-4 transition-colors ${isSelected ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'}`}>
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-medium">{addon.name}</span>
                        <Plus className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-accent rotate-45' : 'text-muted-foreground'} transition-transform`} />
                      </div>
                      <span className="text-accent font-heading text-lg mt-1 block">+${addon.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Confirm */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="font-heading text-xl tracking-wider uppercase mb-4">Confirm Booking</h2>
              <div className="bg-card border border-border rounded-lg p-6 space-y-3">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Service</span><span className="font-medium">{selected.service?.name}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Date</span><span>{selected.date && format(selected.date, 'EEEE, MMM d')}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Time</span><span>{selected.time && format(selected.time, 'h:mm a')}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Barber</span><span>{selected.barber?.name || 'Any Available'}</span></div>
                {selected.addons.length > 0 && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Add-ons</span><span>{selected.addons.map(a => a.name).join(', ')}</span></div>}
                <div className="border-t border-border pt-3 flex justify-between font-semibold">
                  <span>Total</span><span>${totalPrice}</span>
                </div>
                <div className="bg-primary/10 rounded-lg p-3 text-xs text-primary flex items-center gap-2">
                  <Star className="w-3.5 h-3.5" /> Earn {totalPrice * 10} Brotherhood Points + 50 check-in bonus
                </div>
              </div>
              <Button onClick={handleBook} disabled={submitting} className="w-full font-heading tracking-wider uppercase py-6 text-base">
                {submitting ? 'Booking...' : 'Confirm Appointment'}
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* --- Nav Buttons --- */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 0} className="font-heading tracking-wider uppercase text-xs">
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back
        </Button>
        {step < 4 && (
          <Button
            onClick={() => setStep(s => s + 1)}
            disabled={
              (step === 0 && !selected.service) ||
              (step === 1 && (!selected.date || !selected.time)) ||
              (step === 2 && false)
            }
            className="font-heading tracking-wider uppercase text-xs"
          >
            Next <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        )}
      </div>
    </div>
  );
}