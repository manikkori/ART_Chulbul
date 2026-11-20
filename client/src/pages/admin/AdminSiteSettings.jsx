import React, { useEffect, useState, useRef } from 'react';
import { Save, Plus, Trash2, Palette, Globe, HelpCircle, FileText, Upload } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const AdminSiteSettings = () => {
  const { setPageTitle, refreshSettings } = useSettings();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Branding Fields
  const [siteName, setSiteName] = useState("Chulbul's Art");
  const [logoPreview, setLogoPreview] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);

  // Hero Section Fields
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroCtaText, setHeroCtaText] = useState('');
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [heroImagePreview, setHeroImagePreview] = useState('');

  // SEO & Footer
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [footerTagline, setFooterTagline] = useState('');

  // Social Links
  const [socialLinks, setSocialLinks] = useState({
    instagram: '',
    facebook: '',
    youtube: '',
    twitter: ''
  });

  // FAQs
  const [faqs, setFaqs] = useState([]);

  // Pricing Guide
  const [pricingGuide, setPricingGuide] = useState([]);

  // Policies
  const [termsContent, setTermsContent] = useState('');
  const [privacyContent, setPrivacyContent] = useState('');
  const [refundContent, setRefundContent] = useState('');

  useEffect(() => {
    setPageTitle('Site Settings & Branding');
    fetchSettings();
  }, [setPageTitle]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/settings');
      if (res.data?.success && res.data?.data) {
        const s = res.data.data;
        setSiteName(s.siteName || "Chulbul's Art");
        setLogoPreview(s.logo?.url || '');
        setHeroTitle(s.heroTitle || '');
        setHeroSubtitle(s.heroSubtitle || '');
        setHeroCtaText(s.heroCtaText || '');
        setHeroImagePreview(s.heroImage?.url || '');
        setSeoTitle(s.seoTitle || '');
        setSeoDescription(s.seoDescription || '');
        setFooterTagline(s.footerTagline || '');
        setSocialLinks(s.socialLinks || {});
        setFaqs(s.faq || []);
        setPricingGuide(s.pricingGuide || []);
        setTermsContent(s.termsContent || '');
        setPrivacyContent(s.privacyContent || '');
        setRefundContent(s.refundContent || '');
      }
    } catch (err) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('siteName', siteName);
      formData.append('heroTitle', heroTitle);
      formData.append('heroSubtitle', heroSubtitle);
      formData.append('heroCtaText', heroCtaText);
      formData.append('seoTitle', seoTitle);
      formData.append('seoDescription', seoDescription);
      formData.append('footerTagline', footerTagline);
      formData.append('socialLinks', JSON.stringify(socialLinks));
      formData.append('faq', JSON.stringify(faqs));
      formData.append('pricingGuide', JSON.stringify(pricingGuide));
      formData.append('termsContent', termsContent);
      formData.append('privacyContent', privacyContent);
      formData.append('refundContent', refundContent);

      if (logoFile) formData.append('logo', logoFile);
      if (faviconFile) formData.append('favicon', faviconFile);
      if (heroImageFile) formData.append('heroImage', heroImageFile);

      const res = await api.put('/settings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data?.success) {
        toast.success('Site settings and branding updated!');
        refreshSettings();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  // FAQ Handlers
  const addFaq = () => {
    setFaqs([...faqs, { question: '', answer: '', order: faqs.length + 1 }]);
  };
  const removeFaq = (idx) => {
    setFaqs(faqs.filter((_, i) => i !== idx));
  };

  // Pricing Guide Handlers
  const addPriceItem = () => {
    setPricingGuide([
      ...pricingGuide,
      { category: 'Pencil Sketch', size: 'A3 (11.7 x 16.5 in)', startingPrice: 2999, description: '' }
    ]);
  };
  const removePriceItem = (idx) => {
    setPricingGuide(pricingGuide.filter((_, i) => i !== idx));
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-charcoal-400">Loading settings...</div>;
  }

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-200 pb-6">
        <div>
          <span className="eyebrow">STUDIO CONFIGURATION</span>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">
            Site Settings & Global Branding
          </h1>
          <p className="text-xs text-charcoal-500 mt-1">
            Configure site name, logo, hero banners, pricing guidelines, and FAQ entries.
          </p>
        </div>

        <Button variant="primary" icon={Save} loading={saving} onClick={handleSaveSettings}>
          Save Settings
        </Button>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-8">
        {/* Branding & Logo */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card space-y-6">
          <h3 className="font-serif text-lg font-bold text-charcoal-900 border-b border-cream-100 pb-3">
            Brand Identity
          </h3>

          <Input
            label="Website Name"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            helperText="Default: 'Chulbul\'s Art'. This appears throughout the navbar, title tags, and notifications."
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-xs font-semibold uppercase text-charcoal-700 mb-1">
                Upload Custom Logo Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setLogoFile(e.target.files[0]);
                  setLogoPreview(URL.createObjectURL(e.target.files[0]));
                }}
                className="text-xs text-charcoal-700 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:bg-terracotta-50 file:text-terracotta-600"
              />
              {logoPreview && (
                <div className="mt-2 p-2 bg-cream-100 rounded-xl inline-block">
                  <img src={logoPreview} alt="Logo" className="h-8 object-contain" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-charcoal-700 mb-1">
                Upload Favicon (.png / .ico / .svg)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFaviconFile(e.target.files[0])}
                className="text-xs text-charcoal-700 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:bg-terracotta-50 file:text-terracotta-600"
              />
            </div>
          </div>
        </div>

        {/* Hero Section Config */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card space-y-6">
          <h3 className="font-serif text-lg font-bold text-charcoal-900 border-b border-cream-100 pb-3">
            Homepage Hero Section
          </h3>

          <Input
            label="Hero Headline Title"
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold uppercase text-charcoal-700 mb-1">
              Hero Subtitle Paragraph
            </label>
            <textarea
              rows={3}
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="w-full p-3 rounded-2xl bg-white border border-cream-300 text-xs text-charcoal-900 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Primary CTA Button Text"
              value={heroCtaText}
              onChange={(e) => setHeroCtaText(e.target.value)}
            />

            <div>
              <label className="block text-xs font-semibold uppercase text-charcoal-700 mb-1">
                Hero Showcase Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setHeroImageFile(e.target.files[0]);
                  setHeroImagePreview(URL.createObjectURL(e.target.files[0]));
                }}
                className="text-xs text-charcoal-700 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:bg-terracotta-50 file:text-terracotta-600"
              />
            </div>
          </div>
        </div>

        {/* FAQ Manager */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-cream-100 pb-3">
            <h3 className="font-serif text-lg font-bold text-charcoal-900">
              Frequently Asked Questions (FAQ Manager)
            </h3>
            <Button variant="outline" size="sm" icon={Plus} onClick={addFaq}>
              Add FAQ
            </Button>
          </div>

          <div className="space-y-4">
            {faqs.map((f, i) => (
              <div key={i} className="p-4 rounded-2xl bg-cream-50 border border-cream-200 space-y-2 relative">
                <button
                  type="button"
                  onClick={() => removeFaq(i)}
                  className="absolute top-4 right-4 p-1 text-charcoal-400 hover:text-rose-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <Input
                  label={`Question ${i + 1}`}
                  value={f.question}
                  onChange={(e) => {
                    const copy = [...faqs];
                    copy[i].question = e.target.value;
                    setFaqs(copy);
                  }}
                  className="pr-10"
                />
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-charcoal-600 mb-1">
                    Answer
                  </label>
                  <textarea
                    rows={2}
                    value={f.answer}
                    onChange={(e) => {
                      const copy = [...faqs];
                      copy[i].answer = e.target.value;
                      setFaqs(copy);
                    }}
                    className="w-full p-2.5 rounded-xl bg-white border border-cream-300 text-xs text-charcoal-900 leading-relaxed"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing & Size Guide Manager */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-cream-100 pb-3">
            <h3 className="font-serif text-lg font-bold text-charcoal-900">
              Indicative Pricing & Size Guide
            </h3>
            <Button variant="outline" size="sm" icon={Plus} onClick={addPriceItem}>
              Add Pricing Tier
            </Button>
          </div>

          <div className="space-y-3">
            {pricingGuide.map((item, i) => (
              <div key={i} className="p-4 rounded-2xl bg-cream-50 border border-cream-200 flex flex-col sm:flex-row gap-3 items-center">
                <Input
                  placeholder="Category (e.g. Charcoal)"
                  value={item.category}
                  onChange={(e) => {
                    const copy = [...pricingGuide];
                    copy[i].category = e.target.value;
                    setPricingGuide(copy);
                  }}
                  className="sm:w-1/4"
                />
                <Input
                  placeholder="Size (e.g. A3)"
                  value={item.size}
                  onChange={(e) => {
                    const copy = [...pricingGuide];
                    copy[i].size = e.target.value;
                    setPricingGuide(copy);
                  }}
                  className="sm:w-1/4"
                />
                <Input
                  type="number"
                  placeholder="Starting ₹"
                  value={item.startingPrice}
                  onChange={(e) => {
                    const copy = [...pricingGuide];
                    copy[i].startingPrice = Number(e.target.value);
                    setPricingGuide(copy);
                  }}
                  className="sm:w-28"
                />
                <Input
                  placeholder="Description..."
                  value={item.description}
                  onChange={(e) => {
                    const copy = [...pricingGuide];
                    copy[i].description = e.target.value;
                    setPricingGuide(copy);
                  }}
                  className="sm:w-1/3"
                />
                <button
                  type="button"
                  onClick={() => removePriceItem(i)}
                  className="p-2 text-charcoal-400 hover:text-rose-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Social Links & SEO */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card space-y-6">
          <h3 className="font-serif text-lg font-bold text-charcoal-900 border-b border-cream-100 pb-3">
            Social Profiles & SEO
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Instagram URL"
              value={socialLinks.instagram || ''}
              onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
            />
            <Input
              label="Facebook URL"
              value={socialLinks.facebook || ''}
              onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
            />
            <Input
              label="YouTube URL"
              value={socialLinks.youtube || ''}
              onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
            />
            <Input
              label="Twitter / X URL"
              value={socialLinks.twitter || ''}
              onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-cream-100">
            <Input
              label="SEO Title Tag"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
            />
            <Input
              label="Footer Warm Tagline"
              value={footerTagline}
              onChange={(e) => setFooterTagline(e.target.value)}
            />
          </div>

          <Input
            label="SEO Meta Description"
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
          />
        </div>

        {/* Editable Policies */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card space-y-6">
          <h3 className="font-serif text-lg font-bold text-charcoal-900 border-b border-cream-100 pb-3">
            Static Policy Content
          </h3>

          <div>
            <label className="block text-xs font-semibold uppercase text-charcoal-700 mb-1">
              Terms of Commission Content
            </label>
            <textarea
              rows={4}
              value={termsContent}
              onChange={(e) => setTermsContent(e.target.value)}
              className="w-full p-3 rounded-2xl bg-white border border-cream-300 text-xs text-charcoal-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-charcoal-700 mb-1">
              Privacy Policy Content
            </label>
            <textarea
              rows={4}
              value={privacyContent}
              onChange={(e) => setPrivacyContent(e.target.value)}
              className="w-full p-3 rounded-2xl bg-white border border-cream-300 text-xs text-charcoal-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-charcoal-700 mb-1">
              Refund & Cancellation Policy Content
            </label>
            <textarea
              rows={4}
              value={refundContent}
              onChange={(e) => setRefundContent(e.target.value)}
              className="w-full p-3 rounded-2xl bg-white border border-cream-300 text-xs text-charcoal-900"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="primary" size="lg" icon={Save} loading={saving} type="submit">
            Save All Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminSiteSettings;
