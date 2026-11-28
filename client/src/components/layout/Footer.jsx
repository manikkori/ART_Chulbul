import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import GravityShapesBanner from '../common/GravityShapesBanner';

export const Footer = () => {
  const { settings, siteName } = useSettings();
  const displayName = siteName || "Chulbul's Art";
  const instagramUrl =
    settings?.socialLinks?.instagram || 'https://instagram.com/';

  const footerLinks = [
    { label: 'Gallery', to: '/gallery' },
    { label: 'Mediums', to: '/categories' },
    { label: 'Custom Order', to: '/custom-order' },
    { label: 'Pricing Guide', to: '/pricing' },
    { label: 'About Artist', to: '/about' },
    { label: 'My Orders', to: '/my-orders' },
    { label: 'Contact', to: '/contact' },
    { label: 'Instagram', href: instagramUrl },
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Terms & Conditions', to: '/terms' },
    { label: 'Refund Policy', to: '/refund' },
  ];

  return (
    <footer className="relative z-20 w-full bg-[#f2f1f6] pt-12 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 border-t border-black/[0.04]">
      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* Clean Centered Editorial Link Row matching Footer_linksList */}
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-[13px] font-medium text-[#6e6e73] max-w-xl">
            {settings?.footerTagline ||
              'Handcrafted custom charcoal portraits, watercolors & archival canvas paintings made to order from your memories.'}
          </p>

          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 text-[13px] sm:text-[14px] font-medium text-[#3c3c43]">
            {footerLinks.map((item) => (
              <li key={item.label}>
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#ff0457] transition-colors"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    to={item.to}
                    className="hover:text-[#ff0457] transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Collector Trust Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#e5e5ea] text-[12px] font-medium text-[#111827] shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
            <span className="inline-flex items-center gap-0.5 text-[#f59e0b]">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#f59e0b]" />
              ))}
            </span>
            <span className="font-bold">4.9</span>
            <span className="text-[#6e6e73]">Rated by Custom Art Collectors across India</span>
          </div>
        </div>

        {/* Playful Interactive Gravity Shapes White Banner matching Footer_shapesBanner */}
        <GravityShapesBanner siteName={displayName} />
      </div>
    </footer>
  );
};

export default Footer;
