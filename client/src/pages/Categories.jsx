import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Paintbrush } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-16">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="eyebrow">ARTISTIC MEDIUMS</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-charcoal-900">
          Commission Categories
        </h1>
        <p className="text-sm text-charcoal-600 leading-relaxed">
          From classical oil paintings and luminous watercolors to sharp pencil sketch portraits. Find the medium that best honors your vision.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton count={4} className="h-64" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="group bg-white rounded-3xl overflow-hidden border border-cream-200 shadow-card hover:shadow-soft-hover transition-all duration-300 flex flex-col sm:flex-row"
            >
              <div className="sm:w-2/5 aspect-[4/3] sm:aspect-auto overflow-hidden bg-cream-200 relative">
                <img
                  src={cat.image?.url}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="terracotta">
                    From {formatPrice(cat.startingPrice)}
                  </Badge>
                </div>
              </div>

              <div className="p-6 sm:w-3/5 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-charcoal-900 group-hover:text-terracotta-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-charcoal-600 mt-2 leading-relaxed">
                    {cat.description}
                  </p>
                  <p className="text-xs text-charcoal-400 mt-2 font-medium">
                    {cat.artworkCount || 0} showcase artworks available
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-cream-100">
                  <Link
                    to={`/categories/${cat.slug}`}
                    className="text-xs font-semibold text-charcoal-800 hover:text-terracotta-600 flex items-center gap-1"
                  >
                    View Samples
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Button
                    variant="primary"
                    size="sm"
                    icon={Paintbrush}
                    onClick={() => navigate(`/custom-order?category=${cat.slug}`)}
                  >
                    Order in this Medium
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

export default Categories;
