import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Scissors, Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

const FG = '#2D5A27';

const EMPTY_SERVICE = {
  name: '', description: '', price: 0, duration_minutes: 30,
  category: 'grooming', active: true, featured: false,
};

function ServiceForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY_SERVICE);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Name *</label>
          <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Haircut" className="bg-secondary" />
        </div>
        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Price ($) *</label>
          <Input type="number" min="0" step="0.01" value={form.price || ''} onChange={e => set('price', parseFloat(e.target.value) || 0)} placeholder="35" className="bg-secondary" />
        </div>
        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Duration (min) *</label>
          <Input type="number" min="5" step="5" value={form.duration_minutes || ''} onChange={e => set('duration_minutes', parseInt(e.target.value) || 30)} placeholder="45" className="bg-secondary" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Description</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} placeholder="Precision cut + hot towel finish" className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring" />
        </div>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} className="accent-primary" /> Active
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="accent-primary" /> Featured
          </label>
        </div>
      </div>
      <div className="flex gap-3 pt-2 border-t border-border">
        <Button onClick={() => onSave(form)} className="font-heading tracking-wider uppercase gap-2 flex-1" style={{ background: FG }}>
          <Save className="w-4 h-4" /> Save Service
        </Button>
        <Button onClick={onCancel} variant="outline" className="font-heading tracking-wider uppercase">Cancel</Button>
      </div>
    </div>
  );
}

export default function AdminServices() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const qc = useQueryClient();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn: async () => {
      const { data, error } = await supabase.from('services').select('*').order('name');
      if (error) throw error;
      return data || [];
    },
  });

  const saveService = useMutation({
    mutationFn: async (form) => {
      if (!form.name) throw new Error('Name is required');
      if (form.id) {
        const { error } = await supabase.from('services').update(form).eq('id', form.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('services').insert(form);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-services'] }); toast({ title: 'Service saved' }); setShowForm(false); setEditing(null); },
    onError: (e) => toast({ variant: 'destructive', title: 'Error', description: e.message }),
  });

  const deleteService = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-services'] }); toast({ title: 'Service deleted' }); },
    onError: (e) => toast({ variant: 'destructive', title: 'Error', description: e.message }),
  });

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-3xl tracking-wide uppercase flex items-center gap-2">
            <Scissors className="w-7 h-7 text-primary" /> Services
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Manage grooming services, pricing, and durations</p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditing(null); }} className="font-heading tracking-wider uppercase text-xs gap-2" style={{ background: FG }}>
          <Plus className="w-4 h-4" /> New Service
        </Button>
      </div>

      {(showForm || editing) && (
        <div className="mb-5">
          <ServiceForm initial={editing} onSave={(form) => saveService.mutate(form)} onCancel={() => { setShowForm(false); setEditing(null); }} />
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Scissors className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="font-heading tracking-wider uppercase text-sm">No services yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {services.map(s => (
            <div key={s.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-sm">{s.name}</p>
                  {s.featured && <span className="text-[10px] font-heading tracking-wider uppercase px-2 py-0.5 rounded-full bg-yellow-900/40 text-yellow-400">Popular</span>}
                  <span className={`text-[10px] font-heading tracking-wider uppercase px-2 py-0.5 rounded-full ${s.active ? 'bg-green-900/40 text-green-400' : 'bg-secondary text-muted-foreground'}`}>{s.active ? 'Active' : 'Inactive'}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.duration_minutes} min</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-heading text-lg" style={{ color: FG }}>${s.price}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => { setEditing(s); setShowForm(false); }} className="p-1.5 text-muted-foreground hover:text-primary rounded-lg hover:bg-primary/10 transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => { if (confirm(`Delete "${s.name}"?`)) deleteService.mutate(s.id); }} className="p-1.5 text-muted-foreground hover:text-red-400 rounded-lg hover:bg-red-400/10 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
