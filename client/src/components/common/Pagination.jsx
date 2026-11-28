import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="w-9 h-9 rounded-full bg-white border border-[#e2e2e7] text-[#111827] flex items-center justify-center hover:border-[#111827] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
        const isCurrent = page === currentPage;
        return (
          <button
            type="button"
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 rounded-full text-[13px] font-semibold transition-all ${
              isCurrent
                ? 'bg-[#ff0457] text-white shadow-[0_6px_16px_rgba(255,4,87,0.28)]'
                : 'bg-white text-[#111827] border border-[#e2e2e7] hover:border-[#111827]'
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="w-9 h-9 rounded-full bg-white border border-[#e2e2e7] text-[#111827] flex items-center justify-center hover:border-[#111827] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
