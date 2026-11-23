import SiteSettings from '../models/SiteSettings.js';
import ArtistProfile from '../models/ArtistProfile.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

const DEFAULT_SETTINGS = {
  siteName: "Chulbul's Art",
  logo: { url: '', publicId: '' },
  favicon: { url: '', publicId: '' },
  heroTitle: 'Handmade, Personalized Art Made Exclusively For You',
  heroSubtitle: 'Every brushstroke tells your story. Send us your reference photo, receive a custom quote, and watch your memories turn into timeless original art.',
  heroCtaText: 'Order Your Custom Art',
  heroImage: { url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80', publicId: '' },
  stats: [
    { label: 'Original Artworks', value: '450+', description: 'Handmade commissions delivered' },
    { label: 'Happy Art Patrons', value: '98%', description: 'Loved by families & collectors' },
    { label: 'Years of Devotion', value: '8+', description: 'Mastering classical & contemporary mediums' }
  ],
  faq: [
    { question: 'How do custom art commissions work?', answer: 'Pick your medium, upload your reference photo, and describe what you envision. The artist reviews your request and sends an exact quote and completion timeframe.' },
    { question: 'How long does a painting take?', answer: 'Most medium pieces take 7 to 14 days to paint, dry, varnish, and pack for insured delivery.' },
    { question: 'Do you ship across India?', answer: 'Yes! All finished artworks are carefully packed with moisture-resistant archival materials and shipped with end-to-end tracking.' }
  ],
  pricingGuide: [],
  socialLinks: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    youtube: 'https://youtube.com',
    twitter: 'https://twitter.com'
  },
  seoTitle: "Chulbul's Art | Custom Art Commission & Showcase",
  seoDescription: "Discover unique custom art commissions at Chulbul's Art. Handcrafted portraits, sketches, and paintings made with passion and soul.",
  footerTagline: 'Crafting memories onto canvas with devotion and gentle brushstrokes.'
};

const DEFAULT_ARTIST_PROFILE = {
  artistName: 'Chulbul',
  shortBio: 'Fine artist dedicated to preserving memories in oil, watercolor, charcoal, and acrylic.',
  story: 'From early childhood charcoal sketches to masterwork canvas commissions, art has been a lifelong meditation and devotion.',
  philosophy: 'Every artwork is an encounter with time — where beauty does not fade, but transforms.',
  skillsMediums: [
    { medium: 'Charcoal & Graphite', proficiency: 98, description: 'Deep contrast, delicate hyper-realistic portraits' },
    { medium: 'Archival Watercolor', proficiency: 95, description: 'Luminous blooming washes on cotton rag' },
    { medium: 'Oil Painting', proficiency: 96, description: 'Timeless impasto textures & glazed depth' },
    { medium: 'Textured Acrylic', proficiency: 92, description: 'Vivid palette knife contemporary commissions' }
  ],
  experienceTimeline: [
    { year: '2018', title: 'Studio Inception', description: 'Began commissioned portraiture for private art collectors.' },
    { year: '2021', title: 'National Showcase', description: 'Exhibited custom watercolor and charcoal works across India.' },
    { year: '2026', title: 'Atelier Digital Presence', description: 'Launched global custom art commission platform.' }
  ],
  achievements: [],
  processSteps: [
    { stepNumber: 1, title: 'Photo Consultation', description: 'Detailed review of composition, lighting, and medium.' },
    { stepNumber: 2, title: 'Color Blocking & Sketching', description: 'Initial tonal foundation laid on primed canvas.' },
    { stepNumber: 3, title: 'Detailing & Glazing', description: 'Progress photos shared in real-time order chat.' },
    { stepNumber: 4, title: 'Archival Packing', description: 'Varnished, dried, and shipped with tracking.' }
  ]
};

/**
 * @desc    Get site settings
 * @route   GET /api/settings
 * @access  Public
 */
export const getSettings = asyncHandler(async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();

    if (!settings) {
      try {
        settings = await SiteSettings.create(DEFAULT_SETTINGS);
      } catch (createErr) {
        settings = DEFAULT_SETTINGS;
      }
    }

    return sendSuccess(res, 'Site settings retrieved.', settings);
  } catch (err) {
    console.warn('[Settings] DB error during getSettings, returning default fallback:', err.message);
    return sendSuccess(res, 'Site settings retrieved (fallback).', DEFAULT_SETTINGS);
  }
});

/**
 * @desc    Update site settings
 * @route   PUT /api/settings
 * @access  Private/Admin
 */
