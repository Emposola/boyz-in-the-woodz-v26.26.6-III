/* ============================================================
   SCIENCE HUB PAGES — Research, Cortisol, Loneliness, Mental Health
   Routes: /science/*, routed from App.jsx
   ============================================================ */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Zap, Heart, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEO from '@/components/shared/SEO';

const FG = '#2D5A27';
const SAND = '#D2B48C';

const SciencePage = ({ tag, title, subtitle, sections, cta }) => (
  <div className="min-h-screen bg-background">
    <SEO title="The Science — Why Nature Heals" description="Peer-reviewed research on why nature, cold water, and community heal the modern man." canonical="/science" />
    <section className="relative py-14" style={{ background: 'linear-gradient(135deg, rgba(45,90,39,0.1) 0%, transparent 60%)' }}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex gap-2 mb-4 flex-wrap">
          {['/science', '/science/cortisol', '/science/loneliness', '/science/mental-health'].map((path, i) => {
            const labels = ['The Research', 'Cortisol', 'Loneliness', "Men's Mental Health"];
            return (
              <Link key={path} to={path} className="text-xs font-heading tracking-wider uppercase px-3 py-1.5 rounded-full transition-all bg-secondary text-muted-foreground hover:text-foreground">
                {labels[i]}
              </Link>
            );
          })}
        </div>
        <span className="text-xs font-heading tracking-[0.3em] uppercase block mb-2" style={{ color: SAND }}>{tag}</span>
        <h1 className="font-heading text-5xl tracking-wide uppercase text-foreground mb-2">{title}</h1>
        <p className="text-muted-foreground text-lg">{subtitle}</p>
      </div>
    </section>
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {sections.map((s, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
          className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-heading text-xl tracking-wider uppercase mb-4" style={{ color: FG }}>{s.title}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{s.body}</p>
          {s.stat && (
            <div className="mt-4 p-4 rounded-xl border border-primary/20 bg-primary/5">
              <p className="font-heading text-3xl" style={{ color: FG }}>{s.stat}</p>
              <p className="text-xs text-muted-foreground">{s.statLabel}</p>
            </div>
          )}
        </motion.div>
      ))}
      {cta && (
        <div className="text-center pt-4">
          <Button asChild size="lg" className="font-heading tracking-wider uppercase" style={{ background: FG }}>
            <Link to={cta.to}>{cta.label} <ArrowRight className="w-4 h-4 ml-2" /></Link>
          </Button>
        </div>
      )}
    </div>
  </div>
);

