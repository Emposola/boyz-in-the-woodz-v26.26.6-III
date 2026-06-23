import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';

const FALLBACK_CATEGORIES = [
  'Field Notes', 'Retreat Recaps', 'Brotherhood Stories', 'Guest Posts',
  'Science', 'Mental Health', 'Nature & Adventure', 'Gear', 'Culture', 'General',
];

export const CATEGORY_META = {
  'Field Notes':        { display: 'Field Notes',        icon: 'Camera', group: 'browse' },
  'Retreat Recaps':     { display: 'Retreat Recaps',     icon: 'Trees', group: 'browse' },
  'Brotherhood Stories':{ display: 'Brotherhood Stories',icon: 'Trophy', group: 'browse' },
  'Guest Posts':        { display: 'Guest Posts',        icon: 'Camera', group: 'browse' },
  'Science':            { display: 'Science & Research', icon: 'Zap', group: 'topics' },
  'Mental Health':      { display: "Men's Mental Health",icon: 'Heart', group: 'topics' },
  'Nature & Adventure': { display: 'Nature & Adventure', icon: 'Trees', group: 'topics' },
  'Gear':               { display: 'Gear Reviews',       icon: 'Shield', group: 'topics' },
  'Culture':            { display: 'Culture',           icon: 'Users', group: 'topics' },
  'General':            { display: 'General',           icon: 'BookOpen', group: 'topics' },
};

export const GROUP_ORDER = {
  browse: { heading: 'Browse', order: 0 },
  topics: { heading: 'Topics', order: 1 },
};

export function useCategories() {
  return useQuery({
    queryKey: ['journal-categories'],
    queryFn: async () => {
      const { data } = await supabase
        .from('blog_posts')
        .select('category')
        .eq('status', 'published');
      const unique = [...new Set((data || []).map(r => r.category).filter(Boolean))].sort();
      return unique.length > 0 ? unique : FALLBACK_CATEGORIES;
    },
    staleTime: 10 * 60 * 1000,
  });
}
