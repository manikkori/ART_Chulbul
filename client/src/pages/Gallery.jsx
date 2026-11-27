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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-20 pt-4">
      {/* Header with Jhankoo Playfair & Caveat Script Styling */}
      <div className="text-center max-w-2xl mx-auto space-y-2 pt-2">
        <div className="inline-flex items-center gap-1.5 font-caveat text-3xl sm:text-4xl text-[#f19b72]">
          <span>Handmade Portfolio</span>
          <Sparkles className="w-4 h-4 text-[#faa9b0] inline-block" />
        </div>
        <h1 className="font-playfair text-3xl sm:text-5xl text-[#1c1a17]">
          Original Art Showcase
        </h1>
        <p className="font-sans text-xs sm:text-sm text-[#1c1a17]/70 leading-relaxed">
          Explore handcrafted bespoke paintings created for collectors. Every piece here was made-to-order from personal memories.
        </p>
      </div>

      {/* Search & Filter Bar - Jhankoo Soft Butter Card */}
      <div className="bg-white/80 backdrop-blur-md rounded-[2rem] border border-[#1c1a17]/10 p-5 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-4">
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
                className="absolute right-3 text-[#1c1a17]/40 hover:text-[#1c1a17]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Sort & Filter Toggle */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <div className="flex items-center gap-2">
              <span className="text-xs font-sans font-medium text-[#1c1a17]/70 hidden sm:inline">
                Sort:
              </span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-white/90 border border-[#1c1a17]/15 rounded-full px-4 py-2 text-xs font-sans font-medium text-[#1c1a17] focus:outline-none focus:ring-2 focus:ring-[#faa9b0]/30"
              >
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            <button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="md:hidden bg-[#f8f4ea] border border-[#d4a373]/30 rounded-full px-3.5 py-2 text-xs font-sans font-medium text-[#1c1a17] flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-[#1c1a17]/10">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-1.5 text-xs font-sans font-medium rounded-full whitespace-nowrap transition-all border ${
              selectedCategory === 'all'
                ? 'bg-[#1c1a17] text-white border-[#1c1a17] shadow-sm'
                : 'bg-[#f8f4ea] text-[#1c1a17] border-[#d4a373]/30 hover:bg-[#f2e7d5]'
            }`}
          >
            All Mediums
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-1.5 text-xs font-sans font-medium rounded-full whitespace-nowrap transition-all border ${
                selectedCategory === cat.slug
                  ? 'bg-[#1c1a17] text-white border-[#1c1a17] shadow-sm'
                  : 'bg-[#f8f4ea] text-[#1c1a17] border-[#d4a373]/30 hover:bg-[#f2e7d5]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Expanded Price Filters */}
        {(showFiltersMobile || minPrice || maxPrice) && (
          <div className="pt-3 border-t border-[#1c1a17]/10 flex flex-wrap items-center gap-3">
            <span className="text-xs font-sans font-medium text-[#1c1a17]/80">Price Range (₹):</span>
            <input
              type="number"
              placeholder="Min ₹"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-28 px-3 py-1.5 bg-white border border-[#1c1a17]/15 rounded-xl text-xs font-sans text-[#1c1a17] focus:outline-none focus:ring-2 focus:ring-[#faa9b0]/30"
            />
            <span className="text-[#1c1a17]/40 text-xs">to</span>
            <input
              type="number"
              placeholder="Max ₹"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-28 px-3 py-1.5 bg-white border border-[#1c1a17]/15 rounded-xl text-xs font-sans text-[#1c1a17] focus:outline-none focus:ring-2 focus:ring-[#faa9b0]/30"
            />
            <button
              onClick={() => fetchArtworks(1)}
              className="bg-[#1c1a17] text-white font-sans text-xs font-medium px-4 py-1.5 rounded-full hover:bg-black transition-all shadow-sm"
            >
              Apply
            </button>
            {(search || selectedCategory !== 'all' || minPrice || maxPrice) && (
              <button
                onClick={handleResetFilters}
                className="font-sans text-xs font-medium text-[#1c1a17]/60 hover:text-[#1c1a17] underline ml-2"
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
              className="group bg-white rounded-[2rem] border border-[#1c1a17]/10 p-4 shadow-[0_8px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
            >
              {/* Cover Image - Polaroid Look */}
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#f8f4ea]">
                <img
                  src={art.coverImage?.url || art.images?.[0]?.url || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80'}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                  <span className="bg-white/90 backdrop-blur-sm border border-[#1c1a17]/10 rounded-full font-sans text-[11px] font-medium px-3 py-1 text-[#1c1a17] shadow-xs">
                    {art.category?.name}
                  </span>
                </div>
              </div>

              {/* Info Card */}
              <div className="pt-4 px-1 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-playfair text-lg text-[#1c1a17] line-clamp-1 group-hover:text-[#f19b72] transition-colors">
                      {art.title}
                    </h3>
                    <span className="font-sans font-semibold text-sm text-[#1c1a17] shrink-0">
                      {formatPrice(art.startingPrice)}
                    </span>
                  </div>

                  <p className="font-sans text-xs text-[#1c1a17]/65 line-clamp-2 leading-relaxed">
                    {art.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="bg-[#f8f4ea] text-[#1c1a17]/80 text-[10px] font-sans font-medium px-2.5 py-0.5 rounded-full border border-[#d4a373]/30">
                      {art.medium}
                    </span>
                    <span className="bg-[#f8f4ea] text-[#1c1a17]/80 text-[10px] font-sans font-medium px-2.5 py-0.5 rounded-full border border-[#d4a373]/30">
                      {art.dimensions}
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-[#1c1a17]/10">
                  <Link
                    to={`/artworks/${art.slug}`}
                    className="font-sans text-xs font-medium text-[#1c1a17]/70 hover:text-[#1c1a17] flex items-center gap-1.5 transition-colors"
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
                    className="bg-[#1c1a17] text-white hover:bg-black font-sans text-xs font-medium px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm hover:shadow transition-all"
                  >
                    <Paintbrush className="w-3 h-3 text-[#faa9b0]" />
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
