/* ============================================================
   ADMIN ORDERS — View + update order status, tracking
   ============================================================ */
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { Package, Search, ChevronDown, ChevronUp, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';

const FG = '#2D5A27';

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

const STATUS_COLORS = {
  pending:    'bg-yellow-900/40 text-yellow-400 border-yellow-800/40',
  processing: 'bg-blue-900/40 text-blue-400 border-blue-800/40',
  shipped:    'bg-purple-900/40 text-purple-400 border-purple-800/40',
  delivered:  'bg-green-900/40 text-green-400 border-green-800/40',
  cancelled:  'bg-red-900/40 text-red-400 border-red-800/40',
  refunded:   'bg-secondary text-muted-foreground border-border',
};

function OrderRow({ order, onUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState(order.status);
  const [tracking, setTracking] = useState(order.tracking_number || '');
  const [notes, setNotes] = useState(order.notes || '');
  const dirty = status !== order.status || tracking !== (order.tracking_number || '') || notes !== (order.notes || '');

  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-5 py-4 flex items-center gap-4 cursor-pointer hover:bg-white/2 transition-colors"
        onClick={() => setExpanded(e => !e)}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <p className="font-medium text-sm">{order.order_number || `#${order.id.slice(-8).toUpperCase()}`}</p>
            <span className={`text-[10px] font-heading tracking-wider uppercase px-2 py-0.5 rounded-full border ${STATUS_COLORS[order.status] || STATUS_COLORS.pending}`}>
              {order.status}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
            <span>{items.length} item{items.length !== 1 ? 's' : ''}</span>
            <span className="font-medium text-foreground">${parseFloat(order.total_amount || 0).toFixed(2)}</span>
            {order.created_date && (
              <span>{format(new Date(order.created_date), 'MMM d, yyyy')}</span>
            )}
          </div>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="px-5 pb-5 border-t border-border pt-4 space-y-4">
              {/* Items */}
              <div>
                <p className="text-[10px] font-heading tracking-wider uppercase text-muted-foreground mb-2">Items</p>
                <div className="space-y-1.5">
                  {items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm bg-secondary rounded-lg px-3 py-2">
                      <span>{item.product_name || item.name || 'Product'}{item.size ? ` · ${item.size}` : ''}</span>
                      <span className="text-muted-foreground">×{item.quantity} · ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex justify-end gap-4 text-xs text-muted-foreground">
                  {order.shipping_cost > 0 && <span>Shipping: ${parseFloat(order.shipping_cost).toFixed(2)}</span>}
                  {order.tax > 0 && <span>Tax: ${parseFloat(order.tax).toFixed(2)}</span>}
                  <span className="font-medium text-foreground">Total: ${parseFloat(order.total_amount || 0).toFixed(2)}</span>
                </div>
              </div>

              {/* Shipping address */}
              {order.shipping_address && (
                <div>
                  <p className="text-[10px] font-heading tracking-wider uppercase text-muted-foreground mb-1">Shipping Address</p>
                  <p className="text-sm text-muted-foreground">
                    {[
                      order.shipping_address.name,
                      order.shipping_address.line1,
                      order.shipping_address.line2,
                      order.shipping_address.city,
                      order.shipping_address.state,
                      order.shipping_address.zip,
                    ].filter(Boolean).join(', ')}
                  </p>
                </div>
              )}

              {/* Controls */}
              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Status</label>
                  <select value={status} onChange={e => setStatus(e.target.value)}
                    className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground">
                    {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Tracking Number</label>
                  <Input value={tracking} onChange={e => setTracking(e.target.value)}
                    placeholder="1Z..." className="bg-secondary border-border" />
                </div>
                <div>
                  <label className="text-[10px] font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Notes</label>
                  <Input value={notes} onChange={e => setNotes(e.target.value)}
                    placeholder="Internal note..." className="bg-secondary border-border" />
                </div>
              </div>

              {dirty && (
                <Button onClick={() => onUpdate(order.id, { status, tracking_number: tracking, notes })}
                  className="font-heading tracking-wider uppercase text-xs gap-2" style={{ background: FG }}>
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminOrders() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const qc = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders', statusFilter],
    queryFn: async () => {
      let q = supabase.from('orders').select('*').order('created_date', { ascending: false });
      if (statusFilter !== 'all') q = q.eq('status', statusFilter);
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },
  });

  const updateOrder = useMutation({
    mutationFn: async ({ id, updates }) => {
      const { error } = await supabase.from('orders').update({
        ...updates,
        updated_date: new Date().toISOString(),
      }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Order updated');
    },
    onError: (e) => toast.error(e.message),
  });

  const filtered = orders.filter(o => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      o.order_number?.toLowerCase().includes(q) ||
      o.id.includes(q)
    );
  });

  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-heading text-3xl tracking-wide uppercase text-foreground flex items-center gap-2">
            <Package className="w-7 h-7 text-primary" /> Orders
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{orders.length} total orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search order number..." className="pl-9 bg-secondary border-border" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', ...ORDER_STATUSES].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-heading tracking-wider uppercase border transition-all ${
                statusFilter === s ? 'text-white border-transparent' : 'border-border text-muted-foreground hover:border-primary/40'
              }`}
              style={statusFilter === s ? { background: FG } : {}}>
              {s === 'all' ? `All (${orders.length})` : `${s} (${statusCounts[s] || 0})`}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Package className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="font-heading tracking-wider uppercase text-sm">No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => (
            <OrderRow key={order.id} order={order}
              onUpdate={(id, updates) => updateOrder.mutate({ id, updates })} />
          ))}
        </div>
      )}
    </div>
  );
}
