import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

const SAFE_FALLBACK_IMG =
  'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80';

const MEDIUM_SWATCHES = {
  charcoal: ['#1f2937', '#9ca3af'],
  watercolor: ['#60a5fa', '#f472b6', '#fbbf24'],
  oil: ['#991b1b', '#d97706', '#1e3a8a'],
  acrylic: ['#ff0457', '#38bdf8', '#a855f7'],
  graphite: ['#111827', '#d1d5db'],
  default: ['#111827', '#ff0457', '#d4d4d8'],
};

const getSwatchesForArtwork = (artwork) => {
  const mediumStr = (artwork?.medium || artwork?.category?.name || '').toLowerCase();
  if (mediumStr.includes('charcoal')) return MEDIUM_SWATCHES.charcoal;
  if (mediumStr.includes('water')) return MEDIUM_SWATCHES.watercolor;
  if (mediumStr.includes('oil')) return MEDIUM_SWATCHES.oil;
  if (mediumStr.includes('acrylic')) return MEDIUM_SWATCHES.acrylic;
  if (mediumStr.includes('graphite')) return MEDIUM_SWATCHES.graphite;
  return MEDIUM_SWATCHES.default;
};

/**
 * myscribble.in-styled Artwork Product Card.
 * Features square 1:1 media with hover secondary-image wipe,
 * top-left heart wishlist button, top-right expandable Magic Customize pill,
 * and crisp single-row title + INR price footer.
 */
export const ArtworkCard = ({
  artwork,
  isWishlisted = false,
  onToggleWishlist,
  showCustomizable = true,
  index = 0,
  className = '',
}) => {
  const [hovered, setHovered] = useState(false);
  const [localSaved, setLocalSaved] = useState(isWishlisted);
  const [imgError, setImgError] = useState(false);

  const primaryImg =
    (!imgError &&
      (artwork?.coverImage?.url ||
        artwork?.images?.[0]?.url ||
        artwork?.image)) ||
    SAFE_FALLBACK_IMG;
  const secondaryImg =
    artwork?.images?.find(
      (img) =>
        img?.url &&
        img.url !== (artwork?.coverImage?.url || artwork?.images?.[0]?.url)
    )?.url || null;

  const slugOrId = artwork?.slug || artwork?._id;
  const detailPath = `/artworks/${slugOrId}`;
  const customOrderPath = `/custom-order?artwork=${encodeURIComponent(
    artwork?.title || ''
  )}&ref=${encodeURIComponent(slugOrId || '')}`;

  const activeWishlisted =
    typeof isWishlisted === 'boolean' && onToggleWishlist
      ? isWishlisted
      : localSaved;
  const swatches = getSwatchesForArtwork(artwork);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(artwork, e);
    } else {
      setLocalSaved((prev) => !prev);
    }
  };

  return (
    <div
      className={`scribble-card-reveal group relative flex flex-col bg-white rounded-[12px] overflow-hidden border border-[#eae9ee] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] ${className}`}
      style={{ animationDelay: `${Math.min(index * 45, 360)}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Square 1:1 Image Stage */}
      <Link
        to={detailPath}
        className="relative block aspect-square w-full overflow-hidden bg-[#f8f7fb]"
      >
        <img
          src={primaryImg}
          alt={artwork?.title || 'Original Artwork'}
          loading="lazy"
          onError={() => {
            if (!imgError) setImgError(true);
          }}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
            hovered && !secondaryImg ? 'scale-[1.06]' : 'scale-100'
          }`}
        />

        {/* Secondary image wipe on desktop hover */}
        {secondaryImg && (
          <img
            src={secondaryImg}
            alt={`${artwork?.title || 'Artwork'} alternate view`}
            loading="lazy"
            className={`hidden md:block absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              hovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Top Progress Hairline Indicator on Hover */}
        <div
          className={`hidden md:block absolute top-0 left-0 right-0 h-[3px] bg-black/5 z-10 transition-opacity duration-200 ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="h-full bg-[#ff0457] transition-all duration-700 ease-out"
            style={{ width: hovered ? '100%' : '0%' }}
          />
        </div>

        {/* Top-Left Wishlist Heart Button */}
        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label={activeWishlisted ? 'Remove from saved' : 'Save artwork'}
          className={`absolute top-2.5 left-2.5 z-20 w-[31px] h-[31px] rounded-full bg-white/95 backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex items-center justify-center transition-transform duration-200 hover:scale-110 ${
            activeWishlisted
              ? 'heart-pop-active text-[#ff0457]'
              : 'text-[#8e8e93] hover:text-[#ff0457]'
          }`}
        >
          <Heart
            className="w-3.5 h-3.5"
            fill={activeWishlisted ? '#ff0457' : 'none'}
            strokeWidth={2.2}
          />
        </button>

        {/* Top-Right Expandable Magic Wand "Customize" Pill Badge */}
        {showCustomizable && (
          <Link
            to={customOrderPath}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Customize ${artwork?.title || 'artwork'}`}
            className="customizable-pill-badge absolute top-2.5 right-2.5 z-20 shadow-[0_2px_8px_rgba(255,4,87,0.14)]"
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" strokeWidth={2.2} />
            <span className="badge-label">Customize</span>
          </Link>
        )}
      </Link>

      {/* Info Footer matching ProductCard_infoFooter */}
      <Link
        to={detailPath}
        className="flex flex-col gap-1 px-3 py-2.5 sm:px-3.5 sm:py-3 bg-white md:bg-[#f3f3f3]/65 transition-colors group-hover:bg-white"
      >
        <div className="flex items-baseline justify-between gap-2 min-w-0">
          <h3 className="text-[13px] sm:text-[14px] font-bold tracking-[-0.02em] text-[#111827] truncate">
            {artwork?.title}
          </h3>
          <span className="text-[12px] sm:text-[14px] font-bold tracking-[-0.02em] text-[#111827] shrink-0">
            {formatPrice(artwork?.startingPrice ?? artwork?.price)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 min-w-0">
          <span className="text-[11px] sm:text-[12px] font-medium text-[#8e8e93] truncate">
            {artwork?.medium || artwork?.category?.name || 'Handcrafted Original'}
          </span>
          <div className="flex items-center gap-1 shrink-0" aria-hidden="true">
            {swatches.map((color, idx) => (
              <span
                key={idx}
                className="w-2.5 h-2.5 rounded-full border border-black/15"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ArtworkCard;
