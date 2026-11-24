import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, X, Paintbrush, Eye, Heart, Sparkles } from 'lucide-react';
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
      {/* Header with Blush & Black Editorial Styling */}
      <div className="text-center max-w-2xl mx-auto space-y-2 pt-4">
        <div className="inline-flex items-center gap-1 font-script text-3xl sm:text-4xl text-[#121212]">
          <span>Portfolio</span>
          <Heart className="w-4 h-4 text-[#dc8da3] fill-[#f7cbd7] inline-block" />
        </div>
        <h1 className="font-montserrat font-extrabold text-3xl sm:text-5xl text-[#121212] uppercase tracking-[0.08em]">
          COMMISSION SHOWCASE
        </h1>
        <p className="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed">
          Explore handcrafted bespoke paintings created for collectors. Every piece here was made-to-order from a customer's personal photograph.
        </p>
      </div>

      {/* Search & Filter Bar - Blush & Black Noir Box */}
      <div className="bg-white border-2 border-[#121212] p-5 sm:p-6 shadow-[5px_5px_0px_#f7cbd7] space-y-4">
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
                className="absolute right-3 text-gray-400 hover:text-[#121212]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Sort & Filter Toggle */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <div className="flex items-center gap-2">
              <span className="text-xs font-montserrat font-bold uppercase tracking-wider text-gray-600 hidden sm:inline">
                Sort:
              </span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-[#fff7f9] border-2 border-[#121212] px-4 py-2 text-xs font-montserrat font-bold text-[#121212] focus:outline-none focus:ring-2 focus:ring-[#f7cbd7]"
              >
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            <button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="md:hidden bg-[#fde8ef] border-2 border-[#121212] px-3 py-2 text-xs font-montserrat font-bold text-[#121212] flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-[#f7cbd7]">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-1.5 text-xs font-montserrat font-bold uppercase tracking-wider whitespace-nowrap transition-all border-2 border-[#121212] ${
              selectedCategory === 'all'
                ? 'bg-[#121212] text-white shadow-[2px_2px_0px_#f7cbd7]'
                : 'bg-white text-gray-700 hover:bg-[#fde8ef]'
            }`}
          >
            All Mediums
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-1.5 text-xs font-montserrat font-bold uppercase tracking-wider whitespace-nowrap transition-all border-2 border-[#121212] ${
                selectedCategory === cat.slug
                  ? 'bg-[#121212] text-white shadow-[2px_2px_0px_#f7cbd7]'
                  : 'bg-white text-gray-700 hover:bg-[#fde8ef]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Expanded Price Filters */}
        {(showFiltersMobile || minPrice || maxPrice) && (
          <div className="pt-3 border-t border-[#f7cbd7] flex flex-wrap items-center gap-3">
            <span className="text-xs font-montserrat font-bold uppercase text-gray-700">Price Range (₹):</span>
            <input
              type="number"
              placeholder="Min ₹"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-28 px-3 py-1.5 bg-white border-2 border-[#121212] text-xs font-montserrat"
            />
            <span className="text-gray-400 text-xs">to</span>
            <input
              type="number"
              placeholder="Max ₹"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-28 px-3 py-1.5 bg-white border-2 border-[#121212] text-xs font-montserrat"
            />
            <button
              onClick={() => fetchArtworks(1)}
              className="bg-[#121212] text-white font-montserrat text-xs font-bold uppercase tracking-wider px-4 py-1.5 border-2 border-[#121212] shadow-[2px_2px_0px_#f7cbd7]"
            >
              Apply
            </button>
            {(search || selectedCategory !== 'all' || minPrice || maxPrice) && (
              <button
                onClick={handleResetFilters}
                className="font-montserrat text-xs font-bold text-gray-600 hover:text-[#121212] underline ml-2"
              >
                Reset All
              </button>
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
              className="group bg-white border-2 border-[#121212] shadow-[4px_4px_0px_#f7cbd7] hover:shadow-[6px_6px_0px_#ebb0c0] hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
            >
              {/* Cover Image */}
              <div className="relative aspect-[4/5] overflow-hidden bg-[#fde8ef]">
                <img
                  src={art.coverImage?.url || art.images?.[0]?.url || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80'}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                  <span className="bg-white/95 backdrop-blur-xs border border-[#121212] font-montserrat text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 text-[#121212]">
                    {art.category?.name}
                  </span>
                </div>
              </div>

              {/* Info Card - Blush Strip */}
              <div className="p-5 bg-[#fff7f9] border-t-2 border-[#121212] flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-montserrat text-base font-extrabold text-[#121212] line-clamp-1 group-hover:text-[#dc8da3] transition-colors">
                      {art.title}
                    </h3>
                    <span className="font-montserrat text-xs font-extrabold text-[#121212] shrink-0">
                      {formatPrice(art.startingPrice)}
                    </span>
                  </div>

                  <p className="font-sans text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {art.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="bg-white text-gray-700 text-[10px] font-montserrat font-bold px-2 py-0.5 border border-[#121212]">
                      {art.medium}
                    </span>
                    <span className="bg-white text-gray-700 text-[10px] font-montserrat font-bold px-2 py-0.5 border border-[#121212]">
                      {art.dimensions}
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-[#f7cbd7]">
                  <Link
                    to={`/artworks/${art.slug}`}
                    className="font-montserrat text-xs font-bold uppercase tracking-wider text-[#121212] hover:underline flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Details
                  </Link>

                  <button
                    onClick={() =>
                      navigate(
                        `/custom-order?category=${art.category?.slug}&artwork=${art.slug}`
                      )
                    }
                    className="bg-[#121212] text-white hover:bg-black font-montserrat text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 border border-[#121212] shadow-[2px_2px_0px_#f7cbd7] flex items-center gap-1.5"
                  >
                    <Paintbrush className="w-3 h-3 text-[#f7cbd7]" />
                    <span>Order Similar</span>
                  </button>
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
