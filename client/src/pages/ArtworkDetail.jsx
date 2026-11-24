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
        <div className="h-6 w-32 bg-[#fde8ef] animate-pulse rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 h-[500px] bg-[#fde8ef] animate-pulse border-2 border-[#121212]" />
          <div className="lg:col-span-5 space-y-4">
            <div className="h-10 bg-[#fde8ef] animate-pulse w-3/4 border-2 border-[#121212]" />
            <div className="h-6 bg-[#fde8ef] animate-pulse w-1/3" />
            <div className="h-32 bg-[#fde8ef] animate-pulse" />
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
          className="inline-flex items-center gap-1.5 font-montserrat text-xs font-bold uppercase tracking-wider text-gray-700 hover:text-[#121212] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Showcase Gallery
        </Link>
      </div>

      {/* Main Artwork Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: Image Gallery & Lightbox Trigger */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative border-2 border-[#121212] bg-[#fff7f9] shadow-[6px_6px_0px_#f7cbd7] overflow-hidden group aspect-[4/5] flex items-center justify-center">
            <img
              src={currentImgUrl}
              alt={artwork.title}
              className="w-full h-full object-cover cursor-zoom-in"
              onClick={() => setIsLightboxOpen(true)}
            />

            {/* Zoom Action Button */}
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="absolute bottom-4 right-4 bg-white/95 text-[#121212] p-2.5 border-2 border-[#121212] shadow-md hover:scale-105 transition-transform"
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
                  className={`w-20 h-20 shrink-0 border-2 transition-all overflow-hidden ${
                    selectedImageIndex === idx
                      ? 'border-[#121212] shadow-[3px_3px_0px_#f7cbd7] scale-105'
                      : 'border-gray-200 opacity-70 hover:opacity-100'
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
              <span className="font-montserrat text-xs font-bold uppercase tracking-widest text-gray-500 bg-[#fde8ef] px-3 py-1 border border-[#121212]">
                {artwork.category?.name || 'Custom Commission'}
              </span>
              <button
                onClick={handleToggleWishlist}
                className="p-2 border-2 border-[#121212] bg-white shadow-[2px_2px_0px_#f7cbd7] hover:bg-[#fff7f9] transition-all"
                aria-label="Wishlist artwork"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isWishlisted ? 'fill-[#dc8da3] text-[#dc8da3]' : 'text-[#121212]'
                  }`}
                />
              </button>
            </div>

            <h1 className="font-montserrat font-extrabold text-2xl sm:text-4xl text-[#121212] uppercase tracking-[0.06em] leading-tight">
              {artwork.title}
            </h1>

            <div className="inline-block bg-[#121212] text-white px-4 py-1.5 font-montserrat text-base sm:text-lg font-extrabold shadow-[3px_3px_0px_#f7cbd7]">
              Starting at {formatPrice(artwork.startingPrice)}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2 pt-2 border-t border-[#f7cbd7]">
            <h3 className="font-montserrat font-bold text-xs uppercase tracking-wider text-[#121212]">
              About This Piece
            </h3>
            <p className="font-sans text-xs sm:text-sm text-gray-700 leading-relaxed">
              {artwork.description}
            </p>
          </div>

          {/* Specifications Box */}
          <div className="bg-[#fff7f9] border-2 border-[#121212] p-4 shadow-[3px_3px_0px_#f7cbd7] space-y-2 font-montserrat text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#f7cbd7]">
              <span className="text-gray-500 font-bold uppercase">Medium</span>
              <span className="text-[#121212] font-bold">{artwork.medium}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-[#f7cbd7]">
              <span className="text-gray-500 font-bold uppercase">Dimensions</span>
              <span className="text-[#121212] font-bold">{artwork.dimensions}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-bold uppercase">Creation Timeline</span>
              <span className="text-[#121212] font-bold">{artwork.completionTimeDays || 7-14} Business Days</span>
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
              className="w-full bg-[#121212] text-white hover:bg-black font-montserrat text-xs sm:text-sm font-bold uppercase tracking-[0.18em] py-4 border-2 border-[#121212] shadow-[4px_4px_0px_#f7cbd7] hover:shadow-[6px_6px_0px_#ebb0c0] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
            >
              <Paintbrush className="w-4 h-4 text-[#f7cbd7]" />
              <span>COMMISSION SIMILAR ARTWORK</span>
            </button>
            <p className="font-sans text-[11px] text-center text-gray-500">
              Personalized size, framing, and custom color palettes available on request.
            </p>
          </div>

          {/* Value Badges */}
          <div className="pt-4 border-t border-[#f7cbd7] grid grid-cols-2 gap-3 text-xs font-montserrat">
            <div className="flex items-center gap-2 text-gray-700">
              <ShieldCheck className="w-4 h-4 text-[#121212] shrink-0" />
              <span className="font-bold">100% Hand-Painted</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Truck className="w-4 h-4 text-[#121212] shrink-0" />
              <span className="font-bold">Insured Crated Shipping</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Artworks */}
      {related.length > 0 && (
        <div className="space-y-6 pt-10 border-t-2 border-[#121212]">
          <div className="space-y-1">
            <span className="font-script text-3xl text-[#121212] block">More Inspirations</span>
            <h2 className="font-montserrat font-extrabold text-2xl uppercase tracking-[0.08em] text-[#121212]">
              SIMILAR COMMISSIONS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.slice(0, 3).map((art) => (
              <div
                key={art._id}
                onClick={() => navigate(`/artworks/${art.slug}`)}
                className="cursor-pointer group bg-white border-2 border-[#121212] shadow-[4px_4px_0px_#f7cbd7] hover:shadow-[6px_6px_0px_#ebb0c0] hover:-translate-y-1 transition-all overflow-hidden flex flex-col"
              >
                <div className="aspect-[4/3] overflow-hidden bg-[#fde8ef]">
                  <img
                    src={art.coverImage?.url || art.images?.[0]?.url}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 bg-[#fff7f9] border-t-2 border-[#121212] flex items-center justify-between">
                  <div>
                    <h4 className="font-montserrat font-bold text-xs uppercase text-[#121212] line-clamp-1">
                      {art.title}
                    </h4>
                    <span className="text-[10px] text-gray-500 font-montserrat">{art.medium}</span>
                  </div>
                  <span className="font-montserrat text-xs font-bold text-[#121212]">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute -top-10 right-0 text-white hover:text-[#f7cbd7] p-2"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={currentImgUrl}
              alt={artwork.title}
              className="max-h-[85vh] w-auto object-contain border-2 border-white shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtworkDetail;
