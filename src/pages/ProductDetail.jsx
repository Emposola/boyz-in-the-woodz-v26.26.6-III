/* ============================================================
   PRODUCT DETAIL — Full product page with image, sizes, add-to-cart
   Features: size guide, Leave Better Guarantee, pledge checkbox
   ============================================================ */
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/supabaseClient';
import { useCart } from '@/lib/cartContext';
import { usePledge } from '@/lib/pledgeContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingBag, Award, Shield, Minus, Plus, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import PledgeModal from '../components/shared/PledgeModal';
import SEO from '@/components/shared/SEO';

export default function ProductDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = window.location.pathname.split('/product/')[1];

  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [pledgeOpen, setPledgeOpen] = useState(false);
  const { addItem } = useCart();
  const { pledgeAccepted } = usePledge();

  /* --- Fetch the product --- */
  const { data: products, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => api.entities.Product.filter({ id: productId }),
    enabled: !!productId,
  });

  const product = products?.[0];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-12">
        <Skeleton className="aspect-square rounded-lg" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="font-heading text-3xl">Product Not Found</h2>
        <Link to="/" className="text-primary text-sm mt-4 inline-block">Back to Home</Link>
      </div>
    );
  }

  /* --- Add to cart handler --- */
  const handleAddToCart = () => {
    if (!pledgeAccepted) {
      setPledgeOpen(true);
      return;
    }
    if (product.sizes?.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    addItem(product, selectedSize, quantity);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <SEO title="Product — BOYZ IN THE WOODZ Shop" description="Gear forged in the woods. Worn as proof." canonical="/shop/product" />
      {/* Back Button */}
      <Link
        to={`/shop/${product.business}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Back to {product.business === 'boyz' ? 'Survival Pack' : 'Barber Merch'}
      </Link>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        {/* --- Image --- */}
        <div className="relative aspect-square rounded-lg overflow-hidden bg-secondary">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <ShoppingBag className="w-16 h-16 opacity-20" />
            </div>
          )}
          {product.proof_badge_text && (
            <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground gap-1">
              <Award className="w-3.5 h-3.5" />
              {product.proof_badge_text}
            </Badge>
          )}
        </div>

        {/* --- Details --- */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">
              {product.business === 'boyz' ? 'The Woodz' : 'The Chair'}
            </span>
            <h1 className="font-heading text-3xl md:text-4xl tracking-wide uppercase mt-1">{product.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-2xl font-semibold">${product.price?.toFixed(2)}</span>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <span className="text-lg text-muted-foreground line-through">${product.compare_at_price?.toFixed(2)}</span>
              )}
            </div>
          </div>

          {product.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
          )}

          {/* Size Selector */}
          {product.sizes?.length > 0 && (
            <div>
              <h4 className="text-xs font-heading tracking-wider uppercase mb-2">Size</h4>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 text-sm rounded border transition-colors ${selectedSize === size ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-foreground'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <h4 className="text-xs font-heading tracking-wider uppercase mb-2">Quantity</h4>
            <div className="flex items-center gap-3">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 border border-border rounded hover:border-foreground transition-colors">
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-lg font-medium w-8 text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-2 border border-border rounded hover:border-foreground transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <Button onClick={handleAddToCart} className="w-full font-heading tracking-wider uppercase text-base py-6">
            <ShoppingBag className="w-5 h-5 mr-2" />
            Add to Cart — ${(product.price * quantity).toFixed(2)}
          </Button>

          {/* Leave Better Guarantee */}
          <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-lg border border-border">
            <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold">Leave Better Guarantee</h4>
              <p className="text-xs text-muted-foreground mt-1">
                If this product doesn't make you feel like a better man, return it within 30 days. No questions.
              </p>
            </div>
          </div>

          {/* Points Earned */}
          <p className="text-xs text-muted-foreground">
            Earn <span className="text-primary font-semibold">{Math.floor(product.price * quantity * 10)} Brotherhood Points</span> with this purchase.
          </p>
        </div>
      </div>

      {/* Pledge Modal */}
      <PledgeModal open={pledgeOpen} onOpenChange={setPledgeOpen} />
    </div>
  );
}