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
  const baseStyles = 'inline-flex items-center justify-center font-display font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 disabled:shadow-none disabled:transform-none cursor-pointer';

  const variants = {
    primary: 'bg-[#b0456f] text-white shadow-[3px_3px_0px_#f6dcb0] hover:shadow-[5px_5px_0px_#f6dcb0] hover:-translate-y-0.5 focus:ring-[#b0456f]',
    dark: 'bg-[#3d2c33] text-[#fdf7f1] shadow-[3px_3px_0px_#d4b0e4] hover:shadow-[5px_5px_0px_#d4b0e4] hover:-translate-y-0.5 focus:ring-[#3d2c33]',
    secondary: 'bg-[#f1e9e3] text-[#3d2c33] hover:bg-[#eadfd9] hover:-translate-y-0.5 focus:ring-[#d4b0e4]',
    outline: 'border-2 border-[#3d2c33] bg-transparent text-[#3d2c33] hover:bg-[#3d2c33] hover:text-[#fdf7f1] hover:-translate-y-0.5 focus:ring-[#3d2c33]',
    ghost: 'bg-transparent text-[#3d2c33] hover:bg-[#f1e9e3] focus:ring-[#eadfd9]',
    danger: 'bg-rose-500 text-white shadow-[3px_3px_0px_#fecdd3] hover:bg-rose-600 hover:-translate-y-0.5 focus:ring-rose-400',
    white: 'bg-white text-[#3d2c33] shadow-[3px_3px_0px_#f4c6d6] hover:shadow-[5px_5px_0px_#f4c6d6] hover:-translate-y-0.5 focus:ring-[#f4c6d6]'
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
