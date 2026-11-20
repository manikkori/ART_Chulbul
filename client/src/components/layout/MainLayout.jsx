import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-cream-100 selection:bg-terracotta-100 selection:text-terracotta-900">
      <Navbar />
      <main className="flex-1 pt-24 sm:pt-28">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
