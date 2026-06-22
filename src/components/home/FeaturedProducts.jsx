/* ============================================================
   FEATURED PRODUCTS — Shows top products from each business
   Used on homepage to cross-promote
   ============================================================ */
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/supabaseClient';
import ProductCard from '../shared/ProductCard';
import SectionHeading from '../shared/SectionHeading';
import { Skeleton } from '@/components/ui/skeleton';

export default function FeaturedProducts({ business, title, subtitle }) {
  /* --- Fetch featured products for the given business --- */
  const { data: products, isLoading } = useQuery({
    queryKey: ['featured-products', business],
    queryFn: () => api.entities.Product.filter(
      { business, featured: true, active: true },
      '-created_date',
      4
    ),
    initialData: [],
  });

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeading title={title} subtitle={subtitle} />

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {isLoading ? (
            /* Loading skeletons */
            Array(4).fill(0).map((_, i) => (
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
            /* Empty state */
            <div className="col-span-full text-center py-12 text-muted-foreground text-sm">
              Products coming soon.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}