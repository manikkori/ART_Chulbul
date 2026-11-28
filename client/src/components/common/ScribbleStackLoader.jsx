import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const STACK_ARTWORKS = [
  'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=600&q=80',
];

const STACK_FRAMES = [
  ...STACK_ARTWORKS.map((src) => ({ type: 'image', src })),
  { type: 'image', src: STACK_ARTWORKS[0] },
  { type: 'image', src: STACK_ARTWORKS[3] },
  { type: 'color', color: '#ffffff' },
];

/**
 * Exact myscribble.in .stack-stage GSAP stack-and-zoom preloader.
 * Hot-pink (#ff0457) stage, minimal weight-200 counter top-left,
 * Figma-handle framed art cards popping in perspective, ending
 * with a pure white plate zoom into the hero canvas.
 */
export const ScribbleStackLoader = ({ onComplete }) => {
  const stageRef = useRef(null);
  const counterRef = useRef(null);
  const cardsRef = useRef([]);
  const onCompleteRef = useRef(onComplete);
  const [done, setDone] = useState(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // Lock scroll smoothly during reveal
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const finish = () => {
      document.body.style.overflow = prevOverflow;
      setDone(true);
      if (onCompleteRef.current) onCompleteRef.current();
    };

    // Preload images with non-blocking timeout safety (max 1.2s wait)
    let readyRatio = 0.35;
    let loaded = 0;
    const total = STACK_ARTWORKS.length;
    STACK_ARTWORKS.forEach((src) => {
      const img = new Image();
      const mark = () => {
        loaded += 1;
        readyRatio = Math.max(readyRatio, loaded / total);
      };
      img.onload = mark;
      img.onerror = mark;
      img.src = src;
    });

    const safetyBoost = setTimeout(() => {
      readyRatio = 1;
    }, 950);

    const ctx = gsap.context(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        if (counterRef.current) counterRef.current.textContent = '100';
        gsap.delayedCall(0.2, finish);
        return;
      }

      cardsRef.current.forEach((el) => {
        if (el) {
          gsap.set(el, {
            scale: 0.14,
            opacity: 0,
            filter: 'blur(16px)',
            transformPerspective: 1200,
          });
        }
      });

      const tl = gsap.timeline();
      const minDur = 0.13;
      const maxDur = 0.42;
      const count = STACK_FRAMES.length;

      STACK_FRAMES.forEach((_, idx) => {
        const card = cardsRef.current[idx];
        if (!card) return;
        const isFirst = idx === 0;
        const isLast = idx === count - 1;
        const progress = idx / (count - 1);
        const dur = isLast ? 0.45 : minDur + (maxDur - minDur) * Math.pow(progress, 1.5);
        const overlap = dur * 0.72;
        const pos = isFirst ? 0 : `-=${overlap}`;
        const targetScale = 0.86 + idx * 0.036;

        if (!isFirst) {
          const prev = cardsRef.current[idx - 1];
          if (prev) {
            tl.to(prev, { scale: targetScale, duration: dur, ease: 'power2.out' }, pos);
          }
        }

        tl.to(
          card,
          {
            scale: targetScale,
            opacity: 1,
            filter: 'blur(0px)',
            duration: dur,
            ease: isLast ? 'power2.out' : 'back.out(1.3)',
          },
          pos
        );
      });

      const stackDuration = Math.max(0.1, tl.duration());

      tl.eventCallback('onUpdate', function () {
        const p = Math.min(1, this.time() / stackDuration);
        const effective = Math.min(100, Math.floor(p * Math.max(p, readyRatio) * 100));
        if (counterRef.current) {
          counterRef.current.textContent = String(effective);
        }
      });

      const finalCard = cardsRef.current[count - 1];
      if (finalCard) {
        const handles = finalCard.querySelectorAll('.stack-corner-square');

        tl.call(() => {
          readyRatio = 1;
          if (counterRef.current) counterRef.current.textContent = '100';
        });

        tl.to(
          finalCard,
          {
            scale: 15,
            duration: 1.35,
            ease: 'power3.inOut',
            onStart: () => {
              cardsRef.current.forEach((c, idx) => {
                if (c && idx < count - 1) gsap.set(c, { opacity: 0 });
              });
              if (counterRef.current) {
                gsap.to(counterRef.current, { opacity: 0, duration: 0.3 });
              }
            },
            onComplete: () => {
              gsap.to(stageRef.current, {
                opacity: 0,
                duration: 0.25,
                ease: 'power2.out',
                onComplete: finish,
              });
            },
          },
          '+=0.08'
        );

        tl.to(
          finalCard,
          { borderColor: 'rgba(17, 17, 17, 0)', duration: 0.25, ease: 'power2.out' },
          '<'
        );
        if (handles.length) {
          tl.to(handles, { opacity: 0, duration: 0.25, ease: 'power2.out' }, '<');
        }
      } else {
        tl.call(finish);
      }
    }, stageRef);

    return () => {
      clearTimeout(safetyBoost);
      document.body.style.overflow = prevOverflow;
      ctx.revert();
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={stageRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#ff0457] overflow-hidden select-none"
      aria-label="Loading Chulbul's Art Studio"
    >
      {/* Top-Left Architectural Counter matching .stack-loader-counter */}
      <div
        ref={counterRef}
        className="absolute top-[28px] left-[28px] md:top-[40px] md:left-[48px] z-[1000] font-sans font-extralight text-[28px] md:text-[66px] leading-none tracking-[-0.1em] text-white tabular-nums pointer-events-none"
      >
        0
      </div>

      {/* Centered 11:16 Art Portrait Stack */}
      <div className="relative flex items-center justify-center w-[min(300px,64vw)] max-h-[68vh] aspect-[11/16]">
        {STACK_FRAMES.map((frame, idx) => (
          <div
            key={idx}
            ref={(el) => {
              cardsRef.current[idx] = el;
            }}
            className="absolute inset-0 w-full h-full overflow-visible will-change-transform"
            style={{
              backgroundColor: frame.color || '#111111',
              border: frame.type === 'color' ? '1px solid #111111' : '1px solid #ffffff',
              zIndex: idx + 1,
            }}
          >
            {frame.type === 'image' && (
              <img
                src={frame.src}
                alt={`Studio artwork stack ${idx + 1}`}
                loading="eager"
                className="w-full h-full object-cover block pointer-events-none select-none"
              />
            )}

            {/* 4 Figma Corner Handles */}
            <div className="stack-corner-square -top-[4px] -left-[4px]" />
            <div className="stack-corner-square -top-[4px] -right-[4px]" />
            <div className="stack-corner-square -bottom-[4px] -left-[4px]" />
            <div className="stack-corner-square -bottom-[4px] -right-[4px]" />
          </div>
        ))}
      </div>

      {/* Subtle Bottom-Right Skip Control */}
      <button
        type="button"
        onClick={() => {
          document.body.style.overflow = '';
          setDone(true);
          if (onCompleteRef.current) onCompleteRef.current();
        }}
        className="absolute bottom-6 right-6 z-[1001] px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md text-[11px] font-medium tracking-wide text-white border border-white/25 transition-colors"
      >
        Skip →
      </button>
    </div>
  );
};

export default ScribbleStackLoader;
