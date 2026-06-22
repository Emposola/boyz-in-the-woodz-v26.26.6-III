/* ============================================================
   ADMIN PRODUCTS — Full CRUD for the shop
   ============================================================ */
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Plus, Pencil, Trash2, Save, X, Search, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const FG = '#2D5A27';

const CATEGORIES = [
  'hoodies','tees','crewnecks','caps','beanies','jackets','accessories',
  'water-bottles','patches','journals','stickers','towels','flasks','keychains',
  'bundles','sale','limited-edition','gift-cards','new',
];

const EMPTY_PRODUCT = {
  name: '', business: 'boyz', category: 'tees', price: '',
  compare_at_price: '', description: '', image_url: '',
  inventory: 0, proof_badge_text: '', featured: false, active: true,
  sizes: [],
};

function ProductForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial || EMPTY_PRODUCT);
  const [sizeInput, setSizeInput] = useState('');

  // sync if initial changes (edit mode)
  useEffect(() => { if (initial) setForm(initial); }, [initial?.id]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addSize = () => {
    const s = sizeInput.trim().toUpperCase();
    if (s && !form.sizes?.includes(s)) {
      set('sizes', [...(form.sizes || []), s]);
      setSizeInput('');
    }
  };

  const removeSize = (s) => set('sizes', form.sizes.filter(x => x !== s));

  const handleSubmit = () => {
    if (!form.name) { toast.error('Product name is required'); return; }
    if (!form.price || isNaN(parseFloat(form.price))) { toast.error('Valid price is required'); return; }
    onSave({
      ...form,
      price: parseFloat(form.price),
      compare_at_price: form.compare_at_price ? parseFloat(form.compare_at_price) : null,
      inventory: parseInt(form.inventory) || 0,
    });
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <h3 className="font-heading text-base tracking-wider uppercase text-foreground">
        {initial?.id ? 'Edit Product' : 'New Product'}
      </h3>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Product Name *</label>
          <Input value={form.name} onChange={e => set('name', e.target.value)}
            placeholder="Brotherhood Hoodie" className="bg-secondary border-border" />
        </div>

        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Brand *</label>
          <select value={form.business} onChange={e => set('business', e.target.value)}
            className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground">
            <option value="boyz">Boyz In The Woodz</option>
            <option value="barber">The Chair (Barber)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Category *</label>
          <select value={form.category} onChange={e => set('category', e.target.value)}
            className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Price ($) *</label>
          <Input type="number" step="0.01" min="0" value={form.price}
            onChange={e => set('price', e.target.value)}
            placeholder="49.99" className="bg-secondary border-border" />
        </div>

        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Compare At Price ($)</label>
          <Input type="number" step="0.01" min="0" value={form.compare_at_price || ''}
            onChange={e => set('compare_at_price', e.target.value)}
            placeholder="79.99 (original price)" className="bg-secondary border-border" />
        </div>

        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Inventory</label>
          <Input type="number" min="0" value={form.inventory}
            onChange={e => set('inventory', e.target.value)}
            className="bg-secondary border-border" />
        </div>

        <div>
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Proof Badge Text</label>
          <Input value={form.proof_badge_text || ''} onChange={e => set('proof_badge_text', e.target.value)}
            placeholder="e.g. Bestseller" className="bg-secondary border-border" />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Image URL</label>
          <Input value={form.image_url || ''} onChange={e => set('image_url', e.target.value)}
            placeholder="https://..." className="bg-secondary border-border" />
          {form.image_url && (
            <img src={form.image_url} alt="preview"
              className="mt-2 h-20 w-20 rounded-lg object-cover border border-border" />
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Description</label>
          <textarea value={form.description || ''} onChange={e => set('description', e.target.value)}
            rows={3} placeholder="Product description..."
            className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-ring" />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Sizes</label>
          <div className="flex gap-2 mb-2">
            <Input value={sizeInput} onChange={e => setSizeInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addSize()}
              placeholder="XS, S, M, L, XL, XXL..." className="bg-secondary border-border" />
            <Button type="button" onClick={addSize} variant="outline" size="sm">Add</Button>
          </div>
          {form.sizes?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {form.sizes.map(s => (
                <span key={s} className="flex items-center gap-1 bg-secondary text-xs px-2 py-1 rounded-full border border-border">
                  {s}
                  <button onClick={() => removeSize(s)} className="text-muted-foreground hover:text-red-400 ml-0.5">×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="accent-primary" />
            Featured
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} className="accent-primary" />
            Active (visible in shop)
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-3 border-t border-border">
        <Button onClick={handleSubmit} disabled={saving}
          className="font-heading tracking-wider uppercase gap-2 flex-1" style={{ background: FG }}>
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Product'}
        </Button>
        <Button onClick={onCancel} variant="outline" className="font-heading tracking-wider uppercase">
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default function AdminProducts() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [businessFilter, setBusinessFilter] = useState('all');
  const [showForm, setShowForm] = useState(searchParams.get('new') === '1');
  const [editingProduct, setEditingProduct] = useState(null);
  const qc = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_date', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const saveProduct = useMutation({
    mutationFn: async (form) => {
      if (form.id) {
        const { id, created_date, ...rest } = form;
        const { error } = await supabase.from('products').update(rest).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert(form);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] });
      qc.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
      toast.success('Product saved');
      setShowForm(false);
      setEditingProduct(null);
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteProduct = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product deleted');
    },
    onError: (e) => toast.error(e.message),
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, active }) => {
      const { error } = await supabase.from('products').update({ active }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-products'] }),
    onError: (e) => toast.error(e.message),
  });

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
    const matchBiz = businessFilter === 'all' || p.business === businessFilter;
    return matchSearch && matchCat && matchBiz;
  });

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-heading text-3xl tracking-wide uppercase text-foreground flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-primary" /> Products
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{products.length} total products</p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditingProduct(null); }}
          className="font-heading tracking-wider uppercase text-xs gap-2" style={{ background: FG }}>
          <Plus className="w-4 h-4" /> Add Product
        </Button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {(showForm || editingProduct) && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} className="mb-6">
            <ProductForm
              initial={editingProduct}
              onSave={(form) => saveProduct.mutate(form)}
              onCancel={() => { setShowForm(false); setEditingProduct(null); }}
              saving={saveProduct.isPending}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products..." className="pl-9 bg-secondary border-border" />
        </div>
        <select value={businessFilter} onChange={e => setBusinessFilter(e.target.value)}
          className="rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground">
          <option value="all">All Brands</option>
          <option value="boyz">Boyz In The Woodz</option>
          <option value="barber">The Chair</option>
        </select>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
          className="rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground">
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Products table */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Package className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="font-heading tracking-wider uppercase text-sm">No products found</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-xs font-heading tracking-wider uppercase text-muted-foreground">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-heading tracking-wider uppercase text-muted-foreground hidden sm:table-cell">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-heading tracking-wider uppercase text-muted-foreground">Price</th>
                  <th className="text-left px-4 py-3 text-xs font-heading tracking-wider uppercase text-muted-foreground hidden md:table-cell">Inventory</th>
                  <th className="text-left px-4 py-3 text-xs font-heading tracking-wider uppercase text-muted-foreground">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.image_url ? (
                          <img src={p.image_url} alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-border" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                            <ShoppingBag className="w-4 h-4 text-muted-foreground/40" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium truncate max-w-[200px]">{p.name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase">
                            {p.business === 'boyz' ? 'Woodz' : 'Barber'}
                            {p.featured && ' · Featured'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{p.category}</td>
                    <td className="px-4 py-3">
                      <span className="font-medium">${parseFloat(p.price).toFixed(2)}</span>
                      {p.compare_at_price && (
                        <span className="text-xs text-muted-foreground line-through ml-1.5">
                          ${parseFloat(p.compare_at_price).toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={p.inventory <= 0 ? 'text-red-400' : p.inventory <= 5 ? 'text-yellow-400' : 'text-foreground'}>
                        {p.inventory}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleActive.mutate({ id: p.id, active: !p.active })}
                        className={`text-[10px] font-heading tracking-wider uppercase px-2 py-0.5 rounded-full border cursor-pointer transition-colors ${
                          p.active ? 'bg-green-900/40 text-green-400 border-green-800/40 hover:bg-red-900/40 hover:text-red-400 hover:border-red-800/40'
                                   : 'bg-secondary text-muted-foreground border-border hover:bg-green-900/40 hover:text-green-400 hover:border-green-800/40'
                        }`}>
                        {p.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => { setEditingProduct(p); setShowForm(false); }}
                          className="p-1.5 text-muted-foreground hover:text-primary rounded-lg hover:bg-primary/10 transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => {
                          if (confirm(`Delete "${p.name}"? This cannot be undone.`)) deleteProduct.mutate(p.id);
                        }} className="p-1.5 text-muted-foreground hover:text-red-400 rounded-lg hover:bg-red-400/10 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