export const updateSettings = asyncHandler(async (req, res) => {
  let settings = await SiteSettings.findOne();

  if (!settings) {
    settings = new SiteSettings();
  }

  const {
    siteName,
    heroTitle,
    heroSubtitle,
    heroCtaText,
    stats,
    faq,
    pricingGuide,
    socialLinks,
    seoTitle,
    seoDescription,
    footerTagline,
    termsContent,
    privacyContent,
    refundContent
  } = req.body;

  if (siteName !== undefined) settings.siteName = siteName.trim() || "Chulbul's Art";
  if (heroTitle !== undefined) settings.heroTitle = heroTitle;
  if (heroSubtitle !== undefined) settings.heroSubtitle = heroSubtitle;
  if (heroCtaText !== undefined) settings.heroCtaText = heroCtaText;
  if (seoTitle !== undefined) settings.seoTitle = seoTitle;
  if (seoDescription !== undefined) settings.seoDescription = seoDescription;
  if (footerTagline !== undefined) settings.footerTagline = footerTagline;
  if (termsContent !== undefined) settings.termsContent = termsContent;
  if (privacyContent !== undefined) settings.privacyContent = privacyContent;
  if (refundContent !== undefined) settings.refundContent = refundContent;

  if (socialLinks) {
    settings.socialLinks = typeof socialLinks === 'string' ? JSON.parse(socialLinks) : socialLinks;
  }
  if (stats) {
    settings.stats = typeof stats === 'string' ? JSON.parse(stats) : stats;
  }
  if (faq) {
    settings.faq = typeof faq === 'string' ? JSON.parse(faq) : faq;
  }
  if (pricingGuide) {
    settings.pricingGuide = typeof pricingGuide === 'string' ? JSON.parse(pricingGuide) : pricingGuide;
  }

  // Handle uploaded files for logo / favicon / heroImage
  if (req.files) {
    if (req.files.logo && req.files.logo[0]) {
      const up = await uploadToCloudinary(req.files.logo[0].buffer, 'artchulbul/branding', req.files.logo[0].originalname);
      settings.logo = { url: up.url, publicId: up.publicId };
    }
    if (req.files.favicon && req.files.favicon[0]) {
      const up = await uploadToCloudinary(req.files.favicon[0].buffer, 'artchulbul/branding', req.files.favicon[0].originalname);
      settings.favicon = { url: up.url, publicId: up.publicId };
    }
    if (req.files.heroImage && req.files.heroImage[0]) {
      const up = await uploadToCloudinary(req.files.heroImage[0].buffer, 'artchulbul/branding', req.files.heroImage[0].originalname);
      settings.heroImage = { url: up.url, publicId: up.publicId };
    }
  }

  await settings.save();
  return sendSuccess(res, 'Site settings updated successfully.', settings);
});

/**
 * @desc    Get artist profile (About Page)
 * @route   GET /api/artist-profile
 * @access  Public
 */
export const getArtistProfile = asyncHandler(async (req, res) => {
  try {
    let profile = await ArtistProfile.findOne();

    if (!profile) {
      try {
        profile = await ArtistProfile.create(DEFAULT_ARTIST_PROFILE);
      } catch (createErr) {
        profile = DEFAULT_ARTIST_PROFILE;
      }
    }

    return sendSuccess(res, 'Artist profile retrieved.', profile);
  } catch (err) {
    console.warn('[ArtistProfile] DB error during getArtistProfile, returning default fallback:', err.message);
    return sendSuccess(res, 'Artist profile retrieved (fallback).', DEFAULT_ARTIST_PROFILE);
  }
});

/**
 * @desc    Update artist profile (About Page Manager)
 * @route   PUT /api/artist-profile
 * @access  Private/Admin
 */
export const updateArtistProfile = asyncHandler(async (req, res) => {
  let profile = await ArtistProfile.findOne();

  if (!profile) {
    profile = new ArtistProfile();
  }

  const {
    artistName,
    shortBio,
    story,
    philosophy,
    skillsMediums,
    experienceTimeline,
    achievements,
    processSteps
  } = req.body;

  if (artistName !== undefined) profile.artistName = artistName;
  if (shortBio !== undefined) profile.shortBio = shortBio;
  if (story !== undefined) profile.story = story;
  if (philosophy !== undefined) profile.philosophy = philosophy;

  if (skillsMediums) {
    profile.skillsMediums = typeof skillsMediums === 'string' ? JSON.parse(skillsMediums) : skillsMediums;
  }
  if (experienceTimeline) {
    profile.experienceTimeline = typeof experienceTimeline === 'string' ? JSON.parse(experienceTimeline) : experienceTimeline;
  }
  if (achievements) {
    profile.achievements = typeof achievements === 'string' ? JSON.parse(achievements) : achievements;
  }
  if (processSteps) {
    profile.processSteps = typeof processSteps === 'string' ? JSON.parse(processSteps) : processSteps;
  }

  // Handle uploaded files for artist photo / avatar illustration
  if (req.files) {
    if (req.files.photo && req.files.photo[0]) {
      const up = await uploadToCloudinary(req.files.photo[0].buffer, 'artchulbul/artist', req.files.photo[0].originalname);
      profile.photo = { url: up.url, publicId: up.publicId };
    }
    if (req.files.avatarIllustration && req.files.avatarIllustration[0]) {
      const up = await uploadToCloudinary(req.files.avatarIllustration[0].buffer, 'artchulbul/artist', req.files.avatarIllustration[0].originalname);
      profile.avatarIllustration = { url: up.url, publicId: up.publicId };
    }
  }

  await profile.save();
  return sendSuccess(res, 'Artist profile updated successfully.', profile);
});
