/* ============================================================
   RETREAT APPLICATION — 6-step flow with deposit placeholder
   Step 1: Select Retreat
   Step 2: Emergency Contact
   Step 3: Health Info
   Step 4: Accept The Code
   Step 5: Review
   Step 6: Secure Your Spot (Deposit — Stripe)
    ============================================================ */
import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trees, MapPin, Heart, Shield, CheckCircle, ArrowLeft,
  ArrowRight, CreditCard, Lock, Clock, Users, Calendar, DollarSign, Check
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import SEO from '@/components/shared/SEO';
import StripePaymentForm from '@/components/shared/StripePaymentForm';
import { format } from 'date-fns';

const FG = '#2D5A27';
const SAND = '#D2B48C';

const STEPS = [
  { label: 'Retreat',   short: '1' },
  { label: 'Emergency', short: '2' },
  { label: 'Health',    short: '3' },
  { label: 'The Code',  short: '4' },
  { label: 'Review',    short: '5' },
  { label: 'Deposit',   short: '6' },
];

const CODE_ITEMS = [
  'I will leave my phone away during activities',
  'I commit to showing up physically and mentally present',
  'I will respect every man in this space regardless of background',
  'I will check my ego at the trailhead',
  'I will leave better than I arrived',
];

const FALLBACK_RETREATS = [
  {
    id: 'r1', title: 'Broken Bow Fall Retreat',
    location_name: 'Broken Bow, OK', start_date: '2026-10-10',
    spots_remaining: 4, capacity: 12, full_price: 297,
    deposit_amount: 100, difficulty: 'Easy', duration: '2-day',
    description: 'A weekend reset in the Oklahoma wilderness.',
  },
  {
    id: 'r2', title: 'Ouachita Deep Dive',
    location_name: 'Ouachita NF, AR', start_date: '2026-11-07',
    spots_remaining: 2, capacity: 10, full_price: 497,
    deposit_amount: 150, difficulty: 'Moderate', duration: '3-day',
    description: 'Three days to go deeper and stay longer.',
  },
  {
    id: 'r3', title: 'Ozark Expedition',
    location_name: 'Ozark NF, MO', start_date: '2027-01-15',
    spots_remaining: 6, capacity: 8, full_price: 897,
    deposit_amount: 250, difficulty: 'Hard', duration: '5-day',
    description: 'The full experience. Five days in the wilderness.',
  },
];

