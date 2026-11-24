import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Paintbrush, Sparkles, Heart } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { formatPrice } from '../utils/formatters';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import { ArtworkCardSkeleton } from '../components/common/Skeleton';
import api from '../services/api';

export const CategoryDetail = () => {
  const { slug } = useParams();
  const { setPageTitle } = useSettings();
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/categories/${slug}`);
        if (res.data?.success) {
          setCategory(res.data.data.category);
          setArtworks(res.data.data.artworks);
          setPageTitle(res.data.data.category.name);
        }
      } catch (err) {
        console.error('Failed to load category:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryData();
  }, [slug, setPageTitle]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="h-40 bg-[#fde8ef] animate-pulse border-2 border-[#121212]" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <ArtworkCardSkeleton />
          <ArtworkCardSkeleton />
          <ArtworkCardSkeleton />
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <EmptyState
          title="Category Not Found"
          description="The requested art category does not exist or has been archived."
          actionText="Back to Categories"
          onAction={() => navigate('/categories')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-16 pt-4">
      <Link
        to="/categories"
        className="inline-flex items-center gap-1.5 font-montserrat text-xs font-bold uppercase tracking-wider text-gray-700 hover:text-[#121212]"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to all categories
      </Link>

      {/* Category Banner Card - Blush & Black */}
      <div className="bg-[#fff7f9] border-2 border-[#121212] p-8 sm:p-12 shadow-[6px_6px_0px_#f7cbd7]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <span className="bg-[#fde8ef] border border-[#121212] font-montserrat text-[10px] font-bold uppercase tracking-widest px-3 py-1 text-[#121212]">
              Medium Overview
            </span>
            <h1 className="font-montserrat font-extrabold text-3xl sm:text-5xl text-[#121212] uppercase tracking-[0.06em]">
              {category.name}
            </h1>
            <p className="font-sans text-xs sm:text-sm text-gray-700 leading-relaxed max-w-xl">
              {category.description}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <span className="font-montserrat text-xs font-extrabold uppercase tracking-wider text-[#121212] bg-white border border-[#121212] px-3 py-1.5 shadow-[2px_2px_0px_#f7cbd7]">
                Starting from {formatPrice(category.startingPrice)}
              </span>
              <button
                onClick={() => navigate(`/custom-order?category=${category.slug}`)}
                className="bg-[#121212] text-white hover:bg-black font-montserrat text-xs font-bold uppercase tracking-wider px-6 py-2.5 border-2 border-[#121212] shadow-[3px_3px_0px_#f7cbd7] flex items-center gap-2"
              >
                <Paintbrush className="w-3.5 h-3.5 text-[#f7cbd7]" />
                <span>Order in this style</span>
              </button>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="aspect-[4/3] border-2 border-[#121212] shadow-[4px_4px_0px_#f7cbd7] overflow-hidden bg-white">
              <img
                src={category.image?.url || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80'}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Artworks Showcase in this category */}
      <div className="space-y-6">
        <div>
          <span className="font-script text-3xl text-[#121212] block">Portfolio Examples</span>
          <h2 className="font-montserrat font-extrabold text-2xl sm:text-3xl uppercase tracking-[0.08em] text-[#121212]">
            PAST COMMISSIONS IN {category.name}
          </h2>
        </div>

        {artworks.length === 0 ? (
          <EmptyState
            title="No showcase pieces uploaded yet"
            description="Our artist is constantly creating new commissions. You can still commission an artwork in this style!"
            actionText="Start Commission"
            onAction={() => navigate(`/custom-order?category=${category.slug}`)}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {artworks.map((art) => (
              <div
                key={art._id}
                className="group bg-white border-2 border-[#121212] shadow-[4px_4px_0px_#f7cbd7] hover:shadow-[6px_6px_0px_#ebb0c0] hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#fde8ef]">
                  <img
                    src={art.coverImage?.url || art.images?.[0]?.url || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80'}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-5 bg-[#fff7f9] border-t-2 border-[#121212] flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-montserrat text-base font-extrabold text-[#121212] line-clamp-1 group-hover:text-[#dc8da3] transition-colors">
                        {art.title}
                      </h3>
                      <span className="font-montserrat text-xs font-extrabold text-[#121212] shrink-0">
                        {formatPrice(art.startingPrice)}
                      </span>
                    </div>

                    <p className="font-sans text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {art.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="bg-white text-gray-700 text-[10px] font-montserrat font-bold px-2 py-0.5 border border-[#121212]">
                        {art.dimensions}
                      </span>
                      <span className="bg-white text-gray-700 text-[10px] font-montserrat font-bold px-2 py-0.5 border border-[#121212]">
                        {art.timeTaken || 'Handcrafted'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#f7cbd7]">
                    <Link
                      to={`/artworks/${art.slug}`}
                      className="font-montserrat text-xs font-bold uppercase tracking-wider text-[#121212] hover:underline"
                    >
                      View Details
                    </Link>

                    <button
                      onClick={() =>
                        navigate(
                          `/custom-order?category=${category.slug}&artwork=${art.slug}`
                        )
                      }
                      className="bg-[#121212] text-white hover:bg-black font-montserrat text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 border border-[#121212] shadow-[2px_2px_0px_#f7cbd7]"
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
    </div>
  );
};

export default CategoryDetail;
