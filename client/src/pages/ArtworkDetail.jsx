import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Sparkles,
  ShieldCheck,
  Maximize2,
  X,
  Truck,
  Clock,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../hooks/useWishlist';
import { formatPrice } from '../utils/formatters';
import ArtworkCard from '../components/common/ArtworkCard';
import EmptyState from '../components/common/EmptyState';
import api from '../services/api';
import toast from 'react-hot-toast';

export const ArtworkDetail = () => {
  const { slug } = useParams();
  const { setPageTitle } = useSettings();
  const { user, isAuthenticated, refreshUser } = useAuth();
  const { wishlistedIds, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  const [artwork, setArtwork] = useState(null);
  const [related, setRelated] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchArtwork = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/artworks/${slug}`);
        if (res.data?.success) {
          const art = res.data.data.artwork;
          setArtwork(art);
          setRelated(res.data.data.related || []);
          setPageTitle(art.title);
          setSelectedImageIndex(0);
          if (user?.wishlist?.some((id) => (id._id || id) === art._id)) {
            setIsWishlisted(true);
          } else {
            setIsWishlisted(false);
          }
        }
      } catch (err) {
        console.error('Failed to load artwork:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArtwork();
  }, [slug, user, setPageTitle]);

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to save artworks to your wishlist.');
      navigate('/login');
      return;
    }

    try {
      const res = await api.post(`/users/wishlist/${artwork._id}`);
      if (res.data?.success) {
        setIsWishlisted(res.data.isWishlisted);
        toast.success(
          res.data.isWishlisted ? 'Saved to your wishlist' : 'Removed from wishlist'
        );
        refreshUser();
      }
    } catch (err) {
      toast.error('Failed to update wishlist');
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 space-y-6">
        <div className="h-5 w-36 scribble-shimmer rounded-full" />
        <div className="rounded-[28px] bg-white p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 aspect-square scribble-shimmer rounded-[20px]" />
          <div className="lg:col-span-5 space-y-4">
            <div className="h-10 w-3/4 scribble-shimmer rounded-full" />
            <div className="h-7 w-1/3 scribble-shimmer rounded-full" />
            <div className="h-36 scribble-shimmer rounded-[18px]" />
          </div>
        </div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="max-w-[900px] mx-auto px-4 py-16">
        <EmptyState
          title="Artwork not found"
          description="The requested artwork may have been moved or is no longer listed."
          actionText="Browse Gallery"
          onAction={() => navigate('/gallery')}
        />
      </div>
    );
  }

  const allImages = artwork.images?.length
    ? artwork.images
    : artwork.coverImage
    ? [artwork.coverImage]
    : [];

  const currentImgUrl =
    allImages[selectedImageIndex]?.url ||
    allImages[0]?.url ||
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80';

  return (
    <div className="max-w-[1200px] mx-auto px-3 sm:px-6 lg:px-8 pt-6 pb-20 space-y-12">
      {/* Back Breadcrumb */}
      <div>
        <Link
          to="/gallery"
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-[#e2e2e7] text-[12px] font-semibold text-[#111827] hover:border-[#111827] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Gallery</span>
        </Link>
      </div>

      {/* Pure White Product Showcase Container */}
      <div className="rounded-[28px] bg-white border border-[#eae9ee] p-4 sm:p-8 lg:p-10 shadow-[0_8px_36px_rgba(0,0,0,0.04)] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Media Column */}
        <div className="lg:col-span-7 space-y-3.5">
          <div className="relative rounded-[20px] overflow-hidden bg-[#f8f7fb] border border-[#f0eff4] aspect-[4/5] flex items-center justify-center group">
            <img
              src={currentImgUrl}
              alt={artwork.title}
              onClick={() => setIsLightboxOpen(true)}
              className="w-full h-full object-cover cursor-zoom-in transition-transform duration-500 group-hover:scale-[1.02]"
            />

            <button
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              aria-label="Enlarge artwork"
              className="absolute bottom-3.5 right-3.5 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-[#111827] shadow-md flex items-center justify-center hover:scale-105 transition-transform"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {allImages.length > 1 && (
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
              {allImages.map((img, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-18 h-18 sm:w-20 sm:h-20 rounded-[14px] overflow-hidden shrink-0 border-2 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-[#ff0457] ring-2 ring-[#ff0457]/20 scale-[1.03]'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Info Column matching myscribble product details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#ffe5ee] text-[#ff0155] text-[11px] font-bold uppercase tracking-wider">
                {artwork.category?.name || 'Custom Commission'}
              </span>

              <button
                type="button"
                onClick={handleToggleWishlist}
                aria-label="Wishlist artwork"
                className={`w-10 h-10 rounded-full border border-[#eae9ee] bg-[#f8f7fb] flex items-center justify-center transition-all hover:scale-105 ${
                  isWishlisted ? 'heart-pop-active text-[#ff0457] bg-[#ffe5ee]' : 'text-[#6e6e73]'
                }`}
              >
                <Heart
                  className="w-4 h-4"
                  fill={isWishlisted ? '#ff0457' : 'none'}
                  strokeWidth={2.2}
                />
              </button>
            </div>

            <h1 className="editorial-serif text-4xl sm:text-5xl text-[#111827] font-normal leading-[1.03]">
              {artwork.title}
            </h1>

            <div className="flex items-center gap-3 pt-1">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#111827] text-white text-[15px] font-bold">
                Starting at {formatPrice(artwork.startingPrice ?? artwork.price)}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#6e6e73]">
                <Clock className="w-3.5 h-3.5 text-[#ff0457]" />
                {artwork.completionTimeDays || '7–14'} Days
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-[#f0eff4]">
            <h3 className="text-[12px] font-bold uppercase tracking-wider text-[#8e8e93]">
              About This Piece
            </h3>
            <p className="text-[14px] text-[#3c3c43] leading-relaxed">
              {artwork.description}
            </p>
          </div>

          {/* Clean Specifications Card */}
          <div className="rounded-[18px] bg-[#f8f7fb] border border-[#eae9ee] p-4 space-y-2.5 text-[13px]">
            <div className="flex items-center justify-between pb-2 border-b border-[#eae9ee]">
              <span className="text-[#8e8e93] font-medium">Medium</span>
              <span className="font-semibold text-[#111827]">{artwork.medium}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-[#eae9ee]">
              <span className="text-[#8e8e93] font-medium">Dimensions</span>
              <span className="font-semibold text-[#111827]">{artwork.dimensions}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#8e8e93] font-medium">Finish</span>
              <span className="font-semibold text-[#111827]">Signed & Varnished Archival</span>
            </div>
          </div>

          {/* Action CTA */}
          <div className="space-y-2.5 pt-1">
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/custom-order?category=${artwork.category?.slug || ''}&artwork=${artwork.slug || ''}`
                )
              }
              className="w-full py-4 rounded-full bg-[#ff0457] hover:bg-[#d90349] text-white text-[14px] font-bold shadow-[0_10px_28px_rgba(255,4,87,0.3)] transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Commission Similar Artwork</span>
            </button>
            <p className="text-[12px] text-center text-[#8e8e93]">
              Custom canvas sizes, framing options, and multi-subject portraits available.
            </p>
          </div>

          {/* Trust Pills */}
          <div className="pt-3 border-t border-[#f0eff4] grid grid-cols-2 gap-2.5 text-[12px] font-semibold text-[#3c3c43]">
            <div className="flex items-center gap-2 bg-[#f8f7fb] rounded-xl px-3 py-2">
              <ShieldCheck className="w-4 h-4 text-[#ff0457] shrink-0" />
              <span>100% Hand-Painted</span>
            </div>
            <div className="flex items-center gap-2 bg-[#f8f7fb] rounded-xl px-3 py-2">
              <Truck className="w-4 h-4 text-[#ff0457] shrink-0" />
              <span>Insured Crating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Commissions */}
      {related.length > 0 && (
        <div className="space-y-5">
          <div>
            <span className="eyebrow">More Inspirations</span>
            <h2 className="text-[24px] sm:text-[30px] font-bold tracking-[-0.025em] text-[#111827]">
              Similar Commissions
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
            {related.slice(0, 4).map((art, idx) => (
              <ArtworkCard
                key={art._id}
                artwork={art}
                index={idx}
                isWishlisted={wishlistedIds.has(art._id)}
                onToggleWishlist={toggleWishlist}
              />
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Overlay */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close lightbox"
              className="absolute -top-12 right-0 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={currentImgUrl}
              alt={artwork.title}
              className="max-h-[84vh] w-auto object-contain rounded-[18px] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtworkDetail;
