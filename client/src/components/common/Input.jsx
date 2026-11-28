import React, { forwardRef } from 'react';

export const Input = forwardRef(
  (
    {
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
    },
    ref
  ) => {
    const inputId = id || props.name || Math.random().toString(36).substring(7);

    return (
      <div className={`w-full ${wrapperClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[12px] font-semibold text-[#111827] tracking-[-0.01em] mb-1.5 pl-1"
          >
            {label} {required && <span className="text-[#ff0457]">*</span>}
          </label>
        )}

        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8e8e93]">
              <Icon className="w-4 h-4" />
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            type={type}
            required={required}
            className={`
              w-full bg-white rounded-[14px] border text-[14px] text-[#111827] placeholder-[#a1a1aa] font-sans
              transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#ff0457]/12
              ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5
              ${
                error
                  ? 'border-[#ef4444] focus:border-[#ef4444]'
                  : 'border-[#e2e2e7] focus:border-[#ff0457] hover:border-[#c8c8d0]'
              }
              ${className}
            `}
            {...props}
          />
        </div>

        {error ? (
          <p className="mt-1.5 text-[12px] text-[#ef4444] font-medium pl-1">{error}</p>
        ) : helperText ? (
          <p className="mt-1.5 text-[12px] text-[#6e6e73] pl-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
