/* ============================================================
   PRODUCT CARD — Reusable card for both Boyz & Barber products
   Fixed: pledge modal integration, quick-add works properly
   ============================================================ */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/lib/cartContext';
import { usePledge } from '@/lib/pledgeContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import PledgeModal from './PledgeModal';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { pledgeAccepted } = usePledge();
  const [pledgeOpen, setPledgeOpen] = useState(false);
  const [pendingAdd, setPendingAdd] = useState(false);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!pledgeAccepted) {
      setPendingAdd(true);
      setPledgeOpen(true);
      return;
    }
    addItem(product, null, 1);
    toast.success(`${product.name} added to cart`);
  };

  const handlePledgeAccepted = () => {
    setPledgeOpen(false);
    if (pendingAdd) {
      addItem(product, null, 1);
      toast.success(`${product.name} added to cart`);
      setPendingAdd(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <Link to={`/product/${product.id}`} className="group block">
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-secondary mb-3">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <ShoppingBag className="w-12 h-12 opacity-30" />
              </div>
            )}
            {product.proof_badge_text && (
              <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] gap-1">
                <Award className="w-3 h-3" />{product.proof_badge_text}
              </Badge>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <Button onClick={handleQuickAdd} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-heading tracking-wider text-xs" size="sm">
                <ShoppingBag className="w-3.5 h-3.5 mr-1.5" /> Quick Add
              </Button>
            </div>
            <span className={`absolute top-3 right-3 text-[10px] font-heading tracking-wider uppercase px-2 py-0.5 rounded ${product.business === 'boyz' ? 'bg-green-900/80 text-green-300' : 'bg-amber-900/80 text-amber-300'}`}>
              {product.business === 'boyz' ? 'Woodz' : 'Barber'}
            </span>
          </div>
          <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">{product.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-semibold">${product.price?.toFixed(2)}</span>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <span className="text-xs text-muted-foreground line-through">${product.compare_at_price?.toFixed(2)}</span>
            )}
          </div>
        </Link>
      </motion.div>

      <PledgeModal open={pledgeOpen} onOpenChange={setPledgeOpen} onAccept={handlePledgeAccepted} />
    </>
  );
}