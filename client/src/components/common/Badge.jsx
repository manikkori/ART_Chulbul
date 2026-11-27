import React from 'react';

export const Badge = ({
  children,
  variant = 'default', // 'default', 'butter', 'pink', 'sage', 'amber', 'rose', 'outline', 'dark'
  size = 'md', // 'sm', 'md'
  dot = false,
  className = '',
}) => {
  const variants = {
    default: 'bg-[#f8f4ea] text-[#1c1a17] border-[#d4a373]/30',
    butter: 'bg-[#fef3c7] text-[#92400e] border-[#fde68a]',
    pink: 'bg-[#fce7f3] text-[#9d174d] border-[#fbcfe8]',
    blush: 'bg-[#fde8ef] text-[#9d174d] border-[#fbcfe8]',
    noir: 'bg-[#1c1a17] text-white border-[#1c1a17]',
    dark: 'bg-[#1c1a17] text-white border-[#1c1a17]',
    terracotta: 'bg-[#ffedd5] text-[#9a3412] border-[#fed7aa]',
    sage: 'bg-[#dcfce7] text-[#166534] border-[#bbf7d0]',
    amber: 'bg-[#fef3c7] text-[#b45309] border-[#fde68a]',
    rose: 'bg-[#ffe4e6] text-[#be123c] border-[#fecdd3]',
    outline: 'bg-transparent text-[#1c1a17] border-[#1c1a17]/20',
  };

  const dotColors = {
    default: 'bg-[#d4a373]',
    butter: 'bg-[#d97706]',
    pink: 'bg-[#ec4899]',
    blush: 'bg-[#ec4899]',
    noir: 'bg-white',
    dark: 'bg-white',
    terracotta: 'bg-[#ea580c]',
    sage: 'bg-[#16a34a]',
    amber: 'bg-[#d97706]',
    rose: 'bg-[#e11d48]',
    outline: 'bg-[#1c1a17]',
  };

  const sizes = {
    sm: 'text-[11px] px-2.5 py-0.5',
    md: 'text-xs px-3 py-1',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-sans font-medium rounded-full border ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] || dotColors.default}`} />
      )}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
