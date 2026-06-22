/* ============================================================
   POST-RETREAT SURVEY — 5 questions + proof photo upload
   Completing grants +100 Brotherhood Points
   ============================================================ */
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Star, Camera, CheckCircle, Upload } from 'lucide-react';
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
  const [user, setUser] = useState(null);
  const [answers, setAnswers] = useState({});
  const [proofPhoto, setProofPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const urlParams = new URLSearchParams(window.location.search);
  const appId = urlParams.get('id');

  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);

  const setAnswer = (id, val) => setAnswers(p => ({ ...p, [id]: val }));

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setProofPhoto(file_url);
    setUploading(false);
    toast.success('Photo uploaded!');
  };

  const handleSubmit = async () => {
    if (!user) { base44.auth.redirectToLogin(); return; }
    // Update the application with survey data
    if (appId) {
      await base44.entities.RetreatApplication.update(appId, {
        survey_completed: true,
        proof_photo_url: proofPhoto,
      });
    }
    // Award 100 loyalty points
    await base44.entities.LoyaltyTransaction.create({
      user_id: user.id,
      points_amount: 100,
      type: 'earn',
      source: 'survey',
      description: 'Post-retreat survey completed',
    });
    setSubmitted(true);
    toast.success('+100 Brotherhood Points earned!');
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
        {proofPhoto && (
          <div className="mt-4 w-48 h-48 rounded-xl overflow-hidden">
            <img src={proofPhoto} alt="Proof" className="w-full h-full object-cover" />
          </div>
        )}
        <Button className="mt-6 font-heading tracking-wider uppercase" onClick={() => window.location.href = '/account'}>View My Points</Button>
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

        {/* Proof Photo Upload */}
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Camera className="w-5 h-5 text-primary" />
            <h3 className="font-heading text-lg tracking-wider uppercase">Upload Proof Photo</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Optional but encouraged. This becomes your badge of honor on your profile.</p>
          {proofPhoto ? (
            <div className="relative">
              <img src={proofPhoto} alt="Proof" className="w-full h-48 object-cover rounded-lg" />
              <button onClick={() => setProofPhoto(null)} className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">Remove</button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-8 cursor-pointer hover:border-primary/40 transition-colors">
              <Upload className="w-8 h-8 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">{uploading ? 'Uploading...' : 'Click to upload photo'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
            </label>
          )}
        </motion.div>

        <Button onClick={handleSubmit} disabled={!allAnswered} className="w-full font-heading tracking-wider uppercase py-6 text-base">
          Submit Survey & Earn 100 Points
        </Button>
      </div>
    </div>
  );
}