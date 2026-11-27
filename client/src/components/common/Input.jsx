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
          className="block text-xs font-montserrat font-bold uppercase tracking-wider text-[#121212] mb-1.5"
        >
          {label} {required && <span className="text-[#dc8da3]">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          id={inputId}
          ref={ref}
          type={type}
          required={required}
          className={`
            w-full bg-white border-2 text-sm text-[#121212] placeholder-gray-400 font-sans
            transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#f7cbd7]
            ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5
            ${error
              ? 'border-rose-500 shadow-[2px_2px_0px_#fecdd3]'
              : 'border-[#121212] shadow-[2px_2px_0px_#f7cbd7] focus:shadow-[3px_3px_0px_#ebb0c0]'}
            ${className}
          `}
          {...props}
        />
      </div>

      {error ? (
        <p className="mt-1.5 text-xs text-rose-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-charcoal-500">{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
