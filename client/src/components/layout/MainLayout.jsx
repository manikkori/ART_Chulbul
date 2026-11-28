import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './Navbar';
import Footer from './Footer';
import HelpFab from '../common/HelpFab';

gsap.registerPlugin(ScrollTrigger);

export const MainLayout = () => {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const isAuthPage = ['/login', '/register', '/forgot-password'].some((p) =>
    pathname.startsWith(p)
  ) || pathname.startsWith('/reset-password');

  // Lenis smooth scroll wired natively with GSAP ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const updateLenis = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, []);

  // Scroll cleanly to top on route transitions
  useEffect(() => {
    window.scrollTo(0, 0);
    ScrollTrigger.refresh();
  }, [pathname]);

  return (
    <div
      className={`relative min-h-screen flex flex-col selection:bg-[#ff0457] selection:text-white ${
        isAuthPage ? 'bg-white text-[#111827]' : 'bg-[#f2f1f6] text-[#111827]'
      }`}
    >
      <Navbar />

      <main
        className={`relative z-10 flex-1 ${
          isHome
            ? 'pt-0'
            : isAuthPage
            ? 'pt-20 sm:pt-24'
            : 'pt-20 sm:pt-24'
        }`}
      >
        <Outlet />
      </main>

      {!isAuthPage && <Footer />}

      {/* Fixed Studio Help Concierge Button */}
      <HelpFab />

      {/* Bottom Viewport Frosted Blur Strip matching myscribble.in */}
      {!isAuthPage && <div className="global-bottom-blur-strip" aria-hidden="true" />}
    </div>
  );
};

export default MainLayout;