const PAGES = {
  '/science': {
    tag: 'Evidence Based',
    title: 'The Research',
    subtitle: 'We didn\'t build Boyz In The Woodz on vibes. We built it on science.',
    cta: { label: 'Apply for a Retreat', to: '/retreat/apply' },
    sections: [
      { title: 'Why Nature Works', body: 'A landmark study by Stanford University (2015) found that walking in nature for 90 minutes reduced activity in the prefrontal cortex — the part of the brain associated with repetitive negative thinking. Men who spend time outdoors show measurably lower cortisol levels, improved sleep quality, and increased creativity.\n\nA 2019 study in Frontiers in Psychology found that spending 2 hours per week in nature was associated with significantly better health and wellbeing. Two hours. That\'s it.', stat: '2 hrs/week', statLabel: 'minimum nature exposure for measurable wellbeing improvement (University of Exeter, 2019)' },
      { title: 'The Brotherhood Effect', body: 'A 75-year Harvard study — the longest study of human happiness ever conducted — found that the quality of your relationships is the single strongest predictor of health and happiness. Not money. Not fame. Not fitness.\n\nMen with strong social connections live longer, recover from illness faster, and experience significantly less cognitive decline as they age.', stat: '75 years', statLabel: 'Harvard study on human happiness — relationships win, every time' },
      { title: 'Cited Studies', body: 'Bratman, G.N., et al. (2015). Nature experience reduces rumination. PNAS.\nWhite, M.P., et al. (2019). Spending at least 120 minutes a week in nature. Scientific Reports.\nWaldinger, R. (2015). Harvard Study of Adult Development. TEDx.\nEpley, N. & Schroeder, J. (2014). Mistakenly seeking solitude. Journal of Experimental Psychology.\nHolt-Lunstad, J., et al. (2015). Loneliness and social isolation as risk factors for mortality. Perspectives on Psychological Science.' },
    ],
  },
  '/science/cortisol': {
    tag: 'Stress Science',
    title: 'Cortisol & Nature',
    subtitle: 'Your body knows what your mind has forgotten.',
    cta: { label: 'Reset Your Cortisol — Apply Now', to: '/retreat/apply' },
    sections: [
      { title: 'What Is Cortisol?', body: 'Cortisol is your body\'s primary stress hormone. Short bursts are healthy — they help you respond to danger. But modern life keeps cortisol chronically elevated. Constant notifications, financial pressure, performance demands, and social comparison all trigger cortisol release continuously.\n\nChronic high cortisol leads to: poor sleep, increased belly fat, impaired memory, reduced testosterone, weakened immune system, and elevated anxiety.' },
      { title: 'How Nature Reduces It', body: 'Studies show that 20 minutes in a natural setting reduces cortisol levels by measurable amounts. Immersive nature experiences — like a multi-day retreat — can reduce cortisol by up to 28% compared to urban environments.\n\nThe mechanisms: reduced sensory overload, natural light cycles, physical movement, reduced social performance anxiety, and the inherent rhythm of natural soundscapes.', stat: '28%', statLabel: 'cortisol reduction after immersive nature retreat (Journal of Environmental Psychology)' },
      { title: 'The Reset Mechanism', body: 'The Boyz In The Woodz retreat structure was designed around the cortisol reduction research:\n\n• No phones = no social comparison triggers\n• Natural environments = reduced sympathetic nervous system activation\n• Physical activity = cortisol metabolization through movement\n• Brotherhood = oxytocin release (oxytocin suppresses cortisol)\n• Fire ceremony = ritual closure of stress loops' },
    ],
  },
  '/science/loneliness': {
    tag: 'Epidemic',
    title: 'The Loneliness Epidemic',
    subtitle: 'Men are the loneliest they\'ve ever been. And nobody\'s talking about it.',
    cta: { label: 'Find Your Brotherhood', to: '/about' },
    sections: [
      { title: 'The Data Is Alarming', body: 'Harvard\'s Making Caring Common Project (2021) found that 36% of Americans — including 61% of young adults — feel seriously lonely.\n\nFor men specifically, the numbers are worse. A 2021 survey found that 15% of men have no close friends — a 5x increase from 1990. The average man today has fewer meaningful friendships than at any other point in recorded modern history.', stat: '61%', statLabel: 'of young adults feel seriously lonely (Harvard, 2021)' },
      { title: 'Why Men Are Hit Hardest', body: 'Men are socialized to be self-sufficient. Asking for help signals weakness. Vulnerability is dangerous. Performance is the currency of worth.\n\nSo men perform. They stay busy. They achieve. And they quietly fall apart.\n\nThe result: men are less likely to seek mental health care, less likely to maintain friendships after the age of 30, and significantly more likely to die from "diseases of despair" — suicide, overdose, alcoholism.' },
      { title: 'Why Brotherhood Is the Answer', body: 'The antidote isn\'t therapy apps or self-help books. It\'s real human connection — the kind that happens when you\'re unplugged, uncomfortable, and present.\n\nPLOS Medicine found that social isolation carries the same mortality risk as smoking 15 cigarettes a day. The solution isn\'t complicated. It requires a fire, a few honest men, and the willingness to show up.' },
    ],
  },
  '/science/mental-health': {
    tag: 'Men\'s Health',
    title: "Men's Mental Health",
    subtitle: 'The numbers don\'t lie. The silence has to end.',
    cta: { label: 'Take the First Step — Apply', to: '/retreat/apply' },
    sections: [
      { title: 'The Statistics', body: '• Men die by suicide at 3.5x the rate of women (CDC)\n• Men are 40% less likely to seek mental health treatment\n• 1 in 8 men experience depression or anxiety (Mental Health Foundation)\n• Male life expectancy is 5+ years shorter than female, partly due to mental health-related behaviors\n• Suicide is the #1 cause of death for men under 45 in the UK' },
      { title: 'Why Men Don\'t Seek Help', body: 'The barriers are cultural, not individual.\n\nMen are taught that emotional expression is weakness. That needing help means failure. That vulnerability is dangerous. These aren\'t personal character flaws — they\'re the result of a socialization system that prioritizes male stoicism over male wellbeing.\n\nThe result: men cope through work, alcohol, isolation, or aggression. Until they can\'t anymore.' },
      { title: 'What Actually Works', body: 'Research consistently shows that men respond better to action-based interventions than talk therapy alone. Shared physical activity, side-by-side conversations (not face-to-face), and group accountability structures outperform traditional therapy models for most men.\n\nThat\'s not our opinion — it\'s the American Psychological Association\'s conclusion. Brotherhood retreats work because they create the conditions for healing through doing, moving, and being together.' },
      { title: 'Resources', body: 'If you or a brother is struggling:\n\nNational Suicide Prevention Lifeline: 988\nCrisis Text Line: Text HOME to 741741\nMen\'s Shed Association: menssheds.org\nMovember Foundation: movember.com\n\nYou are not alone. You never were.' },
    ],
  },
};

export default function ScienceHub() {
  const location = useLocation();
  const page = PAGES[location.pathname] || PAGES['/science'];
  return <SciencePage {...page} />;
}