import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paintbrush, Check, HelpCircle, Heart, Sparkles } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { formatPrice } from '../utils/formatters';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

const FALLBACK_PRICING = [
  {
    category: 'Charcoal & Pencil Sketch',
    size: 'A4 Size (8 x 12 in)',
    startingPrice: 2499,
    description: 'Detailed graphite & carbon portrait on 300 GSM archival paper. Ideal for single portrait or pet milestone.'
  },
  {
    category: 'Charcoal & Pencil Sketch',
    size: 'A3 Size (12 x 16 in)',
    startingPrice: 3499,
    description: 'Expanded scale allowing delicate micro-textures, clothing folds, and expressive emotional depth.'
  },
  {
    category: 'Water Color Art',
    size: 'Medium (11 x 15 in)',
    startingPrice: 4299,
    description: 'Translucent artist pigment washes on 100% cotton cold-pressed paper. Soft color blends & radiant light.'
  },
  {
    category: 'Oil on Canvas',
    size: 'Collector Size (16 x 20 in)',
    startingPrice: 7999,
    description: 'Museum-grade Old Holland oils on stretched Belgian linen. Heirloom permanence and glowing impasto glaze.'
  },
  {
    category: 'Oil on Canvas',
    size: 'Grand Heritage (18 x 24 in)',
    startingPrice: 10999,
    description: 'Signature large statement piece. Multi-subject family portrait or heirloom celebration canvas.'
  },
  {
    category: 'Acrylic Painting',
    size: 'Modern Gallery (16 x 20 in)',
    startingPrice: 5499,
    description: 'Heavy body acrylics with bold knife texture, UV satin varnish finish, and gallery-wrapped framing.'
  }
];

export const PricingGuide = () => {
  const { settings, setPageTitle } = useSettings();
  const navigate = useNavigate();

  useEffect(() => {
    setPageTitle('Pricing & Size Guide');
  }, [setPageTitle]);

  const pricingGuide = settings?.pricingGuide?.length ? settings.pricingGuide : FALLBACK_PRICING;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-20 pt-4">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1 font-script text-3xl sm:text-4xl text-[#121212]">
          <span>Transparent Valuation</span>
          <Heart className="w-4 h-4 text-[#dc8da3] fill-[#f7cbd7] inline-block" />
        </div>
        <h1 className="font-montserrat font-extrabold text-3xl sm:text-5xl text-[#121212] uppercase tracking-[0.08em]">
          PRICING & SIZE GUIDE
        </h1>
        <p className="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed">
          Because every artwork is custom made-to-order, these baseline prices help plan your commission. Exact estimates depend on reference detail and number of subjects.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pricingGuide.map((item, index) => (
          <div
            key={index}
            className="bg-white border-2 border-[#121212] p-8 shadow-[5px_5px_0px_#f7cbd7] hover:shadow-[7px_7px_0px_#ebb0c0] hover:-translate-y-1 transition-all flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="bg-[#fde8ef] border border-[#121212] font-montserrat text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 text-[#121212] inline-block">
                  {item.category}
                </span>
                <h3 className="font-montserrat font-extrabold text-xl text-[#121212] uppercase tracking-wide">
                  {item.size}
                </h3>
              </div>

              <div className="pt-2">
                <span className="text-[10px] font-montserrat font-bold uppercase tracking-wider text-gray-500 block">
                  Starting from
                </span>
                <span className="font-montserrat font-extrabold text-3xl text-[#121212]">
                  {formatPrice(item.startingPrice)}
                </span>
              </div>

              <p className="font-sans text-xs text-gray-600 leading-relaxed border-t border-[#f7cbd7] pt-3">
                {item.description || 'Single subject with natural background. Ideal for portraits and cherished personal milestones.'}
              </p>

              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-xs font-montserrat text-gray-700">
                  <Check className="w-3.5 h-3.5 text-[#121212] shrink-0" />
                  <span>Archival cotton paper or Belgian stretched canvas</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-montserrat text-gray-700">
                  <Check className="w-3.5 h-3.5 text-[#121212] shrink-0" />
                  <span>Work-in-progress photo updates in your dashboard</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-montserrat text-gray-700">
                  <Check className="w-3.5 h-3.5 text-[#121212] shrink-0" />
                  <span>Protective museum varnish & insured crated shipping</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/custom-order')}
              className="w-full bg-[#121212] text-white hover:bg-black font-montserrat text-xs font-bold uppercase tracking-wider py-3 border-2 border-[#121212] shadow-[3px_3px_0px_#f7cbd7] flex items-center justify-center gap-2"
            >
              <Paintbrush className="w-3.5 h-3.5 text-[#f7cbd7]" />
              <span>Commission this Size</span>
            </button>
          </div>
        ))}
      </div>

      {/* Factors influencing price */}
      <div className="bg-[#fff7f9] border-2 border-[#121212] p-8 sm:p-12 shadow-[6px_6px_0px_#f7cbd7] space-y-6 max-w-4xl mx-auto">
        <h3 className="font-montserrat font-extrabold text-2xl text-[#121212] uppercase tracking-[0.06em] text-center">
          What Determines Your Exact Quote?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="space-y-2 p-4 bg-white border border-[#121212]">
            <h4 className="font-montserrat text-xs font-bold uppercase tracking-wider text-[#121212]">
              1. Number of Subjects
            </h4>
            <p className="font-sans text-xs text-gray-600">
              Each additional face requires dedicated pencil rendering and layering time.
            </p>
          </div>
          <div className="space-y-2 p-4 bg-white border border-[#121212]">
            <h4 className="font-montserrat text-xs font-bold uppercase tracking-wider text-[#121212]">
              2. Canvas Scale
            </h4>
            <p className="font-sans text-xs text-gray-600">
              Larger dimensions demand premium stretched frames, heavier pigments, and reinforced shipping.
            </p>
          </div>
          <div className="space-y-2 p-4 bg-white border border-[#121212]">
            <h4 className="font-montserrat text-xs font-bold uppercase tracking-wider text-[#121212]">
              3. Background Complexity
            </h4>
            <p className="font-sans text-xs text-gray-600">
              Solid studio gradients are complimentary; intricate architectural backdrops add hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingGuide;
