import React, { useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

export const Terms = () => {
  const { setPageTitle, siteName } = useSettings();

  useEffect(() => {
    setPageTitle('Terms & Conditions');
  }, [setPageTitle]);

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 pb-20">
      <div className="rounded-[24px] bg-white border border-[#eae9ee] p-7 sm:p-11 shadow-[0_8px_30px_rgba(0,0,0,0.03)] space-y-6">
        <div className="border-b border-[#f0eff4] pb-5 space-y-1.5">
          <span className="eyebrow">Legal Policy</span>
          <h1 className="editorial-serif text-4xl text-[#111827] font-normal">
            Terms &amp; Conditions
          </h1>
          <p className="text-[12px] text-[#8e8e93]">
            Last updated: {new Date().toLocaleDateString('en-IN')}
          </p>
        </div>

        <div className="space-y-4 text-[14px] text-[#3c3c43] leading-relaxed">
          <p>
            Welcome to <strong>{siteName}</strong>. By accessing our showcase or requesting a custom commissioned painting, you agree to the following terms governing the creative commission workflow.
          </p>
          <h3 className="text-[16px] font-bold text-[#111827] pt-2">
            1. Custom Commissions &amp; Quotes
          </h3>
          <p>
            Custom artworks are priced based on reference complexity, number of subjects, chosen medium, and canvas dimensions. No charges are applied until you explicitly review and accept the artist quote provided in your dashboard.
          </p>
          <h3 className="text-[16px] font-bold text-[#111827] pt-2">
            2. Artist Artistic Discretion &amp; Progress Check-ins
          </h3>
          <p>
            You will receive work-in-progress photographs at key painting milestones. Minor composition refinements may be requested at sketch stage prior to oil or charcoal locking layers.
          </p>
          <h3 className="text-[16px] font-bold text-[#111827] pt-2">
            3. Intellectual Property
          </h3>
          <p>
            The collector receives full physical ownership of the commissioned painting. {siteName} retains the right to display anonymized studio photographs of the finished artwork in our public portfolio unless privacy is specifically requested during commissioning.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
