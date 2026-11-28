import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, MessageCircle, Sparkles, IndianRupee, X } from 'lucide-react';

export const HelpFab = () => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (open && rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="fixed bottom-5 right-5 z-[90] hidden md:block"
    >
      <div
        className={`relative overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] bg-white/85 backdrop-blur-xl border border-black/10 shadow-[0_12px_36px_rgba(0,0,0,0.12)] ${
          open ? 'w-[236px] rounded-[22px] p-3.5' : 'w-[46px] h-[46px] rounded-[23px]'
        }`}
      >
        {!open ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Studio Help"
            className="w-full h-full flex items-center justify-center text-[#111827] hover:text-[#ff0457] transition-colors"
          >
            <HelpCircle className="w-5 h-5" strokeWidth={2} />
          </button>
        ) : (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between px-1 pb-1.5 border-b border-black/5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6e6e73]">
                Studio Help
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close help menu"
                className="w-6 h-6 rounded-full flex items-center justify-center text-[#6e6e73] hover:bg-black/5 hover:text-[#111827] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <Link
              to="/custom-order"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] font-medium text-[#ff0457] bg-[#ffe5ee]/60 hover:bg-[#ffe5ee] transition-colors"
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Commission Custom Art</span>
            </Link>

            <Link
              to="/pricing"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] font-medium text-[#111827] hover:bg-black/5 transition-colors"
            >
              <IndianRupee className="w-4 h-4 text-[#6e6e73] shrink-0" />
              <span>Sizing & Pricing Guide</span>
            </Link>

            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] font-medium text-[#111827] hover:bg-black/5 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#6e6e73] shrink-0" />
              <span>Ask the Artist</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpFab;
