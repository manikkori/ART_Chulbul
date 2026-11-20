import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paintbrush, Check, HelpCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { formatPrice } from '../utils/formatters';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

export const PricingGuide = () => {
  const { settings, setPageTitle } = useSettings();
  const navigate = useNavigate();

  useEffect(() => {
    setPageTitle('Pricing & Size Guide');
  }, [setPageTitle]);

  const pricingGuide = settings?.pricingGuide || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-20">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="eyebrow">TRANSPARENT VALUATION</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-charcoal-900">
          Commission Pricing & Size Guide
        </h1>
        <p className="text-sm text-charcoal-600 leading-relaxed">
          Because every artwork is custom made-to-order, these starting prices serve as a clear baseline. Exact quotes depend on reference complexity and number of subjects.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pricingGuide.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl p-8 border border-cream-200 shadow-card hover:shadow-soft-hover transition-all flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="terracotta">{item.category}</Badge>
                  <h3 className="font-serif text-2xl font-bold text-charcoal-900 mt-2">
                    {item.size}
                  </h3>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-xs uppercase tracking-wider text-charcoal-400 font-semibold block">
                  Starting from
                </span>
                <span className="font-serif text-3xl font-bold text-terracotta-600">
                  {formatPrice(item.startingPrice)}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed border-t border-cream-100 pt-3">
                {item.description || 'Single subject with natural background. Ideal for portraits and cherished personal milestones.'}
              </p>

              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-xs text-charcoal-700">
                  <Check className="w-3.5 h-3.5 text-sage-600 shrink-0" />
                  <span>Museum-grade archival paper or stretched canvas</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-charcoal-700">
                  <Check className="w-3.5 h-3.5 text-sage-600 shrink-0" />
                  <span>Work-in-progress photo updates in your dashboard</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-charcoal-700">
                  <Check className="w-3.5 h-3.5 text-sage-600 shrink-0" />
                  <span>Protective archival varnish & insured packaging</span>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              icon={Paintbrush}
              className="w-full"
              onClick={() => navigate('/custom-order')}
            >
              Commission this Size
            </Button>
          </div>
        ))}
      </div>

      {/* Factors influencing price */}
      <div className="bg-cream-200/50 rounded-3xl p-8 sm:p-12 border border-cream-300 space-y-6 max-w-4xl mx-auto">
        <h3 className="font-serif text-2xl font-bold text-charcoal-900 text-center">
          What Determines Your Final Quote?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="space-y-2">
            <h4 className="font-serif text-base font-bold text-charcoal-900">
              1. Number of People / Pets
            </h4>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Each additional face requires extensive hours of precise proportional sketching and facial shading.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-serif text-base font-bold text-charcoal-900">
              2. Background Detailing
            </h4>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Soft blended vignette backgrounds are standard. Intricate architectural or botanical backgrounds add painting time.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-serif text-base font-bold text-charcoal-900">
              3. Medium & Canvas Size
            </h4>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Multi-layer oil glazes on large Belgian linen take several weeks of curing compared to fast-drying charcoal drawings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingGuide;
