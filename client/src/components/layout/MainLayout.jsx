import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import InteractiveArtCanvas from '../common/InteractiveArtCanvas';

export const MainLayout = () => {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#f8f4ea] text-[#1c1a17] selection:bg-[#faa9b0]/30 selection:text-[#1c1a17]">
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
