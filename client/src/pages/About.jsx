import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Award,
  CheckCircle2,
  Instagram,
  Facebook,
  Youtube,
  ArrowRight,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { STUDIO_ARTWORKS } from '../data/studioFallbacks';
import api from '../services/api';

export const About = () => {
  const { artistProfile, settings, setPageTitle } = useSettings();
  const navigate = useNavigate();
  const [stripArtworks, setStripArtworks] = useState([]);

  useEffect(() => {
    setPageTitle('About the Artist');
    api
      .get('/artworks?limit=4')
      .then((res) => {
        if (res.data?.success && res.data.data?.length > 0) {
          setStripArtworks(res.data.data);
        } else {
          setStripArtworks(STUDIO_ARTWORKS.slice(0, 4));
        }
      })
      .catch(() => {
        setStripArtworks(STUDIO_ARTWORKS.slice(0, 4));
      });
  }, [setPageTitle]);

  const profile = artistProfile || {
    artistName: 'Chulbul',
    shortBio: 'Fine artist dedicated to preserving cherished memories on cotton paper and canvas.',
    story:
      'Art has always been a quiet conversation between memory and texture — turning passing photographs into heirlooms families keep forever.',
    philosophy: 'A custom commission is a deeply personal collaboration of emotion and craft.',
  };

  return (
    <div className="max-w-[1200px] mx-auto px-3 sm:px-6 lg:px-8 pt-6 pb-20 space-y-12">
      {/* 1. HERO BIO SECTION */}
      <section className="rounded-[28px] bg-white border border-[#eae9ee] p-6 sm:p-10 lg:p-12 shadow-[0_8px_36px_rgba(0,0,0,0.03)] grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-5 relative flex justify-center">
          <div className="relative w-68 h-76 sm:w-88 sm:h-96 rounded-[24px] overflow-hidden bg-[#f8f7fb] border border-[#eae9ee] shadow-lg">
            <img
              src={
                profile.photo?.url ||
                'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80'
              }
              alt={profile.artistName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-3 px-5 py-2 rounded-full bg-[#111827] text-white font-caveat text-2xl shadow-lg">
            Hi, I&apos;m {profile.artistName}
          </div>
        </div>

        <div className="lg:col-span-7 space-y-5">
          <span className="eyebrow">Meet the Artist</span>
          <h1 className="editorial-serif text-4xl sm:text-6xl text-[#111827] font-normal leading-[1.03]">
            Preserving Memories Through Brushwork
          </h1>

          <p className="text-[15px] sm:text-[16px] text-[#3c3c43] italic bg-[#f8f7fb] border-l-4 border-[#ff0457] pl-4 py-2.5 rounded-r-xl">
            &ldquo;{profile.shortBio}&rdquo;
          </p>

          <p className="text-[14px] text-[#6e6e73] leading-relaxed whitespace-pre-line">
            {profile.story}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/custom-order')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#ff0457] hover:bg-[#d90349] text-white text-[13px] font-bold shadow-[0_8px_22px_rgba(255,4,87,0.28)] transition-all hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Order Custom Art</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/gallery')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#f2f1f6] hover:bg-[#e5e4ea] text-[#111827] text-[13px] font-semibold transition-colors"
            >
              <span>View Past Commissions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. STUDIO PHILOSOPHY QUOTE */}
      {profile.philosophy && (
        <section className="rounded-[24px] bg-[#16161b] text-white p-8 sm:p-12 text-center space-y-3">
          <span className="inline-block px-3 py-1 rounded-full bg-[#ff0457] text-white text-[11px] font-bold uppercase tracking-wider">
            Studio Philosophy
          </span>
          <blockquote className="editorial-serif text-3xl sm:text-5xl text-white font-normal leading-tight max-w-3xl mx-auto">
            &ldquo;{profile.philosophy}&rdquo;
          </blockquote>
          <p className="font-caveat text-2xl text-[#ffc2d7]">— {profile.artistName}</p>
        </section>
      )}

      {/* 3. HONORS & SOCIALS */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-[24px] bg-white border border-[#eae9ee] p-7 space-y-4 shadow-[0_6px_24px_rgba(0,0,0,0.03)]">
          <h3 className="text-[18px] font-bold text-[#111827] flex items-center gap-2">
            <Award className="w-5 h-5 text-[#ff0457]" />
            <span>Studio Honors &amp; Craft</span>
          </h3>
          <ul className="space-y-3 text-[13px] text-[#3c3c43]">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#ff0457] shrink-0 mt-0.5" />
              <span>350+ bespoke family, wedding, and pet portraits delivered across India.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#ff0457] shrink-0 mt-0.5" />
              <span>Museum-grade archival pigments &amp; acid-free cotton paper.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#ff0457] shrink-0 mt-0.5" />
              <span>Custom plywood-reinforced crating for zero transit damage.</span>
            </li>
          </ul>
        </div>

        <div className="rounded-[24px] bg-white border border-[#eae9ee] p-7 flex flex-col justify-between gap-5 shadow-[0_6px_24px_rgba(0,0,0,0.03)]">
          <div className="space-y-2">
            <h3 className="text-[18px] font-bold text-[#111827] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#ff0457]" />
              <span>Connect with the Studio</span>
            </h3>
            <p className="text-[13px] text-[#6e6e73] leading-relaxed">
              Follow behind-the-scenes charcoal blending reels, watercolor studies, and finished unboxing videos.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {settings?.socialLinks?.instagram && (
              <a
                href={settings.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f2f1f6] hover:bg-[#ffe5ee] hover:text-[#ff0155] text-[13px] font-semibold text-[#111827] transition-colors"
              >
                <Instagram className="w-4 h-4" />
                Instagram
              </a>
            )}
            {settings?.socialLinks?.facebook && (
              <a
                href={settings.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f2f1f6] hover:bg-[#ffe5ee] hover:text-[#ff0155] text-[13px] font-semibold text-[#111827] transition-colors"
              >
                <Facebook className="w-4 h-4" />
                Facebook
              </a>
            )}
            {settings?.socialLinks?.youtube && (
              <a
                href={settings.socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f2f1f6] hover:bg-[#ffe5ee] hover:text-[#ff0155] text-[13px] font-semibold text-[#111827] transition-colors"
              >
                <Youtube className="w-4 h-4" />
                YouTube
              </a>
            )}
          </div>

          {stripArtworks.length > 0 && (
            <div className="grid grid-cols-4 gap-2 pt-2">
              {stripArtworks.slice(0, 4).map((a) => (
                <img
                  key={a._id}
                  src={a.coverImage?.url || a.images?.[0]?.url}
                  alt={a.title}
                  onClick={() => navigate(`/artworks/${a.slug}`)}
                  className="aspect-square rounded-[12px] object-cover cursor-pointer hover:opacity-85 transition-opacity"
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default About;
