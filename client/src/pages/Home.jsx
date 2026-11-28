import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Upload,
  ReceiptIndianRupee,
  Paintbrush,
  Truck,
  Star,
  ArrowDown,
  Palette,
  Camera,
  Feather,
  Layers,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useWishlist } from '../hooks/useWishlist';
import ArtworkCard from '../components/common/ArtworkCard';
import ScribbleWordmark from '../components/common/ScribbleWordmark';
import { STUDIO_ARTWORKS } from '../data/studioFallbacks';
import api from '../services/api';

gsap.registerPlugin(ScrollTrigger);

const CURATED_PICKS_FALLBACK = STUDIO_ARTWORKS;

const SIGNATURE_MEDIUMS = [
  {
    num: '01',
    name: 'CHARCOAL',
    desc: 'Deep contrast & timeless hyper-realistic shading',
    bg: '#b2a497',
    img: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
  },
  {
    num: '02',
    name: 'WATERCOLOR',
    desc: 'Luminous translucent washes on textured cotton paper',
    bg: '#495061',
    img: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=600&q=80',
  },
  {
    num: '03',
    name: 'OIL PAINT',
    desc: 'Museum-grade pigments layered onto primed canvas',
    bg: '#ac9281',
    img: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
  },
  {
    num: '04',
    name: 'ACRYLIC',
    desc: 'Bold palette-knife textures bursting with color',
    bg: '#393b29',
    img: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80',
  },
];

const COMMISSION_STEPS = [
  {
    num: '01',
    title: 'Upload Your Photo',
    desc: 'Share one or more favorite photos along with your preferred medium and dimensions.',
    icon: Upload,
  },
  {
    num: '02',
    title: 'Receive Custom Quote',
    desc: 'Chulbul reviews your reference and responds with pricing and completion timeline.',
    icon: ReceiptIndianRupee,
  },
  {
    num: '03',
    title: 'Watch It Come Alive',
    desc: 'Receive work-in-progress snapshots at key brushstroke milestones for your approval.',
    icon: Paintbrush,
  },
  {
    num: '04',
    title: 'Museum-Safe Delivery',
    desc: 'Carefully varnished, signed, crated, and shipped across India and worldwide.',
    icon: Truck,
  },
];

const FALLBACK_REVIEWS = [
  {
    _id: 'rev-1',
    author: 'Aarav & Priya S.',
    city: 'Mumbai',
    rating: 5,
    comment:
      'The charcoal portrait of our grandparents brought our entire family to tears. The eye details and textures are unbelievable. Truly museum-grade craftsmanship.',
    medium: 'Charcoal Portrait',
  },
  {
    _id: 'rev-2',
    author: 'Meera K.',
    city: 'Bangalore',
    rating: 5,
    comment:
      'Ordered an oil painting for our anniversary. The artist shared in-progress photos at every stage. Packaging was completely crated and secure.',
    medium: 'Oil on Canvas',
  },
  {
    _id: 'rev-3',
    author: 'Rohit V.',
    city: 'New Delhi',
    rating: 5,
    comment:
      'The watercolor painting captures luminosity like nothing else. Far better than any print — you feel the real human touch in every stroke.',
    medium: 'Watercolor Art',
  },
];

const BlurChars = ({ text }) =>
  text.split('').map((ch, idx) => (
    <span key={idx} className="blur-char">
      {ch === ' ' ? '\u00A0' : ch}
    </span>
  ));

