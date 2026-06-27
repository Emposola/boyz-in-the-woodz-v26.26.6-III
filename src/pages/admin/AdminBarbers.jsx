import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Users, Plus, Pencil, Trash2, Save, X, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

const FG = '#2D5A27';

const EMPTY_BARBER = {
  name: '', email: '', phone: '', image_url: '', bio: '',
  specialties: [], active: true, first_aid_certified: false,
  wilderness_certified: false,
};

function BarberForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY_BARBER);
  const [specInput, setSpecInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const uploadImage = async (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ variant: 'destructive', title: 'Image must be under 5MB' });
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `barbers/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('images').upload(path, file, { upsert: true });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(path);
      set('image_url', publicUrl);
      toast({ title: 'Photo uploaded' });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Upload failed', description: err.message });
    } finally {
      setUploading(false);
    }
  };

  const addSpecialty = () => {
    const s = specInput.trim();
    if (s && !form.specialties.includes(s)) {
      set('specialties', [...form.specialties, s]);
      setSpecInput('');
    }
  };

  const removeSpecialty = (s) => set('specialties', form.specialties.filter(x => x !== s));

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Name *</label>
          <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Marcus Cole" className="bg-secondary" />
        </div>
        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Email</label>
          <Input value={form.email} onChange={e => set('email', e.target.value)} placeholder="marcus@example.com" className="bg-secondary" />
        </div>
        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Phone</label>
          <Input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(555) 000-0000" className="bg-secondary" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Photo</label>
          <div className="flex gap-3">
            {form.image_url && (
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary flex-shrink-0 border border-border">
                <img src={form.image_url} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <Input value={form.image_url} onChange={e => set('image_url', e.target.value)} placeholder="/images/logos/team-photo.png" className="bg-secondary text-xs flex-1" />
                <input type="file" accept="image/*" ref={fileRef} className="hidden" onChange={e => { uploadImage(e.target.files[0]); e.target.value = ''; }} />
                <Button type="button" size="sm" variant="outline" disabled={uploading} onClick={() => fileRef.current?.click()}>
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground">Enter a URL or click upload to browse files (max 5MB)</p>
            </div>
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Bio</label>
          <textarea value={form.bio} onChange={e => set('bio', e.target.value)} rows={3} placeholder="Master barber with 12 years behind the chair..." className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Specialties</label>
          <div className="flex gap-2 mb-2">
            <Input value={specInput} onChange={e => setSpecInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSpecialty(); } }} placeholder="Fades" className="bg-secondary" />
            <Button type="button" onClick={addSpecialty} size="sm" variant="outline">Add</Button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {form.specialties.map(s => (
              <span key={s} className="inline-flex items-center gap-1 text-xs bg-secondary px-2 py-1 rounded-full">
                {s} <button onClick={() => removeSpecialty(s)} className="text-muted-foreground hover:text-foreground"><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} className="accent-primary" /> Active
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input type="checkbox" checked={form.first_aid_certified} onChange={e => set('first_aid_certified', e.target.checked)} className="accent-primary" /> First Aid Certified
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input type="checkbox" checked={form.wilderness_certified} onChange={e => set('wilderness_certified', e.target.checked)} className="accent-primary" /> Wilderness Guide
          </label>
        </div>
      </div>
      <div className="flex gap-3 pt-2 border-t border-border">
        <Button onClick={() => onSave(form)} className="font-heading tracking-wider uppercase gap-2 flex-1" style={{ background: FG }}>
          <Save className="w-4 h-4" /> Save Barber
        </Button>
        <Button onClick={onCancel} variant="outline" className="font-heading tracking-wider uppercase">Cancel</Button>
      </div>
    </div>
  );
}

export default function AdminBarbers() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const qc = useQueryClient();

  const { data: barbers = [], isLoading } = useQuery({
    queryKey: ['admin-barbers'],
    queryFn: async () => {
      const { data, error } = await supabase.from('barbers').select('*').order('name');
      if (error) throw error;
      return data || [];
    },
  });

  const saveBarber = useMutation({
    mutationFn: async (form) => {
      if (!form.name) throw new Error('Name is required');
      const payload = { ...form, specialties: form.specialties || [] };
      if (form.id) {
        const { error } = await supabase.from('barbers').update(payload).eq('id', form.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('barbers').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-barbers'] }); toast({ title: 'Barber saved' }); setShowForm(false); setEditing(null); },
    onError: (e) => toast({ variant: 'destructive', title: 'Error', description: e.message }),
  });

  const deleteBarber = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('barbers').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-barbers'] }); toast({ title: 'Barber deleted' }); },
    onError: (e) => toast({ variant: 'destructive', title: 'Error', description: e.message }),
  });

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-3xl tracking-wide uppercase flex items-center gap-2">
            <Users className="w-7 h-7 text-primary" /> Barbers
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Manage barber profiles, photos, and specialties</p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditing(null); }} className="font-heading tracking-wider uppercase text-xs gap-2" style={{ background: FG }}>
          <Plus className="w-4 h-4" /> New Barber
        </Button>
      </div>

      {(showForm || editing) && (
        <div className="mb-5">
          <BarberForm initial={editing} onSave={(form) => saveBarber.mutate(form)} onCancel={() => { setShowForm(false); setEditing(null); }} />
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" /></div>
      ) : barbers.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Users className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="font-heading tracking-wider uppercase text-sm">No barbers yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {barbers.map(b => (
            <div key={b.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary overflow-hidden flex-shrink-0">
                {b.image_url ? <img src={b.image_url} alt={b.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">?</div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-sm">{b.name}</p>
                  <span className={`text-[10px] font-heading tracking-wider uppercase px-2 py-0.5 rounded-full ${b.active ? 'bg-green-900/40 text-green-400' : 'bg-secondary text-muted-foreground'}`}>{b.active ? 'Active' : 'Inactive'}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{b.specialties?.join(', ') || b.bio?.slice(0, 80) || '—'}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => { setEditing(b); setShowForm(false); }} className="p-1.5 text-muted-foreground hover:text-primary rounded-lg hover:bg-primary/10 transition-colors"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => { if (confirm(`Delete "${b.name}"?`)) deleteBarber.mutate(b.id); }} className="p-1.5 text-muted-foreground hover:text-red-400 rounded-lg hover:bg-red-400/10 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
