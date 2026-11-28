import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowRight } from 'lucide-react';
import ScribbleWordmark from '../components/common/ScribbleWordmark';

export const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="rounded-[28px] bg-white border border-[#eae9ee] p-8 sm:p-12 shadow-[0_14px_40px_rgba(0,0,0,0.04)] text-center max-w-md w-full space-y-5">
        <div className="flex justify-center">
          <ScribbleWordmark text="404" variant="pink" size="lg" />
        </div>
        <h1 className="editorial-serif text-4xl text-[#111827] font-normal">
          Canvas Not Found
        </h1>
        <p className="text-[13px] text-[#6e6e73] leading-relaxed">
          The page or painting you are looking for appears to have moved elsewhere in our studio.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#111827] text-white text-[13px] font-bold hover:bg-black transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Back Home</span>
          </Link>
          <Link
            to="/gallery"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#ffe5ee] text-[#ff0155] text-[13px] font-bold hover:bg-[#ffc6da] transition-colors"
          >
            <span>Explore Gallery</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
