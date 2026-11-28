import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import ArtworkCard from '../../components/common/ArtworkCard';
import EmptyState from '../../components/common/EmptyState';
import { ArtworkCardSkeleton } from '../../components/common/Skeleton';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const Wishlist = () => {
  const { setPageTitle } = useSettings();
  const { isAuthenticated, loading: authLoading, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPageTitle('Saved Artworks');
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated, authLoading, setPageTitle]);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users/wishlist');
      if (res.data?.success) {
        setWishlist(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWishlist = async (artwork) => {
    try {
      const res = await api.post(`/users/wishlist/${artwork._id}`);
      if (res.data?.success) {
        toast.success('Removed from wishlist');
        setWishlist((prev) => prev.filter((item) => item._id !== artwork._id));
        refreshUser();
      }
    } catch (err) {
      toast.error('Failed to update wishlist');
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-3 sm:px-6 lg:px-8 pt-6 pb-20 space-y-8">
      <div className="space-y-1.5">
        <span className="eyebrow">Saved Favorites</span>
        <h1 className="editorial-serif text-4xl sm:text-5xl text-[#111827] font-normal">
          My Art Wishlist
        </h1>
        <p className="text-[13px] sm:text-[14px] text-[#6e6e73]">
          Artworks and styles you have pinned for future custom commissions.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ArtworkCardSkeleton key={i} />
          ))}
        </div>
      ) : wishlist.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Explore our showcase gallery and tap the heart on paintings that inspire you."
          actionText="Browse Gallery"
          onAction={() => navigate('/gallery')}
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
          {wishlist.map((art, idx) => (
            <ArtworkCard
              key={art._id}
              artwork={art}
              index={idx}
              isWishlisted={true}
              onToggleWishlist={handleToggleWishlist}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
