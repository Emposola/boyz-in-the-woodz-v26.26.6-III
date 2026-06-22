/* ============================================================
   SHOP PAGE — Product grid for either Boyz or Barber
   URL: /shop/boyz or /shop/barber
   ============================================================ */
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import ProductCard from '../components/shared/ProductCard';
import SectionHeading from '../components/shared/SectionHeading';
import { Skeleton } from '@/components/ui/skeleton';
import { Trees, Scissors } from 'lucide-react';

export default function Shop() {
  /* --- Determine which business from URL params --- */
  const { business } = useParams();
  const isBoyz = business === 'boyz';

  /* --- Fetch active products for this business --- */
  const { data: products, isLoading } = useQuery({
    queryKey: ['shop-products', business],
    queryFn: () => base44.entities.Product.filter(
      { business, active: true },
      '-created_date',
      50
    ),
    initialData: [],
  });

  return (
    <div className="min-h-screen">
      {/* --- Hero Banner --- */}
      <section
        className="relative h-64 md:h-80 flex items-end bg-cover bg-center"
        style={{
          backgroundImage: isBoyz
            ? 'url(https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1400&q=80)'
            : 'url(https://images.unsplash.com/photo-1585747860019-8007580e2f14?w=1400&q=80)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 pb-8 w-full">
          <div className="flex items-center gap-2 mb-2">
            {isBoyz ? <Trees className="w-5 h-5 text-primary" /> : <Scissors className="w-5 h-5 text-accent" />}
            <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">
              {isBoyz ? 'The Woodz' : 'The Chair'}
            </span>
          </div>
          <h1 className="font-heading text-4xl md:text-6xl tracking-wide uppercase">
            {isBoyz ? 'Survival Pack 01' : 'Barber Merch'}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {isBoyz
              ? 'Hoodies, tees, caps, crewnecks — gear that tells your story.'
              : 'Aprons, pomade, combs, tees — essentials from The Chair.'}
          </p>
        </div>
      </section>

      {/* --- Product Grid --- */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {isLoading ? (
            Array(8).fill(0).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[3/4] rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))
          ) : products.length > 0 ? (
            products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <SectionHeading
                title="Coming Soon"
                subtitle="Products are being loaded into the system. Check back shortly."
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}