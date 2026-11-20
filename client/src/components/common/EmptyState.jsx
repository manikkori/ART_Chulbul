import React from 'react';
import { Palette } from 'lucide-react';
import Button from './Button';

export const EmptyState = ({
  icon: Icon = Palette,
  title = 'No items found',
  description = 'There are no items matching your criteria at this moment.',
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white/60 rounded-3xl border border-cream-200 ${className}`}>
      <div className="w-16 h-16 rounded-full bg-terracotta-50 flex items-center justify-center text-terracotta-500 mb-4 border border-terracotta-100 shadow-sm">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-900 mb-2">
        {title}
      </h3>
      <p className="text-sm text-charcoal-500 max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
