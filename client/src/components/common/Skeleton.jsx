import React from 'react';

export const Skeleton = ({ className = '', count = 1 }) => {
  if (count === 1) {
    return <div className={`animate-pulse bg-cream-300/70 rounded-2xl ${className}`} />;
  }

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`animate-pulse bg-cream-300/70 rounded-2xl ${className}`} />
      ))}
    </>
  );
};

export const ArtworkCardSkeleton = () => (
  <div className="bg-white rounded-3xl p-3 border border-cream-200 shadow-card animate-pulse">
    <div className="w-full aspect-[4/5] bg-cream-200 rounded-2xl mb-4" />
    <div className="px-1 space-y-2.5">
      <div className="h-4 bg-cream-200 rounded-full w-3/4" />
      <div className="h-3 bg-cream-200 rounded-full w-1/2" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-4 bg-cream-200 rounded-full w-1/4" />
        <div className="h-7 bg-cream-200 rounded-full w-20" />
      </div>
    </div>
  </div>
);

export default Skeleton;
