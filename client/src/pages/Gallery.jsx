import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, X, Paintbrush, Eye } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { formatPrice } from '../utils/formatters';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Input from '../components/common/Input';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';
import { ArtworkCardSkeleton } from '../components/common/Skeleton';
import api from '../services/api';

export const Gallery = () => {
  const { setPageTitle } = useSettings();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [artworks, setArtworks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginationMeta, setPaginationMeta] = useState({ page: 1, pages: 1, total: 0 });

  // Filters state initialized from URL search params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedMedium, setSelectedMedium] = useState(searchParams.get('medium') || 'all');
  const [sortOption, setSortOption] = useState(searchParams.get('sort') || 'newest');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  useEffect(() => {
    setPageTitle('Showcase Gallery');
    // Load categories for filter pills
    api.get('/categories').then((res) => {
      if (res.data?.success) setCategories(res.data.data);
    });
  }, [setPageTitle]);

  const fetchArtworks = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 9,
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="eyebrow">PORTFOLIO & INSPIRATION</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-charcoal-900">
          Commission Showcase Gallery
        </h1>
        <p className="text-sm text-charcoal-600 leading-relaxed">
          Browse handcrafted custom commissions created for our collectors. Every piece here was made-to-order from a customer's personal photograph.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-cream-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="w-full md:max-w-md relative flex items-center">
            <Input
              type="text"
              placeholder="Search by title, subject, medium..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={Search}
              className="py-2.5"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 text-charcoal-400 hover:text-charcoal-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Sort & Filter Toggle */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase text-charcoal-500 hidden sm:inline">
                Sort:
              </span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-cream-100 border border-cream-300 rounded-full px-4 py-2 text-xs font-medium text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-terracotta-200"
              >
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            <Button
              variant="secondary"
              size="sm"
              icon={SlidersHorizontal}
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="md:hidden"
            >
              Filters
            </Button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-cream-100">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-terracotta-500 text-white shadow-sm'
                : 'bg-cream-100 text-charcoal-700 hover:bg-cream-200 border border-cream-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.slug
                  ? 'bg-terracotta-500 text-white shadow-sm'
                  : 'bg-cream-100 text-charcoal-700 hover:bg-cream-200 border border-cream-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Expanded Price Filters (Desktop & Mobile when toggled) */}
        {(showFiltersMobile || minPrice || maxPrice) && (
          <div className="pt-3 border-t border-cream-100 flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold uppercase text-charcoal-500">Price Range (₹):</span>
            <input
              type="number"
              placeholder="Min ₹"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-28 px-3 py-1.5 bg-cream-100 border border-cream-300 rounded-full text-xs"
            />
            <span className="text-charcoal-400 text-xs">to</span>
            <input
              type="number"
              placeholder="Max ₹"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-28 px-3 py-1.5 bg-cream-100 border border-cream-300 rounded-full text-xs"
            />
            <Button variant="primary" size="sm" onClick={() => fetchArtworks(1)}>
              Apply
            </Button>
            {(search || selectedCategory !== 'all' || minPrice || maxPrice) && (
              <Button variant="ghost" size="sm" onClick={handleResetFilters}>
                Reset All
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Artworks Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <ArtworkCardSkeleton key={i} />
          ))}
        </div>
      ) : artworks.length === 0 ? (
        <EmptyState
          title="No artworks match your filters"
          description="Try broadening your search keyword, removing price bounds, or exploring another medium."
          actionText="Clear Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {artworks.map((art) => (
            <div
              key={art._id}
              className="group bg-white rounded-3xl overflow-hidden border border-cream-200 shadow-card hover:shadow-soft-hover transition-all duration-300 flex flex-col"
            >
              {/* Cover Image */}
              <div className="relative aspect-[4/5] overflow-hidden bg-cream-200">
                <img
                  src={art.coverImage?.url}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant="default" className="bg-white/90 backdrop-blur-sm">
                    {art.category?.name}
                  </Badge>
                </div>
              </div>

              {/* Info Card */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif text-lg font-bold text-charcoal-900 line-clamp-1 group-hover:text-terracotta-600 transition-colors">
                      {art.title}
                    </h3>
                    <span className="text-sm font-bold text-terracotta-600 shrink-0">
                      {formatPrice(art.startingPrice)}
                    </span>
                  </div>

                  <p className="text-xs text-charcoal-500 line-clamp-2 leading-relaxed">
                    {art.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="bg-cream-100 text-charcoal-600 text-[11px] px-2.5 py-0.5 rounded-full border border-cream-200 font-medium">
                      {art.medium}
                    </span>
                    <span className="bg-cream-100 text-charcoal-600 text-[11px] px-2.5 py-0.5 rounded-full border border-cream-200 font-medium">
                      {art.dimensions}
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-cream-100">
                  <Link
                    to={`/artworks/${art.slug}`}
                    className="text-xs font-semibold text-charcoal-600 hover:text-terracotta-600 flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Details
                  </Link>

                  <Button
                    variant="primary"
                    size="sm"
                    icon={Paintbrush}
                    onClick={() =>
                      navigate(
                        `/custom-order?category=${art.category?.slug}&artwork=${art.slug}`
                      )
                    }
                  >
                    Order Similar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
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
