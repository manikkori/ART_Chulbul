import React from 'react';
import { Link } from 'react-router-dom';
import { Palette, Instagram, Facebook, Youtube, Twitter, Heart, Sparkles, Paintbrush, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const Footer = () => {
  const { settings, siteName } = useSettings();

  return (
    <footer className="bg-[#f5f0e1] border-t border-[#1c1a17]/10 pt-16 pb-12 mt-20 relative overflow-hidden">
      {/* Decorative Pastel Background Glows */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#faa9b0]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#ffc96f]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Value Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-[#1c1a17]/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start p-5 bg-white/80 rounded-2xl border border-[#1c1a17]/8 shadow-xs">
            <div className="w-11 h-11 rounded-full bg-[#faa9b0]/30 flex items-center justify-center text-[#e85c76] shrink-0 text-xl">
              🎨
            </div>
            <div>
              <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-[#1c1a17]">100% Hand-Painted</h4>
              <p className="font-sans text-xs text-neutral-600">Archival paints on cotton rag & Belgian linen</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start p-5 bg-white/80 rounded-2xl border border-[#1c1a17]/8 shadow-xs">
            <div className="w-11 h-11 rounded-full bg-[#ffc96f]/30 flex items-center justify-center text-[#d4a373] shrink-0 text-xl">
              📦
            </div>
            <div>
              <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-[#1c1a17]">Safe Crated Delivery</h4>
              <p className="font-sans text-xs text-neutral-600">Insured, moisture-proof custom art packaging</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start p-5 bg-white/80 rounded-2xl border border-[#1c1a17]/8 shadow-xs">
            <div className="w-11 h-11 rounded-full bg-[#78a989]/30 flex items-center justify-center text-[#5f6f65] shrink-0 text-xl">
              ✨
            </div>
            <div>
              <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-[#1c1a17]">Preview Before Dispatch</h4>
              <p className="font-sans text-xs text-neutral-600">Approve high-res artwork photos before shipping</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#1c1a17]/10">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex items-baseline">
                <span className="font-caveat text-3xl font-bold tracking-tight text-[#e85c76]">
                  Chulbul'<span className="text-[#f19b72]">s Art</span>
                </span>
              </div>
            </Link>
            <p className="font-sans text-xs text-neutral-600 leading-relaxed max-w-sm">
              {settings?.footerTagline || 'Creating bespoke original oil, watercolor, and charcoal commissions that turn cherished memories into timeless heirlooms.'}
            </p>
            <div className="flex items-center gap-2.5 pt-2">
              {settings?.socialLinks?.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white rounded-full border border-[#1c1a17]/15 flex items-center justify-center text-[#1c1a17] hover:bg-[#faa9b0] hover:text-white transition-all shadow-xs"
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
                  className="w-9 h-9 bg-white rounded-full border border-[#1c1a17]/15 flex items-center justify-center text-[#1c1a17] hover:bg-[#faa9b0] hover:text-white transition-all shadow-xs"
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
                  className="w-9 h-9 bg-white rounded-full border border-[#1c1a17]/15 flex items-center justify-center text-[#1c1a17] hover:bg-[#faa9b0] hover:text-white transition-all shadow-xs"
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
                  className="w-9 h-9 bg-white rounded-full border border-[#1c1a17]/15 flex items-center justify-center text-[#1c1a17] hover:bg-[#faa9b0] hover:text-white transition-all shadow-xs"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-sans text-xs font-bold text-[#1c1a17] uppercase tracking-[0.16em] mb-4">
              Explore Showcase
            </h4>
            <ul className="space-y-2.5 font-sans text-xs text-neutral-600">
              <li>
                <Link to="/gallery" className="hover:text-[#e85c76] transition-colors">
                  All Artworks Gallery
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-[#e85c76] transition-colors">
                  Art Mediums & Styles
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-[#e85c76] transition-colors">
                  Commission Pricing Table
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#e85c76] transition-colors">
                  About the Artist
                </Link>
              </li>
            </ul>
          </div>

          {/* Commission Mediums */}
          <div>
            <h4 className="font-sans text-xs font-bold text-[#1c1a17] uppercase tracking-[0.16em] mb-4">
              Featured Crafts
            </h4>
            <ul className="space-y-2.5 font-sans text-xs text-neutral-600">
              <li>
                <Link to="/gallery?medium=Oil%20Painting" className="hover:text-[#e85c76] transition-colors">
                  Heirloom Oil on Canvas
                </Link>
              </li>
              <li>
                <Link to="/gallery?medium=Watercolor" className="hover:text-[#e85c76] transition-colors">
                  Delicate Watercolors
                </Link>
              </li>
              <li>
                <Link to="/gallery?medium=Charcoal%20Sketch" className="hover:text-[#e85c76] transition-colors">
                  Charcoal & Graphite Portraits
                </Link>
              </li>
              <li>
                <Link to="/gallery?medium=Acrylic" className="hover:text-[#e85c76] transition-colors">
                  Modern Acrylic Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Custom Commission CTA */}
          <div className="space-y-3">
            <h4 className="font-sans text-xs font-bold text-[#1c1a17] uppercase tracking-[0.16em]">
              Start Your Commission
            </h4>
            <p className="font-sans text-xs text-neutral-600 leading-relaxed">
              Have a special portrait or memory in mind? Upload your photo and get a custom estimate.
            </p>
            <Link
              to="/custom-order"
              className="inline-flex items-center gap-2 bg-[#faa9b0] hover:bg-[#e85c76] text-white font-sans text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Order Custom Art</span>
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} {siteName || "Chulbul's Art"}. Handcrafted with love.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-[#1c1a17] transition-colors">Privacy</Link>
            <Link to="/about" className="hover:text-[#1c1a17] transition-colors">Terms of Commission</Link>
            <Link to="/contact" className="hover:text-[#1c1a17] transition-colors">Studio Location</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
