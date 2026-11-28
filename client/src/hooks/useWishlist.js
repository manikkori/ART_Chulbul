import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

/**
 * Reusable wishlist state & toggle hook for artwork cards and detail views.
 */
export const useWishlist = () => {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const navigate = useNavigate();

  const wishlistedIds = useMemo(() => {
    const ids = (user?.wishlist || []).map((item) => item?._id || item);
    return new Set(ids.filter(Boolean));
  }, [user?.wishlist]);

  const toggleWishlist = async (artwork, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!isAuthenticated) {
      toast.error('Please sign in to save artworks to your wishlist.');
      navigate('/login');
      return;
    }

    const artworkId = artwork?._id;
    if (!artworkId || String(artworkId).startsWith('pick-')) {
      toast('Sign in & save artworks from the full live studio collection.');
      return;
    }

    try {
      const res = await api.post(`/users/wishlist/${artworkId}`);
      if (res.data?.success) {
        toast.success(
          res.data.isWishlisted ? 'Saved to your wishlist' : 'Removed from wishlist'
        );
        await refreshUser();
      }
    } catch (err) {
      toast.error('Unable to update wishlist right now');
    }
  };

  return { wishlistedIds, toggleWishlist };
};

export default useWishlist;
