import React, { useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

export const Privacy = () => {
  const { settings, setPageTitle, siteName } = useSettings();

  useEffect(() => {
    setPageTitle('Photo Privacy Guarantee');
  }, [setPageTitle]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="text-center space-y-2">
        <span className="eyebrow">YOUR TRUST MATTERS</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
          Privacy Policy & Photo Security
        </h1>
        <p className="text-xs text-charcoal-500">How {siteName} protects your family and personal references</p>
      </div>

      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-cream-200 shadow-card text-xs sm:text-sm text-charcoal-700 leading-relaxed whitespace-pre-line space-y-4">
        {settings?.privacyContent || `1. Your Photos: Reference photographs provided for custom commissions are kept strictly confidential and used solely for the creation of your artwork.\n2. Personal Data: We only collect name, email, and shipping address required to fulfill your custom art order.\n3. No Third-Party Sharing: We never sell or share your personal data with third parties.`}
      </div>
    </div>
  );
};

export default Privacy;
