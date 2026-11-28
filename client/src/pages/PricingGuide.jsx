import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Check, Layers, Users, Palette } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { formatPrice } from '../utils/formatters';

const DEFAULT_PRICING_TIERS = [
  {
    name: 'A4 Intimate Portrait',
    dimensions: '8 × 12 inches',
    price: 1999,
    mediums: 'Charcoal / Graphite / Watercolor',
    turnaround: '5–7 Business Days',
    popular: false,
    features: [
      'Ideal for single portrait or gift frame',
      '300 GSM archival acid-free cotton sheet',
      '1 free minor sketch revision included',
    ],
  },
  {
    name: 'A3 Signature Classic',
    dimensions: '12 × 16 inches',
    price: 3499,
    mediums: 'Charcoal / Watercolor / Oil Study',
    turnaround: '7–10 Business Days',
    popular: true,
    features: [
      'Most requested for couples & families',
      'Deep expressive shading & fine detail',
      'Progress snapshot updates before shipping',
    ],
  },
  {
    name: 'Gallery Oil & Acrylic',
    dimensions: '18 × 24 inches',
    price: 6499,
    mediums: 'Oil on Belgian Canvas / Textured Acrylic',
    turnaround: '12–16 Business Days',
    popular: false,
    features: [
      'Museum-grade pigments & protective varnish',
      'Up to 3 subjects or scenic backdrop',
      'Reinforced wooden crate delivery across India',
    ],
  },
];

export const PricingGuide = () => {
  const { settings, setPageTitle } = useSettings();
  const navigate = useNavigate();

  useEffect(() => {
    setPageTitle('Pricing & Size Guide');
  }, [setPageTitle]);

  const tiers =
    settings?.pricingGuide?.length > 0
      ? settings.pricingGuide.map((item, idx) => ({
          name: item.sizeName || item.title || `Tier ${idx + 1}`,
          dimensions: item.dimensions || item.size || 'Custom Scale',
          price: item.startingPrice || item.price || 2999,
          mediums: item.medium || 'All Studio Mediums',
          turnaround: item.turnaround || '7–14 Business Days',
          popular: idx === 1,
          features: item.features || [
            item.notes || '100% hand-painted from your photograph',
            'Archival fixative or protective varnish',
            'Insured shipping across India',
          ],
        }))
      : DEFAULT_PRICING_TIERS;

  return (
    <div className="max-w-[1200px] mx-auto px-3 sm:px-6 lg:px-8 pt-6 pb-20 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="eyebrow">Transparent Studio Estimates</span>
        <h1 className="editorial-serif text-4xl sm:text-6xl text-[#111827] font-normal leading-none">
          Sizing & Pricing Guide
        </h1>
        <p className="text-[13px] sm:text-[14px] text-[#6e6e73] leading-relaxed">
          Every commission is priced transparently based on canvas scale, number of subjects, and chosen medium — with final exact quote confirmed before painting begins.
        </p>
      </div>

      {/* Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-stretch">
        {tiers.map((tier, idx) => (
          <div
            key={idx}
            className={`relative rounded-[24px] p-6 sm:p-8 flex flex-col justify-between transition-all ${
              tier.popular
                ? 'bg-[#111827] text-white shadow-[0_20px_50px_rgba(17,24,39,0.2)] border border-[#111827]'
                : 'bg-white text-[#111827] border border-[#eae9ee] shadow-[0_6px_24px_rgba(0,0,0,0.03)]'
            }`}
          >
            {tier.popular && (
              <span className="absolute -top-3 left-6 px-3.5 py-1 rounded-full bg-[#ff0457] text-white text-[11px] font-bold uppercase tracking-wider shadow-md">
                Most Popular
              </span>
            )}

            <div className="space-y-4">
              <div>
                <p
                  className={`text-[12px] font-semibold uppercase tracking-wider ${
                    tier.popular ? 'text-[#ffc2d7]' : 'text-[#ff0457]'
                  }`}
                >
                  {tier.dimensions}
                </p>
                <h2 className="text-2xl font-bold tracking-[-0.02em] mt-1">
                  {tier.name}
                </h2>
              </div>

              <div className="flex items-baseline gap-1.5 pt-1">
                <span className="text-[12px] opacity-70">Starting from</span>
                <span className="text-3xl font-extrabold tracking-tight">
                  {formatPrice(tier.price)}
                </span>
              </div>

              <div
                className={`rounded-[14px] p-3 text-[12px] space-y-1 ${
                  tier.popular ? 'bg-white/10 text-white/90' : 'bg-[#f8f7fb] text-[#3c3c43]'
                }`}
              >
                <p>
                  <strong>Mediums:</strong> {tier.mediums}
                </p>
                <p>
                  <strong>Timeline:</strong> {tier.turnaround}
                </p>
              </div>

              <ul className="space-y-2.5 pt-2 text-[13px]">
                {tier.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        tier.popular ? 'text-[#ff0457]' : 'text-[#ff0457]'
                      }`}
                    />
                    <span className={tier.popular ? 'text-white/85' : 'text-[#3c3c43]'}>
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={() => navigate('/custom-order')}
              className={`mt-8 w-full py-3.5 rounded-full text-[13px] font-bold flex items-center justify-center gap-2 transition-all ${
                tier.popular
                  ? 'bg-[#ff0457] hover:bg-[#d90349] text-white shadow-[0_8px_22px_rgba(255,4,87,0.35)]'
                  : 'bg-[#111827] hover:bg-black text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Commission This Size</span>
            </button>
          </div>
        ))}
      </div>

      {/* Factors Card */}
      <div className="rounded-[24px] bg-white border border-[#eae9ee] p-6 sm:p-10 shadow-[0_6px_24px_rgba(0,0,0,0.03)] space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <span className="eyebrow">How Quotes Work</span>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-[-0.02em] mt-1">
            What Determines Your Exact Quote?
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: Users,
              title: '1. Number of Subjects',
              desc: 'Each additional face or pet requires dedicated pencil rendering and layering time.',
            },
            {
              icon: Layers,
              title: '2. Canvas Dimensions',
              desc: 'Larger scales demand primed Belgian frames, richer pigment density, and wood crating.',
            },
            {
              icon: Palette,
              title: '3. Backdrop Complexity',
              desc: 'Clean studio tones are complimentary; detailed architecture or florals add studio hours.',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-[18px] bg-[#f8f7fb] border border-[#eae9ee] p-5 space-y-2.5"
              >
                <div className="w-9 h-9 rounded-full bg-white border border-[#eae9ee] flex items-center justify-center text-[#ff0457]">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-[14px] font-bold text-[#111827]">{item.title}</h4>
                <p className="text-[12px] text-[#6e6e73] leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PricingGuide;
