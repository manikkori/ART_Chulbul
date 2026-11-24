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
  Star,
  Camera,
  FileCheck,
  PackageCheck,
  CheckCircle2,
  ChevronRight,
  Palette,
  Eye,
  ZoomIn,
  X,
  Truck,
  RotateCcw
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSettings } from '../context/SettingsContext';
import { formatPrice } from '../utils/formatters';
import api from '../services/api';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// 4 Signature Fine Art Mediums matching the Blush & Black editorial aesthetic
const SIGNATURE_MEDIUMS = [
  {
    id: 1,
    scriptName: 'Charcoal',
    categoryName: 'PORTRAITS',
    subtitle: 'Deep tonal depth & lifelike realism',
    medium: 'Charcoal & Graphite on 300 GSM Archival Paper',
    dimensions: '12 x 16 inches (A3)',
    startingPrice: 3499,
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80',
    slug: 'charcoal-pencil-sketch-portraits',
    tag: 'BEST SELLER',
    badgeText: 'MOST POPULAR'
  },
  {
    id: 2,
    scriptName: 'Watercolor',
    categoryName: 'ORIGINALS',
    subtitle: 'Organic blooms & glowing luminosity',
    medium: 'Finest Artist Pigments on Cold-Pressed Cotton',
    dimensions: '11 x 15 inches',
    startingPrice: 4299,
    image: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=1000&q=80',
    slug: 'water-color-art',
    tag: 'TRENDING',
    badgeText: 'POETIC BLEEDS'
  },
  {
    id: 3,
    scriptName: 'Oil on Canvas',
    categoryName: 'HEIRLOOMS',
    subtitle: 'Rich impasto textures & glazed depth',
    medium: 'Layered Artists Oil on Stretched Belgian Canvas',
    dimensions: '18 x 24 inches',
    startingPrice: 7999,
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
    slug: 'oil-painting',
    tag: 'NEW ARRIVALS',
    badgeText: 'MUSEUM GRADE'
  },
  {
    id: 4,
    scriptName: 'Acrylic & Mix',
    categoryName: 'MODERN ART',
    subtitle: 'Striking modern saturation & knife work',
    medium: 'Heavy Body Acrylics on Gallery Stretched Board',
    dimensions: '16 x 20 inches',
    startingPrice: 5499,
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1000&q=80',
    slug: 'acrylic-painting',
    tag: 'MOST LOVED',
    badgeText: 'VIVID SATURATION'
  }
];

