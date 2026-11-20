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
          className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5"
        >
          {label} {required && <span className="text-terracotta-600">*</span>}
        </label>
      )}

      <div className="relative rounded-2xl">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          id={inputId}
          ref={ref}
          type={type}
          required={required}
          className={`
            w-full rounded-2xl bg-white border text-sm text-charcoal-900 placeholder-charcoal-400
            transition-all duration-200 focus:outline-none focus:ring-2
            ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5
            ${error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
              : 'border-cream-300 focus:border-terracotta-500 focus:ring-terracotta-100'}
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
