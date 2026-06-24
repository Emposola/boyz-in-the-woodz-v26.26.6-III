/* ============================================================
   FEATURED PRODUCTS — Shows featured products from DB
   Used on homepage — reflects admin changes immediately
   ============================================================ */
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import ProductCard from '../shared/ProductCard';
import SectionHeading from '../shared/SectionHeading';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const FG = '#2D5A27';

export default function FeaturedProducts({ business = 'boyz', title, subtitle }) {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['featured-products', business],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('business', business)
        .eq('featured', true)
        .eq('active', true)
        .order('created_date', { ascending: false })
        .limit(4);
      if (error) return [];
      return data || [];
    },
    staleTime: 2 * 60 * 1000,
  });

  // Don't render section at all if no featured products and not loading
  if (!isLoading && products.length === 0) return null;

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <SectionHeading title={title} subtitle={subtitle} />
          <Link to="/shop"
            className="hidden md:flex items-center gap-1.5 text-xs font-heading tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 ml-4">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))
          ) : (
            products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link to="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-heading tracking-wider uppercase px-5 py-2.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all">
            View All Products <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}
