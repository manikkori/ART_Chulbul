import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Paintbrush,
  Clock,
  Maximize2,
  Sparkles,
  ShieldCheck,
  Package,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle2,
  Truck
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatters';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Skeleton from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import api from '../services/api';
import toast from 'react-hot-toast';

export const ArtworkDetail = () => {
  const { slug } = useParams();
  const { setPageTitle } = useSettings();
  const { user, isAuthenticated, refreshUser } = useAuth();
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
      toast.error('Please log in to add artworks to your wishlist.');
      navigate('/login');
      return;
    }

    try {
      const res = await api.post(`/users/wishlist/${artwork._id}`);
      if (res.data?.success) {
        setIsWishlisted(res.data.isWishlisted);
        toast.success(
          res.data.isWishlisted
            ? 'Added to your wishlist'
            : 'Removed from your wishlist'
        );
        refreshUser();
      }
    } catch (err) {
      toast.error('Failed to update wishlist');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="h-6 w-32 bg-[#f8f4ea] animate-pulse rounded-full" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 h-[500px] bg-[#f8f4ea] animate-pulse rounded-[2.5rem]" />
          <div className="lg:col-span-5 space-y-4">
            <div className="h-10 bg-[#f8f4ea] animate-pulse w-3/4 rounded-2xl" />
            <div className="h-6 bg-[#f8f4ea] animate-pulse w-1/3 rounded-full" />
            <div className="h-32 bg-[#f8f4ea] animate-pulse rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
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

  const currentImgUrl = allImages[selectedImageIndex]?.url || allImages[0]?.url || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-20 pt-4">
      {/* Back Button */}
      <div>
        <Link
          to="/gallery"
          className="inline-flex items-center gap-1.5 font-sans text-xs font-medium text-[#1c1a17]/70 hover:text-[#1c1a17] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Showcase Gallery
        </Link>
      </div>

      {/* Main Artwork Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: Image Gallery & Lightbox Trigger */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-[2.5rem] border border-[#1c1a17]/10 bg-white p-4 shadow-[0_12px_40px_rgba(0,0,0,0.04)] overflow-hidden group">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#f8f4ea] flex items-center justify-center">
              <img
                src={currentImgUrl}
                alt={artwork.title}
                className="w-full h-full object-cover cursor-zoom-in group-hover:scale-[1.02] transition-transform duration-500"
                onClick={() => setIsLightboxOpen(true)}
              />
            </div>

            {/* Zoom Action Button */}
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="absolute bottom-7 right-7 bg-white/95 text-[#1c1a17] p-2.5 rounded-full border border-[#1c1a17]/10 shadow-md hover:scale-110 transition-transform"
              aria-label="Enlarge artwork"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Thumbnail Strip */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 shrink-0 rounded-2xl transition-all overflow-hidden border ${
                    selectedImageIndex === idx
                      ? 'border-[#1c1a17] ring-2 ring-[#faa9b0] scale-105 shadow-sm'
                      : 'border-[#1c1a17]/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Artwork Details & Commission CTA */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs font-medium text-[#1c1a17] bg-[#f8f4ea] px-3.5 py-1 rounded-full border border-[#d4a373]/30">
                {artwork.category?.name || 'Custom Commission'}
              </span>
              <button
                onClick={handleToggleWishlist}
                className="p-2.5 rounded-full border border-[#1c1a17]/10 bg-white shadow-xs hover:bg-[#f8f4ea] transition-all"
                aria-label="Wishlist artwork"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isWishlisted ? 'fill-[#faa9b0] text-[#f19b72]' : 'text-[#1c1a17]'
                  }`}
                />
              </button>
            </div>

            <h1 className="font-playfair text-3xl sm:text-4xl text-[#1c1a17] leading-tight">
              {artwork.title}
            </h1>

            <div className="inline-block bg-[#1c1a17] text-white px-5 py-2 rounded-full font-sans text-base sm:text-lg font-semibold shadow-sm">
              Starting at {formatPrice(artwork.startingPrice)}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2 pt-2 border-t border-[#1c1a17]/10">
            <h3 className="font-sans font-semibold text-xs tracking-wider uppercase text-[#1c1a17]/70">
              About This Piece
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#1c1a17]/75 leading-relaxed">
              {artwork.description}
            </p>
          </div>

          {/* Specifications Box */}
          <div className="bg-white/80 rounded-2xl border border-[#1c1a17]/10 p-5 shadow-xs space-y-2.5 font-sans text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#1c1a17]/10">
              <span className="text-[#1c1a17]/60 font-medium">Medium</span>
              <span className="text-[#1c1a17] font-semibold">{artwork.medium}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-[#1c1a17]/10">
              <span className="text-[#1c1a17]/60 font-medium">Dimensions</span>
              <span className="text-[#1c1a17] font-semibold">{artwork.dimensions}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#1c1a17]/60 font-medium">Creation Timeline</span>
              <span className="text-[#1c1a17] font-semibold">{artwork.completionTimeDays || '7-14'} Business Days</span>
            </div>
          </div>

          {/* Commission CTA Button */}
          <div className="pt-2 space-y-3">
            <button
              onClick={() =>
                navigate(
                  `/custom-order?category=${artwork.category?.slug}&artwork=${artwork.slug}`
                )
              }
              className="w-full bg-[#faa9b0] text-[#1c1a17] hover:bg-[#f697a0] font-sans text-sm font-semibold py-4 px-6 rounded-full shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Paintbrush className="w-4 h-4 text-[#1c1a17]" />
              <span>Commission Similar Artwork</span>
            </button>
            <p className="font-sans text-[11px] text-center text-[#1c1a17]/60">
              Personalized size, framing, and custom color palettes available on request.
            </p>
          </div>

          {/* Value Badges */}
          <div className="pt-4 border-t border-[#1c1a17]/10 grid grid-cols-2 gap-3 text-xs font-sans">
            <div className="flex items-center gap-2 text-[#1c1a17]/80">
              <ShieldCheck className="w-4 h-4 text-[#d4a373] shrink-0" />
              <span className="font-medium">100% Hand-Painted</span>
            </div>
            <div className="flex items-center gap-2 text-[#1c1a17]/80">
              <Truck className="w-4 h-4 text-[#d4a373] shrink-0" />
              <span className="font-medium">Insured Crated Shipping</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Artworks */}
      {related.length > 0 && (
        <div className="space-y-6 pt-10 border-t border-[#1c1a17]/10">
          <div className="space-y-1">
            <span className="font-caveat text-3xl text-[#f19b72] block">More Inspirations ✦</span>
            <h2 className="font-playfair text-2xl sm:text-3xl text-[#1c1a17]">
              Similar Commissions
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.slice(0, 3).map((art) => (
              <div
                key={art._id}
                onClick={() => navigate(`/artworks/${art.slug}`)}
                className="cursor-pointer group bg-white rounded-[2rem] border border-[#1c1a17]/10 p-4 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all overflow-hidden flex flex-col"
              >
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#f8f4ea]">
                  <img
                    src={art.coverImage?.url || art.images?.[0]?.url}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="pt-4 px-1 flex items-center justify-between">
                  <div>
                    <h4 className="font-playfair text-sm text-[#1c1a17] line-clamp-1 group-hover:text-[#f19b72] transition-colors">
                      {art.title}
                    </h4>
                    <span className="text-[11px] text-[#1c1a17]/60 font-sans">{art.medium}</span>
                  </div>
                  <span className="font-sans text-xs font-semibold text-[#1c1a17]">
                    {formatPrice(art.startingPrice)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute -top-10 right-0 text-white hover:text-[#faa9b0] p-2"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={currentImgUrl}
              alt={artwork.title}
              className="max-h-[85vh] w-auto object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtworkDetail;
