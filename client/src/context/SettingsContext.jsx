import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    siteName: "Chulbul's Art",
    heroTitle: 'Handmade, Personalized Art Made Exclusively For You',
    heroSubtitle: 'Every brushstroke tells your story. Send us your reference photo, receive a custom quote, and watch your memories turn into timeless original art.',
    heroCtaText: 'Order Your Custom Art',
    footerTagline: 'Crafting memories onto canvas with devotion and gentle brushstrokes.',
    stats: [],
    faq: [],
    pricingGuide: [],
    socialLinks: {
      instagram: 'https://instagram.com',
      facebook: 'https://facebook.com',
      youtube: 'https://youtube.com',
      twitter: 'https://twitter.com'
    }
  });

  const [artistProfile, setArtistProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const [settingsResult, profileResult] = await Promise.allSettled([
        api.get('/settings'),
        api.get('/settings/artist-profile')
      ]);

      if (settingsResult.status === 'fulfilled' && settingsResult.value.data?.data) {
        setSettings(settingsResult.value.data.data);
      }
      if (profileResult.status === 'fulfilled' && profileResult.value.data?.data) {
        setArtistProfile(profileResult.value.data.data);
      }
    } catch (err) {
      console.warn('Failed to load settings, using safe defaults:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  /**
   * Dynamically set page title in format: "<Page name> | <siteName>"
   */
  const setPageTitle = (pageName) => {
    const siteTitle = settings?.siteName || "Chulbul's Art";
    if (!pageName) {
      document.title = `${siteTitle} | Custom Art Commission & Showcase`;
    } else {
      document.title = `${pageName} | ${siteTitle}`;
    }
  };

  const refreshSettings = async () => {
    await fetchSettings();
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        artistProfile,
        loading,
        setPageTitle,
        refreshSettings,
        siteName: settings?.siteName || "Chulbul's Art"
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
