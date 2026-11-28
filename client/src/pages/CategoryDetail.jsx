import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Clock } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useWishlist } from '../hooks/useWishlist';
import { formatPrice } from '../utils/formatters';
import ArtworkCard from '../components/common/ArtworkCard';
import EmptyState from '../components/common/EmptyState';
import { ArtworkCardSkeleton } from '../components/common/Skeleton';
import { STUDIO_ARTWORKS, STUDIO_CATEGORIES } from '../data/studioFallbacks';
import api from '../services/api';

export const CategoryDetail = () => {
  const { slug } = useParams();
  const { setPageTitle } = useSettings();
  const { wishlistedIds, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryDetail = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/categories/${slug}`);
        if (res.data?.success && res.data.data?.category) {
          setCategory(res.data.data.category);
          setArtworks(res.data.data.artworks || []);
          setPageTitle(res.data.data.category?.name || 'Medium');
        } else {
          const fallbackCat = STUDIO_CATEGORIES.find((c) => c.slug === slug);
          if (fallbackCat) {
            setCategory(fallbackCat);
            setArtworks(STUDIO_ARTWORKS.filter((a) => a.category?.slug === slug));
            setPageTitle(fallbackCat.name);
          }
        }
      } catch (err) {
        const fallbackCat = STUDIO_CATEGORIES.find((c) => c.slug === slug);
        if (fallbackCat) {
          setCategory(fallbackCat);
          setArtworks(STUDIO_ARTWORKS.filter((a) => a.category?.slug === slug));
          setPageTitle(fallbackCat.name);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryDetail();
  }, [slug, setPageTitle]);

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-3 sm:px-6 lg:px-8 pt-6 pb-20 space-y-6">
        <div className="h-44 scribble-shimmer rounded-[24px]" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ArtworkCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-[900px] mx-auto px-4 py-16">
        <EmptyState
          title="Medium not found"
          description="The requested art medium does not exist or may have been moved."
          actionText="All Mediums"
          onAction={() => navigate('/categories')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-3 sm:px-6 lg:px-8 pt-6 pb-20 space-y-10">
      <div>
        <Link
          to="/categories"
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-[#e2e2e7] text-[12px] font-semibold text-[#111827] hover:border-[#111827] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Art Mediums</span>
        </Link>
      </div>

      {/* Category Feature Hero Card */}
      <div className="rounded-[28px] bg-white border border-[#eae9ee] p-6 sm:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.03)] grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-7 space-y-4">
          <span className="eyebrow">Signature Medium</span>
          <h1 className="editorial-serif text-4xl sm:text-6xl text-[#111827] font-normal leading-none">
            {category.name}
          </h1>
          <p className="text-[14px] text-[#3c3c43] leading-relaxed">
            {category.description}
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            {category.startingPrice && (
              <span className="px-4 py-1.5 rounded-full bg-[#111827] text-white text-[13px] font-bold">
                Starting from {formatPrice(category.startingPrice)}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f2f1f6] text-[#3c3c43] text-[12px] font-semibold">
              <Clock className="w-3.5 h-3.5 text-[#ff0457]" />
              {category.deliveryDays || '7–14 business days'}
            </span>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => navigate(`/custom-order?category=${category.slug}`)}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#ff0457] hover:bg-[#d90349] text-white text-[13px] font-bold shadow-[0_8px_22px_rgba(255,4,87,0.28)] transition-all hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Commission in {category.name}</span>
            </button>
          </div>
        </div>

        <div className="md:col-span-5">
          <div className="aspect-[4/3] rounded-[20px] overflow-hidden bg-[#f8f7fb] border border-[#eae9ee]">
            <img
              src={
                category.image?.url ||
                'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80'
              }
              alt={category.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Artworks Showcase in Category */}
      <div className="space-y-5">
        <div>
          <span className="eyebrow">Portfolio Examples</span>
          <h2 className="text-[24px] sm:text-[30px] font-bold tracking-[-0.025em] text-[#111827]">
            Past Commissions in {category.name}
          </h2>
        </div>

        {artworks.length === 0 ? (
          <EmptyState
            title="No showcase pieces uploaded yet"
            description="You can still commission an original custom artwork directly in this medium!"
            actionText="Start Commission"
            onAction={() => navigate(`/custom-order?category=${category.slug}`)}
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
      </div>
    </div>
  );
};

export default CategoryDetail;
