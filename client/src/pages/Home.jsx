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

// 4 Signature Mediums styled in Jhankoo's Craft blobs
const CRAFT_MEDIUMS = [
  {
    id: 1,
    name: 'Charcoal Portrait',
    shortName: 'Charcoal',
    slug: 'charcoal-pencil-sketch-portraits',
    icon: '✏️',
    bgColor: 'bg-[#fef3c7]',
    textColor: 'text-orange-700',
    blobRadius: '45% 55% 60% 40% / 50% 45% 55% 50%',
    startingPrice: 3499,
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    tag: 'Best Seller'
  },
  {
    id: 2,
    name: 'Watercolor Art',
    shortName: 'Watercolor',
    slug: 'water-color-art',
    icon: '🌸',
    bgColor: 'bg-[#fce7f3]',
    textColor: 'text-pink-700',
    blobRadius: '55% 45% 40% 60% / 45% 55% 50% 50%',
    startingPrice: 4299,
    image: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=800&q=80',
    tag: 'Trending'
  },
  {
    id: 3,
    name: 'Oil on Canvas',
    shortName: 'Oil Canvas',
    slug: 'oil-painting',
    icon: '🎨',
    bgColor: 'bg-[#dbeafe]',
    textColor: 'text-blue-700',
    blobRadius: '45% 55% 60% 40% / 50% 45% 55% 50%',
    startingPrice: 7999,
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    tag: 'Heirloom'
  },
  {
    id: 4,
    name: 'Acrylic Painting',
    shortName: 'Acrylic',
    slug: 'acrylic-painting',
    icon: '✨',
    bgColor: 'bg-[#e0e7ff]',
    textColor: 'text-purple-700',
    blobRadius: '55% 45% 40% 60% / 45% 55% 50% 50%',
    startingPrice: 5499,
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80',
    tag: 'Modern'
  }
];

// Fallback curated artworks
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
    title: 'Vibrant Palette Knife Texture',
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
    title: 'Monochrome Architectural Ink Wash',
    category: { name: 'Charcoal Sketch' },
    medium: 'Archival Carbon Ink',
    dimensions: '10 x 14 in',
    price: 2999,
    images: [{ url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80' }]
  }
];

