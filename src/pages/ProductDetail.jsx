/* ============================================================
   PRODUCT DETAIL — Full product page
   Proper supabase query, full SEO (OG + JSON-LD Product),
   size selector, quantity, related products
   ============================================================ */
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/lib/cartContext';
import { usePledge } from '@/lib/pledgeContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  ShoppingBag, Shield, Minus, Plus, ArrowLeft,
  Check, Tag, Star, Package, Pencil
} from 'lucide-react';
import { toast } from 'sonner';
import PledgeModal from '@/components/shared/PledgeModal';
import { useAuth } from '@/lib/AuthContext';

const FG = '#2D5A27';
const SAND = '#D2B48C';
const SITE_URL = 'https://boyzinthewoodz.com';
const SITE_NAME = 'Boyz In The Woodz';

/* ── SEO per product ── */
function ProductSEO({ product }) {
  useEffect(() => {
    if (!product) return;
    const title = `${product.name} — ${SITE_NAME}`;
    const description = product.description || `${product.name} — Gear forged in the woods. Worn as proof.`;
    const url = `${SITE_URL}/product/${product.id}`;
    const image = product.image_url || `${SITE_URL}/images/logos/logo-welcome.png`;

    document.title = title;

    const setMeta = (name, content, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute('content', content);
    };

    setMeta('description', description);
    setMeta('og:type', 'product', true);
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:url', url, true);
    setMeta('og:image', image, true);
    setMeta('og:site_name', SITE_NAME, true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', image);

    // JSON-LD Product schema
    const existing = document.getElementById('json-ld-product');
    if (existing) existing.remove();
    const script = document.createElement('script');
    script.id = 'json-ld-product';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description,
      image: [image],
      brand: { '@type': 'Brand', name: SITE_NAME },
      offers: {
        '@type': 'Offer',
        url,
        priceCurrency: 'USD',
        price: parseFloat(product.price).toFixed(2),
        availability: product.inventory > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        seller: { '@type': 'Organization', name: SITE_NAME },
      },
      ...(product.proof_badge_text && { award: product.proof_badge_text }),
    });
    document.head.appendChild(script);

    return () => { document.getElementById('json-ld-product')?.remove(); };
  }, [product]);
  return null;
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { pledgeAccepted } = usePledge();
  const { user } = useAuth();
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [pledgeOpen, setPledgeOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  /* ── Fetch product ── */
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('active', true)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
    retry: false,
  });

  /* ── Related products — same category ── */
  const { data: related = [] } = useQuery({
    queryKey: ['product-related', product?.category, product?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('products')
        .select('id, name, price, compare_at_price, image_url, category, proof_badge_text')
        .eq('active', true)
        .eq('category', product.category)
        .neq('id', product.id)
        .limit(4);
      return data || [];
    },
    enabled: !!product?.category && !!product?.id,
  });

  // Auto-select first size
  useEffect(() => {
    if (product?.sizes?.length > 0 && !selectedSize) {
      setSelectedSize(null); // don't auto-select — let user choose
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!pledgeAccepted) { setPledgeOpen(true); return; }
    if (product.sizes?.length > 0 && !selectedSize) {
      toast.error('Please select a size first');
      return;
    }
    addItem(product, selectedSize, quantity);
    setAddedToCart(true);
    toast.success(`${product.name} added to cart`);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handlePledgeAccepted = () => {
    setPledgeOpen(false);
    if (product.sizes?.length > 0 && !selectedSize) {
      toast.error('Please select a size first');
      return;
    }
    addItem(product, selectedSize, quantity);
    setAddedToCart(true);
    toast.success(`${product.name} added to cart`);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="aspect-square rounded-2xl bg-secondary animate-pulse" />
          <div className="space-y-5 pt-4">
            <div className="h-4 bg-secondary rounded w-1/4 animate-pulse" />
            <div className="h-8 bg-secondary rounded w-3/4 animate-pulse" />
            <div className="h-6 bg-secondary rounded w-1/3 animate-pulse" />
            <div className="h-20 bg-secondary rounded animate-pulse" />
            <div className="h-12 bg-secondary rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground/20" />
        <h2 className="font-heading text-3xl tracking-wide uppercase mb-3">Product Not Found</h2>
        <p className="text-muted-foreground text-sm mb-6">This product may have been removed.</p>
        <Button onClick={() => navigate('/shop')} className="font-heading tracking-wider uppercase" style={{ background: FG }}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
        </Button>
      </div>
    );
  }

  const isSale = product.compare_at_price && parseFloat(product.compare_at_price) > parseFloat(product.price);
  const discount = isSale ? Math.round((1 - parseFloat(product.price) / parseFloat(product.compare_at_price)) * 100) : 0;
  const pointsEarned = Math.floor(parseFloat(product.price) * quantity * 10);

  return (
    <>
      <ProductSEO product={product} />

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 pb-24 lg:pb-12">
        {/* Back */}
        <Link to="/shop"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Shop
        </Link>

        <div className="grid md:grid-cols-2 gap-8 md:gap-14">

          {/* ── Image ── */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary border border-border">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name}
                  className="w-full h-full object-cover" loading="eager" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag className="w-20 h-20 text-muted-foreground/10" />
                </div>
              )}
              {product.proof_badge_text && (
                <div className="absolute top-4 left-4">
                  <span className="text-xs font-heading tracking-wider uppercase px-3 py-1 rounded-full text-white"
                    style={{ background: FG }}>
                    {product.proof_badge_text}
                  </span>
                </div>
              )}
              {isSale && (
                <div className="absolute top-4 right-4">
                  <span className="text-xs font-heading tracking-wider uppercase px-3 py-1 rounded-full bg-red-600 text-white">
                    -{discount}% OFF
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* ── Details ── */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }} className="space-y-6">

            {/* Brand + category */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-heading tracking-[0.3em] uppercase"
                  style={{ color: FG }}>
                  {product.business === 'boyz' ? 'The Woodz' : 'The Chair'}
                </span>
                <span className="text-muted-foreground/40">·</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  {product.category}
                </span>
              </div>
              <h1 className="font-heading text-3xl md:text-4xl tracking-wide uppercase leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-heading text-3xl text-foreground">
                ${parseFloat(product.price).toFixed(2)}
              </span>
              {isSale && (
                <span className="text-xl text-muted-foreground line-through">
                  ${parseFloat(product.compare_at_price).toFixed(2)}
                </span>
              )}
              {isSale && (
                <span className="text-sm text-red-400 font-heading">Save ${(parseFloat(product.compare_at_price) - parseFloat(product.price)).toFixed(2)}</span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Size selector */}
            {product.sizes?.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-heading tracking-wider uppercase">Size</h4>
                  {selectedSize && (
                    <span className="text-xs text-muted-foreground">Selected: <strong className="text-foreground">{selectedSize}</strong></span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button key={size} onClick={() => setSelectedSize(size)}
                      className={`min-w-[48px] px-3 py-2 text-sm rounded-lg border transition-all font-heading tracking-wider uppercase ${
                        selectedSize === size
                          ? 'border-primary bg-primary/10 text-primary shadow-sm'
                          : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                      }`}>
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
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 border border-border rounded-lg flex items-center justify-center hover:border-foreground transition-colors">
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-base font-medium w-8 text-center tabular-nums">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 border border-border rounded-lg flex items-center justify-center hover:border-foreground transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Inventory warning */}
            {product.inventory > 0 && product.inventory <= 5 && (
              <p className="text-xs text-red-400 font-heading tracking-wider uppercase">
                Only {product.inventory} left in stock
              </p>
            )}
            {product.inventory === 0 && (
              <p className="text-xs text-muted-foreground font-heading tracking-wider uppercase">
                Out of Stock
              </p>
            )}

            {/* Add to cart */}
            <Button
              onClick={handleAddToCart}
              disabled={product.inventory === 0}
              className="w-full font-heading tracking-wider uppercase text-base py-6 gap-2 transition-all"
              style={{ background: addedToCart ? '#16a34a' : FG }}>
              {addedToCart ? (
                <><Check className="w-5 h-5" /> Added to Cart!</>
              ) : (
                <><ShoppingBag className="w-5 h-5" />
                  {product.inventory === 0 ? 'Out of Stock' : `Add to Cart — $${(parseFloat(product.price) * quantity).toFixed(2)}`}
                </>
              )}
            </Button>

            {/* Points + Guarantee */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Tag className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span>Earn <strong className="text-primary">{pointsEarned.toLocaleString()} Brotherhood Points</strong> with this purchase</span>
              </div>

              <div className="flex items-start gap-3 p-4 bg-secondary/40 rounded-xl border border-border">
                <Shield className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-foreground">Leave Better Guarantee</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    If this doesn't make you feel like a better man, return it within 30 days. No questions.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[10px] font-heading tracking-[0.3em] uppercase" style={{ color: SAND }}>
                  More Like This
                </span>
                <h2 className="font-heading text-2xl tracking-wide uppercase mt-0.5">
                  You Might Also Like
                </h2>
              </div>
              <Link to="/shop" className="text-xs font-heading tracking-wider uppercase text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                View All <ArrowLeft className="w-3 h-3 rotate-180" />
              </Link>
            </div>
            {/* Horizontal scroll on mobile, grid on md+ */}
            <div className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-4 md:overflow-visible">
              {related.map((p, i) => (
                <Link key={p.id} to={`/product/${p.id}`}
                  className="group flex-shrink-0 w-44 md:w-auto bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-all hover:-translate-y-0.5">
                  <div className="aspect-square overflow-hidden bg-secondary">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-muted-foreground/20" />
                      </div>
                    )}
                  </div>
                  <div className="p-2.5">
                    <p className="font-heading text-xs tracking-wide uppercase leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                      {p.name}
                    </p>
                    <p className="font-heading text-sm mt-1 text-foreground">
                      ${parseFloat(p.price).toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <PledgeModal open={pledgeOpen} onOpenChange={setPledgeOpen} onAccept={handlePledgeAccepted} />

      {/* Floating admin edit button */}
      {user?.is_admin && product && (
        <div className="fixed bottom-24 lg:bottom-8 right-4 lg:right-8 z-50">
          <Link
            to={`/admin/products?edit=${product.id}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full shadow-2xl text-sm font-heading tracking-wider uppercase text-white transition-all hover:scale-105 active:scale-95"
            style={{ background: FG, boxShadow: `0 4px 24px ${FG}60` }}>
            <Pencil className="w-4 h-4" />
            <span className="hidden sm:inline">Edit Product</span>
          </Link>
        </div>
      )}
    </>
  );
}
