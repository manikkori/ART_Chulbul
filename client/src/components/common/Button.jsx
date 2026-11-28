import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary', // 'primary' | 'pink' | 'dark' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'white'
  size = 'md', // 'sm' | 'md' | 'lg'
  loading = false,
  disabled = false,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  onClick,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center rounded-full font-sans font-semibold tracking-[-0.01em] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff0457]/40 focus-visible:ring-offset-2 active:scale-[0.97] disabled:opacity-55 disabled:cursor-not-allowed disabled:active:scale-100 select-none';

  const variants = {
    primary:
      'bg-[#111827] text-white border border-[#111827] shadow-[0_6px_18px_rgba(17,24,39,0.14)] hover:bg-black hover:shadow-[0_10px_24px_rgba(17,24,39,0.2)] hover:-translate-y-0.5',
    pink:
      'bg-[#ff0457] text-white border border-[#ff0457] shadow-[0_8px_22px_rgba(255,4,87,0.28)] hover:bg-[#d90349] hover:border-[#d90349] hover:shadow-[0_12px_28px_rgba(255,4,87,0.34)] hover:-translate-y-0.5',
    dark:
      'bg-[#111827] text-white border border-[#111827] shadow-[0_6px_18px_rgba(17,24,39,0.14)] hover:bg-black hover:-translate-y-0.5',
    secondary:
      'bg-[#ffe5ee] text-[#ff0155] border border-[#ffc2d7] hover:bg-[#ffd4e3] hover:-translate-y-0.5',
    outline:
      'bg-white text-[#111827] border border-[#e2e2e7] shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:bg-[#f8f7fb] hover:border-[#c9c9d1]',
    ghost:
      'bg-transparent text-[#111827] hover:bg-black/[0.05]',
    danger:
      'bg-[#ef4444] text-white border border-[#ef4444] shadow-[0_6px_16px_rgba(239,68,68,0.2)] hover:bg-[#dc2626] hover:-translate-y-0.5',
    white:
      'bg-white/90 backdrop-blur-md text-[#111827] border border-white shadow-[0_6px_20px_rgba(0,0,0,0.08)] hover:bg-white hover:-translate-y-0.5',
  };

  const sizes = {
    sm: 'text-[12px] px-4 py-1.5 gap-1.5',
    md: 'text-[14px] px-6 py-2.5 gap-2',
    lg: 'text-[15px] px-7 py-3.5 gap-2.5',
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
