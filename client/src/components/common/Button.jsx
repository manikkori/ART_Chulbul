import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary', // 'primary', 'dark', 'secondary', 'outline', 'ghost', 'danger', 'white'
  size = 'md', // 'sm', 'md', 'lg'
  loading = false,
  disabled = false,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-montserrat font-bold uppercase tracking-wider transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 disabled:shadow-none disabled:transform-none cursor-pointer';

  const variants = {
    primary: 'bg-[#121212] text-white border-2 border-[#121212] shadow-[3px_3px_0px_#f7cbd7] hover:shadow-[5px_5px_0px_#ebb0c0] hover:-translate-y-0.5 focus:ring-[#121212]',
    dark: 'bg-[#121212] text-white border-2 border-[#121212] shadow-[3px_3px_0px_#f7cbd7] hover:shadow-[5px_5px_0px_#ebb0c0] hover:-translate-y-0.5 focus:ring-[#121212]',
    secondary: 'bg-[#fde8ef] text-[#121212] border-2 border-[#121212] shadow-[2px_2px_0px_#121212] hover:bg-[#f7cbd7] hover:-translate-y-0.5 focus:ring-[#f7cbd7]',
    outline: 'border-2 border-[#121212] bg-white text-[#121212] shadow-[3px_3px_0px_#f7cbd7] hover:bg-[#fff7f9] hover:-translate-y-0.5 focus:ring-[#121212]',
    ghost: 'bg-transparent text-[#121212] hover:bg-[#fde8ef] focus:ring-[#f7cbd7]',
    danger: 'bg-rose-500 text-white border-2 border-rose-600 shadow-[3px_3px_0px_#fecdd3] hover:bg-rose-600 hover:-translate-y-0.5 focus:ring-rose-400',
    white: 'bg-white text-[#121212] border-2 border-[#121212] shadow-[3px_3px_0px_#f7cbd7] hover:shadow-[5px_5px_0px_#f7cbd7] hover:-translate-y-0.5 focus:ring-[#f7cbd7]'
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
