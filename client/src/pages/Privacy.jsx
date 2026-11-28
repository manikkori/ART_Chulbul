import React, { useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

export const Privacy = () => {
  const { setPageTitle, siteName } = useSettings();

  useEffect(() => {
    setPageTitle('Privacy Policy');
  }, [setPageTitle]);

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 pb-20">
      <div className="rounded-[24px] bg-white border border-[#eae9ee] p-7 sm:p-11 shadow-[0_8px_30px_rgba(0,0,0,0.03)] space-y-6">
        <div className="border-b border-[#f0eff4] pb-5 space-y-1.5">
          <span className="eyebrow">Data Protection</span>
          <h1 className="editorial-serif text-4xl text-[#111827] font-normal">
            Privacy Policy
          </h1>
          <p className="text-[12px] text-[#8e8e93]">
            Last updated: {new Date().toLocaleDateString('en-IN')}
          </p>
        </div>

        <div className="space-y-4 text-[14px] text-[#3c3c43] leading-relaxed">
          <p>
            At <strong>{siteName}</strong>, your personal photographs and private data are treated with strict confidentiality and care.
          </p>
          <h3 className="text-[16px] font-bold text-[#111827] pt-2">
            1. Reference Photography &amp; Privacy
          </h3>
          <p>
            Reference photographs uploaded by you are strictly used by our artist solely for painting your requested custom commission. We never publish, sell, or share private personal photographs without your explicit permission.
          </p>
          <h3 className="text-[16px] font-bold text-[#111827] pt-2">
            2. Account &amp; Order Communication
          </h3>
          <p>
            Your name, email address, and shipping details are collected exclusively to deliver your artwork safely and provide real-time quote and status updates.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
