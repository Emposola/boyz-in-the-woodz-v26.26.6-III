/* ============================================================
   PRODUCT CATEGORIES — Dynamic from DB with group mappings
   Used by ShopMain, AdminProducts, Navbar
   ============================================================ */
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

/* Group mappings — URL slug → array of DB category values */
export const CATEGORY_GROUPS = {
  apparel:  { label: 'Apparel',  cats: ['hoodies','tees','crewnecks','caps','beanies','jackets','accessories'] },
  gear:     { label: 'Gear',     cats: ['water-bottles','patches','journals','stickers','towels','flasks','keychains'] },
  bundles:  { label: 'Bundles',  cats: ['bundles'] },
  camping:  { label: 'Camping',  cats: ['camping'] },
  new:      { label: 'New',      cats: ['new'] },
  'limited-edition': { label: 'Limited', cats: ['limited-edition'] },
  sale:     { label: 'Sale',     cats: [] }, // filter via compare_at_price
};

/* Resolve a URL param to a DB filter */
export function resolveCategoryParam(catParam) {
  if (!catParam || catParam === 'all' || catParam === 'boyz') return null;

  // Check if it's a group key
  const group = CATEGORY_GROUPS[catParam];
  if (group) {
    if (catParam === 'sale') return { type: 'sale' };
    return { type: 'group', cats: group.cats };
  }

  // Direct category match
  return { type: 'direct', cat: catParam };
}

/* Fallback when DB is empty */
const FALLBACK_CATEGORIES = [
  'hoodies','tees','crewnecks','caps','beanies','jackets','accessories',
  'water-bottles','patches','journals','stickers','towels','flasks','keychains',
  'bundles','camping','limited-edition','new',
];

export function useProductCategories() {
  const { data: dbCategories = [] } = useQuery({
    queryKey: ['product-categories'],
    queryFn: async () => {
      const { data } = await supabase
        .from('products')
        .select('category')
        .eq('active', true);
      if (!data) return [];
      const distinct = [...new Set(data.map(p => p.category).filter(Boolean))].sort();
      return distinct;
    },
    staleTime: 5 * 60 * 1000,
  });

  const categories = dbCategories.length > 0 ? dbCategories : FALLBACK_CATEGORIES;

  const findGroup = (category) => {
    for (const [key, group] of Object.entries(CATEGORY_GROUPS)) {
      if (group.cats.includes(category)) return key;
    }
    return null;
  };

  return {
    categories,
    groups: CATEGORY_GROUPS,
    findGroup,
    getGroupLabel: (cat) => {
      const g = findGroup(cat);
      return g ? CATEGORY_GROUPS[g].label : null;
    },
    navItems: [
      { label: 'All', value: 'all' },
      ...Object.entries(CATEGORY_GROUPS)
        .filter(([, g]) => g.cats.length > 0 || g.label === 'Sale')
        .map(([key, g]) => ({ label: g.label, value: key })),
    ],
  };
}
