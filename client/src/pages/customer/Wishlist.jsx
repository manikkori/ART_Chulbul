import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Paintbrush, Trash2, ArrowRight, Sparkles } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-20 pt-4">
      <div className="border-b border-[#1c1a17]/10 pb-6 pt-2">
        <div className="inline-flex items-center gap-1.5 font-caveat text-3xl text-[#f19b72]">
          <span>Saved Favorites</span>
          <Sparkles className="w-4 h-4 text-[#faa9b0] inline-block" />
        </div>
        <h1 className="font-playfair text-3xl sm:text-4xl text-[#1c1a17]">
          My Art Wishlist
        </h1>
        <p className="font-sans text-xs sm:text-sm text-[#1c1a17]/65 mt-1">
          Artworks and mediums you have pinned for upcoming custom commissions.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <Skeleton count={3} className="h-80 rounded-[2rem] bg-white border border-[#1c1a17]/10" />
        </div>
      ) : wishlist.length === 0 ? (
        <EmptyState
          title="Your wishlist is empty"
          description="Browse our showcase gallery to heart pieces and mediums that inspire your vision."
          actionText="Browse Gallery"
          onAction={() => navigate('/gallery')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlist.map((art) => (
            <div
              key={art._id}
              className="group bg-white rounded-[2rem] border border-[#1c1a17]/10 p-4 shadow-[0_8px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all overflow-hidden flex flex-col"
            >
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#f8f4ea]">
                <img
                  src={art.coverImage?.url || art.images?.[0]?.url || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80'}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={() => handleRemoveFromWishlist(art._id)}
                  className="absolute top-3 right-3 p-2 bg-white/95 rounded-full border border-[#1c1a17]/10 text-rose-500 hover:bg-rose-50 shadow-sm transition-all"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="pt-4 px-1 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-playfair text-base text-[#1c1a17] line-clamp-1 group-hover:text-[#f19b72] transition-colors">
                    {art.title}
                  </h3>
                  <p className="font-sans text-xs text-[#1c1a17]/60 mt-0.5">
                    {art.medium} • {art.dimensions}
                  </p>
                  <p className="font-sans text-sm font-semibold text-[#1c1a17] mt-1.5">
                    Starts at {formatPrice(art.startingPrice)}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-[#1c1a17]/10">
                  <Link
                    to={`/artworks/${art.slug}`}
                    className="font-sans text-xs font-medium text-[#1c1a17]/70 hover:text-[#1c1a17]"
                  >
                    Details
                  </Link>
                  <button
                    onClick={() =>
                      navigate(
                        `/custom-order?category=${art.category?.slug}&artwork=${art.slug}`
                      )
                    }
                    className="bg-[#1c1a17] text-white hover:bg-black font-sans text-xs font-medium px-4 py-1.5 rounded-full ml-auto shadow-2xs hover:shadow transition-all"
                  >
                    Order Similar
                  </button>
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
