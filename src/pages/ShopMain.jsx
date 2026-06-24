/* ============================================================
   SHOP MAIN — Fully dynamic from DB
   Categories driven by actual product data
   Admin changes reflect immediately
   ============================================================ */
import React, { useState, useMemo, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import {
  ShoppingBag, Filter, ArrowRight, Flame, Trees,
  Search, SlidersHorizontal, X, Package, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/lib/cartContext';
import { usePledge } from '@/lib/pledgeContext';
import PledgeModal from '@/components/shared/PledgeModal';
import SEO from '@/components/shared/SEO';
import { toast } from 'sonner';

const FG = '#2D5A27';
const SAND = '#D2B48C';

/* ── Category groups — used to map URL slugs to DB categories ── */
const CATEGORY_GROUPS = {
  apparel:  { label: 'Apparel',  cats: ['hoodies','tees','crewnecks','caps','beanies','jackets','accessories'] },
  gear:     { label: 'Gear',     cats: ['water-bottles','patches','journals','stickers','towels','flasks','keychains'] },
  bundles:  { label: 'Bundles',  cats: ['bundles'] },
  camping:  { label: 'Camping',  cats: ['camping'] },
  new:      { label: 'New',      cats: ['new'] },
  sale:     { label: 'Sale',     cats: [] }, // handled via compare_at_price filter
  'limited-edition': { label: 'Limited',  cats: ['limited-edition'] },
};

/* ── Product card ── */
function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart();
  const { pledgeAccepted } = usePledge();
  const [pledgeOpen, setPledgeOpen] = useState(false);
  const [pendingAdd, setPendingAdd] = useState(false);

  const handleAdd = (e) => {
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

  const isSale = product.compare_at_price && parseFloat(product.compare_at_price) > parseFloat(product.price);
  const discount = isSale
    ? Math.round((1 - parseFloat(product.price) / parseFloat(product.compare_at_price)) * 100)
    : 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ delay: Math.min(index * 0.04, 0.3) }}>
        <Link to={`/product/${product.id}`}
          className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 block">
          {/* Image */}
          <div className="relative overflow-hidden bg-secondary" style={{ paddingTop: '100%' }}>
            <div className="absolute inset-0">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag className="w-10 h-10 text-muted-foreground/20" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>

            {/* Badges */}
            <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
              {product.proof_badge_text && (
                <span className="text-[9px] font-heading tracking-wider uppercase px-2 py-0.5 rounded-full text-white"
                  style={{ background: FG }}>
                  {product.proof_badge_text}
                </span>
              )}
              {isSale && (
                <span className="text-[9px] font-heading tracking-wider uppercase px-2 py-0.5 rounded-full bg-red-600 text-white">
                  -{discount}%
                </span>
              )}
              {product.featured && !product.proof_badge_text && (
                <span className="text-[9px] font-heading tracking-wider uppercase px-2 py-0.5 rounded-full bg-yellow-600/80 text-white">
                  Featured
                </span>
              )}
            </div>

            {/* Quick add — hover */}
            <div className="absolute bottom-0 left-0 right-0 p-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
              <button onClick={handleAdd}
                className="w-full py-2 text-xs font-heading tracking-wider uppercase text-white rounded-xl transition-all flex items-center justify-center gap-1.5"
                style={{ background: FG }}>
                <ShoppingBag className="w-3.5 h-3.5" /> Quick Add
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="p-3">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">{product.category}</p>
            <h3 className="font-heading text-sm tracking-wide uppercase leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {product.name}
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="font-heading text-base text-foreground">
                  ${parseFloat(product.price).toFixed(2)}
                </span>
                {isSale && (
                  <span className="text-xs text-muted-foreground line-through">
                    ${parseFloat(product.compare_at_price).toFixed(2)}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-muted-foreground">
                +{Math.floor(parseFloat(product.price) * 5)} pts
              </span>
            </div>
          </div>
        </Link>
      </motion.div>

      <PledgeModal open={pledgeOpen} onOpenChange={setPledgeOpen} onAccept={handlePledgeAccepted} />
    </>
  );
}

/* ── Countdown timer ── */
function DropCountdown() {
  const [secs, setSecs] = useState(() => {
    const now = new Date();
    const daysUntilFriday = (5 - now.getDay() + 7) % 7 || 7;
    const target = new Date(now);
    target.setDate(now.getDate() + daysUntilFriday);
    target.setHours(23, 59, 59, 999);
    return Math.max(0, Math.floor((target - now) / 1000));
  });

  useEffect(() => {
    const t = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const h = String(Math.floor(secs / 3600)).padStart(2, '0');
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');

  return (
    <div className="border-b border-border/50" style={{ background: 'rgba(45,90,39,0.08)' }}>
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm">
          <Flame className="w-4 h-4 text-orange-400 flex-shrink-0" />
          <span className="font-heading tracking-wider uppercase text-xs text-muted-foreground">
            Next Drop Ends:
          </span>
        </div>
        <div className="flex items-center gap-2">
          {[['H', h], ['M', m], ['S', s]].map(([label, val]) => (
            <div key={label} className="text-center">
              <div className="font-heading text-xl text-foreground tabular-nums">{val}</div>
              <div className="text-[9px] text-muted-foreground uppercase font-heading tracking-wider">{label}</div>
            </div>
          ))}
        </div>
        <Button asChild size="sm" className="font-heading tracking-wider uppercase text-xs"
          style={{ background: FG }}>
          <Link to="/shop/limited-edition">
            Shop Limited <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

/* ── Main component ── */
export default function ShopMain() {
  const { category: catParam } = useParams();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Resolve category from URL param
  useEffect(() => {
    if (!catParam || catParam === 'boyz') {
      setActiveCategory('all');
      return;
    }
    setActiveCategory(catParam);
  }, [catParam]);

  /* ── Fetch all active products ── */
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['shop-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .eq('business', 'boyz')
        .order('created_date', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    staleTime: 2 * 60 * 1000,
  });

  /* ── Build dynamic category list from actual DB data ── */
  const categoryList = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category).filter(Boolean))].sort();
    return cats;
  }, [products]);

  /* ── Filter tabs — All + each unique category + Sale ── */
  const filterTabs = useMemo(() => {
    const hasSale = products.some(p => p.compare_at_price && parseFloat(p.compare_at_price) > parseFloat(p.price));
    const tabs = [
      { value: 'all', label: 'All' },
      ...categoryList.map(c => ({ value: c, label: c.replace(/-/g, ' ') })),
      ...(hasSale ? [{ value: 'sale', label: 'Sale 🔥' }] : []),
    ];
    return tabs;
  }, [categoryList, products]);

  /* ── Apply filters ── */
  const filtered = useMemo(() => {
    let list = [...products];

    if (activeCategory !== 'all') {
      if (activeCategory === 'sale') {
        list = list.filter(p => p.compare_at_price && parseFloat(p.compare_at_price) > parseFloat(p.price));
      } else {
        // Check if it's a group key (apparel, gear, etc.)
        const group = CATEGORY_GROUPS[activeCategory];
        if (group && group.cats.length > 0) {
          list = list.filter(p => group.cats.includes(p.category));
        } else {
          // Direct category match
          list = list.filter(p => p.category === activeCategory);
        }
      }
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-asc')  list.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    if (sortBy === 'price-desc') list.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    if (sortBy === 'featured')   list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

    return list;
  }, [products, activeCategory, search, sortBy]);

  const featuredProducts = products.filter(p => p.featured);
  const saleProducts = products.filter(p => p.compare_at_price && parseFloat(p.compare_at_price) > parseFloat(p.price));

  // Active category label
  const activeCategoryLabel = filterTabs.find(t => t.value === activeCategory)?.label || 'All';

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Shop — Survival Pack 01 · Boyz In The Woodz"
        description="Hoodies, tees, caps, gear and more — forged in the woods. Every piece is proof that you showed up."
        canonical="/shop"
      />

      {/* Hero */}
      <section className="relative h-56 md:h-72 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=80"
          alt="The Shop" className="w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 pb-6 md:pb-8">
          <span className="text-[10px] font-heading tracking-[0.35em] uppercase" style={{ color: SAND }}>
            Survival Pack
          </span>
          <h1 className="font-heading text-4xl md:text-6xl tracking-wide uppercase text-foreground mt-1">
            The Shop
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Gear forged in the woods. Worn as proof.</p>
        </div>
      </section>

      {/* Countdown */}
      <DropCountdown />

      {/* Filter bar */}
      <div className="sticky top-16 lg:top-20 z-20 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4">
          {/* Category pills — horizontal scroll on mobile */}
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-none">
            {filterTabs.map(tab => (
              <button key={tab.value}
                onClick={() => setActiveCategory(tab.value)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-heading tracking-wider uppercase border transition-all ${
                  activeCategory === tab.value
                    ? 'text-white border-transparent shadow-sm'
                    : 'border-border text-muted-foreground bg-card hover:border-primary/40 hover:text-foreground'
                }`}
                style={activeCategory === tab.value ? { background: FG } : {}}>
                {tab.label}
              </button>
            ))}
            <div className="flex-shrink-0 w-px h-5 bg-border mx-1" />
            {/* Sort + search triggers */}
            <button onClick={() => setShowFilters(f => !f)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-heading tracking-wider uppercase border border-border text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all">
              <SlidersHorizontal className="w-3 h-3" />
              {sortBy !== 'default' ? 'Sorted' : 'Sort'}
            </button>
          </div>

          {/* Expanded filter panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="py-3 flex flex-wrap items-center gap-3 border-t border-border">
                  <div className="relative flex-1 min-w-48">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input value={search} onChange={e => setSearch(e.target.value)}
                      placeholder="Search products..." className="pl-8 h-8 text-xs bg-secondary border-border" />
                    {search && (
                      <button onClick={() => setSearch('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                    className="text-xs bg-secondary border border-border rounded-lg px-3 py-1.5 text-muted-foreground font-heading tracking-wider uppercase">
                    <option value="default">Default</option>
                    <option value="price-asc">Price: Low → High</option>
                    <option value="price-desc">Price: High → Low</option>
                    <option value="featured">Featured First</option>
                  </select>
                  {(search || sortBy !== 'default') && (
                    <button onClick={() => { setSearch(''); setSortBy('default'); }}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                      <X className="w-3 h-3" /> Clear
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Results count + active filter */}
        <div className="flex items-center justify-between mb-6">
          <div>
            {activeCategory !== 'all' && (
              <h2 className="font-heading text-2xl md:text-3xl tracking-wide uppercase mb-0.5">
                {activeCategoryLabel}
              </h2>
            )}
            <p className="text-xs text-muted-foreground font-heading tracking-wider">
              {isLoading ? 'Loading...' : `${filtered.length} PRODUCT${filtered.length !== 1 ? 'S' : ''}`}
            </p>
          </div>
          {activeCategory !== 'all' && (
            <button onClick={() => setActiveCategory('all')}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
              <X className="w-3 h-3" /> Show all
            </button>
          )}
        </div>

        {/* Loading skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-secondary" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-secondary rounded w-3/4" />
                  <div className="h-4 bg-secondary rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Package className="w-14 h-14 mx-auto mb-4 opacity-20" />
            <p className="font-heading text-xl tracking-wide uppercase mb-2">
              {products.length === 0 ? 'No Products Yet' : 'No Results Found'}
            </p>
            <p className="text-sm mb-5">
              {products.length === 0
                ? 'The admin is adding products. Check back soon.'
                : 'Try a different filter or search term.'}
            </p>
            {products.length > 0 && (
              <Button onClick={() => { setActiveCategory('all'); setSearch(''); }}
                className="font-heading tracking-wider uppercase text-xs" style={{ background: FG }}>
                Show All Products
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}

        {/* Featured section — only on 'all' view */}
        {activeCategory === 'all' && !search && featuredProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[10px] font-heading tracking-[0.3em] uppercase" style={{ color: SAND }}>
                  Hand Picked
                </span>
                <h2 className="font-heading text-3xl tracking-wide uppercase mt-1">Featured</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featuredProducts.slice(0, 4).map((p, i) => (
                <ProductCard key={`feat-${p.id}`} product={p} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Sale section — only on 'all' view */}
        {activeCategory === 'all' && !search && saleProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[10px] font-heading tracking-[0.3em] uppercase" style={{ color: '#ef4444' }}>
                  Limited Time
                </span>
                <h2 className="font-heading text-3xl tracking-wide uppercase mt-1">On Sale</h2>
              </div>
              <button onClick={() => setActiveCategory('sale')}
                className="text-xs font-heading tracking-wider uppercase text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                View All <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {saleProducts.slice(0, 4).map((p, i) => (
                <ProductCard key={`sale-${p.id}`} product={p} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Empty shop CTA — if admin hasn't added products */}
        {!isLoading && products.length === 0 && (
          <div className="mt-12 text-center bg-card border border-border rounded-2xl p-10">
            <Trees className="w-14 h-14 mx-auto mb-4" style={{ color: FG }} />
            <h3 className="font-heading text-2xl tracking-wide uppercase mb-2">
              Shop Coming Soon
            </h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
              The gear is being packed. Sign up to be first when the shop drops.
            </p>
            <Button asChild className="font-heading tracking-wider uppercase" style={{ background: FG }}>
              <Link to="/the-code">Take the Pledge</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
