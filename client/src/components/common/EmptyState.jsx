import React from 'react';
import Button from './Button';

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-14 px-6 bg-white rounded-[24px] border border-[#eae9ee] shadow-[0_8px_30px_rgba(0,0,0,0.03)] ${className}`}
    >
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-[#ffe5ee] text-[#ff0457] flex items-center justify-center mb-4">
          <Icon className="w-7 h-7" />
        </div>
      )}
      <h3 className="text-lg font-bold text-[#111827] tracking-[-0.02em] mb-1.5">
        {title}
      </h3>
      {description && (
        <p className="text-[13px] text-[#6e6e73] max-w-md mb-6 leading-relaxed">
          {description}
        </p>
      )}
      {actionText && onAction && (
        <Button onClick={onAction} variant="pink" size="md">
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