export const Home = () => {
  const { setPageTitle, siteName } = useSettings();
  const navigate = useNavigate();

  const [featuredArtworks, setFeaturedArtworks] = useState(CURATED_PICKS_FALLBACK);
  const [reviews, setReviews] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [tooltipLabel, setTooltipLabel] = useState(null);
  const [ripples, setRipples] = useState([]);
  const { wishlistedIds, toggleWishlist } = useWishlist();

  const wordmarkShort = (siteName || "chulbul's").split(' ')[0].toLowerCase();

  // Desktop scrollytelling refs
  const desktopSectionRef = useRef(null);
  const pinStageRef = useRef(null);
  const phase0Ref = useRef(null);
  const phase1Ref = useRef(null);
  const phase2Ref = useRef(null);
  const phase3Ref = useRef(null);
  const phase4Ref = useRef(null);
  const phase5Ref = useRef(null);
  const tooltipRef = useRef(null);
  const propsRefs = useRef([]);
  const fanGroupRef = useRef(null);
  const grainCanvasRef = useRef(null);

  useEffect(() => {
    setPageTitle('Home');
    const fetchData = async () => {
      try {
        const [featRes, revRes] = await Promise.all([
          api.get('/artworks/featured').catch(() => ({ data: { success: false } })),
          api.get('/reviews/public?homeOnly=true').catch(() => ({ data: { success: false } })),
        ]);
        if (featRes.data?.success && featRes.data.data?.length > 0) {
          setFeaturedArtworks(featRes.data.data);
        }
        if (revRes.data?.success && revRes.data.data?.length > 0) {
          setReviews(revRes.data.data);
        }
      } catch (err) {
        // Safe defaults already populated
      }
    };
    fetchData();
  }, [setPageTitle]);

  // Procedural noise canvas for Phase 5 Obsidian Noir stage
  useEffect(() => {
    const canvas = grainCanvasRef.current;
    if (!canvas) return;
    canvas.width = 192;
    canvas.height = 192;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = ctx.createImageData(192, 192);
    const data = img.data;
    for (let i = 0; i < data.length; i += 4) {
      const shade = Math.floor(Math.random() * 255);
      data[i] = shade;
      data[i + 1] = Math.max(0, shade - 12);
      data[i + 2] = Math.min(255, shade + 18);
      data[i + 3] = Math.floor(Math.random() * 55 + 15);
    }
    ctx.putImageData(img, 0, 0);
  }, []);

  // Desktop GSAP Pinned 6-Phase Editorial Scrollytelling
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(min-width: 769px)', () => {
      const triggerEl = pinStageRef.current;
      if (!triggerEl) return;

      gsap.set([phase1Ref.current, phase2Ref.current, phase3Ref.current, phase4Ref.current, phase5Ref.current], {
        autoAlpha: 0,
      });
      gsap.set(phase0Ref.current, { autoAlpha: 1, scale: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerEl,
          start: 'top top',
          end: '+=440%',
          pin: true,
          scrub: 0.9,
          anticipatePin: 1,
        },
      });

      // Phase 0 -> Phase 1 (White hero wordmark ascends -> Sunlit studio desk zoom focus)
      tl.to(phase0Ref.current, { scale: 0.85, y: -60, autoAlpha: 0, duration: 0.8, ease: 'power2.in' }, 0.1)
        .fromTo(
          phase1Ref.current,
          { autoAlpha: 0, scale: 1.12, filter: 'blur(20px)' },
          { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 1.0, ease: 'power2.out' },
          0.45
        );

      // Phase 1 -> Phase 2 (Fade Phase 1 cleanly before Dark Maroon enters to prevent text bleed)
      tl.to(phase1Ref.current, { autoAlpha: 0, scale: 0.94, duration: 0.5 }, 1.6)
        .fromTo(
          phase2Ref.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.65, ease: 'power2.out' },
          2.15
        )
        .fromTo(
          '.phase2-fan-card',
          { y: 60, opacity: 0, scale: 0.86 },
          { y: 0, opacity: 1, scale: 1, stagger: 0.08, duration: 0.7, ease: 'power3.out' },
          2.15
        )
        .fromTo(
          '.phase2-blur .blur-char',
          { opacity: 0, filter: 'blur(10px)', y: 12 },
          { opacity: 1, filter: 'blur(0px)', y: 0, stagger: 0.015, duration: 0.55 },
          2.25
        );

      // Phase 2 -> Phase 3 (4 Signature Medium Columns sliding up)
      tl.to(phase2Ref.current, { autoAlpha: 0, duration: 0.6 }, 3.35)
        .fromTo(
          phase3Ref.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.7 },
          3.45
        )
        .fromTo(
          '.phase3-col',
          { yPercent: 22, opacity: 0 },
          { yPercent: 0, opacity: 1, stagger: 0.09, duration: 0.7, ease: 'power3.out' },
          3.55
        );

      // Phase 3 -> Phase 4 (Cool Mist "For Story Keepers" + Size Guide Scale Morph)
      tl.to(phase3Ref.current, { autoAlpha: 0, duration: 0.6 }, 4.65)
        .fromTo(
          phase4Ref.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.8 },
          4.8
        )
        .fromTo(
          '.phase4-size-card',
          { scale: 0.82, opacity: 0, y: 24 },
          { scale: 1, opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'back.out(1.2)' },
          4.9
        );

      // Phase 4 -> Phase 5 (Obsidian Film Grain -> Bespoke Studio Showcase Cards)
      tl.to(phase4Ref.current, { autoAlpha: 0, duration: 0.6 }, 6.0)
        .fromTo(
          phase5Ref.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.8 },
          6.15
        )
        .fromTo(
          '.phase5-reveal',
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.1, duration: 0.65, ease: 'power3.out' },
          6.3
        );
    });

    return () => mm.revert();
  }, []);

  // Mouse interaction for Phase 1 magnetic studio props & Phase 2 3D fan tilt
  const handleStageMouseMove = (e) => {
    if (tooltipRef.current) {
      tooltipRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -140%)`;
    }

    // Repel studio desk floating items gently
    propsRefs.current.forEach((el, idx) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const radius = 320;
      if (dist < radius) {
        const force = 1 - dist / radius;
        const moveX = -(dx / (dist || 1)) * force * 20;
        const moveY = -(dy / (dist || 1)) * force * 20;
        gsap.to(el, {
          x: moveX,
          y: moveY,
          rotation: ((idx % 2 === 0 ? 1 : -1) * force * 6),
          duration: 1.2,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      } else {
        gsap.to(el, {
          x: 0,
          y: 0,
          rotation: 0,
          duration: 1.6,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
    });

    // 3D perspective tilt on Phase 2 fan group
    if (fanGroupRef.current) {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      gsap.to(fanGroupRef.current, {
        rotateY: nx * 8,
        rotateX: -ny * 7,
        transformPerspective: 1400,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  };

  const triggerColumnRipple = (colIdx, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now() + Math.random();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipples((prev) => [...prev, { id, colIdx, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 950);
  };

  const filteredArtworks = featuredArtworks.filter((art) => {
    if (activeFilter === 'All') return true;
    const str = `${art.medium || ''} ${art.category?.name || ''} ${art.title || ''}`.toLowerCase();
    return str.includes(activeFilter.toLowerCase());
  });

  const displayedReviews = reviews.length > 0 ? reviews.slice(0, 3) : FALLBACK_REVIEWS;

  const scrollToGallerySection = () => {
    const el = document.getElementById('curated-artworks');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full overflow-x-clip bg-[#f2f1f6]">
      {/* Dynamic Frosted Tool Tooltip on Desktop Hover */}
      <div
        ref={tooltipRef}
        className={`artwork-tool-tooltip hidden md:flex items-center gap-1.5 text-[12px] font-semibold text-[#111827] transition-opacity duration-200 ${
          tooltipLabel ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-[#ff0457]" />
        <span>{tooltipLabel}</span>
      </div>

      {/* ================================================================== */}
      {/* DESKTOP 6-PHASE EDITORIAL SCROLLYTELLING (> 768px)                 */}
      {/* ================================================================== */}
      <section
        ref={desktopSectionRef}
        onMouseMove={handleStageMouseMove}
        className="hidden md:block relative w-full bg-white"
      >
        <div
          ref={pinStageRef}
          className="relative w-full h-screen min-h-[680px] overflow-hidden bg-white"
        >
          {/* PHASE 0: Pure White Hero Stage + Extruded Wordmark */}
          <div
            ref={phase0Ref}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white px-8"
          >
            <div className="flex flex-col items-center text-center gap-5">
              <ScribbleWordmark
                text={wordmarkShort}
                subtitle="ORIGINAL ART & COMMISSIONS"
                variant="white"
                size="hero"
              />
              <p className="max-w-lg text-[15px] text-[#6e6e73] font-medium tracking-[-0.01em] mt-2">
                Handcrafted portraits, watercolors, and heirloom oils painted stroke by stroke from your memories.
              </p>
              <div className="flex items-center gap-3 mt-2">
                <Link
                  to="/custom-order"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#ff0457] hover:bg-[#d90349] text-white text-[13px] font-bold shadow-[0_10px_28px_rgba(255,4,87,0.3)] transition-all hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Commission Custom Art</span>
                </Link>
                <Link
                  to="/gallery"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#f2f1f6] hover:bg-[#e5e4ea] text-[#111827] text-[13px] font-semibold transition-colors"
                >
                  <span>Explore Gallery</span>
                </Link>
              </div>
            </div>

            <div className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-[#6e6e73] animate-bounce">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">
                scroll down
              </span>
              <ArrowDown className="w-4 h-4" />
            </div>
          </div>

          {/* PHASE 1: Sunlit Studio Desk Flat-Lay + Cursor-Repelling Art Props */}
          <div
            ref={phase1Ref}
            className="absolute inset-0 z-20 flex items-center justify-center overflow-hidden"
            style={{
              background:
                'radial-gradient(circle at 78% 18%, #fff4dc 0%, #f4e6d2 36%, #e3ceba 68%, #ccb5a0 100%)',
            }}
          >
            {/* Soft Dappled Sunlight Shafts */}
            <div
              className="absolute inset-0 pointer-events-none opacity-65 mix-blend-soft-light"
              style={{
                background:
                  'radial-gradient(ellipse at 28% 35%, rgba(255,255,255,0.75) 0%, transparent 55%), radial-gradient(ellipse at 80% 75%, rgba(255,220,165,0.6) 0%, transparent 60%)',
              }}
            />

            {/* Floating Interactive Art Tools around Centerpiece */}
            <div
              ref={(el) => (propsRefs.current[0] = el)}
              onMouseEnter={() => setTooltipLabel('Charcoal Sketchbook')}
              onMouseLeave={() => setTooltipLabel(null)}
              className="absolute top-[16%] left-[12%] z-20 p-4 rounded-2xl bg-white/85 backdrop-blur-md shadow-[0_14px_30px_rgba(30,15,5,0.14)] -rotate-6 border border-white cursor-pointer transition-shadow hover:shadow-xl"
            >
              <Feather className="w-7 h-7 text-[#111827]" />
              <span className="block text-[10px] font-bold tracking-wider uppercase text-[#6e6e73] mt-1">
                6B Charcoal
              </span>
            </div>

            <div
              ref={(el) => (propsRefs.current[1] = el)}
              onMouseEnter={() => setTooltipLabel('Mineral Pigment Palette')}
              onMouseLeave={() => setTooltipLabel(null)}
              className="absolute top-[18%] right-[13%] z-20 p-4 rounded-full bg-white/90 backdrop-blur-md shadow-[0_14px_30px_rgba(30,15,5,0.14)] rotate-12 border border-white cursor-pointer"
            >
              <Palette className="w-8 h-8 text-[#ff0457]" />
            </div>

            <div
              ref={(el) => (propsRefs.current[2] = el)}
              onMouseEnter={() => setTooltipLabel('Reference Print Camera')}
              onMouseLeave={() => setTooltipLabel(null)}
              className="absolute bottom-[22%] right-[14%] z-20 p-4 rounded-2xl bg-white/88 backdrop-blur-md shadow-[0_14px_30px_rgba(30,15,5,0.14)] -rotate-6 border border-white cursor-pointer"
            >
              <Camera className="w-7 h-7 text-[#111827]" />
              <span className="block text-[10px] font-bold tracking-wider uppercase text-[#6e6e73] mt-1">
                From Photo
              </span>
            </div>

            {/* Center Framed Studio Artwork Plate */}
            <div className="relative z-10 w-[300px] lg:w-[350px] aspect-[4/5] bg-white p-3.5 rounded-[18px] shadow-[0_32px_70px_rgba(35,18,8,0.28)] border border-white rotate-[-2deg]">
              <img
                src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80"
                alt="Artist studio flatlay desk"
                className="w-full h-full object-cover rounded-[12px]"
              />
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#ffe5ee]/90 rotate-1 shadow-sm border border-[#ffc2d7]" />
            </div>

            {/* Corner Frosted Glass Info Box matching myscribble .corner-card */}
            <div className="absolute bottom-14 left-12 z-30 max-w-md px-6 py-4 rounded-[20px] bg-white/75 backdrop-blur-xl border border-white/80 shadow-[0_12px_32px_rgba(0,0,0,0.08)]">
              <p className="text-[13px] font-bold tracking-[0.14em] text-[#111827] uppercase leading-snug">
                FOR THE MEMORIES YOU NEVER WANT TO FORGET
              </p>
              <p className="text-[12px] font-medium text-[#6e6e73] mt-1 tracking-wide">
                rooted in india. delivering everywhere.
              </p>
            </div>
          </div>

          {/* PHASE 2: Deep Maroon "For Collectors" 3D Fanned Artworks */}
          <div
            ref={phase2Ref}
            className="absolute inset-0 z-30 flex items-center justify-center px-12"
            style={{
              background:
                'radial-gradient(circle at 50% 45%, #65121a 0%, #3d090f 55%, #1c0306 100%)',
            }}
          >
            <div className="max-w-6xl w-full grid grid-cols-12 items-center gap-10">
              {/* 3 Fanned Framed Artworks with Mouse Perspective */}
              <div
                ref={fanGroupRef}
                className="col-span-6 relative h-[430px] flex items-center justify-center"
              >
                <div className="phase2-fan-card absolute -translate-x-24 translate-y-4 -rotate-[16deg] w-[220px] h-[290px] rounded-[16px] overflow-hidden border-4 border-white/90 shadow-[0_24px_50px_rgba(0,0,0,0.5)]">
                  <img
                    src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80"
                    alt="Charcoal heirloom piece"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="phase2-fan-card absolute translate-x-24 translate-y-4 rotate-[16deg] w-[220px] h-[290px] rounded-[16px] overflow-hidden border-4 border-white/90 shadow-[0_24px_50px_rgba(0,0,0,0.5)]">
                  <img
                    src="https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=600&q=80"
                    alt="Watercolor botanical portrait"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="phase2-fan-card relative z-10 w-[245px] h-[325px] rounded-[18px] overflow-hidden border-[5px] border-white shadow-[0_30px_65px_rgba(0,0,0,0.65)]">
                  <img
                    src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=700&q=80"
                    alt="Original oil floral canvas"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Right Typography Reveal */}
              <div className="col-span-6 space-y-5 text-left">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#ffc2d7] text-[11px] font-bold uppercase tracking-widest">
                  Heirloom Fine Art
                </span>
                <h2 className="phase2-blur editorial-serif text-6xl lg:text-7xl text-white font-normal leading-[0.98]">
                  <BlurChars text="For Collectors" />
                </h2>
                <p className="phase2-blur text-lg text-white/80 font-normal leading-relaxed max-w-md">
                  <BlurChars text="For memories that belong anywhere and everywhere." />
                </p>
                <div className="pt-2">
                  <Link
                    to="/gallery"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#111827] text-[13px] font-bold hover:bg-[#ffe5ee] transition-colors"
                  >
                    <span>Browse Past Commissions</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* PHASE 3: 4 Dashed Signature Medium Columns + Thermal Ripples */}
          <div
            ref={phase3Ref}
            className="absolute inset-0 z-40 grid grid-cols-12 bg-[#16161b] text-white"
          >
            {/* Left Framed Spotlight */}
            <div className="col-span-4 flex flex-col items-center justify-center p-10 border-r border-dashed border-white/20">
              <div className="w-[230px] aspect-[3/4] rounded-[16px] overflow-hidden border-[5px] border-white shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=700&q=80"
                  alt="Signature medium study"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-6 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[12px] font-medium text-white/90">
                Available in 4 signature mediums
              </div>
            </div>

            {/* Right 4 Dashed Columns */}
            <div className="col-span-8 grid grid-cols-4 h-full">
              {SIGNATURE_MEDIUMS.map((med, colIdx) => (
                <div
                  key={med.num}
                  onClick={(e) => triggerColumnRipple(colIdx, e)}
                  className="phase3-col group relative h-full border-r border-dashed border-white/20 last:border-r-0 overflow-hidden cursor-pointer flex flex-col justify-between p-6"
                  style={{ backgroundColor: med.bg }}
                >
                  <img
                    src={med.img}
                    alt={med.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-55 group-hover:scale-105 group-hover:opacity-75 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/30" />

                  {ripples
                    .filter((r) => r.colIdx === colIdx)
                    .map((r) => (
                      <span
                        key={r.id}
                        className="thermal-diffusion-wave"
                        style={{ left: r.x, top: r.y }}
                      />
                    ))}

                  <div className="relative z-10 flex items-center justify-between text-[11px] font-bold tracking-[0.18em] text-white/90 pt-14">
                    <span>{med.num}</span>
                    <span>/</span>
                  </div>

                  <div className="relative z-10 space-y-2 pb-12">
                    <h3 className="text-[11px] xl:text-[14px] font-bold tracking-[0.08em] xl:tracking-[0.14em] text-white">
                      {med.name}
                    </h3>
                    <p className="text-[12px] text-white/80 leading-snug">
                      {med.desc}
                    </p>
                    <Link
                      to={`/gallery?medium=${encodeURIComponent(med.name.split(' ')[0])}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#ffc2d7] hover:text-white pt-1"
                    >
                      <span>Explore</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PHASE 4: Cool Slate Mist "For Story Keepers" + Size Guide Scale */}
          <div
            ref={phase4Ref}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center px-12 bg-[#c1c7d0] text-[#111827]"
          >
            <div className="max-w-5xl w-full text-center space-y-3 mb-10">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/60 backdrop-blur-md text-[11px] font-bold uppercase tracking-widest text-[#111827]">
                <Layers className="w-3.5 h-3.5 text-[#ff0457]" /> Archival Sizes
              </span>
              <h2 className="editorial-serif text-5xl lg:text-7xl text-[#111827] font-normal">
                For Story Keepers
              </h2>
              <p className="text-[16px] text-[#3c3c43] font-medium">
                Make memories tangible. Keep them close — sized cleanly for desks, shelves, and gallery walls.
              </p>
            </div>

            <div className="max-w-4xl w-full grid grid-cols-4 gap-5 items-end">
              {[
                { label: 'A4 Portrait', size: '8 × 12 in', h: 'h-48', price: 'From ₹1,999' },
                { label: 'A3 Classic', size: '12 × 16 in', h: 'h-60', price: 'From ₹3,499' },
                { label: 'Grand Oil', size: '18 × 24 in', h: 'h-72', price: 'From ₹6,499' },
                { label: 'Square Heirloom', size: '16 × 16 in', h: 'h-56', price: 'From ₹4,999' },
              ].map((s, idx) => (
                <Link
                  key={s.label}
                  to="/pricing"
                  className="phase4-size-card group flex flex-col items-center gap-3"
                >
                  <div
                    className={`w-full ${s.h} rounded-[18px] bg-white p-2.5 shadow-[0_16px_40px_rgba(17,24,39,0.12)] border border-white transition-transform duration-300 group-hover:-translate-y-2`}
                  >
                    <img
                      src={CURATED_PICKS_FALLBACK[idx].images[0].url}
                      alt={s.label}
                      className="w-full h-full object-cover rounded-[12px]"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-[14px] font-bold text-[#111827]">{s.label}</p>
                    <p className="text-[12px] text-[#4b5563]">
                      {s.size} • <span className="font-semibold text-[#ff0457]">{s.price}</span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* PHASE 5: Obsidian Film Grain -> "Live Custom Studio" Explore Showcase */}
          <div
            ref={phase5Ref}
            className="absolute inset-0 z-[60] flex flex-col items-center justify-center px-10 bg-[#0b0b0f] text-white overflow-hidden"
          >
            <canvas
              ref={grainCanvasRef}
              className="absolute inset-0 w-full h-full opacity-[0.14] pointer-events-none mix-blend-screen"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle at 50% 35%, rgba(255,4,87,0.22) 0%, rgba(11,11,15,0) 62%)',
              }}
            />

            <div className="relative z-10 max-w-5xl w-full space-y-6">
              <div className="phase5-reveal text-center space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff0457] text-white text-[11px] font-bold uppercase tracking-widest">
                  <Sparkles className="w-3 h-3" /> Now Open
                </span>
                <h2 className="editorial-serif text-5xl lg:text-6xl text-white font-normal leading-[1.02]">
                  Introducing our Bespoke Art Studio
                </h2>
                <p className="text-[14px] text-white/70">
                  Painted directly from your photographs — tracked live from sketch to varnished frame.
                </p>
              </div>

              {/* Pastel Frosted Explore Cards Grid matching Phase 5 */}
              <div className="phase5-reveal rounded-[26px] bg-white/95 backdrop-blur-2xl p-5 text-[#111827] shadow-[0_24px_80px_rgba(0,0,0,0.45)] space-y-4">
                <div className="relative overflow-hidden rounded-[18px] bg-[#16161b] text-white p-6 flex items-center justify-between gap-6">
                  <img
                    src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1000&q=80"
                    alt="Studio paints banner"
                    className="absolute inset-0 w-full h-full object-cover opacity-35"
                  />
                  <div className="relative z-10">
                    <h3 className="editorial-serif text-3xl text-white font-normal">
                      Commission Custom Artwork
                    </h3>
                    <p className="text-[12px] text-white/75 mt-1">
                      Submit your photo in under 60 seconds and get a direct quote from Chulbul.
                    </p>
                  </div>
                  <Link
                    to="/custom-order"
                    className="relative z-10 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#ff0457] hover:bg-[#d90349] text-white text-[13px] font-bold shrink-0 transition-colors"
                  >
                    <span>Start Now</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-3.5">
                  {[
                    {
                      title: 'For Portrait Lovers',
                      to: '/gallery?medium=Charcoal',
                      bg: '#3d090f',
                      img: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80',
                    },
                    {
                      title: 'For Memory Keepers',
                      to: '/gallery?medium=Watercolor',
                      bg: '#4b5563',
                      img: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=400&q=80',
                    },
                    {
                      title: 'For Collectors',
                      to: '/gallery',
                      bg: '#18181b',
                      img: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80',
                    },
                  ].map((c) => (
                    <Link
                      key={c.title}
                      to={c.to}
                      className="group relative rounded-[16px] overflow-hidden p-4 h-36 flex items-end text-white"
                      style={{ backgroundColor: c.bg }}
                    >
                      <img
                        src={c.img}
                        alt={c.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="relative z-10 flex items-center justify-between w-full">
                        <span className="editorial-serif text-2xl">{c.title}</span>
                        <ArrowUpRight className="w-4 h-4 opacity-80" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={scrollToGallerySection}
              className="relative z-10 mt-5 inline-flex items-center gap-1.5 text-[12px] font-semibold text-white/75 hover:text-white"
            >
              <span>Scroll down for Shoppable Gallery</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Persistent Subtle Skip Control during scroll phases */}
          <button
            type="button"
            onClick={scrollToGallerySection}
            className="absolute bottom-6 left-6 z-[70] px-4 py-2 rounded-full bg-white/80 hover:bg-white backdrop-blur-md text-[12px] font-semibold text-[#111827] border border-black/10 shadow-sm transition-all"
          >
            Jump to Artworks ↓
          </button>
        </div>
      </section>

      {/* ================================================================== */}
      {/* MOBILE EDITORIAL HOME EXPERIENCE (<= 768px)                        */}
      {/* ================================================================== */}
      <section className="md:hidden pt-[72px] px-2.5 space-y-2.5 bg-[#f2f1f6]">
        {/* Mobile Card 1: Rounded Studio Desk Hero Banner */}
        <div
          className="relative overflow-hidden rounded-[24px] p-5 min-h-[380px] flex flex-col justify-between shadow-sm"
          style={{
            background:
              'radial-gradient(circle at 80% 15%, #fff3d6 0%, #f1e1cc 45%, #d6beaa 100%)',
          }}
        >
          <div className="relative z-10 flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-[#111827]">
              Handmade Studio
            </span>
            <Link
              to="/custom-order"
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#ff0457] text-white text-[11px] font-bold"
            >
              <Sparkles className="w-3 h-3" />
              <span>Custom</span>
            </Link>
          </div>

          <div className="my-4 mx-auto w-[195px] aspect-[4/5] rounded-[16px] overflow-hidden border-[4px] border-white shadow-[0_18px_40px_rgba(30,15,5,0.22)] -rotate-2">
            <img
              src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80"
              alt="Chulbul's Art Studio"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 rounded-[18px] bg-white/82 backdrop-blur-xl p-4 border border-white/80">
            <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#111827] leading-snug">
              FOR THE MEMORIES YOU NEVER WANT TO FORGET
            </p>
            <p className="text-[11px] text-[#6e6e73] mt-0.5">
              rooted in india. delivering everywhere.
            </p>
          </div>
        </div>

        {/* Mobile Card 2: Dark Maroon "For Portrait Lovers" */}
        <Link
          to="/gallery?medium=Charcoal"
          className="block relative overflow-hidden rounded-[24px] p-5 text-white shadow-sm"
          style={{
            background:
              'radial-gradient(circle at 25% 25%, #65121a 0%, #3d090f 55%, #160204 100%)',
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1 max-w-[58%]">
              <h2 className="editorial-serif text-[32px] text-white font-normal leading-none">
                For Portrait Lovers
              </h2>
              <p className="text-[12px] text-white/75 leading-snug">
                Charcoal & fine art painted stroke by stroke from your photos.
              </p>
            </div>
            <div className="relative w-28 h-28 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80"
                alt="Portrait sketch"
                className="w-full h-full object-cover rounded-[14px] border-2 border-white rotate-3 shadow-lg"
              />
            </div>
          </div>
        </Link>

        {/* Mobile Card 3: Slate Blue "For Story Keepers" */}
        <Link
          to="/pricing"
          className="block relative overflow-hidden rounded-[24px] p-5 text-white shadow-sm"
          style={{
            background:
              'linear-gradient(135deg, #27374d 0%, #526d82 60%, #9db2bf 100%)',
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="relative w-24 h-24 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=400&q=80"
                alt="Watercolor story"
                className="w-full h-full object-cover rounded-[14px] border-2 border-white -rotate-3 shadow-lg"
              />
            </div>
            <div className="space-y-1 text-right">
              <h2 className="editorial-serif text-[30px] text-white font-normal leading-none">
                For Story Keepers
              </h2>
              <p className="text-[12px] text-white/85 leading-snug">
                Make memories tangible. Keep them close.
              </p>
            </div>
          </div>
        </Link>

        {/* Mobile Horizontal Mediums Snap Pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
          {SIGNATURE_MEDIUMS.map((m) => (
            <Link
              key={m.num}
              to={`/gallery?medium=${encodeURIComponent(m.name.split(' ')[0])}`}
              className="shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-[#e5e5ea] text-[12px] font-semibold text-[#111827] shadow-xs"
            >
              <span className="text-[10px] font-bold text-[#ff0457]">{m.num}</span>
              <span>{m.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ================================================================== */}
      {/* SHARED CURATED ARTWORKS GRID (Desktop 4-Col / Mobile 2-Col)         */}
      {/* ================================================================== */}
      <section
        id="curated-artworks"
        className="relative z-20 max-w-[1200px] mx-auto px-2.5 sm:px-6 lg:px-8 pt-10 md:pt-16 pb-10 space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-1">
          <div>
            <span className="eyebrow">Curated Originals & Past Commissions</span>
            <h2 className="text-[26px] sm:text-[34px] font-bold tracking-[-0.03em] text-[#111827] leading-tight mt-1">
              Handcrafted on Paper & Canvas
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pb-1">
            {['All', 'Charcoal', 'Watercolor', 'Oil', 'Acrylic'].map((tab) => {
              const active = activeFilter === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveFilter(tab)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12px] sm:text-[13px] font-semibold transition-all ${
                    active
                      ? 'bg-[#111827] text-white shadow-sm'
                      : 'bg-white text-[#3c3c43] border border-[#e5e5ea] hover:border-[#111827]'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Col Mobile / 4-Col Desktop Cards matching ProductCard grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
          {filteredArtworks.slice(0, 8).map((art, idx) => (
            <ArtworkCard
              key={art._id || idx}
              artwork={art}
              index={idx}
              isWishlisted={wishlistedIds.has(art._id)}
              onToggleWishlist={toggleWishlist}
            />
          ))}
        </div>

        {/* Center Bright #ff0448 View All Pill Button matching myscribble mobile */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#ff0448] hover:bg-[#d90349] text-white text-[14px] font-bold shadow-[0_10px_28px_rgba(255,4,72,0.28)] transition-all hover:-translate-y-0.5"
          >
            <span>View All Artworks</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={() => navigate('/custom-order')}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-[#ffe5ee] text-[#111827] border border-[#e5e5ea] text-[14px] font-semibold transition-colors"
          >
            <Sparkles className="w-4 h-4 text-[#ff0457]" />
            <span>Commission Custom Art</span>
          </button>
        </div>
      </section>

      {/* ================================================================== */}
      {/* COMMISSION PROCESS & COLLECTOR REVIEWS (Clean White Rounded Cards) */}
      {/* ================================================================== */}
      <section className="max-w-[1200px] mx-auto px-2.5 sm:px-6 lg:px-8 pb-12 space-y-6">
        <div className="rounded-[24px] bg-white border border-[#e8e8ed] p-6 sm:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.03)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="eyebrow">How It Works</span>
              <h3 className="text-[22px] sm:text-[28px] font-bold tracking-[-0.025em] text-[#111827] mt-1">
                From Your Photo to Framed Heirloom
              </h3>
            </div>
            <Link
              to="/pricing"
              className="text-[13px] font-semibold text-[#ff0457] hover:underline inline-flex items-center gap-1"
            >
              <span>See sizing & prices</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {COMMISSION_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="rounded-[18px] bg-[#f8f7fb] border border-[#eae9ee] p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[18px] font-bold text-[#ff0457]">
                      {step.num}
                    </span>
                    <div className="w-9 h-9 rounded-full bg-white border border-[#eae9ee] flex items-center justify-center text-[#111827]">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h4 className="text-[14px] font-bold text-[#111827]">
                    {step.title}
                  </h4>
                  <p className="text-[12px] text-[#6e6e73] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Collector Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {displayedReviews.map((rev) => (
            <div
              key={rev._id}
              className="rounded-[24px] bg-white border border-[#e8e8ed] p-6 flex flex-col justify-between gap-4 shadow-[0_6px_24px_rgba(0,0,0,0.03)]"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-0.5 text-[#f59e0b]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < (rev.rating || 5) ? 'fill-[#f59e0b]' : 'text-[#e5e5ea]'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[13px] text-[#3c3c43] leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>
              <div className="pt-3 border-t border-[#f2f1f6] flex items-center justify-between gap-2">
                <div>
                  <p className="text-[13px] font-bold text-[#111827]">
                    {rev.author || rev.userName}
                  </p>
                  <p className="text-[11px] text-[#8e8e93]">
                    {rev.city || 'Verified Collector'}
                  </p>
                </div>
                <span className="shrink-0 whitespace-nowrap px-2.5 py-1 rounded-full bg-[#ffe5ee] text-[#ff0155] text-[11px] font-bold">
                  {rev.medium || 'Custom Art'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
