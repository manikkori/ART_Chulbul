import SiteSettings from '../models/SiteSettings.js';
import ArtistProfile from '../models/ArtistProfile.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

/**
 * @desc    Get site settings
 * @route   GET /api/settings
 * @access  Public
 */
export const getSettings = asyncHandler(async (req, res) => {
  let settings = await SiteSettings.findOne();

  if (!settings) {
    // If not yet seeded, create default doc
    settings = await SiteSettings.create({
      siteName: "Chulbul's Art"
    });
  }

  return sendSuccess(res, 'Site settings retrieved.', settings);
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
  let profile = await ArtistProfile.findOne();

  if (!profile) {
    profile = await ArtistProfile.create({
      artistName: 'Chulbul'
    });
  }

  return sendSuccess(res, 'Artist profile retrieved.', profile);
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
