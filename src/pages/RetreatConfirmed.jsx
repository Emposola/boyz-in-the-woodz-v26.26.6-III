/* ============================================================
   RETREAT CONFIRMED — After admin approval
   Packing list, waiver (e-sign), deposit link, weather
   ============================================================ */
import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { api } from '@/api/supabaseClient';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle, Package, FileText, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const PACKING_LIST = [
  { category: 'Shelter', items: ['2-person tent or hammock', 'Sleeping bag (30°F rating)', 'Sleeping pad'] },
  { category: 'Clothing', items: ['Moisture-wicking base layer', 'Insulating mid layer', 'Waterproof outer shell', 'Broken Bow Brotherhood Hoodie', 'Hiking boots (broken in)', 'Wool socks x3'] },
  { category: 'Hydration', items: ['Water bottle (32oz+)', 'Water filter or purification tabs', 'Electrolyte packets'] },
  { category: 'Nutrition', items: ['Trail snacks (2 days)', 'Camp stove + fuel', 'Lightweight cookset'] },
  { category: 'Navigation', items: ['Paper map of area', 'Headlamp + batteries', 'Compass'] },
  { category: 'The Code', items: ['Phone off by first fire', 'Open mind', 'Leave-no-trace attitude'] },
];

const WAIVER_TEXT = `I, the undersigned, acknowledge and accept that participation in the Boyz In The Woodz retreat involves inherent risks including but not limited to: hiking, campfires, wildlife, and remote terrain. I am in sufficient physical condition to participate. I release Boyz In The Woodz, its organizers, and facilitators from all liability for any injuries or damages. I have disclosed all relevant medical conditions. I agree to follow The Code and the instructions of retreat facilitators at all times.`;

export default function RetreatConfirmed() {
  const { user } = useAuth();
  const [waiverChecked, setWaiverChecked] = useState(false);
  const [waiverSigned, setWaiverSigned] = useState(false);
  const [packingChecked, setPackingChecked] = useState([]);

  const { data: applications } = useQuery({
    queryKey: ['confirmed-apps', user?.id],
    queryFn: () => api.entities.RetreatApplication.filter({ user_id: user.id, status: 'confirmed' }, '-created_date', 1),
    enabled: !!user?.id,
    initialData: [],
  });

  const app = applications[0];
  const appLocationName = app?.location_name || app?.responses?.location_name;
  const appRequestedDate = app?.requested_date || app?.responses?.requested_date;
  const appWaiverSigned = waiverSigned || app?.waiver_signed || app?.responses?.waiver_signed;
  const appWaiverDate = app?.waiver_signed_date || app?.responses?.waiver_signed_date;

  const handleSignWaiver = async () => {
    if (!waiverChecked) return;
    if (app) {
      const latestApp = await api.entities.RetreatApplication.get(app.id);
      const updatedResponses = {
        ...(latestApp?.responses || {}),
        waiver_signed: true,
        waiver_signed_date: new Date().toISOString(),
      };
      await api.entities.RetreatApplication.update(app.id, {
        responses: updatedResponses,
      });
    }
    setWaiverSigned(true);
    toast.success('Waiver signed. See you out there, brother.');
  };

  const togglePacking = (item) => {
    setPackingChecked(p => p.includes(item) ? p.filter(i => i !== item) : [...p, item]);
  };

  return (
    <div className="min-h-screen max-w-3xl mx-auto px-4 py-8 md:py-12">
      {/* --- Confirmed Header --- */}
      <div className="text-center mb-10">
        <CheckCircle className="w-14 h-14 text-primary mx-auto mb-4" />
        <h1 className="font-heading text-4xl tracking-wide uppercase">You're Confirmed</h1>
        {app && <p className="text-muted-foreground text-sm mt-2">{appLocationName} · {appRequestedDate}</p>}
      </div>

      <div className="space-y-6">
        {/* --- Waiver Section --- */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="font-heading text-xl tracking-wider uppercase">Liability Waiver</h2>
          </div>
          {appWaiverSigned ? (
            <div className="bg-green-900/20 border border-green-800 rounded-lg p-3 text-xs text-green-400 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Waiver signed on {appWaiverDate ? new Date(appWaiverDate).toLocaleDateString() : 'file'}
            </div>
          ) : (
            <>
              <div className="bg-secondary rounded-lg p-4 text-xs text-muted-foreground leading-relaxed max-h-32 overflow-y-auto mb-4">
                {WAIVER_TEXT}
              </div>
              <label className="flex items-center gap-2 cursor-pointer mb-4">
                <Checkbox checked={waiverChecked} onCheckedChange={setWaiverChecked} />
                <span className="text-sm">I have read and agree to the terms above</span>
              </label>
              <Button onClick={handleSignWaiver} disabled={!waiverChecked} className="font-heading tracking-wider uppercase">
                Sign Waiver Electronically
              </Button>
            </>
          )}
        </motion.div>

        {/* --- Packing List --- */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              <h2 className="font-heading text-xl tracking-wider uppercase">Packing List</h2>
            </div>
            <span className="text-xs text-muted-foreground">{packingChecked.length}/{PACKING_LIST.flatMap(c => c.items).length} packed</span>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {PACKING_LIST.map(cat => (
              <div key={cat.category}>
                <h4 className="text-xs font-heading tracking-wider uppercase text-primary mb-2">{cat.category}</h4>
                <div className="space-y-2">
                  {cat.items.map(item => (
                    <label key={item} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox checked={packingChecked.includes(item)} onCheckedChange={() => togglePacking(item)} />
                      <span className={`text-xs ${packingChecked.includes(item) ? 'line-through text-muted-foreground' : ''}`}>{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* --- Weather Teaser --- */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Cloud className="w-5 h-5 text-primary" />
            <h2 className="font-heading text-xl tracking-wider uppercase">Weather at Location</h2>
          </div>
          <p className="text-xs text-muted-foreground">Live weather forecast will be available 5 days before your retreat date. Check back closer to the date.</p>
        </motion.div>
      </div>
    </div>
  );
}