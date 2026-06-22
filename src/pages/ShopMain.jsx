/* ============================================================
   SHOP MAIN — 50+ products, filters, bundles, size guide
   URL: /shop  (and /shop/:category)
   ============================================================ */
import React, { useState, useMemo, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Filter, Star, Heart, X, ChevronDown, ArrowRight, Flame, Tag, Check, Trees } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cartContext';
import { toast } from 'sonner';
import SEO from '@/components/shared/SEO';

const FG = '#2D5A27';
const SAND = '#D2B48C';

const ALL_PRODUCTS = [
  // Hoodies
  { id: 'h1', name: 'Signature Hoodie', color: 'Forest Green', price: 68, category: 'hoodies', tag: 'Bestseller', img: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=500&q=75', sizes: ['S','M','L','XL'], points: 340 },
  { id: 'h2', name: 'Signature Hoodie', color: 'Charcoal', price: 68, category: 'hoodies', img: 'https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=500&q=75', sizes: ['S','M','L','XL'], points: 340 },
  { id: 'h3', name: 'Signature Hoodie', color: 'Sand', price: 68, category: 'hoodies', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=75', sizes: ['S','M','L','XL'], points: 340 },
  { id: 'h4', name: 'Pullover Hoodie', color: 'Brown', price: 72, category: 'hoodies', tag: 'Limited Edition', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=75', sizes: ['S','M','L','XL'], points: 360 },
  { id: 'h5', name: 'Zip-Up Hoodie', color: 'Forest Green', price: 75, category: 'hoodies', img: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&q=75', sizes: ['S','M','L','XL'], points: 375 },
  { id: 'h6', name: 'Lightweight Hoodie', color: 'Natural', price: 55, category: 'hoodies', tag: 'New', img: 'https://images.unsplash.com/photo-1513789181297-6f2ec112c0bc?w=500&q=75', sizes: ['S','M','L','XL'], points: 275 },
  // Tees
  { id: 't1', name: 'Logo Tee', color: 'Forest Green', price: 32, category: 'tees', tag: 'Bestseller', img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&q=75', sizes: ['S','M','L','XL'], points: 160 },
  { id: 't2', name: 'Logo Tee', color: 'Charcoal', price: 32, category: 'tees', img: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500&q=75', sizes: ['S','M','L','XL'], points: 160 },
  { id: 't3', name: 'Logo Tee', color: 'Sand', price: 32, category: 'tees', img: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=500&q=75', sizes: ['S','M','L','XL'], points: 160 },
  { id: 't4', name: '"Reset" Tee', color: 'Forest Green', price: 34, category: 'tees', img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&q=75', sizes: ['S','M','L','XL'], points: 170 },
  { id: 't5', name: '"Brotherhood" Tee', color: 'Charcoal', price: 34, category: 'tees', img: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4f8d?w=500&q=75', sizes: ['S','M','L','XL'], points: 170 },
  { id: 't6', name: '"Wild" Tee', color: 'Sand', price: 34, category: 'tees', img: 'https://images.unsplash.com/photo-1601333144130-8cbb312386b6?w=500&q=75', sizes: ['S','M','L','XL'], points: 170 },
  { id: 't7', name: 'Vintage Wash Tee', color: 'Brown', price: 36, category: 'tees', tag: 'Limited Edition', img: 'https://images.unsplash.com/photo-1581791538161-8a0b1b2e2e7c?w=500&q=75', sizes: ['S','M','L','XL'], points: 180 },
  { id: 't8', name: 'Long Sleeve Tee', color: 'Forest Green', price: 42, category: 'tees', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=75', sizes: ['S','M','L','XL'], points: 210 },
  // Crewnecks
  { id: 'c1', name: 'Classic Crewneck', color: 'Forest Green', price: 58, category: 'crewnecks', img: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=75', sizes: ['S','M','L','XL'], points: 290 },
  { id: 'c2', name: 'Classic Crewneck', color: 'Charcoal', price: 58, category: 'crewnecks', img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=75', sizes: ['S','M','L','XL'], points: 290 },
  { id: 'c3', name: 'Heavyweight Crewneck', color: 'Brown', price: 65, category: 'crewnecks', tag: 'Bestseller', img: 'https://images.unsplash.com/photo-1503341338985-95048f33ab37?w=500&q=75', sizes: ['S','M','L','XL'], points: 325 },
  { id: 'c4', name: 'Quarter Zip Crewneck', color: 'Sand', price: 65, category: 'crewnecks', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&q=75', sizes: ['S','M','L','XL'], points: 325 },
  // Caps
  { id: 'ca1', name: 'Structured Cap', color: 'Forest Green/Brown', price: 28, category: 'caps', tag: 'Bestseller', img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&q=75', sizes: ['One Size'], points: 140 },
  { id: 'ca2', name: 'Dad Hat', color: 'Washed Charcoal', price: 25, category: 'caps', img: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500&q=75', sizes: ['One Size'], points: 125 },
  { id: 'ca3', name: 'Snapback', color: 'Forest Green', price: 28, category: 'caps', img: 'https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=500&q=75', sizes: ['One Size'], points: 140 },
  { id: 'ca4', name: 'Mesh Back Cap', color: 'Sand', price: 25, category: 'caps', img: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500&q=75', sizes: ['One Size'], points: 125 },
  // Beanies
  { id: 'b1', name: 'Knit Beanie', color: 'Forest Green', price: 28, category: 'beanies', img: 'https://images.unsplash.com/photo-1510431198580-7727c9fa6e0a?w=500&q=75', sizes: ['One Size'], points: 140 },
  { id: 'b2', name: 'Cuffed Beanie', color: 'Charcoal', price: 25, category: 'beanies', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=75', sizes: ['One Size'], points: 125 },
  // Jackets
  { id: 'j1', name: 'Lightweight Jacket', color: 'Brown', price: 95, category: 'jackets', tag: 'Limited Edition', img: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&q=75', sizes: ['S','M','L','XL'], points: 475 },
  { id: 'j2', name: 'Vest', color: 'Forest Green', price: 75, category: 'jackets', img: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4f8d?w=500&q=75', sizes: ['S','M','L','XL'], points: 375 },
  // Water Bottles
  { id: 'wb1', name: 'Insulated Bottle (22oz)', color: 'Forest Green', price: 35, category: 'water-bottles', tag: 'Bestseller', img: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=75', sizes: ['22oz'], points: 175 },
  { id: 'wb2', name: 'Stainless Bottle (32oz)', color: 'Charcoal', price: 40, category: 'water-bottles', img: 'https://images.unsplash.com/photo-1545839875-8bdf26c43f20?w=500&q=75', sizes: ['32oz'], points: 200 },
  // Patches
  { id: 'p1', name: 'Embroidered Patch – Circle Logo', color: 'Forest Green', price: 12, category: 'patches', img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=500&q=75', sizes: ['OS'], points: 60 },
  { id: 'p2', name: 'Embroidered Patch – Boyz Script', color: 'Brown', price: 12, category: 'patches', img: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&q=75', sizes: ['OS'], points: 60 },
  // Journals
  { id: 'jn1', name: 'Leather Journal – The Reset Log', color: 'Brown', price: 24, category: 'journals', tag: 'Bestseller', img: 'https://images.unsplash.com/photo-1541960071727-c531398e7494?w=500&q=75', sizes: ['OS'], points: 120 },
  // Stickers
  { id: 'st1', name: 'Sticker Pack (5 stickers)', color: 'Multi', price: 10, category: 'stickers', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=75', sizes: ['OS'], points: 50 },
  { id: 'st2', name: 'Single Sticker – Logo', color: 'Forest Green', price: 3, category: 'stickers', img: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=500&q=75', sizes: ['OS'], points: 15 },
  { id: 'st3', name: 'Single Sticker – Reset', color: 'Sand', price: 3, category: 'stickers', img: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=500&q=75', sizes: ['OS'], points: 15 },
  // Towels, Flasks, Keychains
  { id: 'tw1', name: 'Microfiber Towel', color: 'Forest Green', price: 18, category: 'towels', img: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=500&q=75', sizes: ['OS'], points: 90 },
  { id: 'fl1', name: 'Stainless Flask 8oz – Engraved', color: 'Charcoal', price: 22, category: 'flasks', img: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&q=75', sizes: ['8oz'], points: 110 },
  { id: 'kc1', name: 'Wooden Keychain – Laser Engraved', color: 'Brown', price: 12, category: 'keychains', img: 'https://images.unsplash.com/photo-1558637845-e8ac5d677915?w=500&q=75', sizes: ['OS'], points: 60 },
  { id: 'kc2', name: 'Metal Keychain – Logo', color: 'Silver', price: 10, category: 'keychains', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=75', sizes: ['OS'], points: 50 },
  { id: 'tc1', name: 'Canvas Tote Bag', color: 'Natural', price: 20, category: 'accessories', tag: 'Bestseller', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=75', sizes: ['OS'], points: 100 },
  // Camping Gear
  { id: 'cg1', name: 'Camp Mug – Enamel', color: 'Forest Green', price: 15, category: 'camping', img: 'https://images.unsplash.com/photo-1572119865084-43c285814d63?w=500&q=75', sizes: ['OS'], points: 75 },
  { id: 'cg2', name: 'Spork – Titanium', color: 'Silver', price: 12, category: 'camping', img: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&q=75', sizes: ['OS'], points: 60 },
  { id: 'cg3', name: 'Pocket Camp Stove', color: 'Silver', price: 45, category: 'camping', img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500&q=75', sizes: ['OS'], points: 225 },
  { id: 'cg4', name: 'Rechargeable Headlamp', color: 'Black', price: 35, category: 'camping', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=75', sizes: ['OS'], points: 175 },
  { id: 'cg5', name: 'Compact First Aid Kit', color: 'Red', price: 25, category: 'camping', img: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500&q=75', sizes: ['OS'], points: 125 },
  { id: 'cg6', name: 'Brass Compass', color: 'Brass', price: 20, category: 'camping', img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500&q=75', sizes: ['OS'], points: 100 },
  { id: 'cg7', name: 'Paracord Bracelet', color: 'Forest Green', price: 10, category: 'camping', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=75', sizes: ['OS'], points: 50 },
  { id: 'cg8', name: 'Carabiner', color: 'Black', price: 8, category: 'camping', img: 'https://images.unsplash.com/photo-1476611338391-6f395a0ebc7b?w=500&q=75', sizes: ['OS'], points: 40 },
  { id: 'cg9', name: 'Dry Bag 10L', color: 'Forest Green', price: 25, category: 'camping', img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&q=75', sizes: ['10L'], points: 125 },
  { id: 'cg10', name: 'Fire Starter – Ferro Rod', color: 'Black', price: 15, category: 'camping', img: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=500&q=75', sizes: ['OS'], points: 75 },
  // Bundles
  { id: 'bun1', name: 'Complete Survival Kit', color: 'Multi', price: 150, category: 'bundles', tag: 'Save $40', img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=500&q=75', sizes: ['S','M','L','XL'], points: 750, bundle: true, originalPrice: 190 },
  { id: 'bun2', name: 'Brotherhood Bundle (2 Hoodies)', color: 'Multi', price: 130, category: 'bundles', tag: 'Save $20', img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500&q=75', sizes: ['S','M','L','XL'], points: 650, bundle: true, originalPrice: 150 },
  { id: 'bun3', name: 'Gear Starter Pack', color: 'Multi', price: 65, category: 'bundles', tag: 'Save $15', img: 'https://images.unsplash.com/photo-1476611338391-6f395a0ebc7b?w=500&q=75', sizes: ['OS'], points: 325, bundle: true, originalPrice: 80 },
  { id: 'bun4', name: 'Gift Box', color: 'Multi', price: 100, category: 'bundles', tag: 'Save $20', img: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=500&q=75', sizes: ['S','M','L','XL'], points: 500, bundle: true, originalPrice: 120 },
];

const CATEGORIES = [
  { label: 'All', value: 'all' },
  { label: 'Apparel', value: 'apparel' },
  { label: 'Gear', value: 'gear' },
  { label: 'Camping', value: 'camping' },
  { label: 'Bundles', value: 'bundles' },
  { label: 'Sale', value: 'sale' },
  { label: 'New', value: 'new' },
];

const APPAREL_CATS = ['hoodies','tees','crewnecks','caps','beanies','jackets','accessories'];
const GEAR_CATS = ['water-bottles','patches','journals','stickers','towels','flasks','keychains'];

function getFilteredProducts(products, catParam, activeFilter) {
  let list = [...products];
  
  // URL category param takes priority
  if (catParam && catParam !== 'boyz') {
    if (catParam === 'hoodies' || catParam === 'tees' || catParam === 'crewnecks' ||
        catParam === 'caps' || catParam === 'beanies' || catParam === 'jackets' ||
        catParam === 'accessories' || catParam === 'water-bottles' || catParam === 'patches' ||
        catParam === 'journals' || catParam === 'stickers' || catParam === 'towels' ||
        catParam === 'flasks' || catParam === 'keychains' || catParam === 'camping') {
      return list.filter(p => p.category === catParam);
    }
    if (catParam === 'bundles') return list.filter(p => p.category === 'bundles');
    if (catParam === 'limited') return list.filter(p => p.tag === 'Limited Edition');
    if (catParam === 'new') return list.filter(p => p.tag === 'New');
    if (catParam === 'sale') return list.filter(p => p.tag && p.tag.startsWith('Save'));
  }

  if (activeFilter === 'apparel') return list.filter(p => APPAREL_CATS.includes(p.category));
  if (activeFilter === 'gear') return list.filter(p => GEAR_CATS.includes(p.category));
  if (activeFilter === 'camping') return list.filter(p => p.category === 'camping');
  if (activeFilter === 'bundles') return list.filter(p => p.category === 'bundles');
  if (activeFilter === 'sale') return list.filter(p => p.tag && p.tag.startsWith('Save'));
  if (activeFilter === 'new') return list.filter(p => p.tag === 'New');
  return list;
}

function ProductCard({ product, onWishlist, wishlisted }) {
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem({ id: product.id, name: product.name, price: product.price, image_url: product.img, business: 'boyz' });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {product.tag && (
          <div className="absolute top-2 left-2">
            <span className="text-[10px] font-heading tracking-wider uppercase px-2.5 py-1 rounded-full text-white"
              style={{ background: product.tag.startsWith('Save') ? '#8B6914' : product.tag === 'Limited Edition' ? '#5C4033' : FG }}>
              {product.tag}
            </span>
          </div>
        )}
        <button onClick={() => onWishlist(product.id)}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${wishlisted ? 'bg-red-500/90 text-white' : 'bg-black/50 text-white/70 hover:bg-red-500/80'}`}>
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>
        {product.bundle && product.originalPrice && (
          <div className="absolute bottom-2 left-2 bg-black/70 rounded-lg px-2 py-0.5">
            <span className="text-[10px] text-white/60 line-through">${product.originalPrice}</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-[10px] text-muted-foreground capitalize mb-0.5">{product.color}</p>
        <h3 className="font-heading text-sm tracking-wider uppercase leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">{product.name}</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="font-heading text-lg text-foreground">${product.price}</span>
          <span className="text-[10px] text-muted-foreground">+{product.points} pts</span>
        </div>
        <Button onClick={handleAdd} size="sm" className="w-full font-heading tracking-wider uppercase text-xs" style={{ background: FG }}>
          Add to Cart
        </Button>
      </div>
    </motion.div>
  );
}

export default function ShopMain() {
  const { category: catParam } = useParams();
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [wishlist, setWishlist] = useState([]);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [countdown, setCountdown] = useState({ h: 11, m: 47, s: 22 });

  React.useEffect(() => {
    const t = setInterval(() => {
      setCountdown(c => {
        let { h, m, s } = c;
        s--; if (s < 0) { s = 59; m--; } if (m < 0) { m = 59; h--; } if (h < 0) { h = 23; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const toggleWishlist = (id) => setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);

  const filtered = useMemo(() => {
    let list = getFilteredProducts(ALL_PRODUCTS, catParam, activeFilter);
    if (sortBy === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [catParam, activeFilter, sortBy]);

  const limitedItems = ALL_PRODUCTS.filter(p => p.tag === 'Limited Edition');

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Shop — Survival Pack 01"
        description="Hoodies, tees, caps, crewnecks, and gear forged in the woods. Worn as proof. Every piece is proof that you were there, that you chose to reset."
        canonical="/shop"
      />

      {/* Hero */}
      <section className="relative h-64 md:h-72 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=80" alt="Shop" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 pb-8">
          <span className="text-xs font-heading tracking-[0.3em] uppercase" style={{ color: SAND }}>Survival Pack</span>
          <h1 className="font-heading text-5xl md:text-6xl tracking-wide uppercase text-foreground mt-1">The Shop</h1>
          <p className="text-muted-foreground text-sm mt-1">Gear forged in the woods. Worn as proof.</p>
        </div>
      </section>

      {/* Limited Drop Countdown */}
      <div className="border-b border-border" style={{ background: 'rgba(45,90,39,0.1)' }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="font-heading tracking-wider uppercase text-xs">Next Limited Drop Ends:</span>
          </div>
          <div className="flex items-center gap-3">
            {[['H', countdown.h], ['M', countdown.m], ['S', countdown.s]].map(([label, val]) => (
              <div key={label} className="text-center">
                <div className="font-heading text-2xl text-foreground">{String(val).padStart(2, '0')}</div>
                <div className="text-[9px] text-muted-foreground uppercase font-heading tracking-wider">{label}</div>
              </div>
            ))}
          </div>
          <Button size="sm" className="font-heading tracking-wider uppercase text-xs" style={{ background: FG }}>
            Shop Limited <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(c => (
              <button key={c.value} onClick={() => setActiveFilter(c.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-heading tracking-wider uppercase transition-all ${activeFilter === c.value ? 'text-white' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
                style={activeFilter === c.value ? { background: FG } : {}}>
                {c.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowSizeGuide(true)}
              className="text-xs font-heading tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-3 py-1.5">
              Size Guide
            </button>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="text-xs bg-secondary border border-border rounded-lg px-3 py-1.5 text-muted-foreground font-heading tracking-wider uppercase">
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>
        </div>

        {/* Product Count */}
        <p className="text-xs text-muted-foreground mb-6 font-heading tracking-wider">{filtered.length} PRODUCTS</p>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} onWishlist={toggleWishlist} wishlisted={wishlist.includes(product.id)} />
          ))}
        </div>

        {/* Limited Edition Section */}
        {activeFilter === 'all' && !catParam && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-heading tracking-[0.3em] uppercase" style={{ color: SAND }}>Don't Miss Out</span>
                <h2 className="font-heading text-3xl tracking-wide uppercase mt-1">Limited Edition</h2>
              </div>
              <Link to="/shop/limited" className="text-xs font-heading tracking-wider uppercase text-muted-foreground hover:text-foreground flex items-center gap-1">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {limitedItems.map(product => (
                <ProductCard key={`lim-${product.id}`} product={product} onWishlist={toggleWishlist} wishlisted={wishlist.includes(product.id)} />
              ))}
            </div>
          </div>
        )}

        {/* Bundles Section */}
        {activeFilter === 'all' && !catParam && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-heading tracking-[0.3em] uppercase" style={{ color: '#D2B48C' }}>Better Together</span>
                <h2 className="font-heading text-3xl tracking-wide uppercase mt-1">Bundle & Save</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {ALL_PRODUCTS.filter(p => p.bundle).map(product => (
                <ProductCard key={`bun-${product.id}`} product={product} onWishlist={toggleWishlist} wishlisted={wishlist.includes(product.id)} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Size Guide Modal */}
      <AnimatePresence>
        {showSizeGuide && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={() => setShowSizeGuide(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-card border border-border rounded-2xl p-6 max-w-lg w-full shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-heading text-xl tracking-wider uppercase">Size Guide</h3>
                <button onClick={() => setShowSizeGuide(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {['Size', 'Chest (in)', 'Length (in)', 'Height'].map(h => (
                      <th key={h} className="text-left pb-2 text-xs font-heading tracking-wider uppercase text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[['S','36–38','27','5\'7"–5\'9"'],['M','38–40','28','5\'9"–6\'0"'],['L','40–42','29','6\'0"–6\'2"'],['XL','42–44','30','6\'2"+']]
                    .map(([size, chest, length, height]) => (
                    <tr key={size} className="border-b border-border/50">
                      <td className="py-2.5 font-heading text-sm" style={{ color: FG }}>{size}</td>
                      <td className="py-2.5 text-sm text-muted-foreground">{chest}</td>
                      <td className="py-2.5 text-sm text-muted-foreground">{length}</td>
                      <td className="py-2.5 text-sm text-muted-foreground">{height}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-muted-foreground mt-4">All measurements are approximate. When in doubt, size up.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}