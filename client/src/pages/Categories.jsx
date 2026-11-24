import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Paintbrush, Heart, Sparkles } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { formatPrice } from '../utils/formatters';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Skeleton from '../components/common/Skeleton';
import api from '../services/api';

export const Categories = () => {
  const { setPageTitle } = useSettings();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPageTitle('Art Categories & Mediums');
    api.get('/categories').then((res) => {
      if (res.data?.success) setCategories(res.data.data);
      setLoading(false);
    });
  }, [setPageTitle]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-16 pt-4">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1 font-script text-3xl sm:text-4xl text-[#121212]">
          <span>Artistic Mediums</span>
          <Heart className="w-4 h-4 text-[#dc8da3] fill-[#f7cbd7] inline-block" />
        </div>
        <h1 className="font-montserrat font-extrabold text-3xl sm:text-5xl text-[#121212] uppercase tracking-[0.08em]">
          COMMISSION MEDIUMS
        </h1>
        <p className="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed">
          From classical oil paintings and luminous watercolors to sharp pencil sketch portraits. Find the medium that best honors your vision.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton count={4} className="h-64 border-2 border-[#121212]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="group bg-white border-2 border-[#121212] shadow-[5px_5px_0px_#f7cbd7] hover:shadow-[7px_7px_0px_#ebb0c0] hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row overflow-hidden"
            >
              <div className="sm:w-2/5 aspect-[4/3] sm:aspect-auto overflow-hidden bg-[#fde8ef] relative border-b-2 sm:border-b-0 sm:border-r-2 border-[#121212]">
                <img
                  src={cat.image?.url || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80'}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-[#121212] text-white font-montserrat text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 shadow-[2px_2px_0px_#f7cbd7]">
                    From {formatPrice(cat.startingPrice)}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:w-3/5 flex flex-col justify-between space-y-4 bg-[#fff7f9]">
                <div>
                  <h3 className="font-montserrat font-extrabold text-xl sm:text-2xl text-[#121212] uppercase tracking-wide group-hover:text-[#dc8da3] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="font-sans text-xs text-gray-600 mt-2 leading-relaxed">
                    {cat.description}
                  </p>
                  <p className="font-montserrat text-[11px] text-gray-500 mt-2 font-bold uppercase tracking-wider">
                    {cat.artworkCount || 0} showcase artworks available
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-[#f7cbd7]">
                  <Link
                    to={`/categories/${cat.slug}`}
                    className="font-montserrat text-xs font-bold uppercase tracking-wider text-[#121212] hover:underline flex items-center gap-1"
                  >
                    Samples
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => navigate(`/custom-order?category=${cat.slug}`)}
                    className="bg-[#121212] text-white hover:bg-black font-montserrat text-xs font-bold uppercase tracking-wider px-4 py-2 border-2 border-[#121212] shadow-[2px_2px_0px_#f7cbd7] flex items-center gap-1.5 ml-auto"
                  >
                    <Paintbrush className="w-3.5 h-3.5 text-[#f7cbd7]" />
                    <span>Order Medium</span>
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

export default Categories;
