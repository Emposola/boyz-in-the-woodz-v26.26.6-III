import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Plus, Pencil, Trash2, Save, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

const FG = '#2D5A27';

const EMPTY_ADDON = { name: '', price: 0, description: '', active: true };

function AddonForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY_ADDON);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Name *</label>
          <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Beard Oil Treatment" className="bg-secondary" />
        </div>
        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Price ($)</label>
          <Input type="number" value={form.price} onChange={e => set('price', parseInt(e.target.value) || 0)} className="bg-secondary" />
        </div>
        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Active</label>
          <div className="flex items-center h-10">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} className="accent-primary" /> Active
            </label>
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Description</label>
          <Input value={form.description} onChange={e => set('description', e.target.value)} placeholder="Nourishing argan & jojoba oil blend" className="bg-secondary" />
        </div>
      </div>
      <div className="flex gap-3 pt-2 border-t border-border">
        <Button onClick={() => onSave(form)} className="font-heading tracking-wider uppercase gap-2 flex-1" style={{ background: FG }}>
          <Save className="w-4 h-4" /> Save Add-on
        </Button>
        <Button onClick={onCancel} variant="outline" className="font-heading tracking-wider uppercase">Cancel</Button>
      </div>
    </div>
  );
}

export default function AdminAddons() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const qc = useQueryClient();

  const { data: addons = [], isLoading } = useQuery({
    queryKey: ['admin-addons'],
    queryFn: async () => {
      const { data, error } = await supabase.from('addons').select('*').order('name');
      if (error) throw error;
      return data || [];
    },
  });

  const saveAddon = useMutation({
    mutationFn: async (form) => {
      if (!form.name) throw new Error('Name is required');
      if (form.id) {
        const { error } = await supabase.from('addons').update(form).eq('id', form.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('addons').insert(form);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-addons'] }); toast({ title: 'Add-on saved' }); setShowForm(false); setEditing(null); },
    onError: (e) => toast({ variant: 'destructive', title: 'Error', description: e.message }),
  });

  const deleteAddon = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('addons').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-addons'] }); toast({ title: 'Add-on deleted' }); },
    onError: (e) => toast({ variant: 'destructive', title: 'Error', description: e.message }),
  });

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-3xl tracking-wide uppercase flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-primary" /> Add-ons
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Extra services customers can add at booking (shampoo, beard oil, etc.)</p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditing(null); }} className="font-heading tracking-wider uppercase text-xs gap-2" style={{ background: FG }}>
          <Plus className="w-4 h-4" /> New Add-on
        </Button>
      </div>

      {(showForm || editing) && (
        <div className="mb-5">
          <AddonForm initial={editing} onSave={(form) => saveAddon.mutate(form)} onCancel={() => { setShowForm(false); setEditing(null); }} />
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" /></div>
      ) : addons.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="font-heading tracking-wider uppercase text-sm">No add-ons yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {addons.map(a => (
            <div key={a.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-sm">{a.name}</p>
                  <span className={`text-[10px] font-heading tracking-wider uppercase px-2 py-0.5 rounded-full ${a.active ? 'bg-green-900/40 text-green-400' : 'bg-secondary text-muted-foreground'}`}>{a.active ? 'Active' : 'Inactive'}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{a.description || '—'}</p>
              </div>
              <span className="font-heading text-lg flex-shrink-0" style={{ color: FG }}>+${a.price}</span>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => { setEditing(a); setShowForm(false); }} className="p-1.5 text-muted-foreground hover:text-primary rounded-lg hover:bg-primary/10 transition-colors"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => { if (confirm(`Delete "${a.name}"?`)) deleteAddon.mutate(a.id); }} className="p-1.5 text-muted-foreground hover:text-red-400 rounded-lg hover:bg-red-400/10 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
