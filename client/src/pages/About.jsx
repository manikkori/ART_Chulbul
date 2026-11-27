import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Paintbrush,
  Sparkles,
  Award,
  Calendar,
  CheckCircle2,
  Heart,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  ArrowRight
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import api from '../services/api';

export const About = () => {
  const { artistProfile, settings, setPageTitle, siteName } = useSettings();
  const navigate = useNavigate();
  const [stripArtworks, setStripArtworks] = useState([]);

  useEffect(() => {
    setPageTitle('About the Artist');
    api.get('/artworks?limit=4').then((res) => {
      if (res.data?.success) setStripArtworks(res.data.data);
    });
  }, [setPageTitle]);

  const profile = artistProfile || {
    artistName: 'Chulbul',
    shortBio: 'Fine artist dedicated to preserving memories on canvas.',
    story: 'Art has always been a heartfelt path of listening, observing, and honoring life.',
    philosophy: 'A custom commission is a sacred collaboration of emotion and technique.',
    skillsMediums: [],
    experienceTimeline: [],
    achievements: [],
    processSteps: []
  };

  return (
    <div className="space-y-20 pb-20 pt-6">
      {/* 1. HERO / BIO HEADER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Photo & Tags - Jhankoo Polaroid */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative bg-white p-4 pb-14 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.08)] border border-[#1c1a17]/10 -rotate-2 hover:rotate-0 transition-transform duration-300 w-72 sm:w-96">
              {/* Tape */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#ffdda4]/85 backdrop-blur-sm -rotate-1 rounded-sm shadow-xs border border-[#e5c58a]/40" />

              <div className="w-full aspect-square rounded-xl overflow-hidden bg-[#f8f4ea]">
                <img
                  src={profile.photo?.url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80'}
                  alt={profile.artistName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Hand-drawn caption on Polaroid bottom */}
              <div className="absolute bottom-3 left-0 right-0 text-center font-caveat text-2xl text-[#1c1a17]">
                Hi, I'm {profile.artistName} ✦
              </div>
            </div>
          </div>

          {/* Right Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 font-caveat text-3xl sm:text-4xl text-[#f19b72]">
                <span>Meet the Artist</span>
                <Sparkles className="w-4 h-4 text-[#faa9b0] inline-block" />
              </div>
              <h1 className="font-playfair text-3xl sm:text-5xl text-[#1c1a17] leading-tight">
                Preserving Memories Through Soulful Brushwork
              </h1>
            </div>

            <p className="font-sans text-base sm:text-lg text-[#1c1a17] leading-relaxed italic border-l-4 border-[#faa9b0] pl-4 bg-white/60 py-3 rounded-r-2xl">
              "{profile.shortBio}"
            </p>

            <p className="font-sans text-sm text-[#1c1a17]/75 leading-relaxed whitespace-pre-line">
              {profile.story}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate('/custom-order')}
                className="bg-[#1c1a17] text-white hover:bg-black font-sans text-sm font-medium px-8 py-3.5 rounded-full shadow-sm hover:shadow-md transition-all flex items-center gap-2"
              >
                <Paintbrush className="w-4 h-4 text-[#faa9b0]" />
                <span>Order Custom Art</span>
              </button>
              <button
                onClick={() => navigate('/gallery')}
                className="bg-white/80 text-[#1c1a17] hover:bg-[#f8f4ea] font-sans text-sm font-medium px-6 py-3.5 rounded-full border border-[#1c1a17]/15 shadow-xs transition-all"
              >
                View Past Commissions
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ART PHILOSOPHY QUOTE BOX */}
      {profile.philosophy && (
        <section className="bg-white/70 border-y border-[#1c1a17]/10 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <span className="font-caveat text-2xl text-[#f19b72]">
              Studio Philosophy ✦
            </span>
            <blockquote className="font-playfair text-2xl sm:text-3xl text-[#1c1a17] leading-snug">
              "{profile.philosophy}"
            </blockquote>
            <p className="font-caveat text-2xl text-[#1c1a17]/80">— {profile.artistName}</p>
          </div>
        </section>
      )}

      {/* 3. EXPERIENCE & ACHIEVEMENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Achievements */}
          <div className="bg-white rounded-[2.5rem] border border-[#1c1a17]/10 p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-4">
            <h3 className="font-playfair text-xl text-[#1c1a17] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#d4a373]" />
              <span>Studio Honors & Milestones</span>
            </h3>
            <ul className="space-y-3 font-sans text-sm text-[#1c1a17]/75">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Over 350+ bespoke family, wedding, and pet portraits delivered across India.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Museum-grade archival pigments with 100+ year permanence ratings.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Zero transit damages with custom plywood-reinforced crating.</span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-[2.5rem] border border-[#1c1a17]/10 p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="font-playfair text-xl text-[#1c1a17] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#faa9b0]" />
                <span>Connect with the Artist</span>
              </h3>
              <p className="font-sans text-sm text-[#1c1a17]/65">
                Follow behind-the-scenes easel stories, time-lapse reels, and direct studio drops.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              {settings?.socialLinks?.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#f8f4ea] hover:bg-[#f1e8d6] border border-[#d4a373]/30 px-5 py-2.5 rounded-full text-xs font-sans font-medium text-[#1c1a17] flex items-center gap-2 transition-all shadow-2xs"
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
                  className="bg-[#f8f4ea] hover:bg-[#f1e8d6] border border-[#d4a373]/30 px-5 py-2.5 rounded-full text-xs font-sans font-medium text-[#1c1a17] flex items-center gap-2 transition-all shadow-2xs"
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
                  className="bg-[#f8f4ea] hover:bg-[#f1e8d6] border border-[#d4a373]/30 px-5 py-2.5 rounded-full text-xs font-sans font-medium text-[#1c1a17] flex items-center gap-2 transition-all shadow-2xs"
                >
                  <Youtube className="w-4 h-4" />
                  YouTube
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
