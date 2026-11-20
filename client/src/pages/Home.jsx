import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Paintbrush,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  Heart,
  ChevronDown,
  Star,
  Camera,
  FileCheck,
  Send,
  PackageCheck,
  CheckCircle2,
  ChevronRight,
  Palette
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { formatPrice } from '../utils/formatters';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import api from '../services/api';

// 4 showcase pieces with exact artdiarium rotating showcase characteristics
const SHOWCASE_SLIDES = [
  {
    id: 1,
    title: 'Hyper-Realistic Charcoal Portrait',
    category: 'Charcoal / Pencil Sketch Portraits',
    categorySlug: 'charcoal-pencil-sketch-portraits',
    medium: 'Charcoal & Graphite on 300 GSM Archival Paper',
    dimensions: '12 x 16 inches (A3)',
    startingPrice: 3499,
    description: 'Delicate hand-blending capturing deep tonal depth, lifelike expressions, and fine skin textures.',
    image: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1000&q=80',
    sheetColor: '#d4b0e4', // Lilac
    sheetRotation: '-3deg',
    label: 'Charcoal',
    tag: '100% Hand-Drawn'
  },
  {
    id: 2,
    title: 'Dreamy Translucent Watercolor',
    category: 'Water Color Art',
    categorySlug: 'water-color-art',
    medium: 'Artist Pigments on Cold-Pressed Cotton Rag',
    dimensions: '11 x 15 inches',
    startingPrice: 4299,
    description: 'Soft organic color bleeds and glowing luminosity that breathe poetic life into any memory.',
    image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=1000&q=80',
    sheetColor: '#f6dcb0', // Peach Amber
    sheetRotation: '2.5deg',
    label: 'Watercolor',
    tag: 'Cold-Pressed Cotton'
  },
  {
    id: 3,
    title: 'Heirloom Oil Painting on Canvas',
    category: 'Oil Painting',
    categorySlug: 'oil-painting',
    medium: 'Layered Artists Oil on Stretched Belgian Canvas',
    dimensions: '18 x 24 inches',
    startingPrice: 7999,
    description: 'Rich impasto brushwork, radiant glazed depth, and timeless museum-grade durability.',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
    sheetColor: '#f4c6d6', // Soft Rose Pink
    sheetRotation: '-2deg',
    label: 'Oil Canvas',
    tag: 'Museum Stretched'
  },
  {
    id: 4,
    title: 'Vibrant Contemporary Acrylic',
    category: 'Acrylic Painting',
    categorySlug: 'acrylic-painting',
    medium: 'Heavy Body Acrylics on Gallery-Wrapped Canvas',
    dimensions: '16 x 20 inches',
    startingPrice: 5499,
    description: 'Striking modern saturation, bold knife textures, and a protective UV satin varnish finish.',
    image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1000&q=80',
    sheetColor: '#c4e4f6', // Soft Sky Blue
    sheetRotation: '3deg',
    label: 'Acrylic',
    tag: 'Vivid Contemporary'
  }
];

