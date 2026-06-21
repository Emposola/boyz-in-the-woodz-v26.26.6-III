/* Social proof animated marquee strip */
import React from 'react';
import { Star } from 'lucide-react';

const REVIEWS = [
  { name: 'Marcus D.', text: 'Best investment in myself all year. The retreat rewired me.' },
  { name: 'James T.', text: 'Left feeling like a brand new man. The Code is real.' },
  { name: 'Dev P.', text: 'Walk in looking rough. Walk out feeling sharp. Every time.' },
  { name: 'Chris W.', text: 'My cortisol levels are actually down. Science doesn\'t lie.' },
  { name: 'Aaron B.', text: 'The brotherhood here is not just marketing. It\'s real.' },
  { name: 'Mike S.', text: 'Dre gave me the cleanest fade I\'ve ever had. I\'m a regular now.' },
];

export default function SocialProofStrip() {
  const doubled = [...REVIEWS, ...REVIEWS];
  return (
    <section className="py-10 border-y border-border bg-secondary/20 overflow-hidden">
      <div className="flex gap-4 animate-marquee whitespace-nowrap">
        {doubled.map((r, i) => (
          <div key={i} className="flex-shrink-0 bg-card border border-border rounded-xl px-5 py-4 w-64">
            <div className="flex gap-0.5 mb-2">
              {[...Array(5)].map((_, j) => <Star key={j} className="w-3 h-3 text-accent fill-accent" />)}
            </div>
            <p className="text-xs text-muted-foreground italic line-clamp-2">"{r.text}"</p>
            <p className="text-xs font-medium mt-2">— {r.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}