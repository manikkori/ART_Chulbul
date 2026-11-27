import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import InteractiveArtCanvas from '../common/InteractiveArtCanvas';

export const MainLayout = () => {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#fdfcf9] text-[#2d2421] selection:bg-[#f2cadb] selection:text-[#5c2039]">
      {/* 60fps Ambient Interactive Canvas Background */}
      <InteractiveArtCanvas />
      
      <Navbar />
      <main className="relative z-10 flex-1 pt-24 sm:pt-28">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
