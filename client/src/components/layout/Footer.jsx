import React from 'react';
import { Link } from 'react-router-dom';
import { Palette, Instagram, Facebook, Youtube, Twitter, Heart, Sparkles, MessageSquare } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const Footer = () => {
  const { settings, siteName } = useSettings();

  return (
    <footer className="bg-white border-t border-[#eadfd9] pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#eadfd9]">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              {settings?.logo?.url ? (
                <img
                  src={settings.logo.url}
                  alt={siteName}
                  className="w-8 h-8 rounded-full object-contain shadow-sm"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#b0456f] text-white flex items-center justify-center shadow-[2px_2px_0px_#f6dcb0]">
                  <Palette className="w-4 h-4" />
                </div>
              )}
              <span className="font-display text-2xl font-bold tracking-tight text-[#3d2c33]">
                {siteName}
              </span>
            </Link>
            <p className="font-sans text-xs text-[#6e5a60] leading-relaxed max-w-sm">
              {settings?.footerTagline || 'Crafting memories onto canvas with devotion and gentle brushstrokes.'}
            </p>
            <div className="flex items-center gap-2.5 pt-2">
              {settings?.socialLinks?.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#fdf7f1] border border-[#eadfd9] flex items-center justify-center text-[#6e5a60] hover:text-[#b0456f] hover:border-[#b0456f] transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings?.socialLinks?.facebook && (
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#fdf7f1] border border-[#eadfd9] flex items-center justify-center text-[#6e5a60] hover:text-[#b0456f] hover:border-[#b0456f] transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings?.socialLinks?.youtube && (
                <a
                  href={settings.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#fdf7f1] border border-[#eadfd9] flex items-center justify-center text-[#6e5a60] hover:text-[#b0456f] hover:border-[#b0456f] transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {settings?.socialLinks?.twitter && (
                <a
                  href={settings.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#fdf7f1] border border-[#eadfd9] flex items-center justify-center text-[#6e5a60] hover:text-[#b0456f] hover:border-[#b0456f] transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-sm font-bold text-[#3d2c33] uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 font-display text-xs text-[#6e5a60]">
              <li>
                <Link to="/gallery" className="hover:text-[#b0456f] transition-colors">
                  Art Showcase Gallery
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-[#b0456f] transition-colors">
                  Mediums & Categories
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#b0456f] transition-colors">
                  Meet the Artist
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-[#b0456f] transition-colors">
                  Pricing & Size Guide
                </Link>
              </li>
              <li>
                <Link to="/custom-order" className="hover:text-[#b0456f] font-semibold text-[#b0456f] transition-colors">
                  Commission Custom Art
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies & Assistance */}
          <div>
            <h4 className="font-display text-sm font-bold text-[#3d2c33] uppercase tracking-wider mb-4">
              In-Site Assistance
            </h4>
            <ul className="space-y-2.5 font-display text-xs text-[#6e5a60]">
              <li>
                <Link to="/contact" className="hover:text-[#b0456f] transition-colors">
                  Direct Artist Query Form
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#b0456f] transition-colors">
                  Terms of Commission
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#b0456f] transition-colors">
                  Photo Privacy Guarantee
                </Link>
              </li>
              <li>
                <Link to="/refund" className="hover:text-[#b0456f] transition-colors">
                  Refund & Cancellation Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Handcrafted Note / Dedicated inside messaging */}
          <div className="bg-[#fdf7f1] rounded-[24px] p-5 border border-[#eadfd9] space-y-3">
            <div className="flex items-center gap-2 text-[#b0456f] text-xs font-display font-semibold uppercase tracking-wider">
              <MessageSquare className="w-4 h-4" />
              <span>In-Platform Collaboration</span>
            </div>
            <p className="font-sans text-xs text-[#6e5a60] leading-relaxed">
              All communications, progress snaps, and quotes happen securely inside your order dashboard. No third-party chat apps required.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center font-display text-xs font-semibold text-[#b0456f] hover:underline"
            >
              Ask a question before ordering
            </Link>
          </div>
        </div>

        {/* Bottom sign-off */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-sans text-[#6e5a60] gap-4">
          <p>© 2026 {siteName}. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-[#6e5a60]">
            <span>Handcrafted with patience & soul</span>
            <Heart className="w-3.5 h-3.5 text-[#b0456f] fill-[#b0456f]" />
            <span>for art lovers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
