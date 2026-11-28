import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown, ArrowUpDown } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useWishlist } from '../hooks/useWishlist';
import ArtworkCard from '../components/common/ArtworkCard';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';
import { ArtworkCardSkeleton } from '../components/common/Skeleton';
import api from '../services/api';

export const Gallery = () => {
  const { setPageTitle } = useSettings();
  const [searchParams] = useSearchParams();
  const { wishlistedIds, toggleWishlist } = useWishlist();

  const [artworks, setArtworks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginationMeta, setPaginationMeta] = useState({ page: 1, pages: 1, total: 0 });

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedMedium, setSelectedMedium] = useState(searchParams.get('medium') || 'all');
  const [sortOption, setSortOption] = useState(searchParams.get('sort') || 'newest');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [showFilters, setShowFilters] = useState(false);

  // Sync URL query params when navigated from header / drawer
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || 'all');
    setSelectedMedium(searchParams.get('medium') || 'all');
  }, [searchParams]);

  useEffect(() => {
    setPageTitle('Showcase Gallery');
    api.get('/categories').then((res) => {
      if (res.data?.success) setCategories(res.data.data);
    });
  }, [setPageTitle]);

  const fetchArtworks = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 12,
        sort: sortOption,
      };
      if (search.trim()) params.search = search.trim();
      if (selectedCategory && selectedCategory !== 'all') params.category = selectedCategory;
      if (selectedMedium && selectedMedium !== 'all') params.medium = selectedMedium;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const res = await api.get('/artworks', { params });
      if (res.data?.success) {
        setArtworks(res.data.data);
        if (res.data.meta) {
          setPaginationMeta(res.data.meta);
        }
      }
    } catch (err) {
      console.error('Failed to fetch artworks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks(1);
  }, [selectedCategory, selectedMedium, sortOption]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchArtworks(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedMedium('all');
    setSortOption('newest');
    setMinPrice('');
    setMaxPrice('');
    fetchArtworks(1);
  };

  const hasActiveFilters =
    Boolean(search) ||
    selectedCategory !== 'all' ||
    selectedMedium !== 'all' ||
    Boolean(minPrice) ||
    Boolean(maxPrice);

  return (
    <div className="max-w-[1200px] mx-auto px-3 sm:px-6 lg:px-8 pt-6 pb-20 space-y-6 sm:space-y-8">
      {/* Header matching ProductsSection typography */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="eyebrow">Original Art & Portfolio</span>
        <h1 className="editorial-serif text-4xl sm:text-6xl text-[#111827] font-normal leading-none">
          Commission Showcase
        </h1>
        <p className="text-[13px] sm:text-[14px] text-[#6e6e73] leading-relaxed">
          Explore handcrafted bespoke paintings created for collectors. Tap the sparkle icon on any artwork to request your own custom version.
        </p>
      </div>

      {/* Frosted Pill Control Bar */}
      <div className="rounded-[22px] bg-white border border-[#eae9ee] p-3.5 sm:p-5 shadow-[0_6px_24px_rgba(0,0,0,0.03)] space-y-3.5">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Pill */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-md flex items-center gap-2 bg-[#f2f1f6] rounded-full px-4 py-2.5 border border-transparent focus-within:border-[#ff0457] focus-within:bg-white transition-all"
          >
            <Search className="w-4 h-4 text-[#8e8e93] shrink-0" />
            <input
              type="text"
              placeholder="Search portrait, charcoal, oil, floral..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-[13px] sm:text-[14px] text-[#111827] placeholder-[#8e8e93] focus:outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  fetchArtworks(1);
                }}
                aria-label="Clear search"
                className="text-[#8e8e93] hover:text-[#111827]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Sort Pill & Price Bounds Toggle */}
          <div className="flex items-center gap-2 justify-between md:justify-end">
            <div className="relative inline-flex items-center">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#6e6e73] absolute left-3.5 pointer-events-none" />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                aria-label="Sort artworks"
                className="appearance-none bg-[#f2f1f6] hover:bg-[#e8e7ed] rounded-full pl-9 pr-8 py-2 text-[12px] sm:text-[13px] font-semibold text-[#111827] focus:outline-none cursor-pointer transition-colors"
              >
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#6e6e73] absolute right-3 pointer-events-none" />
            </div>

            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] sm:text-[13px] font-semibold border transition-colors ${
                showFilters || minPrice || maxPrice
                  ? 'bg-[#111827] text-white border-[#111827]'
                  : 'bg-white text-[#111827] border-[#e2e2e7] hover:border-[#111827]'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Price</span>
            </button>
          </div>
        </div>

        {/* Category / Medium Horizontal Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setSelectedMedium('all');
            }}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all ${
              selectedCategory === 'all' && selectedMedium === 'all'
                ? 'bg-[#ff0457] text-white shadow-[0_4px_14px_rgba(255,4,87,0.25)]'
                : 'bg-[#f2f1f6] text-[#3c3c43] hover:bg-[#e5e4ea]'
            }`}
          >
            All Works
          </button>

          {categories.map((cat) => (
            <button
              type="button"
              key={cat._id}
              onClick={() => {
                setSelectedMedium('all');
                setSelectedCategory(cat.slug);
              }}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all ${
                selectedCategory === cat.slug
                  ? 'bg-[#111827] text-white'
                  : 'bg-[#f2f1f6] text-[#3c3c43] hover:bg-[#e5e4ea]'
              }`}
            >
              {cat.name}
            </button>
          ))}

          {selectedMedium !== 'all' && (
            <button
              type="button"
              onClick={() => setSelectedMedium('all')}
              className="shrink-0 inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-[12px] font-bold bg-[#ffe5ee] text-[#ff0155]"
            >
              <span>Medium: {selectedMedium}</span>
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Optional Price Range Drawer */}
        {(showFilters || minPrice || maxPrice) && (
          <div className="pt-3 border-t border-[#f2f1f6] flex flex-wrap items-center gap-2.5">
            <span className="text-[12px] font-semibold text-[#6e6e73]">Budget (₹):</span>
            <input
              type="number"
              placeholder="Min ₹"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-24 px-3 py-1.5 rounded-full bg-[#f2f1f6] text-[12px] font-medium text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#ff0457]/30"
            />
            <span className="text-[#8e8e93] text-xs">–</span>
            <input
              type="number"
              placeholder="Max ₹"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-24 px-3 py-1.5 rounded-full bg-[#f2f1f6] text-[12px] font-medium text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#ff0457]/30"
            />
            <button
              type="button"
              onClick={() => fetchArtworks(1)}
              className="px-4 py-1.5 rounded-full bg-[#111827] text-white text-[12px] font-semibold hover:bg-black transition-colors"
            >
              Apply
            </button>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[12px] font-semibold text-[#ff0457] hover:underline ml-auto"
              >
                Reset All
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results Grid (Mobile 2-col, Tablet 3-col, Desktop 4-col) */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ArtworkCardSkeleton key={i} />
          ))}
        </div>
      ) : artworks.length === 0 ? (
        <EmptyState
          title="No artworks match your filters"
          description="Try broadening your search keyword, clearing price limits, or exploring all mediums."
          actionText="Clear Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {artworks.map((art, idx) => (
            <ArtworkCard
              key={art._id}
              artwork={art}
              index={idx}
              isWishlisted={wishlistedIds.has(art._id)}
              onToggleWishlist={toggleWishlist}
            />
          ))}
        </div>
      )}

      {!loading && (
        <Pagination
          currentPage={paginationMeta.page}
          totalPages={paginationMeta.pages}
          onPageChange={(page) => fetchArtworks(page)}
        />
      )}
    </div>
  );
};

export default Gallery;
