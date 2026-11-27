import React from 'react';
import { Link } from 'react-router-dom';
import { Palette, Instagram, Facebook, Youtube, Twitter, Heart, Sparkles, Paintbrush, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const Footer = () => {
  const { settings, siteName } = useSettings();

  return (
    <footer className="bg-[#fff7f9] border-t-2 border-[#121212] pt-16 pb-12 mt-20 relative overflow-hidden">
      {/* Decorative Blush Brush in background */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#fde8ef] rounded-full blur-3xl pointer-events-none opacity-60" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#f7cbd7] rounded-full blur-3xl pointer-events-none opacity-40" />

      {/* Top Value Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-[#f7cbd7]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start p-4 bg-white border border-[#121212] shadow-[3px_3px_0px_#f7cbd7]">
            <div className="w-10 h-10 rounded-full bg-[#fde8ef] flex items-center justify-center text-[#121212] shrink-0">
              <Paintbrush className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-montserrat font-bold text-xs uppercase tracking-wider text-[#121212]">100% Handcrafted</h4>
              <p className="font-sans text-xs text-gray-600">Every stroke painted on premium archival canvas</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start p-4 bg-white border border-[#121212] shadow-[3px_3px_0px_#f7cbd7]">
            <div className="w-10 h-10 rounded-full bg-[#fde8ef] flex items-center justify-center text-[#121212] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-montserrat font-bold text-xs uppercase tracking-wider text-[#121212]">Safe Crated Delivery</h4>
              <p className="font-sans text-xs text-gray-600">Insured, moisture-proof custom art packaging</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start p-4 bg-white border border-[#121212] shadow-[3px_3px_0px_#f7cbd7]">
            <div className="w-10 h-10 rounded-full bg-[#fde8ef] flex items-center justify-center text-[#121212] shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-montserrat font-bold text-xs uppercase tracking-wider text-[#121212]">Preview Before Shipping</h4>
              <p className="font-sans text-xs text-gray-600">Approve high-res artwork photos before dispatch</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#f7cbd7]">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              {settings?.logo?.url ? (
                <img
                  src={settings.logo.url}
                  alt={siteName}
                  className="w-8 h-8 rounded-full object-contain border border-[#121212]"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#121212] text-white flex items-center justify-center shadow-[2px_2px_0px_#f7cbd7]">
                  <Palette className="w-4 h-4 text-[#f7cbd7]" />
                </div>
              )}
              <div className="flex items-baseline gap-1">
                <span className="font-montserrat font-extrabold text-lg tracking-tight text-[#121212]">
                  {siteName ? siteName.toUpperCase() : "CHULBUL'S"}
                </span>
                <span className="font-script text-2xl text-[#121212] font-normal lowercase leading-none">
                  : art
                </span>
              </div>
            </Link>
            <p className="font-sans text-xs text-gray-600 leading-relaxed max-w-sm">
              {settings?.footerTagline || 'Creating bespoke original oil, watercolor, and charcoal commissions that turn cherished memories into timeless heirlooms.'}
            </p>
            <div className="flex items-center gap-2.5 pt-2">
              {settings?.socialLinks?.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-white border border-[#121212] shadow-[2px_2px_0px_#f7cbd7] flex items-center justify-center text-[#121212] hover:bg-[#121212] hover:text-white transition-all"
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
                  className="w-8 h-8 bg-white border border-[#121212] shadow-[2px_2px_0px_#f7cbd7] flex items-center justify-center text-[#121212] hover:bg-[#121212] hover:text-white transition-all"
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
                  className="w-8 h-8 bg-white border border-[#121212] shadow-[2px_2px_0px_#f7cbd7] flex items-center justify-center text-[#121212] hover:bg-[#121212] hover:text-white transition-all"
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
                  className="w-8 h-8 bg-white border border-[#121212] shadow-[2px_2px_0px_#f7cbd7] flex items-center justify-center text-[#121212] hover:bg-[#121212] hover:text-white transition-all"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-montserrat text-xs font-bold text-[#121212] uppercase tracking-[0.16em] mb-4">
              Art Portfolio
            </h4>
            <ul className="space-y-2 font-montserrat text-xs text-gray-600">
              <li>
                <Link to="/gallery" className="hover:text-[#121212] hover:underline transition-colors">
                  All Artworks Gallery
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-[#121212] hover:underline transition-colors">
                  Art Mediums & Styles
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-[#121212] hover:underline transition-colors">
                  Commission Pricing Table
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#121212] hover:underline transition-colors">
                  About Artist & Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Commission Mediums */}
          <div>
            <h4 className="font-montserrat text-xs font-bold text-[#121212] uppercase tracking-[0.16em] mb-4">
              Featured Mediums
            </h4>
            <ul className="space-y-2 font-montserrat text-xs text-gray-600">
              <li>
                <Link to="/gallery?medium=Oil%20Painting" className="hover:text-[#121212] hover:underline transition-colors">
                  Oil on Canvas
                </Link>
              </li>
              <li>
                <Link to="/gallery?medium=Watercolor" className="hover:text-[#121212] hover:underline transition-colors">
                  Delicate Watercolors
                </Link>
              </li>
              <li>
                <Link to="/gallery?medium=Charcoal%20Sketch" className="hover:text-[#121212] hover:underline transition-colors">
                  Charcoal & Graphite Portraits
                </Link>
              </li>
              <li>
                <Link to="/gallery?medium=Acrylic" className="hover:text-[#121212] hover:underline transition-colors">
                  Modern Acrylic Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Custom Commission CTA */}
          <div className="space-y-3">
            <h4 className="font-montserrat text-xs font-bold text-[#121212] uppercase tracking-[0.16em]">
              Start Your Commission
            </h4>
            <p className="font-sans text-xs text-gray-600 leading-relaxed">
              Have a special portrait or memory in mind? Upload your photo and get a custom estimate.
            </p>
            <Link
              to="/custom-order"
              className="inline-flex items-center gap-2 bg-[#121212] text-white hover:bg-black font-montserrat text-xs font-bold uppercase tracking-wider px-4 py-2.5 border-2 border-[#121212] shadow-[3px_3px_0px_#f7cbd7] transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#f7cbd7]" />
              <span>Order Custom Art</span>
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-montserrat text-xs text-gray-500">
          <p>© {new Date().getFullYear()} {siteName || "Chulbul's Art"}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-[#121212] transition-colors">Privacy</Link>
            <Link to="/about" className="hover:text-[#121212] transition-colors">Terms of Commission</Link>
            <Link to="/contact" className="hover:text-[#121212] transition-colors">Studio Location</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
