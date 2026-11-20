import React from 'react';

export const Badge = ({
  children,
  variant = 'default', // 'default', 'terracotta', 'sage', 'amber', 'rose', 'outline'
  size = 'md', // 'sm', 'md'
  dot = false,
  className = '',
}) => {
  const variants = {
    default: 'bg-cream-200 text-charcoal-700 border-cream-300',
    terracotta: 'bg-terracotta-50 text-terracotta-700 border-terracotta-200',
    sage: 'bg-sage-50 text-sage-600 border-sage-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
    outline: 'bg-transparent text-charcoal-700 border-charcoal-300',
  };

  const dotColors = {
    default: 'bg-charcoal-400',
    terracotta: 'bg-terracotta-500',
    sage: 'bg-sage-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    outline: 'bg-charcoal-400',
  };

  const sizes = {
    sm: 'text-[11px] px-2.5 py-0.5',
    md: 'text-xs px-3 py-1',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] || dotColors.default}`} />
      )}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