// Fallback curated artworks if API is initializing
const CURATED_PICKS_FALLBACK = [
  {
    _id: 'pick-1',
    title: 'Renaissance Girl with Pearl Earring',
    category: { name: 'Oil on Canvas' },
    medium: 'Oil on Linen Canvas',
    dimensions: '16 x 20 in',
    price: 7999,
    images: [{ url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80' }]
  },
  {
    _id: 'pick-2',
    title: 'Soulful Charcoal Portrait',
    category: { name: 'Charcoal Sketch' },
    medium: 'Charcoal & Graphite',
    dimensions: '12 x 16 in',
    price: 3499,
    images: [{ url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80' }]
  },
  {
    _id: 'pick-3',
    title: 'Ethereal Botanical Blossom',
    category: { name: 'Watercolor Art' },
    medium: 'Cold-Pressed Watercolor',
    dimensions: '11 x 15 in',
    price: 4299,
    images: [{ url: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=800&q=80' }]
  },
  {
    _id: 'pick-4',
    title: 'Vibrant Palette Knife Abstract',
    category: { name: 'Acrylic Painting' },
    medium: 'Heavy Body Acrylic',
    dimensions: '18 x 24 in',
    price: 6499,
    images: [{ url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80' }]
  },
  {
    _id: 'pick-5',
    title: 'Vintage Couple Portrait in Oil',
    category: { name: 'Oil on Canvas' },
    medium: 'Oil on Belgian Canvas',
    dimensions: '20 x 24 in',
    price: 8999,
    images: [{ url: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=800&q=80' }]
  },
  {
    _id: 'pick-6',
    title: 'Monochrome Architectural Ink & Wash',
    category: { name: 'Charcoal Sketch' },
    medium: 'Archival Carbon Ink',
    dimensions: '10 x 14 in',
    price: 2999,
    images: [{ url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80' }]
  }
];

export const Home = () => {
  const { settings, artistProfile, setPageTitle, siteName } = useSettings();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [featuredArtworks, setFeaturedArtworks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeMediumIdx, setActiveMediumIdx] = useState(0);
  const [previewModalItem, setPreviewModalItem] = useState(null);

  // Hero container ref for GSAP
  const heroRef = useRef(null);
  const welcomeRef = useRef(null);
  const boxesRef = useRef(null);
  const bannerRef = useRef(null);
  const picksRef = useRef(null);

  useEffect(() => {
    setPageTitle('Home');

    const fetchData = async () => {
      try {
        const [catRes, featRes, revRes] = await Promise.all([
          api.get('/categories').catch(() => ({ data: { success: false } })),
          api.get('/artworks/featured').catch(() => ({ data: { success: false } })),
          api.get('/reviews/public?homeOnly=true').catch(() => ({ data: { success: false } }))
        ]);
        if (catRes.data?.success && catRes.data.data?.length > 0) {
          setCategories(catRes.data.data);
        }
        if (featRes.data?.success && featRes.data.data?.length > 0) {
          setFeaturedArtworks(featRes.data.data);
        } else {
          setFeaturedArtworks(CURATED_PICKS_FALLBACK);
        }
        if (revRes.data?.success) {
          setReviews(revRes.data.data);
        }
      } catch (err) {
        console.error('Homepage fetch error:', err);
        setFeaturedArtworks(CURATED_PICKS_FALLBACK);
      }
    };
    fetchData();
  }, [setPageTitle]);

  // GSAP scroll animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.from('.gsap-hero-title', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.15
      });

      gsap.from('.gsap-hero-image-wrap', {
        scale: 0.92,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.2
      });

      // Welcome Bar scroll reveal
      if (welcomeRef.current) {
        gsap.from(welcomeRef.current, {
          scrollTrigger: {
            trigger: welcomeRef.current,
            start: 'top 85%',
          },
          y: 30,
          opacity: 0,
          duration: 0.9,
          ease: 'power2.out'
        });
      }

      // 4 Category Boxes scroll stagger
      if (boxesRef.current) {
        gsap.from('.gsap-category-box', {
          scrollTrigger: {
            trigger: boxesRef.current,
            start: 'top 80%',
          },
          y: 45,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out'
        });
      }

      // Featured Ribbon Banner
      if (bannerRef.current) {
        gsap.from(bannerRef.current, {
          scrollTrigger: {
            trigger: bannerRef.current,
            start: 'top 80%',
          },
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const currentMedium = SIGNATURE_MEDIUMS[activeMediumIdx];

  const steps = [
    {
      num: '01',
      title: 'Send Reference Photo',
      desc: 'Upload your photo, select the medium (oil, watercolor, charcoal), and mention any special requests.',
      icon: Camera
    },
    {
      num: '02',
      title: 'Approve Composition',
      desc: 'The artist reviews your photo and provides a digital composition sketch and exact timeline.',
      icon: FileCheck
    },
    {
      num: '03',
      title: 'Handcrafted With Devotion',
      desc: 'Each stroke is painted with archival artist pigments. Receive progress photos inside your order portal.',
      icon: Paintbrush
    },
    {
      num: '04',
      title: 'Safe Crated Delivery',
      desc: 'Carefully cured, varnished, moisture-proof crated, and shipped directly with full transit insurance.',
      icon: PackageCheck
    }
  ];

  return (
    <div className="space-y-20 sm:space-y-28 overflow-hidden">
      {/* ============================================================== */}
      {/* 1. HERO SECTION - BLUSH & BLACK EDITORIAL AESTHETIC           */}
      {/* ============================================================== */}
      <section ref={heroRef} className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-6 sm:pt-10">
        {/* Soft Watercolor Blush Paint Splash Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] bg-gradient-to-tr from-[#fde8ef]/70 via-[#f7cbd7]/40 to-transparent rounded-[45%_55%_70%_35%] blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Script "Custom" + Bold "COMMISSIONS" */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-1">
              {/* Romantic Flowing Script */}
              <div className="gsap-hero-title font-script text-5xl sm:text-7xl lg:text-8xl text-[#121212] leading-[0.9] select-none flex items-center gap-2">
                <span>Custom</span>
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-[#dc8da3] fill-[#f7cbd7] animate-pulse inline-block" />
              </div>

              {/* Bold Condensed Sans / Modern Headline */}
              <h1 className="gsap-hero-title font-montserrat font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-[0.08em] text-[#121212] uppercase leading-none">
                COMMISSIONS
              </h1>
            </div>

            {/* Studio Tagline */}
            <p className="gsap-hero-title font-sans text-sm sm:text-base text-gray-700 max-w-lg leading-relaxed">
              {settings?.heroSubtitle ||
                'Turn your cherished memories, loved ones, and milestone moments into museum-grade hand-painted portraits. Oil, watercolor, and fine charcoal created exclusively for you.'}
            </p>

            {/* Black CTA Button with Blush Shadow (matches mockup "SHOP NOW") */}
            <div className="gsap-hero-title flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => navigate('/custom-order')}
                className="bg-[#121212] text-white hover:bg-black font-montserrat text-xs sm:text-sm font-bold uppercase tracking-[0.18em] px-8 py-3.5 border-2 border-[#121212] shadow-[4px_4px_0px_#f7cbd7] hover:shadow-[6px_6px_0px_#ebb0c0] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2"
              >
                <Paintbrush className="w-4 h-4 text-[#f7cbd7]" />
                <span>ORDER NOW</span>
              </button>

              <button
                onClick={() => navigate('/gallery')}
                className="bg-white text-[#121212] hover:bg-[#fff7f9] font-montserrat text-xs sm:text-sm font-bold uppercase tracking-[0.16em] px-6 py-3.5 border-2 border-[#121212] shadow-[3px_3px_0px_#f7cbd7] transition-all flex items-center gap-2"
              >
                <span>EXPLORE ART</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Medium Selector Pills matching Blush & Black aesthetic */}
            <div className="gsap-hero-title pt-4 border-t border-[#f7cbd7]">
              <div className="flex items-center justify-between mb-2.5">
                <span className="font-montserrat text-[11px] font-bold uppercase tracking-[0.16em] text-gray-700">
                  Select Medium To Preview:
                </span>
                <span className="font-script text-lg text-[#121212]">
                  {currentMedium.scriptName}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {SIGNATURE_MEDIUMS.map((med, idx) => {
                  const isActive = activeMediumIdx === idx;
                  return (
                    <button
                      key={med.id}
                      onClick={() => setActiveMediumIdx(idx)}
                      className={`py-2 px-1 text-center border-2 transition-all ${
                        isActive
                          ? 'border-[#121212] bg-[#fde8ef] shadow-[2px_2px_0px_#121212]'
                          : 'border-gray-200 bg-white hover:border-gray-400 text-gray-600'
                      }`}
                    >
                      <p className="font-montserrat text-[10px] sm:text-xs font-bold uppercase tracking-wider truncate">
                        {med.scriptName}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Layered Collage (Circular Artwork + Tilted Canvas + Scalloped Badge) */}
          <div className="lg:col-span-6 relative flex justify-center items-center py-6 sm:py-10">
            <div className="gsap-hero-image-wrap relative w-full max-w-md sm:max-w-lg aspect-square flex items-center justify-center">
              {/* Decorative Blush Brush Splash Behind Artwork */}
              <div className="absolute inset-4 bg-gradient-to-tr from-[#fde8ef] to-[#f7cbd7] rounded-full blur-2xl opacity-70 -z-10" />

              {/* 1. Tilted Canvas / Sketchbook Mockup in Background (left-tilted) */}
              <div className="absolute left-2 sm:left-6 top-8 w-44 sm:w-56 h-56 sm:h-72 bg-white border-2 border-[#121212] shadow-xl rotate-[-8deg] overflow-hidden z-10 hidden sm:block">
                <img
                  src={SIGNATURE_MEDIUMS[(activeMediumIdx + 1) % SIGNATURE_MEDIUMS.length].image}
                  alt="Artwork Preview"
                  className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute bottom-0 inset-x-0 bg-white/90 backdrop-blur-xs p-2 border-t border-[#121212] text-center">
                  <p className="font-montserrat text-[10px] font-bold text-[#121212] uppercase tracking-wider">
                    {SIGNATURE_MEDIUMS[(activeMediumIdx + 1) % SIGNATURE_MEDIUMS.length].scriptName} Sketch
                  </p>
                </div>
              </div>

              {/* 2. Main Circular Centerpiece Artwork with Crisp White Border */}
              <div className="relative z-20 w-60 h-60 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full border-4 sm:border-8 border-white shadow-2xl overflow-hidden group">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentMedium.id}
                    src={currentMedium.image}
                    alt={currentMedium.scriptName}
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </AnimatePresence>

                {/* Subtle Hover Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => setPreviewModalItem({
                      title: `${currentMedium.scriptName} ${currentMedium.categoryName}`,
                      medium: currentMedium.medium,
                      dimensions: currentMedium.dimensions,
                      price: currentMedium.startingPrice,
                      image: currentMedium.image
                    })}
                    className="bg-white text-[#121212] p-2.5 rounded-full border border-[#121212] shadow-md hover:scale-110 transition-transform"
                    aria-label="Zoom artwork"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 3. Scalloped Badge (Pink with dashed border, matching "20% OFF" badge from mockup) */}
              <div className="absolute -right-2 sm:right-6 top-6 z-30 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#fde8ef] border-2 border-dashed border-[#dc8da3] shadow-lg flex flex-col items-center justify-center text-center rotate-12 p-1.5 hover:rotate-0 transition-transform cursor-pointer">
                <Sparkles className="w-3.5 h-3.5 text-[#121212] mb-0.5" />
                <span className="font-montserrat font-extrabold text-[10px] sm:text-xs text-[#121212] uppercase leading-tight">
                  100%
                </span>
                <span className="font-montserrat font-bold text-[8px] sm:text-[9px] text-gray-700 uppercase tracking-tighter">
                  HANDMADE
                </span>
              </div>

              {/* 4. Bottom Floating Pill Indicator */}
              <div className="absolute -bottom-2 sm:bottom-2 z-30 bg-white/95 backdrop-blur-sm border-2 border-[#121212] px-4 py-1.5 shadow-[3px_3px_0px_#f7cbd7]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#121212] animate-ping" />
                  <span className="font-montserrat text-xs font-bold text-[#121212] uppercase tracking-wider">
                    Starts at {formatPrice(currentMedium.startingPrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. WELCOME BAR ("WELCOME TO BLUSH & BLACK" equivalent)         */}
      {/* ============================================================== */}
      <section ref={welcomeRef} className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center space-y-3">
        <div className="flex items-center justify-center gap-4">
          <div className="h-[1px] w-12 sm:w-20 bg-[#121212]" />
          <h2 className="font-montserrat font-bold text-xs sm:text-sm tracking-[0.22em] text-[#121212] uppercase">
            WELCOME TO {siteName ? siteName.toUpperCase() : "CHULBUL'S ART"}!
          </h2>
          <div className="h-[1px] w-12 sm:w-20 bg-[#121212]" />
        </div>
        <p className="font-sans text-xs sm:text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
          Share information about your custom commission idea with our studio. Describe a portrait, choose an archival medium, or commission a personalized heirloom artwork made exclusively for you.
        </p>
      </section>

      {/* ============================================================== */}
      {/* 3. 4 ICONIC SQUARE CATEGORY BOXES (matches reference mockup)  */}
      {/* ============================================================== */}
      <section ref={boxesRef} className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {SIGNATURE_MEDIUMS.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => navigate(`/gallery?category=${item.slug}`)}
              className="gsap-category-box cursor-pointer group bg-white border-2 border-[#121212] p-4 sm:p-6 text-center shadow-[4px_4px_0px_#f7cbd7] hover:shadow-[6px_6px_0px_#ebb0c0] hover:-translate-y-1 transition-all relative flex flex-col justify-between aspect-square"
            >
              {/* Top Mini Tag */}
              <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-montserrat font-bold text-gray-500 uppercase tracking-widest">
                <span>{item.tag}</span>
                <Heart className="w-3 h-3 text-[#dc8da3] group-hover:fill-[#dc8da3] transition-colors" />
              </div>

              {/* Center Typography: Layered Script + Condensed Sans */}
              <div className="my-auto space-y-1">
                <span className="block font-script text-3xl sm:text-4xl text-[#121212] group-hover:text-[#dc8da3] transition-colors leading-none">
                  {item.scriptName}
                </span>
                <span className="block font-montserrat font-extrabold text-sm sm:text-base tracking-[0.14em] text-[#121212] uppercase">
                  {item.categoryName}
                </span>
              </div>

              {/* Bottom Details */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] sm:text-xs font-montserrat">
                <span className="text-gray-500">From {formatPrice(item.startingPrice)}</span>
                <span className="font-bold text-[#121212] group-hover:translate-x-1 transition-transform inline-flex items-center">
                  →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. FEATURED PRODUCT RIBBON BANNER ("FEATURED PRODUCT" MOCKUP) */}
      {/* ============================================================== */}
      <section ref={bannerRef} className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="border-2 border-[#121212] bg-[#fff7f9] shadow-[6px_6px_0px_#f7cbd7] flex flex-col md:flex-row relative overflow-hidden">
          {/* Vertical Black Ribbon on Left (matching reference mockup!) */}
          <div className="bg-[#121212] text-white py-2 md:py-0 px-4 md:px-3 flex items-center justify-center shrink-0">
            <span className="font-montserrat font-bold text-[11px] sm:text-xs tracking-[0.25em] uppercase text-white md:[writing-mode:vertical-rl] md:rotate-180">
              FEATURED ARTWORK
            </span>
          </div>

          {/* Left Canvas Preview inside Banner */}
          <div className="md:w-5/12 p-6 sm:p-8 flex items-center justify-center relative bg-gradient-to-br from-[#fde8ef]/60 to-white/40">
            {/* Soft pink splash */}
            <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-lg border-2 border-[#121212] bg-white shadow-lg overflow-hidden group relative">
              <img
                src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80"
                alt="Featured Canvas"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 right-2 bg-white/95 border border-[#121212] px-2 py-0.5 text-[9px] font-montserrat font-bold text-[#121212] uppercase">
                OIL ON LINEN
              </div>
            </div>
          </div>

          {/* Right Content in Banner: Script "The" + Bold Headline */}
          <div className="md:w-7/12 p-6 sm:p-10 flex flex-col justify-center space-y-4">
            <div className="space-y-0.5">
              <span className="font-script text-4xl sm:text-5xl text-[#121212] leading-none block">
                The
              </span>
              <h3 className="font-montserrat font-extrabold text-2xl sm:text-4xl text-[#121212] uppercase tracking-[0.06em]">
                ORIGINAL HEIRLOOM COMMISSIONS
              </h3>
            </div>

            <p className="font-sans text-xs sm:text-sm text-gray-700 leading-relaxed max-w-lg">
              Crafted with genuine Old Holland artist oil paints on stretched Belgian linen canvas. Each commissioned artwork is built up in delicate glazing layers, capturing luminous lifelike warmth and protected with museum-grade satin varnish.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate('/custom-order')}
                className="bg-[#121212] text-white hover:bg-black font-montserrat text-xs font-bold uppercase tracking-[0.16em] px-6 py-3 border-2 border-[#121212] shadow-[3px_3px_0px_#f7cbd7] hover:shadow-[4px_4px_0px_#ebb0c0] transition-all"
              >
                COMMISSION THIS STYLE
              </button>
              <button
                onClick={() => navigate('/gallery?medium=Oil%20Painting')}
                className="font-montserrat text-xs font-bold uppercase tracking-wider text-[#121212] hover:underline px-2 py-3"
              >
                VIEW SIMILAR WORKS →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. SHOWCASE GALLERY GRID ("OUR PICKS" / "SHOP OUR PICKS")      */}
      {/* ============================================================== */}
      <section ref={picksRef} className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="text-center space-y-2">
          <h2 className="font-montserrat font-extrabold text-2xl sm:text-3xl text-[#121212] tracking-[0.12em] uppercase">
            SHOP OUR ART PICKS
          </h2>
          <p className="font-sans text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
            Handcrafted original paintings & recent bespoke commissions created for art lovers across India.
          </p>
        </div>

        {/* Gallery Grid: 3 columns on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredArtworks.slice(0, 6).map((art) => {
            const imgUrl = art.images?.[0]?.url || art.images?.[0] || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80';
            return (
              <div
                key={art._id}
                className="bg-white border-2 border-[#121212] shadow-[4px_4px_0px_#f7cbd7] hover:shadow-[6px_6px_0px_#ebb0c0] hover:-translate-y-1 transition-all overflow-hidden flex flex-col group"
              >
                {/* Image Container with hover zoom */}
                <div className="relative aspect-4/3 overflow-hidden bg-[#fde8ef]">
                  <img
                    src={imgUrl}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPreviewModalItem({
                        title: art.title,
                        medium: art.medium || art.category?.name,
                        dimensions: art.dimensions || 'Custom Size Available',
                        price: art.price,
                        image: imgUrl
                      })}
                      className="bg-white text-[#121212] p-2 rounded-full border border-[#121212] shadow hover:scale-110 transition-transform"
                      aria-label="Quick preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigate('/custom-order')}
                      className="bg-[#121212] text-white p-2 rounded-full border border-[#121212] shadow hover:scale-110 transition-transform"
                      aria-label="Commission art"
                    >
                      <Paintbrush className="w-4 h-4 text-[#f7cbd7]" />
                    </button>
                  </div>
                </div>

                {/* Soft Blush Strip at the Bottom (matching mockup picks cards!) */}
                <div className="p-4 bg-[#fff7f9] border-t-2 border-[#121212] flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <span className="font-montserrat text-[10px] font-bold text-gray-500 uppercase tracking-widest block">
                      {art.medium || art.category?.name || 'Handmade Painting'}
                    </span>
                    <h4 className="font-montserrat font-bold text-sm text-[#121212] tracking-tight truncate">
                      {art.title}
                    </h4>
                  </div>

                  <div className="pt-2 border-t border-[#f7cbd7] flex items-center justify-between">
                    <span className="font-montserrat text-xs font-extrabold text-[#121212]">
                      {art.price ? formatPrice(art.price) : 'Custom Estimate'}
                    </span>
                    <button
                      onClick={() => navigate('/custom-order')}
                      className="font-montserrat text-[11px] font-bold uppercase tracking-wider text-[#121212] hover:text-[#dc8da3] transition-colors"
                    >
                      Order Similar →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center pt-4">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 bg-white text-[#121212] hover:bg-[#fff7f9] font-montserrat text-xs font-bold uppercase tracking-[0.18em] px-8 py-3.5 border-2 border-[#121212] shadow-[4px_4px_0px_#f7cbd7] transition-all"
          >
            <span>VIEW FULL ARTWORK GALLERY</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. HOW IT WORKS - 4 CRISP STEPS                                */}
      {/* ============================================================== */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="border-2 border-[#121212] bg-white p-8 sm:p-12 shadow-[6px_6px_0px_#f7cbd7] space-y-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="font-script text-3xl text-[#121212] block">How It Works</span>
            <h3 className="font-montserrat font-extrabold text-2xl sm:text-3xl uppercase tracking-[0.1em] text-[#121212]">
              THE COMMISSION JOURNEY
            </h3>
            <p className="font-sans text-xs sm:text-sm text-gray-600">
              Commissioning your personalized fine art piece is transparent, personal, and stress-free.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => {
              const IconComp = step.icon;
              return (
                <div
                  key={step.num}
                  className="p-5 border border-[#121212] bg-[#fff7f9] shadow-[3px_3px_0px_#f7cbd7] space-y-3 relative group hover:-translate-y-1 transition-transform"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-montserrat font-extrabold text-2xl text-[#121212]">
                      {step.num}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#fde8ef] border border-[#121212] flex items-center justify-center text-[#121212]">
                      <IconComp className="w-4 h-4" />
                    </div>
                  </div>
                  <h4 className="font-montserrat font-bold text-xs uppercase tracking-wider text-[#121212]">
                    {step.title}
                  </h4>
                  <p className="font-sans text-xs text-gray-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. COLLECTOR TESTIMONIALS / REVIEWS                            */}
      {/* ============================================================== */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="font-script text-3xl text-[#121212] block">Collector Love</span>
          <h2 className="font-montserrat font-extrabold text-2xl sm:text-3xl text-[#121212] tracking-[0.1em] uppercase">
            WHAT ART LOVERS SAY
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(reviews.length > 0 ? reviews.slice(0, 3) : [
            {
              _id: 'rev-1',
              author: 'Aarav & Priya S.',
              city: 'Mumbai',
              rating: 5,
              comment: 'The charcoal portrait of our grandparents brought our entire family to tears. The eye details and textures are unbelievable. Truly museum-grade craftsmanship!',
              medium: 'Charcoal Portrait'
            },
            {
              _id: 'rev-2',
              author: 'Meera K.',
              city: 'Bangalore',
              rating: 5,
              comment: 'Ordered an oil painting for our anniversary. The artist shared in-progress photos at every stage. Packaging was completely crated and secure. Absolutely stunning!',
              medium: 'Oil on Canvas'
            },
            {
              _id: 'rev-3',
              author: 'Rohit V.',
              city: 'New Delhi',
              rating: 5,
              comment: 'The watercolor painting captures luminosity like nothing else. Far better than a generic digital print. You can feel the real human touch in every stroke.',
              medium: 'Watercolor Art'
            }
          ]).map((rev) => (
            <div
              key={rev._id}
              className="bg-white border-2 border-[#121212] p-6 shadow-[4px_4px_0px_#f7cbd7] space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-[#121212]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < (rev.rating || 5) ? 'fill-[#121212]' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="font-sans text-xs text-gray-700 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#f7cbd7] flex items-center justify-between text-xs font-montserrat">
                <div>
                  <p className="font-bold text-[#121212]">{rev.author || rev.userName}</p>
                  <p className="text-[10px] text-gray-500">{rev.city || 'Verified Collector'}</p>
                </div>
                <span className="text-[10px] bg-[#fde8ef] border border-[#121212] px-2 py-0.5 font-bold text-[#121212]">
                  {rev.medium || 'Custom Art'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* QUICK PREVIEW LIGHTBOX MODAL                                   */}
      {/* ============================================================== */}
      <AnimatePresence>
        {previewModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border-2 border-[#121212] shadow-[8px_8px_0px_#f7cbd7] max-w-xl w-full p-6 relative space-y-4"
            >
              <button
                onClick={() => setPreviewModalItem(null)}
                className="absolute top-4 right-4 p-1.5 border border-[#121212] bg-[#fde8ef] hover:bg-[#121212] hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="aspect-4/3 w-full overflow-hidden border border-[#121212] bg-[#fde8ef]">
                <img
                  src={previewModalItem.image}
                  alt={previewModalItem.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="space-y-1">
                <span className="font-montserrat text-[10px] font-bold uppercase text-gray-500 tracking-wider">
                  {previewModalItem.medium} • {previewModalItem.dimensions}
                </span>
                <h3 className="font-montserrat font-extrabold text-xl text-[#121212]">
                  {previewModalItem.title}
                </h3>
                {previewModalItem.price && (
                  <p className="font-montserrat text-sm font-bold text-[#121212]">
                    Estimated Price: {formatPrice(previewModalItem.price)}
                  </p>
                )}
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => {
                    setPreviewModalItem(null);
                    navigate('/custom-order');
                  }}
                  className="bg-[#121212] text-white hover:bg-black font-montserrat text-xs font-bold uppercase tracking-wider px-6 py-2.5 border border-[#121212] shadow-[3px_3px_0px_#f7cbd7]"
                >
                  Order Custom Artwork
                </button>
                <button
                  onClick={() => setPreviewModalItem(null)}
                  className="bg-white text-[#121212] font-montserrat text-xs font-bold uppercase tracking-wider px-4 py-2.5 border border-[#121212]"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
