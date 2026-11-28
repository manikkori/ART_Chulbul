import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Layers, Clock, Sparkles } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { formatPrice } from '../utils/formatters';
import { Skeleton } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import api from '../services/api';

export const Categories = () => {
  const { setPageTitle } = useSettings();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPageTitle('Art Mediums');
    const loadCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data?.success) {
          setCategories(res.data.data || []);
        }
      } catch (err) {
        console.error('Categories fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, [setPageTitle]);

  return (
    <div className="max-w-[1200px] mx-auto px-3 sm:px-6 lg:px-8 pt-6 pb-20 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="eyebrow">Signature Surfaces & Styles</span>
        <h1 className="editorial-serif text-4xl sm:text-6xl text-[#111827] font-normal leading-none">
          Explore Our Art Mediums
        </h1>
        <p className="text-[13px] sm:text-[14px] text-[#6e6e73] leading-relaxed">
          From expressive dry charcoal portraits to museum-grade oils, discover the surface that speaks to your story.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          <Skeleton count={6} className="h-80 rounded-[24px]" />
        </div>
      ) : categories.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="Mediums coming soon"
          description="Check our showcase gallery or commission custom art directly."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/categories/${cat.slug}`}
              className="group rounded-[24px] bg-white border border-[#eae9ee] overflow-hidden shadow-[0_6px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_14px_36px_rgba(0,0,0,0.07)] hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f8f7fb]">
                <img
                  src={
                    cat.image?.url ||
                    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {cat.startingPrice && (
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/92 backdrop-blur-sm text-[11px] font-bold text-[#111827] shadow-xs">
                    From {formatPrice(cat.startingPrice)}
                  </span>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-[18px] font-bold text-[#111827] tracking-[-0.02em] group-hover:text-[#ff0457] transition-colors">
                      {cat.name}
                    </h2>
                    <ArrowUpRight className="w-4 h-4 text-[#8e8e93] group-hover:text-[#ff0457] transition-colors shrink-0" />
                  </div>
                  <p className="text-[13px] text-[#6e6e73] line-clamp-2 leading-relaxed">
                    {cat.description || 'Bespoke handmade artwork tailored to your photograph and vision.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#f2f1f6] flex items-center justify-between text-[12px]">
                  <span className="inline-flex items-center gap-1.5 text-[#8e8e93] font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    {cat.deliveryDays || '7–14 days'}
                  </span>
                  <span className="inline-flex items-center gap-1 font-bold text-[#ff0155] bg-[#ffe5ee] px-2.5 py-1 rounded-full">
                    <Sparkles className="w-3 h-3" />
                    <span>Explore</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