export const Home = () => {
  const { settings, artistProfile, setPageTitle, siteName } = useSettings();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [featuredArtworks, setFeaturedArtworks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // 4-slide rotating showcase state (artdiarium.com replica)
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const SLIDE_DURATION = 2800; // 2.8 seconds per slide

  useEffect(() => {
    setPageTitle('Home');

    const fetchData = async () => {
      try {
        const [catRes, featRes, revRes] = await Promise.all([
          api.get('/categories'),
          api.get('/artworks/featured'),
          api.get('/reviews/public?homeOnly=true')
        ]);
        if (catRes.data?.success) setCategories(catRes.data.data);
        if (featRes.data?.success) setFeaturedArtworks(featRes.data.data);
        if (revRes.data?.success) setReviews(revRes.data.data);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      }
    };
    fetchData();
  }, [setPageTitle]);

  // Auto-rotate 4 slides every 2.8s
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SHOWCASE_SLIDES.length);
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, [isPaused, activeSlide]);

  const currentSlide = SHOWCASE_SLIDES[activeSlide];

  const steps = [
    {
      num: '01',
      title: 'Share Your Reference',
      desc: 'Pick your medium, upload up to 5 photos, and tell us your desired size and composition.',
      icon: Camera
    },
    {
      num: '02',
      title: 'Receive Custom Quote',
      desc: 'The artist reviews your photos and delivers an exact INR price quote and completion timeline.',
      icon: FileCheck
    },
    {
      num: '03',
      title: 'Handcrafted With Love',
      desc: 'Work begins on canvas. The artist shares real-time progress photos inside your order chat.',
      icon: Paintbrush
    },
    {
      num: '04',
      title: 'Insured Doorstep Delivery',
      desc: 'Varnished, archival-packed, and shipped via tracked courier straight to your home.',
      icon: PackageCheck
    }
  ];

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* ============================================================== */}
      {/* 1. HERO SECTION WITH 4-SLIDE ROTATING STAGE & PROGRESS PICKER */}
      {/* ============================================================== */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-4 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Hero Copy + CTA + 4-Thumbnail Index Picker */}
          <div className="lg:col-span-7 space-y-7">
            {/* Artdiarium-style Eyebrow */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f8e4ed] border border-[#f2cadb] text-[#b0456f]">
              <Sparkles className="w-3.5 h-3.5 text-[#b0456f]" />
              <span className="font-display text-xs font-semibold tracking-wider uppercase">
                100% CUSTOM MADE-TO-ORDER ARTWORKS
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#3d2c33] tracking-tight leading-[1.12]">
              {settings?.heroTitle || 'Handmade, Personalized Art Made Exclusively For You'}
            </h1>

            {/* Subtitle */}
            <p className="font-sans text-base sm:text-lg text-[#6e5a60] max-w-xl leading-relaxed">
              {settings?.heroSubtitle ||
                'Every brushstroke tells your story. Send us your reference photos, receive a custom quote, and watch your memories turn into timeless original art.'}
            </p>

            {/* Artdiarium-style Pill CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Button
                variant="dark"
                size="lg"
                icon={Paintbrush}
                onClick={() => navigate('/custom-order')}
              >
                {settings?.heroCtaText || 'Order Your Custom Art'}
              </Button>
              <Button
                variant="outline"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                onClick={() => navigate('/gallery')}
              >
                Explore Showcase
              </Button>
            </div>

            {/* Quick Guarantees Strip */}
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-[#6e5a60]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#b0456f] shrink-0" />
                <span className="font-semibold text-[#3d2c33]">100% Hand-Painted</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#b0456f] shrink-0" />
                <span className="font-semibold text-[#3d2c33]">Progress Updates in Chat</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#b0456f] shrink-0" />
                <span className="font-semibold text-[#3d2c33]">Insured India Delivery</span>
              </div>
            </div>

            {/* ============================================================== */}
            {/* 4-THUMBNAIL SELECTOR WITH LIVE FILLING PROGRESS BARS           */}
            {/* ============================================================== */}
            <div className="pt-6 border-t border-[#eadfd9]">
              <p className="font-display text-xs font-semibold tracking-wider uppercase text-[#b0456f] mb-3">
                Rotating Showcase Mediums (Click to preview):
              </p>

              <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-lg">
                {SHOWCASE_SLIDES.map((slide, idx) => {
                  const isActive = activeSlide === idx;
                  return (
                    <button
                      key={slide.id}
                      onClick={() => {
                        setActiveSlide(idx);
                        setIsPaused(false);
                      }}
                      onMouseEnter={() => setIsPaused(true)}
                      onMouseLeave={() => setIsPaused(false)}
                      className="group flex flex-col items-center text-center cursor-pointer transition-transform active:scale-95 text-left focus:outline-none"
                    >
                      {/* Thumbnail Container */}
                      <div
                        className={`relative w-full aspect-square rounded-2xl overflow-hidden transition-all duration-300 shadow-sm ${
                          isActive
                            ? 'ring-3 ring-[#b0456f] shadow-md scale-105'
                            : 'opacity-70 group-hover:opacity-100 group-hover:scale-102 border border-[#eadfd9]'
                        }`}
                      >
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="w-full h-full object-cover"
                        />
                        {isActive && (
                          <div className="absolute inset-0 bg-[#b0456f]/15" />
                        )}
                      </div>

                      {/* Animated Progress Bar (Fills 0% to 100% in 2.8s) */}
                      <div className="w-full h-1 bg-[#eadfd9] rounded-full overflow-hidden mt-2">
                        {isActive ? (
                          <div
                            key={`progress-${idx}-${activeSlide}`}
                            className="h-full bg-[#b0456f] rounded-full"
                            style={{
                              animation: isPaused
                                ? 'none'
                                : `fillProgress ${SLIDE_DURATION}ms linear forwards`,
                              width: isPaused ? '100%' : undefined
                            }}
                          />
                        ) : (
                          <div className="h-full bg-transparent w-0" />
                        )}
                      </div>

                      {/* Label in Fredoka font */}
                      <span
                        className={`font-display text-xs mt-1.5 truncate max-w-full font-medium ${
                          isActive ? 'text-[#b0456f] font-semibold' : 'text-[#6e5a60] group-hover:text-[#3d2c33]'
                        }`}
                      >
                        {slide.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* Right Column: Artdiarium Rotating Showcase Stage               */}
          {/* ============================================================== */}
          <div
            className="lg:col-span-5 relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Tilted Colored Backdrop Sheet that changes color with slide */}
              <div
                className="absolute inset-0 rounded-[34px] transition-all duration-700 ease-out -z-10"
                style={{
                  backgroundColor: currentSlide.sheetColor,
                  transform: `rotate(${currentSlide.sheetRotation}) scale(1.02)`,
                  boxShadow: '0 20px 40px -15px rgba(61, 44, 51, 0.15)'
                }}
              />

              {/* Elevated Front Card */}
              <div className="relative bg-white rounded-[30px] p-4 sm:p-5 shadow-2xl border border-[#f1e9e3] overflow-hidden">
                {/* 1:1 Aspect Ratio Painting Window with Crossfade & Subtle Zoom */}
                <div className="relative aspect-square rounded-[22px] overflow-hidden bg-[#fdf7f1] shadow-inner">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentSlide.id}
                      src={currentSlide.image}
                      alt={currentSlide.title}
                      initial={{ opacity: 0, scale: 1.06 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.55, ease: 'easeInOut' }}
                      className="w-full h-full object-cover object-center"
                    />
                  </AnimatePresence>

                  {/* Floating Badges */}
                  <div className="absolute top-3.5 left-3.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md shadow-md text-xs font-display font-semibold text-[#3d2c33] border border-[#eadfd9]">
                      <Palette className="w-3.5 h-3.5 text-[#b0456f]" />
                      {currentSlide.category}
                    </span>
                  </div>

                  <div className="absolute top-3.5 right-3.5">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#3d2c33]/90 backdrop-blur-md shadow-md text-[11px] font-display font-medium text-white">
                      {currentSlide.tag}
                    </span>
                  </div>

                  {/* Pause Indicator on Hover */}
                  {isPaused && (
                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-display text-[#6e5a60] shadow">
                      Paused (Hovered)
                    </div>
                  )}
                </div>

                {/* Caption & Metadata Details below the painting */}
                <div className="mt-4 pt-1 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-lg sm:text-xl font-bold text-[#3d2c33] leading-snug">
                        {currentSlide.title}
                      </h3>
                      <p className="font-sans text-xs text-[#6e5a60] line-clamp-2 mt-0.5">
                        {currentSlide.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#f1e9e3]">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-[#6e5a60] block">
                        Commission Starting
                      </span>
                      <span className="font-display text-lg font-bold text-[#b0456f]">
                        {formatPrice(currentSlide.startingPrice)}
                      </span>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() =>
                        navigate(`/custom-order?category=${currentSlide.categorySlug}`)
                      }
                      icon={Paintbrush}
                    >
                      Commission This Style
                    </Button>
                  </div>
                </div>
              </div>

              {/* Artdiarium-style Floating Stats Badge */}
              <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-white p-3.5 sm:p-4 rounded-3xl shadow-xl border border-[#eadfd9] max-w-[210px] z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#f8e4ed] text-[#b0456f] flex items-center justify-center font-display text-lg font-bold">
                    450+
                  </div>
                  <div>
                    <p className="font-display text-xs font-bold text-[#3d2c33]">Custom Pieces</p>
                    <p className="font-sans text-[11px] text-[#6e5a60]">Delivered across India</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. STATS STRIP                                                 */}
      {/* ============================================================== */}
      {settings?.stats && settings.stats.length > 0 && (
        <section className="bg-white/80 border-y border-[#eadfd9] py-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-[#eadfd9]">
              {settings.stats.map((stat, i) => (
                <div key={i} className="pt-6 md:pt-0 px-4 space-y-1">
                  <p className="font-display text-3xl sm:text-4xl font-bold text-[#b0456f]">
                    {stat.value}
                  </p>
                  <p className="font-display text-sm font-semibold text-[#3d2c33]">{stat.label}</p>
                  {stat.description && (
                    <p className="font-sans text-xs text-[#6e5a60] max-w-xs mx-auto">
                      {stat.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================== */}
      {/* 3. ART CATEGORIES SECTION (CURATED MEDIUMS)                   */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="eyebrow">CURATED MEDIUMS</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#3d2c33]">
            Explore Handcrafted Art Styles
          </h2>
          <p className="font-sans text-sm text-[#6e5a60]">
            Select the medium that best speaks to the emotion of your memory.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="group bg-white rounded-[26px] overflow-hidden border border-[#eadfd9] shadow-card hover:shadow-soft-hover transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#fdf7f1]">
                <img
                  src={cat.image?.url || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80'}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-xs font-display font-semibold text-[#b0456f] shadow-md border border-[#eadfd9]">
                    Starts from {formatPrice(cat.startingPrice)}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-display text-xl font-bold text-[#3d2c33] group-hover:text-[#b0456f] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="font-sans text-xs text-[#6e5a60] mt-2 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#f1e9e3]">
                  <Link
                    to={`/categories/${cat.slug}`}
                    className="font-display text-xs font-semibold text-[#3d2c33] hover:text-[#b0456f] flex items-center gap-1 transition-colors"
                  >
                    View Samples
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#b0456f] hover:bg-[#f8e4ed] font-semibold"
                    onClick={() => navigate(`/custom-order?category=${cat.slug}`)}
                  >
                    Order in this style
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. "FROM THE EASEL" FEATURED ARTWORKS                          */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="eyebrow">FROM THE EASEL</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#3d2c33]">
              Recent Past Commissions
            </h2>
            <p className="font-sans text-sm text-[#6e5a60] mt-1">
              Browse original pieces created for collectors and families across India.
            </p>
          </div>
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 font-display text-sm font-semibold text-[#b0456f] hover:text-[#83284e] transition-colors"
          >
            <span>View Full Gallery</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredArtworks.map((art) => (
            <div
              key={art._id}
              className="group bg-white rounded-[26px] overflow-hidden border border-[#eadfd9] shadow-card hover:shadow-soft-hover transition-all duration-300"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#fdf7f1]">
                <img
                  src={art.coverImage?.url}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-xs font-display font-medium text-[#3d2c33] shadow-md border border-[#eadfd9]">
                    {art.category?.name}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-lg font-bold text-[#3d2c33] line-clamp-1 group-hover:text-[#b0456f] transition-colors">
                    {art.title}
                  </h3>
                  <span className="font-display text-sm font-bold text-[#b0456f] shrink-0">
                    {formatPrice(art.startingPrice)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 text-xs text-[#6e5a60]">
                  <span className="bg-[#fdf7f1] px-2.5 py-0.5 rounded-full border border-[#eadfd9]">
                    {art.medium}
                  </span>
                  <span className="bg-[#fdf7f1] px-2.5 py-0.5 rounded-full border border-[#eadfd9]">
                    {art.dimensions}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#f1e9e3]">
                  <Link
                    to={`/artworks/${art.slug}`}
                    className="font-display text-xs font-semibold text-[#6e5a60] hover:text-[#b0456f] transition-colors"
                  >
                    Artwork Details
                  </Link>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      navigate(
                        `/custom-order?category=${art.category?.slug}&artwork=${art.slug}`
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
      </section>

      {/* ============================================================== */}
      {/* 5. "HOW IT WORKS" 4-STEP COMMISSION FLOW                       */}
      {/* ============================================================== */}
      <section className="bg-white py-20 border-y border-[#eadfd9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="eyebrow">TRANSPARENT CREATION PROCESS</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#3d2c33]">
              How Your Commission Comes to Life
            </h2>
            <p className="font-sans text-sm text-[#6e5a60]">
              Simple, transparent, and collaborative from the initial reference photo to final delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={step.num}
                  className="relative p-6 rounded-[24px] bg-[#fdf7f1] border border-[#eadfd9] space-y-4 hover:border-[#b0456f]/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-white text-[#b0456f] flex items-center justify-center shadow-sm border border-[#eadfd9]">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="font-display text-2xl font-bold text-[#eadfd9]">
                      {step.num}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#3d2c33]">
                    {step.title}
                  </h3>
                  <p className="font-sans text-xs text-[#6e5a60] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Button
              variant="dark"
              size="lg"
              icon={Paintbrush}
              onClick={() => navigate('/custom-order')}
            >
              Start Your Commission Today
            </Button>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. ABOUT THE ARTIST TEASER BLOCK                               */}
      {/* ============================================================== */}
      {artistProfile && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[32px] p-8 sm:p-12 lg:p-16 border border-[#eadfd9] shadow-card">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Photo & Badge */}
              <div className="lg:col-span-5 relative flex justify-center">
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden border-8 border-[#fdf7f1] shadow-xl">
                  <img
                    src={artistProfile.photo?.url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80'}
                    alt={artistProfile.artistName}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Handwritten Tag */}
                <div className="absolute -bottom-2 bg-[#b0456f] text-white font-handwriting text-2xl px-5 py-1.5 rounded-full shadow-md rotate-[-4deg]">
                  Hi, it's {artistProfile.artistName}
                </div>
              </div>

              {/* Bio & Philosophy */}
              <div className="lg:col-span-7 space-y-6">
                <span className="eyebrow">MEET THE ARTIST</span>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#3d2c33] leading-tight">
                  "Every face holds a lifetime; every canvas gives it permanence."
                </h2>
                <p className="font-sans text-sm sm:text-base text-[#6e5a60] leading-relaxed">
                  {artistProfile.shortBio}
                </p>

                {/* Medium Pills */}
                {artistProfile.skillsMediums && artistProfile.skillsMediums.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <p className="font-display text-xs font-semibold uppercase tracking-wider text-[#3d2c33]">
                      Specialized Mediums
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {artistProfile.skillsMediums.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3.5 py-1.5 rounded-full bg-[#fdf7f1] border border-[#eadfd9] text-xs font-display font-medium text-[#3d2c33]"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 flex items-center gap-4">
                  <Button variant="outline" onClick={() => navigate('/about')}>
                    Read Full Story & Journey
                  </Button>
                  <Button variant="secondary" onClick={() => navigate('/contact')}>
                    Ask Me a Question
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============================================================== */}
      {/* 7. CUSTOMER TESTIMONIALS (APPROVED REVIEWS)                    */}
      {/* ============================================================== */}
      {reviews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="eyebrow">VERIFIED REVIEWS</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#3d2c33]">
              Loved by Families & Collectors
            </h2>
            <p className="font-sans text-sm text-[#6e5a60]">
              Real stories from people who turned their favorite memories into fine art.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map((rev) => (
              <div
                key={rev._id}
                className="bg-white rounded-[26px] p-6 sm:p-8 border border-[#eadfd9] shadow-card flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < rev.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-[#eadfd9]'
                          }`}
                        />
                      ))}
                    </div>
                    {rev.artwork && (
                      <span className="font-display text-xs text-[#6e5a60] font-medium">
                        {rev.artwork.title}
                      </span>
                    )}
                  </div>

                  <p className="font-sans text-sm text-[#3d2c33] italic leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-[#f1e9e3]">
                  <div className="w-10 h-10 rounded-full bg-[#f8e4ed] text-[#b0456f] font-display font-bold flex items-center justify-center text-sm">
                    {rev.customer?.name ? rev.customer.name.charAt(0).toUpperCase() : 'C'}
                  </div>
                  <div>
                    <p className="font-display text-xs font-bold text-[#3d2c33]">
                      {rev.customer?.name || 'Verified Client'}
                    </p>
                    <p className="font-sans text-[11px] text-[#6e5a60]">Custom Commission</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ============================================================== */}
      {/* 8. FAQ ACCORDION SECTION                                       */}
      {/* ============================================================== */}
      {settings?.faq && settings.faq.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-2">
            <span className="eyebrow">COMMON QUESTIONS</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#3d2c33]">
              Everything You Need to Know
            </h2>
            <p className="font-sans text-sm text-[#6e5a60]">
              Have questions about ordering custom art? We have answered the most common ones.
            </p>
          </div>

          <div className="space-y-4">
            {settings.faq.map((item, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-[#eadfd9] overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-display text-base sm:text-lg font-bold text-[#3d2c33] hover:text-[#b0456f] transition-colors"
                  >
                    <span>{item.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#6e5a60] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#b0456f]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 font-sans text-xs sm:text-sm text-[#6e5a60] leading-relaxed border-t border-[#f1e9e3] pt-3">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ============================================================== */}
      {/* 9. CLOSING CTA BAND                                            */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[32px] bg-[#3d2c33] text-[#fdf7f1] overflow-hidden p-8 sm:p-14 text-center shadow-2xl border border-[#eadfd9]">
          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <span className="font-display text-xs font-semibold tracking-widest uppercase text-[#d4b0e4]">
              COMMISSION AN ORIGINAL HEIRLOOM
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#fdf7f1] leading-tight">
              Ready to Turn Your Memory into Fine Art?
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#eadfd9] leading-relaxed">
              Upload your reference photo today. The artist will review it personally and provide a tailored quote within 24 hours.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <Button
                variant="primary"
                size="lg"
                icon={Paintbrush}
                onClick={() => navigate('/custom-order')}
              >
                Order Your Custom Art
              </Button>
              <Button
                variant="white"
                size="lg"
                onClick={() => navigate('/pricing')}
              >
                View Pricing & Size Guide
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
