import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export const JhankooIntroLoader = ({ onComplete }) => {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Initial states
      gsap.set('.intro-strip', { yPercent: -110 });
      gsap.set('.intro-kicker', { opacity: 0, y: 15 });
      gsap.set('.intro-logo', { opacity: 0, y: 25, scale: 0.85 });
      gsap.set('.intro-tagline', { opacity: 0, y: 10 });
      gsap.set('.intro-photo', { opacity: 0, y: 50, scale: 0.7 });
      gsap.set('.intro-doodle', { opacity: 0, scale: 0, rotation: -30 });
      gsap.set('.intro-bottom', { opacity: 0, y: 15 });
      gsap.set('.intro-counter', { opacity: 0, scale: 0.8 });

      // Animate progress value
      const counterObj = { val: 0 };
      gsap.to(counterObj, {
        val: 100,
        duration: 2.2,
        ease: 'power2.out',
        onUpdate: () => {
          setProgress(Math.floor(counterObj.val));
        }
      });

      // 1. Top color stripes cascade
      tl.to('.intro-strip', {
        yPercent: 0,
        duration: 0.38,
        stagger: 0.08,
        ease: 'power3.out'
      });

      // 2. Kicker text
      tl.to(
        '.intro-kicker',
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
        '-=0.05'
      );

      // 3. Logo and counter
      tl.to(
        ['.intro-logo', '.intro-counter'],
        { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.7)' },
        '-=0.05'
      );

      // 4. Tagline
      tl.to(
        '.intro-tagline',
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
        '-=0.25'
      );

      // 5. Polaroid artwork photos popping in with bounce
      tl.to(
        '.intro-photo',
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.12,
          ease: 'back.out(1.5)'
        },
        '-=0.05'
      );

      // 6. Doodles
      tl.to(
        '.intro-doodle',
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: 'back.out(2)'
        },
        '-=0.2'
      );

      // 7. Bottom ticker
      tl.to(
        '.intro-bottom',
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' },
        '-=0.15'
      );

      // Floating continuous ambient loops
      gsap.to('.floating-palette', {
        y: -10,
        rotation: 6,
        duration: 1.3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
      gsap.to('.floating-star', {
        rotation: 15,
        scale: 1.15,
        duration: 1.1,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
      gsap.to('.floating-flower', {
        y: -8,
        rotation: -8,
        duration: 1.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Hold slightly at 100%
      tl.to({}, { duration: 0.4 });

      // Exit transition: zoom in slightly & fade out smoothly
      tl.to('.intro-content', {
        scale: 1.04,
        opacity: 0,
        duration: 0.45,
        ease: 'power2.in'
      });

      tl.to(
        containerRef.current,
        {
          yPercent: -100,
          duration: 0.55,
          ease: 'power3.inOut'
        },
        '-=0.2'
      );

      tl.call(() => {
        if (typeof onComplete === 'function') {
          onComplete();
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="intro-page fixed inset-0 z-[99999] overflow-hidden bg-[#fffaf8] select-none pointer-events-auto"
    >
      <div className="intro-content relative flex h-full w-full items-center justify-center">
        {/* Top Jhankoo 5-color accent strip */}
        <div className="absolute left-0 top-0 flex h-[70px] w-full overflow-hidden sm:h-[85px]">
          <div className="intro-strip h-full flex-1 bg-[#d4a373]" />
          <div className="intro-strip h-full flex-1 bg-[#faa9b0]" />
          <div className="intro-strip h-full flex-1 bg-[#ffc96f]" />
          <div className="intro-strip h-full flex-1 bg-[#f65a8d]" />
          <div className="intro-strip h-full flex-1 bg-[#d4a373]" />
        </div>

        {/* Floating Palette / Butterfly Doodle on left */}
        <div className="floating-palette intro-doodle absolute left-[4%] top-[34%] h-12 w-12 sm:left-[6%] sm:h-16 sm:w-16">
          <div className="flex h-full w-full items-center justify-center text-3xl sm:text-4xl filter drop-shadow-md">
            🎨
          </div>
        </div>

        {/* Floating Star / Flower Doodle on right */}
        <div className="floating-star intro-doodle absolute right-[5%] top-[32%] h-12 w-12 sm:right-[7%] sm:h-16 sm:w-16">
          <div className="flex h-full w-full items-center justify-center text-3xl sm:text-4xl filter drop-shadow-md">
            ✨
          </div>
        </div>

        {/* Center Intro Card */}
        <div className="relative z-10 flex w-full max-w-[760px] flex-col items-center px-5">
          {/* Top Kicker with accent rules */}
          <div className="intro-kicker mb-2 mt-8 flex items-center gap-2 text-[9px] font-bold tracking-[3px] text-[#b57a78] sm:text-[11px] font-sans">
            <span className="h-px w-6 bg-[#dba4a0] sm:w-8" />
            <span>MADE FOR ART LOVERS</span>
            <span className="h-px w-6 bg-[#dba4a0] sm:w-8" />
          </div>

          {/* Logo & Sparkles */}
          <div className="text-center">
            <div className="intro-logo relative inline-block">
              <span className="absolute -left-6 -top-3 text-base text-[#e8b14e] animate-pulse">
                ✦
              </span>
              <span className="absolute -bottom-2 -right-6 text-base text-[#78a989] animate-pulse">
                ✧
              </span>
              <h1 className="font-caveat text-[55px] sm:text-[80px] font-bold leading-none tracking-[-2px] text-[#e85c76]">
                Chulbul'<span className="text-[#f19b72]">s Art</span>
              </h1>
            </div>
            <p className="intro-tagline mt-3 text-[9px] sm:text-[11px] font-bold uppercase tracking-[3px] text-[#9c7977] font-sans">
              handcrafted memories · timeless original art
            </p>
          </div>

          {/* Floating Polaroid Art Cards with Washi Tape */}
          <div className="relative mt-8 h-[135px] w-[320px] sm:mt-10 sm:h-[180px] sm:w-[560px]">
            {/* Card 1: Oil Painting */}
            <div className="intro-photo absolute left-[4px] top-1/2 h-[90px] w-[90px] -translate-y-1/2 rotate-[-7deg] rounded-[12px] bg-white p-1.5 shadow-[0_15px_35px_rgba(71,46,50,0.14)] sm:left-6 sm:h-[135px] sm:w-[135px] sm:rounded-[14px]">
              <img
                src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80"
                alt="Oil Painting"
                className="h-full w-full rounded-[8px] object-cover"
              />
              <span className="absolute -top-1.5 left-1/2 h-2.5 w-8 -translate-x-1/2 -rotate-3 bg-[#ffdda4]/90 sm:h-3 sm:w-10 rounded-[1px] shadow-xs" />
            </div>

            {/* Card 2: Charcoal Portrait */}
            <div className="intro-photo absolute left-[80px] top-1/2 h-[90px] w-[90px] -translate-y-1/2 rotate-[4deg] rounded-[12px] bg-white p-1.5 shadow-[0_15px_35px_rgba(71,46,50,0.14)] sm:left-[175px] sm:h-[135px] sm:w-[135px] sm:rounded-[14px]">
              <img
                src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80"
                alt="Charcoal Portrait"
                className="h-full w-full rounded-[8px] object-cover"
              />
              <span className="absolute -top-1.5 left-1/2 h-2.5 w-8 -translate-x-1/2 rotate-2 bg-[#ffdda4]/90 sm:h-3 sm:w-10 rounded-[1px] shadow-xs" />
            </div>

            {/* Card 3: Watercolor */}
            <div className="intro-photo absolute right-[80px] top-1/2 h-[90px] w-[90px] -translate-y-1/2 rotate-[-3deg] rounded-[12px] bg-white p-1.5 shadow-[0_15px_35px_rgba(71,46,50,0.14)] sm:right-[175px] sm:h-[135px] sm:w-[135px] sm:rounded-[14px]">
              <img
                src="https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=400&q=80"
                alt="Watercolor"
                className="h-full w-full rounded-[8px] object-cover"
              />
              <span className="absolute -top-1.5 left-1/2 h-2.5 w-8 -translate-x-1/2 -rotate-2 bg-[#ffdda4]/90 sm:h-3 sm:w-10 rounded-[1px] shadow-xs" />
            </div>

            {/* Card 4: Acrylic Painting */}
            <div className="intro-photo absolute right-[4px] top-1/2 h-[90px] w-[90px] -translate-y-1/2 rotate-[7deg] rounded-[12px] bg-white p-1.5 shadow-[0_15px_35px_rgba(71,46,50,0.14)] sm:right-6 sm:h-[135px] sm:w-[135px] sm:rounded-[14px]">
              <img
                src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=400&q=80"
                alt="Acrylic Art"
                className="h-full w-full rounded-[8px] object-cover"
              />
              <span className="absolute -top-1.5 left-1/2 h-2.5 w-8 -translate-x-1/2 rotate-3 bg-[#ffdda4]/90 sm:h-3 sm:w-10 rounded-[1px] shadow-xs" />
            </div>
          </div>

          {/* Live Percentage Counter & Progress Line */}
          <div className="intro-counter mt-6 flex flex-col items-center gap-1.5">
            <span className="font-caveat text-xl sm:text-2xl font-bold text-[#e85c76]">
              {progress}%
            </span>
            <div className="h-1 w-32 sm:w-44 overflow-hidden rounded-full bg-[#fde8ef]">
              <div
                className="h-full bg-gradient-to-r from-[#faa9b0] via-[#f19b72] to-[#e85c76] transition-all duration-75 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Bottom Ticker */}
          <div className="intro-bottom mt-5 flex items-center gap-2 text-[8px] font-extrabold uppercase tracking-[2px] text-[#9c8583] sm:gap-3 sm:text-[10px] font-sans">
            <span>DISCOVER</span>
            <span className="h-1 w-1 rounded-full bg-[#e85c76]" />
            <span>HANDMADE</span>
            <span className="h-1 w-1 rounded-full bg-[#e85c76]" />
            <span>PORTRAITS</span>
            <span className="h-1 w-1 rounded-full bg-[#e85c76]" />
            <span>HEIRLOOM ART</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JhankooIntroLoader;
