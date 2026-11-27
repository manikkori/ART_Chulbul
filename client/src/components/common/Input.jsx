import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  wrapperClassName = '',
  type = 'text',
  id,
  required = false,
  ...props
}, ref) => {
  const inputId = id || props.name || Math.random().toString(36).substring(7);

  return (
    <div className={`w-full ${wrapperClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-sans font-semibold tracking-wide text-[#1c1a17]/80 mb-1.5"
        >
          {label} {required && <span className="text-[#f19b72]">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#1c1a17]/40">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          id={inputId}
          ref={ref}
          type={type}
          required={required}
          className={`
            w-full bg-white/90 border rounded-2xl text-sm text-[#1c1a17] placeholder-[#1c1a17]/40 font-sans
            transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#faa9b0]/30 focus:border-[#faa9b0]
            ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5
            ${error
              ? 'border-rose-400 bg-rose-50/20'
              : 'border-[#1c1a17]/15 hover:border-[#1c1a17]/30'}
            ${className}
          `}
          {...props}
        />
      </div>

      {error ? (
        <p className="mt-1.5 text-xs text-rose-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-[#1c1a17]/60">{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
