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
  ChevronRight
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
        <div className="h-6 w-32 bg-cream-300 animate-pulse rounded-full" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 h-[500px] bg-cream-300 animate-pulse rounded-3xl" />
          <div className="lg:col-span-5 space-y-4">
            <div className="h-10 bg-cream-300 animate-pulse rounded-full w-3/4" />
            <div className="h-6 bg-cream-300 animate-pulse rounded-full w-1/3" />
            <div className="h-32 bg-cream-300 animate-pulse rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <EmptyState
          title="Artwork Not Found"
          description="The artwork you are looking for does not exist or has been unpublished."
          actionText="Back to Gallery"
          onAction={() => navigate('/gallery')}
        />
      </div>
    );
  }

  const allImages = artwork.images && artwork.images.length > 0
    ? artwork.images
    : [artwork.coverImage];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-20">
      {/* Breadcrumb / Back Link */}
      <Link
        to="/gallery"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-600 hover:text-terracotta-600"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Showcase Gallery
      </Link>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14">
        {/* Left: Gallery & Zoom Lightbox */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-cream-200 border border-cream-200 shadow-lg group">
            <img
              src={allImages[selectedImageIndex]?.url}
              alt={artwork.title}
              className="w-full h-full object-cover cursor-zoom-in"
              onClick={() => setIsLightboxOpen(true)}
            />

            {/* Lightbox Trigger Button */}
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="absolute bottom-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-md text-charcoal-700 hover:text-terracotta-600 hover:bg-white shadow-md transition-all"
              aria-label="Enlarge image"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={handleToggleWishlist}
              className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md shadow-md transition-all ${
                isWishlisted
                  ? 'bg-rose-50 text-rose-500 fill-rose-500'
                  : 'bg-white/90 text-charcoal-600 hover:text-rose-500 hover:bg-white'
              }`}
              aria-label="Save to wishlist"
            >
              <Heart
                className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500' : ''}`}
              />
            </button>
          </div>

          {/* Image Thumbnails Strip */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-terracotta-500 scale-95 shadow-sm'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`${artwork.title} thumb ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Artwork Metadata & Order CTA */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <Link
              to={`/categories/${artwork.category?.slug}`}
              className="inline-block"
            >
              <Badge variant="terracotta">{artwork.category?.name}</Badge>
            </Link>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 leading-tight">
              {artwork.title}
            </h1>

            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-xs uppercase tracking-wider text-charcoal-500 font-semibold">
                Starting Commission Price:
              </span>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-terracotta-600">
                {formatPrice(artwork.startingPrice)}
              </span>
            </div>
          </div>

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-white border border-cream-200">
            <div>
              <p className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-400">
                Medium
              </p>
              <p className="text-xs sm:text-sm font-semibold text-charcoal-800 mt-0.5">
                {artwork.medium}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-400">
                Dimensions
              </p>
              <p className="text-xs sm:text-sm font-semibold text-charcoal-800 mt-0.5">
                {artwork.dimensions}
              </p>
            </div>
            {artwork.timeTaken && (
              <div className="col-span-2 pt-2 border-t border-cream-100 flex items-center gap-2 text-xs text-charcoal-600">
                <Clock className="w-4 h-4 text-terracotta-500" />
                <span>Handcrafted in: {artwork.timeTaken}</span>
              </div>
            )}
          </div>

          {/* Prominent Commission CTA */}
          <div className="space-y-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              className="w-full shadow-md py-3.5 text-base"
              icon={Paintbrush}
              onClick={() =>
                navigate(
                  `/custom-order?category=${artwork.category?.slug}&artwork=${artwork.slug}`
                )
              }
            >
              Order Something Like This
            </Button>
            <p className="text-xs text-center text-charcoal-500 leading-relaxed">
              Clicking above opens our commission builder pre-filled with this style. You will upload your own reference photo.
            </p>
          </div>

          {/* Story & Description */}
          <div className="space-y-3 pt-4 border-t border-cream-200">
            <h3 className="font-serif text-lg font-bold text-charcoal-900">
              The Story Behind This Piece
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed whitespace-pre-line">
              {artwork.description}
            </p>
          </div>

          {/* Tags */}
          {artwork.tags && artwork.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {artwork.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-cream-100 rounded-full text-xs text-charcoal-600 border border-cream-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Guarantees Box */}
          <div className="bg-cream-100/70 rounded-2xl p-4 border border-cream-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-charcoal-800">
              <ShieldCheck className="w-4 h-4 text-terracotta-500" />
              <span>Original Artwork Guarantee</span>
            </div>
            <p className="text-xs text-charcoal-500 leading-relaxed">
              Every custom order is 100% hand-painted by the artist. We share progress photos during creation and use insured archival packaging.
            </p>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal-900/95 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative max-w-5xl max-h-[85vh] flex items-center justify-center">
            <img
              src={allImages[selectedImageIndex]?.url}
              alt={artwork.title}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />

            {allImages.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setSelectedImageIndex((prev) =>
                      prev === 0 ? allImages.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-4 p-2.5 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() =>
                    setSelectedImageIndex((prev) =>
                      prev === allImages.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-4 p-2.5 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Related Artworks Section */}
      {related.length > 0 && (
        <div className="space-y-8 pt-10 border-t border-cream-200">
          <div>
            <span className="eyebrow">MORE IN THIS CATEGORY</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
              Related Showcase Commissions
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((rel) => (
              <div
                key={rel._id}
                className="group bg-white rounded-3xl overflow-hidden border border-cream-200 shadow-card hover:shadow-soft-hover transition-all"
              >
                <div className="aspect-[4/5] overflow-hidden bg-cream-200">
                  <img
                    src={rel.coverImage?.url}
                    alt={rel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="font-serif text-sm font-bold text-charcoal-900 line-clamp-1 group-hover:text-terracotta-600 transition-colors">
                    {rel.title}
                  </h4>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-charcoal-500">{rel.dimensions}</span>
                    <span className="font-bold text-terracotta-600">
                      {formatPrice(rel.startingPrice)}
                    </span>
                  </div>
                  <Link
                    to={`/artworks/${rel.slug}`}
                    className="block text-center text-xs font-semibold py-1.5 bg-cream-100 rounded-full text-charcoal-700 hover:bg-terracotta-50 hover:text-terracotta-600 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtworkDetail;
