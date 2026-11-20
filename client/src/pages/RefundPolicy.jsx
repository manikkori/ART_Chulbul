import React, { useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

export const RefundPolicy = () => {
  const { settings, setPageTitle, siteName } = useSettings();

  useEffect(() => {
    setPageTitle('Refund & Cancellation Policy');
  }, [setPageTitle]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="text-center space-y-2">
        <span className="eyebrow">ORDER PROTECTION</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
          Refund & Cancellation Policy
        </h1>
        <p className="text-xs text-charcoal-500">Custom Commission Rules at {siteName}</p>
      </div>

      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-cream-200 shadow-card text-xs sm:text-sm text-charcoal-700 leading-relaxed whitespace-pre-line space-y-4">
        {settings?.refundContent || `1. Cancellation Window: You can cancel an order free of charge while in 'Pending Review' or 'Quoted' status.\n2. Custom Work: Once a commission enters 'In Progress' status, artistic time and materials are committed; cancellations after this stage are handled on a case-by-case basis.\n3. Damaged in Transit: If an artwork arrives damaged, please send photos within 48 hours for immediate resolution.`}
      </div>
    </div>
  );
};

export default RefundPolicy;
