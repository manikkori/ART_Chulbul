import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Paintbrush, Trash2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { formatPrice } from '../../utils/formatters';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import Skeleton from '../../components/common/Skeleton';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const Wishlist = () => {
  const { setPageTitle } = useSettings();
  const { isAuthenticated, loading: authLoading, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPageTitle('My Wishlist');
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchWishlist();
  }, [isAuthenticated, authLoading, setPageTitle]);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users/wishlist');
      if (res.data?.success) {
        setWishlist(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (artworkId) => {
    try {
      const res = await api.post(`/users/wishlist/${artworkId}`);
      if (res.data?.success) {
        toast.success('Removed from wishlist');
        setWishlist((prev) => prev.filter((item) => item._id !== artworkId));
        refreshUser();
      }
    } catch (err) {
      toast.error('Failed to update wishlist');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-20">
      <div className="space-y-1">
        <span className="eyebrow">SAVED INSPIRATION</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
          My Saved Showcase Artworks
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-500">
          Artworks you've saved for inspiration. Click any piece to commission something similar.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <Skeleton count={3} className="h-80" />
        </div>
      ) : wishlist.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Browse our showcase gallery and tap the heart icon on any artwork to save it here."
          actionText="Explore Gallery"
          onAction={() => navigate('/gallery')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlist.map((art) => (
            <div
              key={art._id}
              className="group bg-white rounded-3xl overflow-hidden border border-cream-200 shadow-card hover:shadow-soft-hover transition-all flex flex-col"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-cream-200">
                <img
                  src={art.coverImage?.url}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={() => handleRemoveFromWishlist(art._id)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/90 text-rose-500 hover:bg-white shadow-sm transition-all"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif text-lg font-bold text-charcoal-900 line-clamp-1">
                      {art.title}
                    </h3>
                    <span className="text-sm font-bold text-terracotta-600 shrink-0">
                      {formatPrice(art.startingPrice)}
                    </span>
                  </div>

                  <p className="text-xs text-charcoal-500">
                    {art.medium} • {art.dimensions}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-cream-100">
                  <Link
                    to={`/artworks/${art.slug}`}
                    className="text-xs font-semibold text-charcoal-600 hover:text-terracotta-600"
                  >
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
    </div>
  );
};

export default Wishlist;
