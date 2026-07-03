/* ============================================================
   SEARCH PAGE — Ultra Premium Search Experience
   Live Search | Filters | AI-Powered | SEO Optimized
   ============================================================ */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search as SearchIcon, X, Filter, ChevronDown, ChevronUp, 
  ShoppingBag, Scissors, Trees, Users, BookOpen,
  MapPin, Calendar, Star, ArrowRight, Clock,
  Sparkles, Zap, Heart, Shield, Award, Compass,
  Loader2, Grid3x3, List, SlidersHorizontal
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/shared/SEO';

// ============================================================
// SEARCH TYPES & FILTERS
// ============================================================
const SEARCH_TYPES = [
  { value: 'all', label: 'All Results', icon: SearchIcon },
  { value: 'products', label: 'Products', icon: ShoppingBag },
  { value: 'blog', label: 'Blog Posts', icon: BookOpen },
  { value: 'events', label: 'Events', icon: Calendar },
  { value: 'barbers', label: 'Barbers', icon: Scissors },
  { value: 'retreats', label: 'Retreats', icon: Trees },
  { value: 'pages', label: 'Pages', icon: Compass },
];

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
];

// ============================================================
// SEARCH RESULTS CARD
// ============================================================
function SearchResultCard({ result, type }) {
  const getIcon = () => {
    switch (type) {
      case 'products': return <ShoppingBag className="w-4 h-4" />;
      case 'blog': return <BookOpen className="w-4 h-4" />;
      case 'events': return <Calendar className="w-4 h-4" />;
      case 'barbers': return <Scissors className="w-4 h-4" />;
      case 'retreats': return <Trees className="w-4 h-4" />;
      default: return <SearchIcon className="w-4 h-4" />;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'products': return 'text-primary bg-primary/10 border-primary/20';
      case 'blog': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'events': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'barbers': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'retreats': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'products': return 'Product';
      case 'blog': return 'Article';
      case 'events': return 'Event';
      case 'barbers': return 'Barber';
      case 'retreats': return 'Retreat';
      default: return 'Result';
    }
  };

  const getHref = () => {
    switch (type) {
      case 'products': return `/product/${result.id}`;
      case 'blog': return `/journal/${result.slug || result.id}`;
      case 'events': return `/events#${result.id}`;
      case 'barbers': return `/barber/profile/${result.id}`;
      case 'retreats': return `/retreat/${result.id}`;
      default: return '#';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="group bg-card border border-border/50 rounded-2xl overflow-hidden hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-300"
    >
      <Link to={getHref()} className="flex flex-col sm:flex-row gap-4 p-5">
        {/* Thumbnail */}
        {result.image_url && (
          <div className="sm:w-32 h-32 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden bg-secondary">
            <img 
              src={result.image_url} 
              alt={result.name || result.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          {/* Type Badge */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-heading tracking-wider uppercase border ${getTypeColor()}`}>
              {getIcon()}
              {getTypeLabel()}
            </span>
            {result.featured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-heading tracking-wider uppercase bg-amber-400/10 text-amber-400 border border-amber-400/20">
                <Star className="w-2.5 h-2.5" />
                Featured
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-heading text-base tracking-wide text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {result.name || result.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {result.description || result.excerpt || result.bio || 'No description available.'}
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
            {result.price && (
              <span className="font-semibold text-foreground">${result.price}</span>
            )}
            {result.rating && (
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                {result.rating}
              </span>
            )}
            {result.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {result.location}
              </span>
            )}
            {result.category && (
              <span className="px-2 py-0.5 rounded bg-secondary/50 text-muted-foreground">
                {result.category}
              </span>
            )}
          </div>
        </div>

        {/* Arrow */}
        <div className="flex items-center justify-center sm:justify-end flex-shrink-0">
          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
        </div>
      </Link>
    </motion.div>
  );
}

// ============================================================
// MAIN SEARCH PAGE
// ============================================================
export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialType = searchParams.get('type') || 'all';
  const initialSort = searchParams.get('sort') || 'relevance';

  const [query, setQuery] = useState(initialQuery);
  const [activeType, setActiveType] = useState(initialType);
  const [sortBy, setSortBy] = useState(initialSort);
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);

  // ─── Focus input on load ───
  useEffect(() => {
    if (inputRef.current && !query) {
      inputRef.current.focus();
    }
  }, []);

  // ─── Update URL when filters change ───
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (activeType !== 'all') params.set('type', activeType);
    if (sortBy !== 'relevance') params.set('sort', sortBy);
    setSearchParams(params, { replace: true });
  }, [query, activeType, sortBy, setSearchParams]);

  // ─── Search Function ───
  const performSearch = useCallback(async () => {
    if (!query.trim() || query.length < 2) {
      return { products: [], blog: [], events: [], barbers: [], retreats: [] };
    }

    setIsSearching(true);

    try {
      const searchTerm = query.trim().toLowerCase();
      const results = {
        products: [],
        blog: [],
        events: [],
        barbers: [],
        retreats: [],
      };

      // ── Search Products ──
      if (activeType === 'all' || activeType === 'products') {
        const { data: products } = await api.entities.Product.filter(
          { active: true },
          '-created_date',
          20
        );
        results.products = (products || []).filter(p => 
          p.name?.toLowerCase().includes(searchTerm) ||
          p.description?.toLowerCase().includes(searchTerm) ||
          p.category?.toLowerCase().includes(searchTerm)
        );
      }

      // ── Search Blog Posts ──
      if (activeType === 'all' || activeType === 'blog') {
        const { data: posts } = await api.entities.BlogPost.filter(
          { status: 'published' },
          '-created_date',
          20
        );
        results.blog = (posts || []).filter(p => 
          p.title?.toLowerCase().includes(searchTerm) ||
          p.body?.toLowerCase().includes(searchTerm) ||
          p.excerpt?.toLowerCase().includes(searchTerm) ||
          p.category?.toLowerCase().includes(searchTerm)
        );
      }

      // ── Search Events ──
      if (activeType === 'all' || activeType === 'events') {
        const { data: events } = await api.entities.Event.filter(
          { active: true },
          'start_date',
          20
        );
        results.events = (events || []).filter(e => 
          e.title?.toLowerCase().includes(searchTerm) ||
          e.location_name?.toLowerCase().includes(searchTerm) ||
          e.description?.toLowerCase().includes(searchTerm)
        );
      }

      // ── Search Barbers ──
      if (activeType === 'all' || activeType === 'barbers') {
        const { data: barbers } = await api.entities.Barber.filter(
          { active: true },
          '-created_date',
          20
        );
        results.barbers = (barbers || []).filter(b => 
          b.name?.toLowerCase().includes(searchTerm) ||
          b.bio?.toLowerCase().includes(searchTerm) ||
          b.specialties?.some(s => s?.toLowerCase().includes(searchTerm))
        );
      }

      // ── Search Retreats ──
      if (activeType === 'all' || activeType === 'retreats') {
        const { data: retreats } = await api.entities.Event.filter(
          { type: 'retreat', active: true },
          'start_date',
          20
        );
        results.retreats = (retreats || []).filter(r => 
          r.title?.toLowerCase().includes(searchTerm) ||
          r.location_name?.toLowerCase().includes(searchTerm) ||
          r.description?.toLowerCase().includes(searchTerm)
        );
      }

      return results;
    } catch (error) {
      console.error('Search error:', error);
      return { products: [], blog: [], events: [], barbers: [], retreats: [] };
    } finally {
      setIsSearching(false);
    }
  }, [query, activeType]);

  // ─── React Query for search ───
  const { data: results, isLoading } = useQuery({
    queryKey: ['search', query, activeType, sortBy],
    queryFn: performSearch,
    enabled: query.length >= 2,
    staleTime: 30000,
  });

  // ─── Count total results ───
  const totalResults = results 
    ? Object.values(results).reduce((sum, arr) => sum + arr.length, 0)
    : 0;

  // ─── Clear search ───
  const clearSearch = () => {
    setQuery('');
    setActiveType('all');
    setSortBy('relevance');
    if (inputRef.current) inputRef.current.focus();
  };

  // ─── Render result sections ───
  const renderResults = () => {
    if (!results) return null;

    const sections = [
      { key: 'products', label: 'Products', icon: ShoppingBag, data: results.products },
      { key: 'blog', label: 'Articles', icon: BookOpen, data: results.blog },
      { key: 'events', label: 'Events', icon: Calendar, data: results.events },
      { key: 'barbers', label: 'Barbers', icon: Scissors, data: results.barbers },
      { key: 'retreats', label: 'Retreats', icon: Trees, data: results.retreats },
    ];

    return sections.map((section) => {
      if (section.data.length === 0) return null;
      if (activeType !== 'all' && section.key !== activeType) return null;

      return (
        <div key={section.key} className="mb-8 last:mb-0">
          <div className="flex items-center gap-2 mb-4">
            <section.icon className="w-4 h-4 text-primary" />
            <h3 className="font-heading text-sm tracking-wider uppercase text-foreground">
              {section.label}
            </h3>
            <Badge variant="secondary" className="text-[9px]">
              {section.data.length}
            </Badge>
          </div>
          <div className="space-y-3">
            {section.data.map((item, index) => (
              <SearchResultCard 
                key={item.id || index} 
                result={item} 
                type={section.key} 
              />
            ))}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={query ? `Search Results for "${query}" — BOYZ IN THE WOODZ` : "Search — BOYZ IN THE WOODZ"}
        description={query ? `Search results for "${query}" on BOYZ IN THE WOODZ. Find products, articles, events, barbers, and retreats.` : "Search BOYZ IN THE WOODZ for products, articles, events, barbers, and retreats."}
        canonical="/search"
      />

      {/* ─── HERO ─── */}
      <section className="relative py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] bg-primary/5 rounded-full blur-[200px] -translate-y-1/2" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl tracking-wide uppercase text-foreground leading-[0.95] mb-3">
              <span className="relative inline-block">
                <span className="relative z-10 text-primary">Search</span>
                <span className="absolute bottom-0 left-0 w-full h-2 sm:h-2.5 bg-primary/10 -z-0" />
              </span>
              <span className="block">The Brotherhood</span>
            </h1>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto">
              Find products, articles, events, barbers, and retreats in the ecosystem.
            </p>
          </div>

          {/* ─── Search Bar ─── */}
          <div className="relative max-w-2xl mx-auto">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products, articles, events, barbers..."
                className="pl-12 pr-24 py-6 text-base bg-card/50 border-border/50 focus-visible:ring-0 focus-visible:ring-primary/30 rounded-2xl h-auto"
                aria-label="Search"
              />
              {query && (
                <button
                  onClick={clearSearch}
                  className="absolute right-16 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Button 
                  size="sm" 
                  className="rounded-full font-heading tracking-wider uppercase text-xs bg-primary hover:bg-primary/90"
                >
                  Search
                </Button>
              </div>
            </div>

            {/* ─── Search Stats ─── */}
            {query.length >= 2 && !isLoading && (
              <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                <span>
                  {totalResults} result{totalResults !== 1 ? 's' : ''} for "{query}"
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Filters</span>
                    {showFilters ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── FILTERS ─── */}
      <AnimatePresence>
        {showFilters && query.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
              <div className="bg-card/50 border border-border/50 rounded-2xl p-6 space-y-5">
                {/* Type Filter */}
                <div>
                  <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground block mb-3">
                    Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SEARCH_TYPES.map((type) => {
                      const Icon = type.icon;
                      const isActive = activeType === type.value;
                      return (
                        <button
                          key={type.value}
                          onClick={() => setActiveType(type.value)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-heading tracking-wider uppercase transition-all duration-300 ${
                            isActive
                              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                              : 'bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10 hover:text-foreground'
                          }`}
                        >
                          <Icon className="w-3 h-3" />
                          {type.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sort Filter */}
                <div>
                  <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground block mb-3">
                    Sort By
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value)}
                        className={`px-3 py-1.5 rounded-full text-xs font-heading tracking-wider uppercase transition-all duration-300 ${
                          sortBy === option.value
                            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                            : 'bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10 hover:text-foreground'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── RESULTS ─── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {isLoading ? (
          // ─── Loading State ───
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-muted-foreground text-sm mt-4 font-heading tracking-wider uppercase">
              Searching...
            </p>
          </div>
        ) : query.length < 2 ? (
          // ─── Empty State ───
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <SearchIcon className="w-16 h-16 text-muted-foreground/20 mb-4" />
            <h3 className="font-heading text-xl tracking-wide uppercase text-foreground mb-2">
              Search the Brotherhood
            </h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              Type at least 2 characters to start searching for products, articles, events, barbers, and retreats.
            </p>
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {SEARCH_TYPES.slice(1).map((type) => {
                const Icon = type.icon;
                return (
                  <span key={type.value} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] bg-white/5 border border-white/10 text-muted-foreground">
                    <Icon className="w-3 h-3" />
                    {type.label}
                  </span>
                );
              })}
            </div>
          </div>
        ) : totalResults === 0 ? (
          // ─── No Results ───
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-muted/10 flex items-center justify-center mb-4">
              <SearchIcon className="w-8 h-8 text-muted-foreground/30" />
            </div>
            <h3 className="font-heading text-xl tracking-wide uppercase text-foreground mb-2">
              No Results Found
            </h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              We couldn't find anything matching "{query}". Try adjusting your search terms or filters.
            </p>
            <Button
              variant="outline"
              onClick={clearSearch}
              className="mt-4 font-heading tracking-wider uppercase text-xs"
            >
              Clear Search
            </Button>
          </div>
        ) : (
          // ─── Results ───
          <motion.div
            layout
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{totalResults}</span> results for "{query}"
              </p>
              {activeType !== 'all' && (
                <button
                  onClick={() => setActiveType('all')}
                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  Show all types
                </button>
              )}
            </div>
            {renderResults()}
          </motion.div>
        )}
      </div>
    </div>
  );
}