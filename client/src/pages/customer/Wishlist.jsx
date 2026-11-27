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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-20 pt-4">
      <div className="border-b-2 border-[#121212] pb-6">
        <div className="inline-flex items-center gap-1 font-script text-3xl text-[#121212]">
          <span>Saved Favorites</span>
          <Heart className="w-4 h-4 text-[#dc8da3] fill-[#f7cbd7] inline-block" />
        </div>
        <h1 className="font-montserrat font-extrabold text-2xl sm:text-4xl text-[#121212] uppercase tracking-[0.06em]">
          MY ART WISHLIST
        </h1>
        <p className="font-sans text-xs sm:text-sm text-gray-600 mt-1">
          Artworks and mediums you have pinned for upcoming commissions.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <Skeleton count={3} className="h-80 border-2 border-[#121212]" />
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
              className="group bg-white border-2 border-[#121212] shadow-[4px_4px_0px_#f7cbd7] hover:shadow-[6px_6px_0px_#ebb0c0] hover:-translate-y-1 transition-all overflow-hidden flex flex-col"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#fde8ef]">
                <img
                  src={art.coverImage?.url || art.images?.[0]?.url || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80'}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={() => handleRemoveFromWishlist(art._id)}
                  className="absolute top-3 right-3 p-2 bg-white/95 border border-[#121212] text-rose-600 hover:bg-rose-50 shadow-sm"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 bg-[#fff7f9] border-t-2 border-[#121212] flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-montserrat text-sm font-extrabold uppercase text-[#121212] line-clamp-1">
                    {art.title}
                  </h3>
                  <p className="font-montserrat text-xs text-gray-500 mt-0.5">
                    {art.medium} • {art.dimensions}
                  </p>
                  <p className="font-montserrat text-sm font-extrabold text-[#121212] mt-2">
                    Starts at {formatPrice(art.startingPrice)}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[#f7cbd7]">
                  <Link
                    to={`/artworks/${art.slug}`}
                    className="font-montserrat text-xs font-bold uppercase text-[#121212] hover:underline"
                  >
                    Details
                  </Link>
                  <button
                    onClick={() =>
                      navigate(
                        `/custom-order?category=${art.category?.slug}&artwork=${art.slug}`
                      )
                    }
                    className="bg-[#121212] text-white hover:bg-black font-montserrat text-xs font-bold uppercase tracking-wider px-3 py-1.5 border border-[#121212] shadow-[2px_2px_0px_#f7cbd7] ml-auto"
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
