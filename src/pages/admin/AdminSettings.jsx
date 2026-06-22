/* ============================================================
   ADMIN SETTINGS — App settings, feature flags, site config
   ============================================================ */
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Settings, Save, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const FG = '#2D5A27';

export default function AdminSettings() {
  const qc = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-app-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data || {};
    },
  });

  const [form, setForm] = useState({});

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = useMutation({
    mutationFn: async (data) => {
      if (data.id) {
        const { id, ...rest } = data;
        const { error } = await supabase.from('app_settings').update(rest).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('app_settings').insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-app-settings'] });
      toast.success('Settings saved');
    },
    onError: (e) => toast.error(e.message),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-heading text-3xl tracking-wide uppercase text-foreground flex items-center gap-2">
            <Settings className="w-7 h-7 text-primary" /> Settings
          </h1>
          <p className="text-muted-foreground text-sm mt-1">App-wide configuration</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* General */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 className="font-heading text-sm tracking-wider uppercase text-foreground border-b border-border pb-2">
            General
          </h2>
          <div>
            <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">App Name</label>
            <Input value={form.app_name || ''} onChange={e => set('app_name', e.target.value)}
              placeholder="BOYZ IN THE WOODZ" className="bg-secondary border-border" />
          </div>
          <div>
            <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Contact Email</label>
            <Input value={form.contact_email || ''} onChange={e => set('contact_email', e.target.value)}
              placeholder="info@boyzinthewoodz.com" className="bg-secondary border-border" />
          </div>
          <div>
            <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Support Phone</label>
            <Input value={form.support_phone || ''} onChange={e => set('support_phone', e.target.value)}
              placeholder="+1 (555) 000-0000" className="bg-secondary border-border" />
          </div>
        </div>

        {/* Feature Flags */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 className="font-heading text-sm tracking-wider uppercase text-foreground border-b border-border pb-2">
            Feature Flags
          </h2>
          {[
            { key: 'shop_enabled',        label: 'Shop Enabled',           desc: 'Allow customers to browse and purchase products' },
            { key: 'retreats_enabled',     label: 'Retreat Applications',   desc: 'Accept new retreat applications' },
            { key: 'booking_enabled',      label: 'Barber Booking',         desc: 'Allow appointment bookings' },
            { key: 'studio_enabled',       label: 'Studio / Live Sessions', desc: 'Show the studio page to visitors' },
            { key: 'maintenance_mode',     label: 'Maintenance Mode',       desc: 'Show a maintenance message to all visitors' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-0.5">
                <input type="checkbox"
                  checked={form[key] !== false}
                  onChange={e => set(key, e.target.checked)}
                  className="sr-only peer" />
                <div className="w-10 h-5 bg-secondary peer-focus:outline-none rounded-full peer
                  peer-checked:after:translate-x-5 peer-checked:after:border-white
                  after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                  after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all
                  peer-checked:bg-primary border border-border" />
              </label>
            </div>
          ))}
        </div>

        {/* Announcement Banner */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 className="font-heading text-sm tracking-wider uppercase text-foreground border-b border-border pb-2">
            Announcement Banner
          </h2>
          <div className="flex items-center justify-between gap-4 mb-2">
            <p className="text-sm">Show banner on site</p>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox"
                checked={form.banner_enabled || false}
                onChange={e => set('banner_enabled', e.target.checked)}
                className="sr-only peer" />
              <div className="w-10 h-5 bg-secondary peer-focus:outline-none rounded-full peer
                peer-checked:after:translate-x-5 peer-checked:after:border-white
                after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all
                peer-checked:bg-primary border border-border" />
            </label>
          </div>
          <div>
            <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Banner Message</label>
            <Input value={form.banner_message || ''} onChange={e => set('banner_message', e.target.value)}
              placeholder="🌲 Next retreat: Oct 10 — Apply now!" className="bg-secondary border-border" />
          </div>
          <div>
            <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Banner Link (optional)</label>
            <Input value={form.banner_link || ''} onChange={e => set('banner_link', e.target.value)}
              placeholder="/retreat/apply" className="bg-secondary border-border" />
          </div>
        </div>

        {/* Save */}
        <Button onClick={() => save.mutate(form)} disabled={save.isPending}
          className="w-full font-heading tracking-wider uppercase gap-2 py-5" style={{ background: FG }}>
          <Save className="w-4 h-4" />
          {save.isPending ? 'Saving...' : 'Save All Settings'}
        </Button>
      </div>
    </div>
  );
}
