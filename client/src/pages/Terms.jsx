import React, { useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

export const Terms = () => {
  const { settings, setPageTitle, siteName } = useSettings();

  useEffect(() => {
    setPageTitle('Terms of Commission');
  }, [setPageTitle]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="text-center space-y-2">
        <span className="eyebrow">POLICIES & AGREEMENTS</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
          Terms of Commission
        </h1>
        <p className="text-xs text-charcoal-500">Effective for 2026 at {siteName}</p>
      </div>

      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-cream-200 shadow-card text-xs sm:text-sm text-charcoal-700 leading-relaxed whitespace-pre-line space-y-4">
        {settings?.termsContent || `1. Custom Orders: Every artwork is handcrafted to order based on your approved specifications.\n2. Quotations: The artist reviews reference materials and provides a quote with price and estimated time.\n3. Cancellation: Orders may be cancelled before work enters 'In Progress' status.\n4. Copyright: The artist retains copyright for portfolio showcase unless an exclusivity agreement is arranged.`}
      </div>
    </div>
  );
};

export default Terms;
