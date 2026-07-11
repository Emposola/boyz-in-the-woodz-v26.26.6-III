/* ============================================================
   POST-RETREAT SURVEY — 5 questions + proof photo upload
   Completing grants +100 Brotherhood Points
   ============================================================ */
import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '@/api/supabaseClient';
import { supabase } from '@/lib/supabase';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const QUESTIONS = [
  { id: 'q1', label: 'How were you feeling BEFORE the retreat?', type: 'scale', low: 'Burnt out', high: 'Great' },
  { id: 'q2', label: 'How are you feeling AFTER the retreat?', type: 'scale', low: 'Same', high: 'Transformed' },
  { id: 'q3', label: 'Would you recommend this to a brother?', type: 'yesno' },
  { id: 'q4', label: 'What was the most meaningful moment?', type: 'text' },
  { id: 'q5', label: 'What would make the next retreat even better?', type: 'text' },
];

function ScaleQuestion({ question, value, onChange }) {
  return (
    <div>
      <label className="text-sm font-medium">{question.label}</label>
      <div className="flex items-center gap-3 mt-3">
        <span className="text-xs text-muted-foreground w-16 text-right">{question.low}</span>
        <div className="flex gap-2 flex-1 justify-center">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
            <button key={n} onClick={() => onChange(n)}
              className={`w-8 h-8 rounded-full text-xs font-bold border transition-colors ${value === n ? 'bg-primary border-primary text-primary-foreground' : 'border-border hover:border-primary text-muted-foreground'}`}>
              {n}
            </button>
          ))}
        </div>
        <span className="text-xs text-muted-foreground w-16">{question.high}</span>
      </div>
    </div>
  );
}

export default function RetreatSurvey() {
  const { user, isAuthenticated, isLoadingAuth } = useAuth();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [validating, setValidating] = useState(true);
  const [accessDenied, setAccessDenied] = useState(null);
  const urlParams = new URLSearchParams(window.location.search);
  const appId = urlParams.get('id');

  React.useEffect(() => {
    if (isLoadingAuth) return;
    if (!isAuthenticated) { navigate('/auth/signin?redirect=/retreat/survey' + (appId ? `%3Fid%3D${appId}` : '')); return; }
    if (!appId) { setAccessDenied('No retreat application specified.'); setValidating(false); return; }
    api.entities.RetreatApplication.get(appId).then(app => {
      if (!app) { setAccessDenied('Retreat application not found.'); setValidating(false); return; }
      if (app.user_id !== user.id) { setAccessDenied('This application does not belong to you.'); setValidating(false); return; }
      if (app.responses?.survey_completed) { setAccessDenied('Survey already completed for this retreat.'); setValidating(false); return; }
      if (!app.attended && app.status !== 'confirmed') { setAccessDenied('Survey is only available for completed retreats.'); setValidating(false); return; }
      setValidating(false);
    }).catch(() => { setAccessDenied('Error loading application.'); setValidating(false); });
  }, [isAuthenticated, isLoadingAuth, user, appId, navigate]);

  const setAnswer = (id, val) => setAnswers(p => ({ ...p, [id]: val }));

  const handleSubmit = async () => {
    if (!isAuthenticated && !isLoadingAuth) { navigate('/auth/signin'); return; }
    try {
      // Update the application with survey data
      if (appId) {
        const existingApp = await api.entities.RetreatApplication.get(appId);
        const updatedResponses = {
          ...(existingApp?.responses || {}),
          survey_completed: true,
          survey_answers: answers,
        };
        await api.entities.RetreatApplication.update(appId, {
          responses: updatedResponses,
        });
      }
      // Award 100 loyalty points
      await supabase.from('loyalty_transactions').insert({
        user_id: user.id,
        points_amount: 100,
        type: 'earn',
        source: 'retreat_survey',
        description: 'Post-retreat survey completed',
      });

      const { data: curProf } = await supabase.from('profiles').select('loyalty_points').eq('id', user.id).single();
      await supabase.from('profiles').update({ loyalty_points: (curProf?.loyalty_points || 0) + 100, last_active_at: new Date().toISOString() }).eq('id', user.id);

      try {
        await supabase.from('activity_feed').insert({
          user_id: user.id,
          action_type: 'retreat_survey',
          description: 'Post-retreat survey completed',
          points: 100,
        });
      } catch (_) { /* activity_feed may not exist */ }

      setSubmitted(true);
      toast.success('+100 Brotherhood Points earned!');
    } catch (err) {
      toast.error(err?.message || 'Failed to submit survey');
    }
  };

  const allAnswered = QUESTIONS.every(q => {
    if (q.type === 'scale') return !!answers[q.id];
    if (q.type === 'yesno') return answers[q.id] !== undefined;
    return true; // text questions optional
  });

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <CheckCircle className="w-16 h-16 text-primary mb-4" />
        <h1 className="font-heading text-4xl tracking-wide uppercase">Thank You, Brother</h1>
        <p className="text-muted-foreground text-sm mt-2 mb-2">Your survey is submitted and +100 Brotherhood Points have been added.</p>
        <Button className="mt-6 font-heading tracking-wider uppercase" onClick={() => window.location.href = '/account'}>View My Points</Button>
      </div>
    );
  }

  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-background">
        <h1 className="font-heading text-3xl tracking-wide uppercase text-foreground mb-3">Access Denied</h1>
        <p className="text-muted-foreground text-sm mb-6">{accessDenied}</p>
        <Button onClick={() => window.location.href = '/account'} className="font-heading tracking-wider uppercase" style={{ background: '#2D5A27' }}>Go to Account</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-2xl mx-auto px-4 py-8 md:py-12">
      <h1 className="font-heading text-3xl tracking-wide uppercase mb-2">Post-Retreat Survey</h1>
      <p className="text-sm text-muted-foreground mb-8">5 questions. Takes 3 minutes. Earns you 100 points.</p>

      <div className="space-y-8">
        {QUESTIONS.map((q, i) => (
          <motion.div key={q.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
            className="bg-card border border-border rounded-xl p-6">
            {q.type === 'scale' && <ScaleQuestion question={q} value={answers[q.id]} onChange={v => setAnswer(q.id, v)} />}
            {q.type === 'yesno' && (
              <div>
                <label className="text-sm font-medium">{q.label}</label>
                <div className="flex gap-3 mt-3">
                  {['Yes', 'No'].map(v => (
                    <button key={v} onClick={() => setAnswer(q.id, v === 'Yes')}
                      className={`px-6 py-2 rounded-lg border text-sm font-heading tracking-wider uppercase transition-colors ${answers[q.id] === (v === 'Yes') ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/40'}`}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {q.type === 'text' && (
              <div>
                <label className="text-sm font-medium">{q.label}</label>
                <textarea value={answers[q.id] || ''} onChange={e => setAnswer(q.id, e.target.value)}
                  placeholder="Your answer (optional)..." rows={3}
                  className="mt-2 w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
            )}
          </motion.div>
        ))}

        <Button onClick={handleSubmit} disabled={!allAnswered} className="w-full font-heading tracking-wider uppercase py-6 text-base">
          Submit Survey & Earn 100 Points
        </Button>
      </div>
    </div>
  );
}