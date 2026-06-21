/* ============================================================
   BROTHERHOOD DIRECTORY — Opt-in brother search
   URL: /brotherhood/directory
   ============================================================ */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Users, UserPlus, Check, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const FG = '#2D5A27';

const SAMPLE_BROTHERS = [
  { id: 1, name: 'Marcus T.', city: 'Houston, TX', retreats: ['Broken Bow 2024', 'Ouachita 2025'], interests: ['Fishing', 'Fatherhood', 'Men\'s circle'], pledged: true, avatar: 'MT' },
  { id: 2, name: 'James W.', city: 'Atlanta, GA', retreats: ['Broken Bow 2024'], interests: ['Running', 'Mental health', 'Brotherhood'], pledged: true, avatar: 'JW' },
  { id: 3, name: 'David R.', city: 'Chicago, IL', retreats: ['Ozark 2025', 'Broken Bow 2024'], interests: ['Hiking', 'Camping', 'Stoicism'], pledged: true, avatar: 'DR' },
  { id: 4, name: 'Andre L.', city: 'Dallas, TX', retreats: ['Ouachita 2025'], interests: ['Fatherhood', 'Nature', 'Fitness'], pledged: true, avatar: 'AL' },
  { id: 5, name: 'Kevin H.', city: 'Memphis, TN', retreats: ['Broken Bow 2024', 'Broken Bow 2025'], interests: ['Veterans', 'Accountability', 'Brotherhood'], pledged: true, avatar: 'KH' },
  { id: 6, name: 'Troy M.', city: 'Nashville, TN', retreats: ['Ozark 2025'], interests: ['Fishing', 'Mental health', 'Music'], pledged: true, avatar: 'TM' },
];

export default function BrotherhoodDirectory() {
  const [search, setSearch] = useState('');
  const [connected, setConnected] = useState([]);

  const filtered = SAMPLE_BROTHERS.filter(b =>
    !search || b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.city.toLowerCase().includes(search.toLowerCase()) ||
    b.interests.some(i => i.toLowerCase().includes(search.toLowerCase()))
  );

  const connect = (id) => setConnected(c => [...c, id]);

  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-16 overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(45,90,39,0.1) 0%, transparent 60%)' }}>
        <div className="max-w-4xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs font-heading tracking-[0.3em] uppercase block mb-2" style={{ color: '#D2B48C' }}>The Brotherhood</span>
            <h1 className="font-heading text-5xl tracking-wide uppercase text-foreground mb-3">Brother Directory</h1>
            <p className="text-muted-foreground mb-6">Find brothers in your city. Connect after a shared retreat. Opt-in only — privacy first.</p>

            <div className="relative max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by name, city, or interest..." value={search} onChange={e => setSearch(e.target.value)}
                className="pl-10 bg-secondary border-border" />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-card border border-border rounded-xl p-4 mb-6 flex items-center gap-3">
            <Shield className="w-5 h-5 flex-shrink-0" style={{ color: FG }} />
            <p className="text-sm text-muted-foreground">This directory is opt-in only. Brothers choose to be visible. Connection requests require approval. Names and locations are approximate.</p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {filtered.map((brother, i) => (
              <motion.div key={brother.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-heading text-lg text-white" style={{ background: FG }}>
                      {brother.avatar}
                    </div>
                    <div>
                      <p className="font-heading text-base tracking-wider uppercase">{brother.name}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />{brother.city}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-[10px] font-heading tracking-wider uppercase text-muted-foreground mb-1">Retreats Attended</p>
                  <div className="flex flex-wrap gap-1">
                    {brother.retreats.map(r => (
                      <span key={r} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{r}</span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-[10px] font-heading tracking-wider uppercase text-muted-foreground mb-1">Interests</p>
                  <div className="flex flex-wrap gap-1">
                    {brother.interests.map(interest => (
                      <span key={interest} className="text-[10px] px-2 py-0.5 rounded-full border border-border text-muted-foreground">{interest}</span>
                    ))}
                  </div>
                </div>

                {connected.includes(brother.id) ? (
                  <div className="flex items-center gap-2 text-xs font-heading tracking-wider" style={{ color: FG }}>
                    <Check className="w-4 h-4" /> Request Sent
                  </div>
                ) : (
                  <Button onClick={() => connect(brother.id)} size="sm" variant="outline"
                    className="w-full font-heading tracking-wider uppercase text-xs">
                    <UserPlus className="w-3.5 h-3.5 mr-1" /> Connect
                  </Button>
                )}
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-heading tracking-wider uppercase">No brothers found</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}