export const Home = () => {
  const { settings, setPageTitle, siteName } = useSettings();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [featuredArtworks, setFeaturedArtworks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [previewModalItem, setPreviewModalItem] = useState(null);

  const heroRef = useRef(null);
  const whatRef = useRef(null);
  const craftRef = useRef(null);
  const darkBannerRef = useRef(null);

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

  // GSAP scroll animations matching Jhankoo
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.from('.animate-text', {
        y: 35,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
      });

      gsap.from('.animate-btn', {
        y: 25,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.4
      });

      gsap.from('.animate-img-main', {
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.2
      });

      gsap.from(['.animate-img-left', '.animate-img-right'], {
        scale: 0.85,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.35
      });

      gsap.from('.animate-decor', {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'back.out(2)',
        delay: 0.5
      });

      // Craft section trigger
      if (craftRef.current) {
        gsap.from('.animate-craft-header', {
          scrollTrigger: {
            trigger: craftRef.current,
            start: 'top 80%',
          },
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out'
        });

        gsap.from('.animate-craft-blob', {
          scrollTrigger: {
            trigger: craftRef.current,
            start: 'top 75%',
          },
          y: 40,
          opacity: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'back.out(1.5)'
        });
      }

      // "What We Do" trigger
      if (whatRef.current) {
        gsap.from('.what-content', {
          scrollTrigger: {
            trigger: whatRef.current,
            start: 'top 75%',
          },
          x: 40,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out'
        });

        gsap.from('.what-feature', {
          scrollTrigger: {
            trigger: whatRef.current,
            start: 'top 75%',
          },
          y: 25,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out'
        });
      }

      // Dark Banner trigger
      if (darkBannerRef.current) {
        gsap.from(darkBannerRef.current, {
          scrollTrigger: {
            trigger: darkBannerRef.current,
            start: 'top 80%',
          },
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out'
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="space-y-20 sm:space-y-32 overflow-hidden bg-creator-bg-butter">
      {/* ============================================================== */}
      {/* 1. HERO SECTION - EXACT JHANKOO LAYOUT & CAVEAT TYPOGRAPHY     */}
      {/* ============================================================== */}
      <section ref={heroRef} className="relative w-full pt-2 sm:pt-6">
        <div className="min-h-0 lg:min-h-[calc(100vh-100px)] w-full flex flex-col lg:flex-row max-w-7xl mx-auto items-center">
          {/* Left Column: Playful Stacked Caveat Headings */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 md:px-14 lg:px-16 py-8 sm:py-12">
            <div className="w-full space-y-1">
              <h1 className="animate-text font-caveat text-6xl sm:text-7xl md:text-8xl font-normal leading-none lg:-rotate-4 text-center lg:text-left text-[#1c1a17]">
                Handcrafted
              </h1>
              <h1 className="animate-text font-caveat text-6xl sm:text-7xl md:text-8xl font-normal leading-none lg:-rotate-3 text-center lg:text-left text-[#1c1a17]">
                Portraits &
              </h1>
              <h1 className="animate-text font-caveat text-6xl sm:text-7xl md:text-8xl font-normal leading-none text-[#faa9b0] lg:-rotate-2 text-center lg:text-left">
                Original Paintings.
              </h1>
            </div>

            {/* Subtitle */}
            <div className="animate-text mt-4 lg:mt-6 flex flex-col items-center text-center lg:text-start lg:items-start">
              <p className="font-caveat text-xl sm:text-2xl text-[#1c1a17]">
                Discover unique handmade portraits. Support authentic fine art.
              </p>
              <p className="text-xs sm:text-sm font-sans text-neutral-600 mt-2 max-w-md leading-relaxed">
                Turn your cherished memories, loved ones, and milestone moments into museum-grade heirloom paintings. Every stroke painted with devotion on archival canvas.
              </p>
            </div>

            {/* CTA Buttons in Jhankoo Pill Styling */}
            <div className="relative z-10 flex flex-wrap justify-center lg:justify-start mt-6 sm:mt-8 gap-4">
              <button
                onClick={() => navigate('/gallery')}
                className="animate-btn group flex touch-manipulation items-center cursor-pointer bg-[#faa9b0] hover:bg-[#e85c76] px-7 py-3.5 text-sm font-semibold text-white shadow-sm hover:-translate-y-1 hover:shadow-lg rounded-full transition-all duration-300 gap-2"
              >
                <span>Explore Artworks</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => navigate('/custom-order')}
                className="animate-btn flex touch-manipulation items-center cursor-pointer border border-[#faa9b0]/60 bg-white/70 hover:bg-white px-7 py-3.5 text-sm font-semibold text-[#1c1a17] hover:-translate-y-1 shadow-xs rounded-full transition-all duration-300 gap-2"
              >
                <Paintbrush className="w-4 h-4 text-[#e85c76]" />
                <span>Order Custom Art</span>
              </button>
            </div>

            {/* Quick Guarantees Strip */}
            <div className="animate-text mt-8 pt-6 border-t border-[#1c1a17]/10 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-neutral-600 font-sans">
              <div className="flex items-center gap-1.5 font-medium">
                <span className="text-[#e85c76]">✦</span>
                <span>100% Hand-Painted</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <span className="text-[#e85c76]">✦</span>
                <span>Preview Before Dispatch</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <span className="text-[#e85c76]">✦</span>
                <span>Insured Doorstep Delivery</span>
              </div>
            </div>
          </div>

          {/* Right Column: Layered Tilted Polaroid Artwork Frames */}
          <div className="w-full lg:w-1/2 min-h-[30rem] sm:min-h-[36rem] lg:min-h-[calc(100vh-100px)] relative flex items-center justify-center px-4 sm:px-10 py-10 lg:py-0 overflow-hidden lg:overflow-visible">
            {/* Whimsical Floating Doodles */}
            <div className="animate-decor absolute top-[10%] left-[8%] text-3xl sm:text-4xl filter drop-shadow-md z-10 -rotate-12">
              🎨
            </div>
            <div className="animate-decor absolute top-[14%] right-[6%] text-3xl sm:text-4xl filter drop-shadow-md z-10 rotate-12">
              ✨
            </div>
            <div className="animate-decor absolute bottom-[12%] right-[10%] text-3xl sm:text-4xl filter drop-shadow-md z-40 rotate-12">
              🌸
            </div>
            <div className="animate-decor absolute bottom-[16%] left-[10%] text-3xl sm:text-4xl filter drop-shadow-md z-40 -rotate-12">
              🍃
            </div>

            {/* Main Center Image: Oil Painting */}
            <div className="animate-img-main relative w-[68%] sm:w-[58%] lg:w-[65%] aspect-square z-10 rotate-6 border-[10px] sm:border-[14px] border-[#faf9f6] shadow-[0_20px_50px_rgba(71,46,50,0.22)] rounded-[20px] overflow-hidden group cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80"
                alt="Heirloom Oil Painting"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-2 inset-x-2 bg-white/90 backdrop-blur-xs py-1 px-2 rounded-lg text-center border border-black/5">
                <p className="font-caveat text-sm font-bold text-[#1c1a17]">
                  Heirloom Oil on Canvas
                </p>
              </div>
            </div>

            {/* Left Tilted Image: Charcoal Portrait */}
            <div className="animate-img-left absolute top-[24%] sm:top-[28%] left-[2%] sm:left-[6%] lg:left-[-4%] w-[40%] sm:w-[35%] lg:w-[38%] aspect-square z-20 -rotate-12 border-[8px] sm:border-[12px] border-[#faf9f6] shadow-[0_20px_50px_rgba(71,46,50,0.22)] rounded-[18px] overflow-hidden group cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80"
                alt="Charcoal Sketch"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-1.5 inset-x-1.5 bg-white/90 py-0.5 px-1.5 rounded text-center">
                <p className="font-caveat text-xs font-bold text-[#1c1a17]">
                  Charcoal Portrait
                </p>
              </div>
            </div>

            {/* Right Tilted Image: Watercolor */}
            <div className="animate-img-right absolute bottom-[18%] sm:bottom-[22%] right-[2%] sm:right-[6%] lg:right-[3%] w-[38%] sm:w-[33%] lg:w-[36%] aspect-square z-30 rotate-12 border-[8px] sm:border-[12px] border-[#faf9f6] shadow-[0_20px_50px_rgba(71,46,50,0.22)] rounded-[18px] overflow-hidden group cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=800&q=80"
                alt="Watercolor Art"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-1.5 inset-x-1.5 bg-white/90 py-0.5 px-1.5 rounded text-center">
                <p className="font-caveat text-xs font-bold text-[#1c1a17]">
                  Archival Watercolor
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. EXPLORE BY CRAFT / MEDIUM (Jhankoo "Explore by Craft")       */}
      {/* ============================================================== */}
      <section ref={craftRef} className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
        <div className="space-y-2">
          <p className="animate-craft-header font-caveat text-xl sm:text-2xl tracking-wide text-[#faa9b0] -rotate-3 inline-block">
            Different hands. Different mediums. Same heart.
          </p>
          <h2 className="animate-craft-header font-playfair text-3xl sm:text-5xl font-bold text-[#1c1a17]">
            Explore by Medium
          </h2>
          <p className="animate-craft-header mx-auto max-w-lg text-xs sm:text-sm text-neutral-600">
            A world of bespoke artworks, waiting to be commissioned.
          </p>
        </div>

        {/* 4 Organic Craft Blob Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 max-w-4xl mx-auto pt-4">
          {CRAFT_MEDIUMS.map((craft) => (
            <div
              key={craft.id}
              onClick={() => navigate(`/gallery?category=${craft.slug}`)}
              className="animate-craft-blob flex flex-col items-center group cursor-pointer transition-transform"
            >
              <div
                style={{ borderRadius: craft.blobRadius }}
                className={`flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center text-4xl sm:text-5xl ${craft.bgColor} ${craft.textColor} shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:scale-105 group-hover:shadow-md`}
              >
                {craft.icon}
              </div>
              <h4 className="mt-3 text-sm font-semibold text-neutral-800 transition-colors group-hover:text-[#e85c76]">
                {craft.name}
              </h4>
              <p className="text-xs text-neutral-500 font-sans">
                From {formatPrice(craft.startingPrice)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. MORE THAN A CANVAS (Jhankoo "More Than A Product Link")     */}
      {/* ============================================================== */}
      <section ref={whatRef} className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative mx-auto rounded-[3rem] bg-[#F8E8E7] p-6 sm:p-12 lg:p-16 border border-[#faa9b0]/30 shadow-xs">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-10 lg:gap-16">
            {/* Left: Featured Canvas Artwork Card */}
            <div className="w-full lg:w-[48%] relative">
              <div className="relative overflow-hidden rounded-[2rem] bg-white p-3 sm:p-4 shadow-xl border border-white">
                <img
                  src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80"
                  alt="Heirloom Studio Piece"
                  className="w-full h-[280px] sm:h-[360px] object-cover rounded-[1.5rem] hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-6 right-6 rotate-12">
                  <span className="bg-[#faa9b0] text-white font-caveat text-base sm:text-lg px-4 py-1.5 rounded-full shadow-md font-bold">
                    100% Original
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Content & 3 Feature Pills */}
            <div className="what-content w-full lg:w-[52%] space-y-4">
              <span className="font-caveat text-xl text-[#e85c76] block">
                More than a canvas.
              </span>
              <h3 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-[#1c1a17]">
                A digital studio made for fine art commissions.
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-xl">
                Chulbul's Art gives families, couples, and art collectors a transparent, personal studio to commission original paintings from their photographs, review progress photos in real time, and receive museum-grade delivery.
              </p>

              {/* 3 Feature Pills with icons */}
              <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-3">
                <div className="what-feature group p-2">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-pink-100 text-[#e85c76] transition-transform duration-300 group-hover:scale-110">
                    <Camera className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-xs text-neutral-800 uppercase tracking-wider">
                    Share Photos
                  </h4>
                  <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
                    Upload your favorite people, pets, or wedding memories.
                  </p>
                </div>

                <div className="what-feature group p-2 sm:border-l border-neutral-200 sm:pl-4">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-green-700 transition-transform duration-300 group-hover:scale-110">
                    <Paintbrush className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-xs text-neutral-800 uppercase tracking-wider">
                    Artist Crafts It
                  </h4>
                  <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
                    Watch in-progress sketches directly inside your order portal.
                  </p>
                </div>

                <div className="what-feature group p-2 sm:border-l border-neutral-200 sm:pl-4">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-yellow-100 text-yellow-700 transition-transform duration-300 group-hover:scale-110">
                    <Truck className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-xs text-neutral-800 uppercase tracking-wider">
                    Safe Delivery
                  </h4>
                  <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
                    Crated with moisture-proof protection straight to your doorstep.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. DARK FEATURE BANNER (Jhankoo Dark Section)                   */}
      {/* ============================================================== */}
      <section ref={darkBannerRef} className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-[3rem] bg-[#1c1a17] text-white p-8 sm:p-14 lg:p-16 shadow-2xl relative overflow-hidden space-y-8">
          <div className="max-w-xl space-y-3">
            <span className="font-sans text-xs font-bold uppercase tracking-[0.22em] text-[#d4a373] block">
              AUTHENTIC ARTISAN PROMISE
            </span>
            <h3 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              Made for collectors who value authentic craftsmanship.
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              No digital prints. No AI filters. Every stroke is applied with real brush, charcoal, and pigment on archival cotton rag or Belgian stretched canvas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            <div className="flex items-center gap-3.5 p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
              <div className="w-8 h-8 rounded-full bg-white text-[#1c1a17] flex items-center justify-center font-bold shrink-0">
                ✓
              </div>
              <span className="text-xs font-semibold text-neutral-200">
                100% Hand-Painted Original
              </span>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
              <div className="w-8 h-8 rounded-full bg-white text-[#1c1a17] flex items-center justify-center font-bold shrink-0">
                ✓
              </div>
              <span className="text-xs font-semibold text-neutral-200">
                Progress Preview in Chat
              </span>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
              <div className="w-8 h-8 rounded-full bg-white text-[#1c1a17] flex items-center justify-center font-bold shrink-0">
                ✓
              </div>
              <span className="text-xs font-semibold text-neutral-200">
                Archival Museum Varnish
              </span>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
              <div className="w-8 h-8 rounded-full bg-white text-[#1c1a17] flex items-center justify-center font-bold shrink-0">
                ✓
              </div>
              <span className="text-xs font-semibold text-neutral-200">
                Insured Plywood Crating
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. CURATED ART PICKS & LIGHTBOX                                */}
      {/* ============================================================== */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <p className="font-caveat text-xl text-[#faa9b0] -rotate-2">
            Curated pieces & bespoke commissions
          </p>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#1c1a17]">
            Featured Artworks
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredArtworks.slice(0, 6).map((art) => {
            const imgUrl =
              art.images?.[0]?.url ||
              art.images?.[0] ||
              'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80';
            return (
              <div
                key={art._id}
                className="group bg-white rounded-[2rem] p-3 border border-[#1c1a17]/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
              >
                <div className="relative aspect-4/3 rounded-[1.5rem] overflow-hidden bg-[#faf9f6]">
                  <img
                    src={imgUrl}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() =>
                        setPreviewModalItem({
                          title: art.title,
                          medium: art.medium || art.category?.name,
                          dimensions: art.dimensions || 'Custom Size Available',
                          price: art.price,
                          image: imgUrl
                        })
                      }
                      className="bg-white text-[#1c1a17] p-2.5 rounded-full shadow-md hover:scale-110 transition-transform"
                      aria-label="Quick preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigate('/custom-order')}
                      className="bg-[#faa9b0] text-white p-2.5 rounded-full shadow-md hover:scale-110 transition-transform"
                      aria-label="Commission art"
                    >
                      <Paintbrush className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#e85c76] block">
                      {art.medium || art.category?.name || 'Handmade Painting'}
                    </span>
                    <h4 className="font-playfair font-bold text-base text-[#1c1a17] tracking-tight truncate mt-0.5">
                      {art.title}
                    </h4>
                  </div>

                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                    <span className="font-sans text-xs font-bold text-[#1c1a17]">
                      {art.price ? formatPrice(art.price) : 'Custom Estimate'}
                    </span>
                    <button
                      onClick={() => navigate('/custom-order')}
                      className="text-xs font-semibold text-[#e85c76] hover:underline"
                    >
                      Order Similar →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-4">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 bg-[#faa9b0] hover:bg-[#e85c76] text-white font-sans text-xs font-bold uppercase tracking-wider px-8 py-3.5 rounded-full shadow-sm hover:shadow-md transition-all"
          >
            <span>View Full Art Showcase</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. COLLECTOR LOVE / TESTIMONIALS                               */}
      {/* ============================================================== */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-1">
          <span className="font-caveat text-2xl text-[#faa9b0] -rotate-2 block">
            Collector Stories
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#1c1a17]">
            What Art Lovers Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(reviews.length > 0
            ? reviews.slice(0, 3)
            : [
                {
                  _id: 'rev-1',
                  author: 'Aarav & Priya S.',
                  city: 'Mumbai',
                  rating: 5,
                  comment:
                    'The charcoal portrait of our grandparents brought our entire family to tears. The eye details and textures are unbelievable. Truly museum-grade craftsmanship!',
                  medium: 'Charcoal Portrait'
                },
                {
                  _id: 'rev-2',
                  author: 'Meera K.',
                  city: 'Bangalore',
                  rating: 5,
                  comment:
                    'Ordered an oil painting for our anniversary. The artist shared in-progress photos at every stage. Packaging was completely crated and secure. Absolutely stunning!',
                  medium: 'Oil on Canvas'
                },
                {
                  _id: 'rev-3',
                  author: 'Rohit V.',
                  city: 'New Delhi',
                  rating: 5,
                  comment:
                    'The watercolor painting captures luminosity like nothing else. Far better than a generic digital print. You can feel the real human touch in every stroke.',
                  medium: 'Watercolor Art'
                }
              ]
          ).map((rev) => (
            <div
              key={rev._id}
              className="bg-white rounded-[2rem] p-6 border border-[#1c1a17]/10 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-[#e8b14e]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < (rev.rating || 5)
                          ? 'fill-[#e8b14e] text-[#e8b14e]'
                          : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="font-sans text-xs sm:text-sm text-neutral-600 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-sans">
                <div>
                  <p className="font-bold text-[#1c1a17]">
                    {rev.author || rev.userName}
                  </p>
                  <p className="text-[10px] text-neutral-400">
                    {rev.city || 'Verified Collector'}
                  </p>
                </div>
                <span className="text-[10px] bg-[#faa9b0]/20 text-[#e85c76] px-2.5 py-0.5 rounded-full font-bold">
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
              className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 relative space-y-4"
            >
              <button
                onClick={() => setPreviewModalItem(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="aspect-4/3 w-full overflow-hidden rounded-2xl bg-[#faf9f6]">
                <img
                  src={previewModalItem.image}
                  alt={previewModalItem.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-sans font-bold uppercase text-[#e85c76] tracking-wider">
                  {previewModalItem.medium} • {previewModalItem.dimensions}
                </span>
                <h3 className="font-playfair font-bold text-xl text-[#1c1a17]">
                  {previewModalItem.title}
                </h3>
                {previewModalItem.price && (
                  <p className="font-sans text-sm font-bold text-[#1c1a17]">
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
                  className="bg-[#faa9b0] hover:bg-[#e85c76] text-white font-sans text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-full shadow-sm"
                >
                  Order Custom Artwork
                </button>
                <button
                  onClick={() => setPreviewModalItem(null)}
                  className="bg-gray-100 hover:bg-gray-200 text-[#1c1a17] font-sans text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-full"
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
