import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary', // 'primary', 'pink', 'secondary', 'outline', 'ghost', 'danger', 'white', 'dark'
  size = 'md', // 'sm', 'md', 'lg'
  loading = false,
  disabled = false,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-sans font-medium tracking-wide rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 disabled:shadow-none cursor-pointer';

  const variants = {
    primary: 'bg-[#1c1a17] text-white hover:bg-[#33302b] shadow-sm focus:ring-[#1c1a17]',
    dark: 'bg-[#1c1a17] text-white hover:bg-[#33302b] shadow-sm focus:ring-[#1c1a17]',
    pink: 'bg-[#faa9b0] text-[#1c1a17] hover:bg-[#f697a0] font-semibold shadow-sm focus:ring-[#faa9b0]',
    secondary: 'bg-[#f8f4ea] text-[#1c1a17] border border-[#d4a373]/30 hover:bg-[#f1e8d6] focus:ring-[#d4a373]',
    outline: 'border border-[#1c1a17]/20 bg-white/80 hover:bg-[#f8f4ea] text-[#1c1a17] focus:ring-[#1c1a17]',
    ghost: 'bg-transparent text-[#1c1a17] hover:bg-[#1c1a17]/5 focus:ring-[#1c1a17]',
    danger: 'bg-rose-500 text-white hover:bg-rose-600 focus:ring-rose-400',
    white: 'bg-white text-[#1c1a17] border border-[#1c1a17]/10 hover:bg-[#f8f4ea] shadow-sm focus:ring-[#faa9b0]'
  };

  const sizes = {
    sm: 'text-xs px-4 py-1.5 gap-1.5',
    md: 'text-sm px-6 py-2.5 gap-2',
    lg: 'text-base px-8 py-3.5 gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
};

export default Button;
