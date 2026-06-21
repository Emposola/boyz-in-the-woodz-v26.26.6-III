/* ============================================================
   PLEDGE MODAL — Updated to support onAccept callback
   ============================================================ */
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { usePledge } from '@/lib/pledgeContext';
import { Shield, Smartphone, Eye, Heart, Users, ArrowUp } from 'lucide-react';

const CODE_RULES = [
  { icon: Smartphone, title: 'No Phones', desc: 'Be present. The wilderness and the chair demand it.' },
  { icon: Users, title: 'Show Up Physically', desc: 'No shortcuts. Your body, your presence.' },
  { icon: Heart, title: 'Respect Everyone', desc: 'Every brother earns dignity by default.' },
  { icon: Eye, title: 'No Ego', desc: 'Check it at the door. Growth requires humility.' },
  { icon: ArrowUp, title: 'Leave Better', desc: 'Than when you arrived. Always.' },
];

export default function PledgeModal({ open, onOpenChange, onAccept }) {
  const { acceptPledge } = usePledge();
  const [checked, setChecked] = useState(false);

  const handleAccept = () => {
    acceptPledge();
    onOpenChange(false);
    if (onAccept) onAccept();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl tracking-wider uppercase flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" /> The Code
          </DialogTitle>
          <DialogDescription>Before you enter this brotherhood, accept our non-negotiables.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {CODE_RULES.map(rule => (
            <div key={rule.title} className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                <rule.icon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">{rule.title}</h4>
                <p className="text-xs text-muted-foreground">{rule.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-border">
          <Checkbox id="pledge" checked={checked} onCheckedChange={setChecked} />
          <label htmlFor="pledge" className="text-sm text-muted-foreground cursor-pointer">
            I accept The Code and commit to the brotherhood
          </label>
        </div>
        <Button onClick={handleAccept} disabled={!checked} className="w-full mt-4 font-heading tracking-wider uppercase">
          Enter The Brotherhood
        </Button>
      </DialogContent>
    </Dialog>
  );
}