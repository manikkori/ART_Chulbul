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
    <div className="space-y-20 pb-20 pt-4">
      {/* 1. HERO / BIO HEADER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Photo & Tags */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 border-2 border-[#121212] bg-[#fff7f9] shadow-[8px_8px_0px_#f7cbd7] overflow-hidden">
              <img
                src={profile.photo?.url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80'}
                alt={profile.artistName}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating Tag */}
            <div className="absolute -bottom-4 bg-[#121212] text-white font-script text-3xl px-6 py-2 border-2 border-[#121212] shadow-[3px_3px_0px_#f7cbd7] rotate-[-4deg]">
              Hi, I'm {profile.artistName}
            </div>
          </div>

          {/* Right Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1 font-script text-3xl text-[#121212]">
                <span>Meet the Artist</span>
                <Heart className="w-4 h-4 text-[#dc8da3] fill-[#f7cbd7] inline-block" />
              </div>
              <h1 className="font-montserrat font-extrabold text-3xl sm:text-5xl text-[#121212] uppercase tracking-[0.06em] leading-tight">
                PRESERVING MEMORIES THROUGH BRUSHWORK
              </h1>
            </div>

            <p className="font-sans text-base sm:text-lg text-gray-800 leading-relaxed italic border-l-4 border-[#121212] pl-4 bg-[#fff7f9] py-2">
              "{profile.shortBio}"
            </p>

            <p className="font-sans text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {profile.story}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate('/custom-order')}
                className="bg-[#121212] text-white hover:bg-black font-montserrat text-xs font-bold uppercase tracking-wider px-8 py-3.5 border-2 border-[#121212] shadow-[4px_4px_0px_#f7cbd7] flex items-center gap-2"
              >
                <Paintbrush className="w-4 h-4 text-[#f7cbd7]" />
                <span>ORDER CUSTOM ART</span>
              </button>
              <button
                onClick={() => navigate('/gallery')}
                className="bg-white text-[#121212] hover:bg-[#fff7f9] font-montserrat text-xs font-bold uppercase tracking-wider px-6 py-3.5 border-2 border-[#121212] shadow-[3px_3px_0px_#f7cbd7]"
              >
                VIEW PAST COMMISSIONS
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ART PHILOSOPHY QUOTE BOX */}
      {profile.philosophy && (
        <section className="bg-[#fff7f9] border-y-2 border-[#121212] py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <span className="font-montserrat text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
              STUDIO PHILOSOPHY
            </span>
            <blockquote className="font-montserrat font-extrabold text-xl sm:text-3xl text-[#121212] uppercase tracking-wide leading-snug">
              "{profile.philosophy}"
            </blockquote>
            <p className="font-script text-2xl text-[#121212]">— {profile.artistName}</p>
          </div>
        </section>
      )}

      {/* 3. EXPERIENCE & ACHIEVEMENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Achievements */}
          <div className="bg-white border-2 border-[#121212] p-8 shadow-[6px_6px_0px_#f7cbd7] space-y-4">
            <h3 className="font-montserrat font-extrabold text-xl text-[#121212] uppercase tracking-wider flex items-center gap-2">
              <Award className="w-5 h-5 text-[#121212]" />
              <span>Studio Honors & Milestones</span>
            </h3>
            <ul className="space-y-3 font-sans text-xs sm:text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#121212] shrink-0 mt-0.5" />
                <span>Over 350+ bespoke family, wedding, and pet portraits delivered across India.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#121212] shrink-0 mt-0.5" />
                <span>Museum-grade archival pigments with 100+ year permanence ratings.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#121212] shrink-0 mt-0.5" />
                <span>Zero transit damages with custom plywood-reinforced crating.</span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="bg-white border-2 border-[#121212] p-8 shadow-[6px_6px_0px_#f7cbd7] space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="font-montserrat font-extrabold text-xl text-[#121212] uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#121212]" />
                <span>Connect with the Artist</span>
              </h3>
              <p className="font-sans text-xs sm:text-sm text-gray-600">
                Follow behind-the-scenes easel stories, time-lapse reels, and direct studio drops.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              {settings?.socialLinks?.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#fff7f9] border-2 border-[#121212] px-4 py-2 text-xs font-montserrat font-bold text-[#121212] shadow-[2px_2px_0px_#f7cbd7] flex items-center gap-2"
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
                  className="bg-[#fff7f9] border-2 border-[#121212] px-4 py-2 text-xs font-montserrat font-bold text-[#121212] shadow-[2px_2px_0px_#f7cbd7] flex items-center gap-2"
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
                  className="bg-[#fff7f9] border-2 border-[#121212] px-4 py-2 text-xs font-montserrat font-bold text-[#121212] shadow-[2px_2px_0px_#f7cbd7] flex items-center gap-2"
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