export default function RetreatApply() {
  const [step, setStep] = useState(0);
  const { user, isAuthenticated, isLoadingAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const referralId = queryParams.get('ref');

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [depositConfirmed, setDepositConfirmed] = useState(false);
  const [depositPaid, setDepositPaid] = useState(false);

  const [form, setForm] = useState({
    retreat: null,
    emergency_contact_name: '',
    emergency_contact_phone: '',
    medical_notes: '',
    code_items_checked: [],
  });

  /* ── Fetch real events from DB ── */
  const { data: events = [] } = useQuery({
    queryKey: ['retreat-events-apply'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('type', 'retreat')
        .eq('active', true)
        .order('start_date', { ascending: true });
      if (error) return [];
      return data || [];
    },
  });

  const retreats = events.length > 0 ? events : FALLBACK_RETREATS;

  const toggleCode = (item) => setForm(p => ({
    ...p,
    code_items_checked: p.code_items_checked.includes(item)
      ? p.code_items_checked.filter(i => i !== item)
      : [...p.code_items_checked, item],
  }));

  const allCodeChecked = form.code_items_checked.length === CODE_ITEMS.length;
  const selectedRetreat = form.retreat;
  const spotsRemaining = selectedRetreat?.spots_remaining ?? selectedRetreat?.capacity ?? 0;
  const depositAmount = selectedRetreat?.deposit_amount ?? 100;
  const fullPrice = selectedRetreat?.full_price ?? 297;
  const balanceAmount = fullPrice - depositAmount;

  /* ── Step validation ── */
  const canProceed = () => {
    if (step === 0) return !!selectedRetreat;
    if (step === 1) return form.emergency_contact_name && form.emergency_contact_phone;
    if (step === 3) return allCodeChecked;
    if (step === 5) return depositConfirmed;
    return true;
  };

  /* ── Submit ── */
  const handleSubmit = async () => {
    if (!isAuthenticated || !user) {
      navigate('/auth/signin?redirect=/retreat/apply');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const isRealEvent = typeof selectedRetreat.id === 'string' &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(selectedRetreat.id);

      const applicationData = {
        user_id: user.id,
        event_id: isRealEvent ? selectedRetreat.id : null,
        status: 'pending',
        deposit_paid: false,
        payment_pending: true,
        deposit_amount: depositAmount,
        balance_amount: balanceAmount,
        total_amount: fullPrice,
        responses: {
          retreat_title: selectedRetreat.title,
          location_name: selectedRetreat.location_name,
          requested_date: selectedRetreat.start_date || selectedRetreat.requested_date,
          user_name: user.full_name || user.email,
          user_email: user.email,
          emergency_contact_name: form.emergency_contact_name,
          emergency_contact_phone: form.emergency_contact_phone,
          medical_notes: form.medical_notes,
          code_accepted: true,
          code_items_checked: form.code_items_checked,
          referred_by: referralId || null,
          full_price: fullPrice,
          deposit_amount: depositAmount,
          balance_amount: balanceAmount,
        },
      };

      const { error: insertError } = await supabase
        .from('retreat_applications')
        .insert(applicationData);

      if (insertError) throw new Error(insertError.message);

      // Decrease spots_remaining if it's a real DB event
      if (isRealEvent && spotsRemaining > 0) {
        await supabase
          .from('events')
          .update({ spots_remaining: spotsRemaining - 1 })
          .eq('id', selectedRetreat.id);
      }

      setSubmitted(true);
      toast.success('Application submitted! We\'ll contact you with payment details within 24 hours.');
    } catch (err) {
      console.error('Retreat application error:', err);
      setError(err.message || 'Unable to submit your application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Success screen ── */
  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center max-w-lg mx-auto">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: `${FG}22` }}>
            <CheckCircle className="w-10 h-10" style={{ color: FG }} />
          </div>
          <h1 className="font-heading text-4xl tracking-wide uppercase mb-3">Spot Reserved</h1>
          <p className="text-muted-foreground text-sm mb-2 max-w-md">
            Your application is in. We review every man personally.
          </p>
          <div className="bg-card border border-border rounded-xl p-5 my-6 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Retreat</span>
              <span className="font-medium">{selectedRetreat?.title}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Deposit due</span>
              <span className="font-heading text-lg" style={{ color: FG }}>${depositAmount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Balance (on approval)</span>
              <span className="text-muted-foreground">${balanceAmount}</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between text-sm font-medium">
              <span>Total</span>
              <span>${fullPrice}</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-6">
            We'll reach out within 24 hours with deposit payment instructions.
            Your spot is held pending payment.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate('/retreat/waitlist')}
              className="font-heading tracking-wider uppercase" style={{ background: FG }}>
              Track My Application
            </Button>
            <Button onClick={() => navigate('/')} variant="outline"
              className="font-heading tracking-wider uppercase">
              Go Home
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-2xl mx-auto px-4 py-8 md:py-12">
      <SEO
        title="Apply for a Retreat — BOYZ IN THE WOODZ"
        description="Apply for a Boyz In The Woodz wilderness retreat. Limited spots. Deposit secures your place."
        canonical="/retreat/apply"
      />

      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Trees className="w-5 h-5" style={{ color: FG }} />
        <span className="text-xs font-heading tracking-[0.3em] uppercase" style={{ color: FG }}>The Woodz</span>
      </div>
      <h1 className="font-heading text-3xl md:text-4xl tracking-wide uppercase mb-1">Apply for a Retreat</h1>
      <p className="text-muted-foreground text-sm mb-6">Limited spots. A deposit secures yours.</p>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Step indicator */}
      <div className="flex items-center gap-1 mb-8">
        {STEPS.map((s, i) => (
          <React.Fragment key={s.label}>
            <div className={`flex items-center gap-1.5 ${i <= step ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border flex-shrink-0 transition-all ${
                i < step  ? 'text-white border-primary'  :
                i === step ? 'border-primary text-primary' :
                'border-border text-muted-foreground'
              }`} style={i < step ? { background: FG, borderColor: FG } : {}}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className="text-[10px] hidden md:inline font-heading tracking-wider uppercase">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px transition-colors ${i < step ? 'bg-primary' : 'bg-border'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step}
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.18 }}>

          {/* ── STEP 0: Select Retreat ── */}
          {step === 0 && (
            <div className="space-y-3">
              <h2 className="font-heading text-xl tracking-wider uppercase mb-4">Select a Retreat</h2>
              {retreats.map(r => {
                const spots = r.spots_remaining ?? r.capacity;
                const price = r.full_price ?? 297;
                const deposit = r.deposit_amount ?? 100;
                const date = r.start_date || r.requested_date;
                const selected = form.retreat?.id === r.id;
                return (
                  <button key={r.id} onClick={() => setForm(p => ({ ...p, retreat: r }))}
                    className={`w-full text-left rounded-xl border p-5 transition-all ${
                      selected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40 bg-card'
                    }`}>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-heading text-sm tracking-wider uppercase">{r.title}</h3>
                          {r.difficulty && (
                            <span className="text-[10px] font-heading tracking-wider uppercase px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                              {r.difficulty}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{r.location_name}</span>
                          {date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />
                            {date.includes('T') ? format(new Date(date), 'MMM d, yyyy') : date}
                          </span>}
                          {r.duration && <span>{r.duration}</span>}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-heading text-xl" style={{ color: FG }}>${price}</p>
                        <p className="text-[10px] text-muted-foreground">${deposit} deposit</p>
                        <span className={`text-[10px] font-heading tracking-wider uppercase mt-1 block ${
                          spots <= 0 ? 'text-red-400' : spots <= 3 ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          {spots <= 0 ? 'Waitlist' : `${spots} spots left`}
                        </span>
                      </div>
                    </div>
                    {r.description && (
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-1">{r.description}</p>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* ── STEP 1: Emergency Contact ── */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-heading text-xl tracking-wider uppercase mb-4">Emergency Contact</h2>
              <p className="text-xs text-muted-foreground">Required for all retreat participants. This person will be contacted if there's an emergency on the trail.</p>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Contact Name *</label>
                <Input value={form.emergency_contact_name}
                  onChange={e => setForm(p => ({ ...p, emergency_contact_name: e.target.value }))}
                  placeholder="Full name" className="bg-secondary" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Contact Phone *</label>
                <Input value={form.emergency_contact_phone}
                  onChange={e => setForm(p => ({ ...p, emergency_contact_phone: e.target.value }))}
                  placeholder="(555) 000-0000" className="bg-secondary" />
              </div>
            </div>
          )}

          {/* ── STEP 2: Health Info ── */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-heading text-xl tracking-wider uppercase mb-4">Health Information</h2>
              <p className="text-xs text-muted-foreground">This stays private. Our first-aid certified facilitators need to know about any conditions that could affect your safety outdoors.</p>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Medical conditions, allergies, or medications (optional)</label>
                <textarea value={form.medical_notes}
                  onChange={e => setForm(p => ({ ...p, medical_notes: e.target.value }))}
                  placeholder="None" rows={4}
                  className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div className="bg-card border border-border rounded-lg p-4 text-xs text-muted-foreground flex items-start gap-2">
                <Heart className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                All retreat facilitators carry first-aid kits and are trained in wilderness emergency response.
              </div>
            </div>
          )}

          {/* ── STEP 3: Accept The Code ── */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-heading text-xl tracking-wider uppercase mb-2">Accept The Code</h2>
              <p className="text-xs text-muted-foreground mb-4">Check each item to confirm your commitment to the brotherhood. Commitment is part of The Code.</p>
              {CODE_ITEMS.map(item => (
                <label key={item} className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox"
                    checked={form.code_items_checked.includes(item)}
                    onChange={() => toggleCode(item)}
                    className="mt-0.5 rounded border-border w-4 h-4 accent-primary" />
                  <span className={`text-sm transition-colors ${form.code_items_checked.includes(item) ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {item}
                  </span>
                </label>
              ))}
              <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-xl text-xs text-primary">
                <Shield className="w-3.5 h-3.5 inline mr-1.5" />
                Your deposit also proves you're showing up — physically, mentally, financially.
              </div>
            </div>
          )}

          {/* ── STEP 4: Review ── */}
          {step === 4 && selectedRetreat && (
            <div className="space-y-4">
              <h2 className="font-heading text-xl tracking-wider uppercase mb-4">Review Your Application</h2>
              <div className="bg-card border border-border rounded-xl p-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Retreat</span>
                  <span className="font-medium">{selectedRetreat.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <span>{selectedRetreat.location_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span>{selectedRetreat.start_date || selectedRetreat.requested_date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Emergency Contact</span>
                  <span>{form.emergency_contact_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">The Code</span>
                  <span style={{ color: FG }}>✓ All items accepted</span>
                </div>
                <div className="border-t border-border pt-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Price</span>
                    <span className="font-medium">${fullPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deposit (due now)</span>
                    <span className="font-heading" style={{ color: FG }}>${depositAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Balance (on approval)</span>
                    <span className="text-muted-foreground">${balanceAmount}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 5: Deposit ── */}
          {step === 5 && selectedRetreat && (
            <div className="space-y-5">
              <h2 className="font-heading text-xl tracking-wider uppercase mb-1">Secure Your Spot</h2>
              <p className="text-sm text-muted-foreground">
                A non-refundable deposit of <span className="font-heading text-foreground">${depositAmount}</span> secures
                your place in <span className="font-medium">{selectedRetreat.title}</span>.
                This filters for serious men only.
              </p>

              {/* Deposit breakdown */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-border flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <span className="font-heading text-sm tracking-wider uppercase">Payment Summary</span>
                </div>
                <div className="p-5 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{selectedRetreat.title}</span>
                    <span>${fullPrice}</span>
                  </div>
                  <div className="flex justify-between font-medium border-t border-border pt-3">
                    <span>Deposit Due Today</span>
                    <span className="font-heading text-xl" style={{ color: FG }}>${depositAmount}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground text-xs">
                    <span>Balance due on approval</span>
                    <span>${balanceAmount}</span>
                  </div>
                </div>
              </div>

              {/* Payment placeholder */}
              <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className="w-4 h-4 text-primary" />
                  <span className="font-heading text-sm tracking-wider uppercase">Payment</span>
                  <span className="ml-auto flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Lock className="w-3 h-3" /> Secure
                  </span>
                </div>

                {/* Stripe payment */}
                {depositPaid ? (
                  <div className="bg-green-900/20 border border-green-800/30 rounded-lg p-4 text-center">
                    <Check className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-green-300">Deposit Paid — ${depositAmount}</p>
                  </div>
                ) : (
                  <StripePaymentForm
                    amount={depositAmount}
                    onSuccess={() => setDepositPaid(true)}
                    buttonText={`Pay Deposit — $${depositAmount}`}
                  />
                )}

                {/* Policy */}
                <div className="bg-amber-900/10 border border-amber-800/30 rounded-lg p-3 text-xs text-amber-400 flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <span>
                    Your spot is held for <strong>24 hours</strong> pending deposit payment.
                    The deposit is <strong>non-refundable</strong> but transferable to another retreat date.
                  </span>
                </div>

                {/* Confirmation checkbox */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox"
                    checked={depositConfirmed}
                    onChange={e => setDepositConfirmed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-primary rounded" />
                  <span className="text-sm text-muted-foreground">
                    I understand the <strong className="text-foreground">${depositAmount} deposit is non-refundable</strong> and
                    agree to complete payment within 24 hours to secure my spot.
                  </span>
                </label>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-xs text-primary flex items-start gap-2">
                <Shield className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span>
                  We'll review your application and contact you at <strong>{user?.email}</strong> with
                  payment instructions. Once paid, your spot is confirmed.
                </span>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between mt-8 gap-4">
        <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 0}
          className="font-heading tracking-wider uppercase text-xs">
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back
        </Button>

        {step < 5 ? (
          <Button onClick={() => setStep(s => s + 1)} disabled={!canProceed()}
            className="font-heading tracking-wider uppercase text-xs" style={{ background: FG }}>
            {step === 4 ? 'Proceed to Deposit' : 'Next'}
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={submitting || !depositConfirmed}
            className="font-heading tracking-wider uppercase flex-1 py-5 text-sm" style={{ background: FG }}>
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Submit Application
              </span>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
