import React from 'react';

export const Skeleton = ({ className = '', count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`scribble-shimmer rounded-[12px] ${className}`}
        />
      ))}
    </>
  );
};

export const ArtworkCardSkeleton = () => (
  <div className="bg-white rounded-[12px] overflow-hidden border border-[#eae9ee]">
    <div className="aspect-square w-full scribble-shimmer" />
    <div className="p-3 sm:p-3.5 space-y-2 bg-[#f8f7fb]">
      <div className="flex items-center justify-between gap-2">
        <div className="h-3.5 w-2/3 scribble-shimmer rounded-full" />
        <div className="h-3.5 w-12 scribble-shimmer rounded-full" />
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="h-3 w-1/3 scribble-shimmer rounded-full" />
        <div className="flex gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-[#e5e4ea]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#e5e4ea]" />
        </div>
      </div>
    </div>
  </div>
);

export default Skeleton;
