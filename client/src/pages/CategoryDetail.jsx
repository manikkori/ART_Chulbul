import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Paintbrush, Sparkles } from 'lucide-react';
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
        <div className="h-40 bg-cream-300 animate-pulse rounded-3xl" />
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-16">
      <Link
        to="/categories"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-600 hover:text-terracotta-600"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to all categories
      </Link>

      {/* Category Banner Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-cream-200 shadow-card">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <Badge variant="terracotta">Medium Overview</Badge>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-charcoal-900">
              {category.name}
            </h1>
            <p className="text-sm sm:text-base text-charcoal-600 leading-relaxed max-w-xl">
              {category.description}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
                Starting from {formatPrice(category.startingPrice)}
              </span>
              <Button
                variant="primary"
                icon={Paintbrush}
                onClick={() => navigate(`/custom-order?category=${category.slug}`)}
              >
                Order in this style
              </Button>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border-2 border-white">
              <img
                src={category.image?.url}
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
          <span className="eyebrow">PORTFOLIO EXAMPLES</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
            Past Work in {category.name}
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
                className="group bg-white rounded-3xl overflow-hidden border border-cream-200 shadow-card hover:shadow-soft-hover transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-cream-200">
                  <img
                    src={art.coverImage?.url}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif text-lg font-bold text-charcoal-900 line-clamp-1 group-hover:text-terracotta-600 transition-colors">
                        {art.title}
                      </h3>
                      <span className="text-sm font-bold text-terracotta-600 shrink-0">
                        {formatPrice(art.startingPrice)}
                      </span>
                    </div>

                    <p className="text-xs text-charcoal-500 line-clamp-2 leading-relaxed">
                      {art.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="bg-cream-100 text-charcoal-600 text-[11px] px-2.5 py-0.5 rounded-full border border-cream-200">
                        {art.dimensions}
                      </span>
                      <span className="bg-cream-100 text-charcoal-600 text-[11px] px-2.5 py-0.5 rounded-full border border-cream-200">
                        {art.timeTaken || 'Handcrafted'}
                      </span>
                    </div>
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
                      onClick={() =>
                        navigate(
                          `/custom-order?category=${category.slug}&artwork=${art.slug}`
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
    </div>
  );
};

export default CategoryDetail;
