import React, { useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

export const RefundPolicy = () => {
  const { setPageTitle } = useSettings();

  useEffect(() => {
    setPageTitle('Cancellation & Refund Policy');
  }, [setPageTitle]);

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 pb-20">
      <div className="rounded-[24px] bg-white border border-[#eae9ee] p-7 sm:p-11 shadow-[0_8px_30px_rgba(0,0,0,0.03)] space-y-6">
        <div className="border-b border-[#f0eff4] pb-5 space-y-1.5">
          <span className="eyebrow">Studio Policies</span>
          <h1 className="editorial-serif text-4xl text-[#111827] font-normal">
            Cancellation &amp; Refund Policy
          </h1>
          <p className="text-[12px] text-[#8e8e93]">
            Last updated: {new Date().toLocaleDateString('en-IN')}
          </p>
        </div>

        <div className="space-y-4 text-[14px] text-[#3c3c43] leading-relaxed">
          <p>
            Because bespoke commissioned paintings are handcrafted specifically to your personal reference images, customized orders follow transparent fair guidelines:
          </p>
          <h3 className="text-[16px] font-bold text-[#111827] pt-2">
            1. Cancelling Before Artist Work Begins
          </h3>
          <p>
            You may freely cancel your request at any point while status is <strong>Pending Review</strong> or <strong>Quoted</strong> (prior to clicking Accept Quote) at no cost.
          </p>
          <h3 className="text-[16px] font-bold text-[#111827] pt-2">
            2. Cancellation During Creation
          </h3>
          <p>
            If creation is <strong>In Progress</strong>, a cancellation deduction covering already-incurred canvas, priming materials, and artist studio hours will apply.
          </p>
          <h3 className="text-[16px] font-bold text-[#111827] pt-2">
            3. Transit Protection Guarantee
          </h3>
          <p>
            In the rare event of courier transit damage, share unboxing photos within 48 hours of delivery and we will restore or repaint your artwork at zero additional charge.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
