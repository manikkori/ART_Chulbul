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
    <div className="space-y-20 pb-20">
      {/* 1. HERO / BIO HEADER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Photo & Tags */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-cream-200">
              <img
                src={profile.photo?.url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80'}
                alt={profile.artistName}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating Tag */}
            <div className="absolute -bottom-4 bg-terracotta-500 text-white font-handwriting text-2xl px-6 py-2 rounded-full shadow-lg rotate-[-3deg]">
              Hi, I'm {profile.artistName}
            </div>
          </div>

          {/* Right Text */}
          <div className="lg:col-span-7 space-y-6">
            <span className="eyebrow">ABOUT THE ARTIST</span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-charcoal-900 leading-tight">
              Preserving Love & Memories Through Authentic Brushwork
            </h1>
            <p className="text-base sm:text-lg text-charcoal-700 leading-relaxed font-serif italic border-l-2 border-terracotta-400 pl-4">
              "{profile.shortBio}"
            </p>
            <p className="text-sm text-charcoal-600 leading-relaxed whitespace-pre-line">
              {profile.story}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Button
                variant="primary"
                size="md"
                icon={Paintbrush}
                onClick={() => navigate('/custom-order')}
              >
                Order Your Custom Art
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => navigate('/gallery')}
              >
                View Past Commissions
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ART PHILOSOPHY QUOTE BOX */}
      {profile.philosophy && (
        <section className="bg-cream-200/50 border-y border-cream-300 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <span className="eyebrow">ARTISTIC PHILOSOPHY</span>
            <blockquote className="font-serif text-xl sm:text-2xl lg:text-3xl font-medium text-charcoal-900 leading-relaxed">
              "{profile.philosophy}"
            </blockquote>
            <p className="text-xs uppercase tracking-widest text-terracotta-600 font-bold pt-2">
              — {profile.artistName}, Founder & Lead Artist at {siteName}
            </p>
          </div>
        </section>
      )}

      {/* 3. SKILLS & SPECIALIZED MEDIUMS */}
      {profile.skillsMediums && profile.skillsMediums.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="eyebrow">MASTERY & CRAFT</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
              Mediums & Techniques
            </h2>
            <p className="text-sm text-charcoal-600">
              Years of devoted practice dedicated to mastering traditional fine art materials.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {profile.skillsMediums.map((skill, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-6 border border-cream-200 shadow-card space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-charcoal-900">
                    {skill.name}
                  </h3>
                  <Badge variant="sage">{skill.experienceLevel || 'Expert'}</Badge>
                </div>
                {skill.description && (
                  <p className="text-xs text-charcoal-600 leading-relaxed">
                    {skill.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. THE 5-STEP COMMISSION PROCESS */}
      {profile.processSteps && profile.processSteps.length > 0 && (
        <section className="bg-white py-16 border-y border-cream-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="eyebrow">THE CREATION RITUAL</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
                How Your Commission Unfolds
              </h2>
              <p className="text-sm text-charcoal-600">
                Every stage is handled personally by the artist with relentless attention to detail.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {profile.processSteps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="bg-cream-100/60 rounded-3xl p-6 border border-cream-200 space-y-3 relative flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <span className="w-8 h-8 rounded-full bg-terracotta-500 text-white font-serif font-bold text-sm flex items-center justify-center">
                      {step.stepNumber}
                    </span>
                    <h4 className="font-serif text-base font-bold text-charcoal-900">
                      {step.title}
                    </h4>
                    <p className="text-xs text-charcoal-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. EXPERIENCE TIMELINE & ACHIEVEMENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Timeline */}
          {profile.experienceTimeline && profile.experienceTimeline.length > 0 && (
            <div className="bg-white rounded-3xl p-8 border border-cream-200 shadow-card space-y-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-terracotta-500" />
                <h3 className="font-serif text-2xl font-bold text-charcoal-900">
                  Artistic Journey
                </h3>
              </div>

              <div className="space-y-6 relative border-l-2 border-cream-200 pl-6 ml-3">
                {profile.experienceTimeline.map((item, idx) => (
                  <div key={idx} className="relative space-y-1">
                    <span className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-terracotta-500 ring-4 ring-white" />
                    <span className="text-xs font-bold text-terracotta-600 uppercase tracking-wider">
                      {item.year}
                    </span>
                    <h4 className="font-serif text-base font-bold text-charcoal-900">
                      {item.title}
                    </h4>
                    <p className="text-xs text-charcoal-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Awards & Recognition */}
          {profile.achievements && profile.achievements.length > 0 && (
            <div className="bg-white rounded-3xl p-8 border border-cream-200 shadow-card space-y-6">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-terracotta-500" />
                <h3 className="font-serif text-2xl font-bold text-charcoal-900">
                  Honors & Exhibitions
                </h3>
              </div>

              <div className="space-y-4">
                {profile.achievements.map((ach, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-cream-100/70 border border-cream-200 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-sm font-bold text-charcoal-900">
                        {ach.title}
                      </h4>
                      <Badge variant="terracotta">{ach.year}</Badge>
                    </div>
                    {ach.organization && (
                      <p className="text-xs text-charcoal-500">
                        Conferred by: {ach.organization}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Social connect */}
              <div className="pt-4 border-t border-cream-200 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-600">
                  Follow My Easel on Social
                </p>
                <div className="flex items-center gap-3">
                  {settings?.socialLinks?.instagram && (
                    <a
                      href={settings.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-cream-200 text-charcoal-700 hover:text-terracotta-600"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {settings?.socialLinks?.youtube && (
                    <a
                      href={settings.socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-cream-200 text-charcoal-700 hover:text-terracotta-600"
                    >
                      <Youtube className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 6. GALLERY STRIP OF WORK */}
      {stripArtworks.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="eyebrow">PORTFOLIO SNAPSHOT</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
                A Glimpse of the Portfolio
              </h2>
            </div>
            <Link
              to="/gallery"
              className="text-xs font-semibold text-terracotta-600 hover:text-terracotta-700 flex items-center gap-1"
            >
              See all
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stripArtworks.map((art) => (
              <Link
                key={art._id}
                to={`/artworks/${art.slug}`}
                className="group aspect-[4/5] rounded-3xl overflow-hidden bg-cream-200 relative shadow-sm block"
              >
                <img
                  src={art.coverImage?.url}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex items-end">
                  <p className="text-white text-xs font-serif font-bold line-clamp-1">
                    {art.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 7. FINAL COMMISSION CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
          Have a Special Memory in Mind?
        </h2>
        <p className="text-sm text-charcoal-600 max-w-xl mx-auto leading-relaxed">
          I would be honored to paint your story. Every custom commission is crafted with heartfelt patience and sent securely to your home.
        </p>
        <div className="flex justify-center gap-4">
          <Button
            variant="primary"
            size="lg"
            icon={Paintbrush}
            onClick={() => navigate('/custom-order')}
          >
            Order Your Custom Art
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/contact')}
          >
            Send a Query First
          </Button>
        </div>
      </section>
    </div>
  );
};

export default About;
