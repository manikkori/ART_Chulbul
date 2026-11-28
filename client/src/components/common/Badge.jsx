import React from 'react';

export const Badge = ({
  children,
  variant = 'default', // 'default' | 'pink' | 'blush' | 'noir' | 'dark' | 'terracotta' | 'sage' | 'amber' | 'rose' | 'outline'
  size = 'md', // 'sm' | 'md'
  dot = false,
  className = '',
}) => {
  const variants = {
    default: 'bg-[#f2f1f6] text-[#111827] border-[#e2e2e7]',
    pink: 'bg-[#ffe5ee] text-[#ff0155] border-[#ffc6da]',
    blush: 'bg-[#ffe5ee] text-[#ff0155] border-[#ffc6da]',
    noir: 'bg-[#111827] text-white border-[#111827]',
    dark: 'bg-[#111827] text-white border-[#111827]',
    terracotta: 'bg-[#fff1ea] text-[#c2410c] border-[#fed7aa]',
    sage: 'bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]',
    amber: 'bg-[#fffbeb] text-[#b45309] border-[#fde68a]',
    rose: 'bg-[#fff1f2] text-[#be123c] border-[#fecdd3]',
    outline: 'bg-white text-[#111827] border-[#d4d4d8]',
  };

  const dotColors = {
    default: 'bg-[#8e8e93]',
    pink: 'bg-[#ff0457]',
    blush: 'bg-[#ff0457]',
    noir: 'bg-white',
    dark: 'bg-white',
    terracotta: 'bg-[#ea580c]',
    sage: 'bg-[#10b981]',
    amber: 'bg-[#f59e0b]',
    rose: 'bg-[#e11d48]',
    outline: 'bg-[#111827]',
  };

  const sizes = {
    sm: 'text-[11px] px-2.5 py-0.5',
    md: 'text-[12px] px-3 py-1',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold tracking-[-0.01em] rounded-full border ${
        variants[variant] || variants.default
      } ${sizes[size] || sizes.md} ${className}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] || dotColors.default}`} />
      )}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
