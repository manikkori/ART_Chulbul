import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Paintbrush,
  Camera,
  FileText,
  MapPin,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { formatPrice } from '../../utils/formatters';
import Input from '../../components/common/Input';
import ImageUploader from '../../components/common/ImageUploader';
import { STUDIO_CATEGORIES } from '../../data/studioFallbacks';
import api from '../../services/api';
import toast from 'react-hot-toast';

const STEPS = [
  { step: 1, title: 'Medium & Size', icon: Paintbrush },
  { step: 2, title: 'Reference Photos', icon: Camera },
  { step: 3, title: 'Art Preferences', icon: FileText },
  { step: 4, title: 'Address & Review', icon: MapPin },
];

const STANDARD_SIZES = [
  { size: 'A4 (8.3 x 11.7 in)', desc: 'Ideal for a single portrait or bedside frame' },
  { size: 'A3 (11.7 x 16.5 in)', desc: 'Most requested for couple portraits and living spaces' },
  { size: 'A2 (16.5 x 23.4 in)', desc: 'Statement piece for weddings & milestone walls' },
  { size: '16 x 20 inches', desc: 'Classic stretched proportion for fine oils & acrylics' },
  { size: '18 x 24 inches', desc: 'Gallery canvas with commanding presence' },
  { size: '24 x 36 inches', desc: 'Museum scale heirloom painting' },
];

export const CustomOrderForm = () => {
  const { user, isAuthenticated } = useAuth();
  const { setPageTitle } = useSettings();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [currentStep, setCurrentStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [medium, setMedium] = useState('');
  const [size, setSize] = useState('A3 (11.7 x 16.5 in)');
  const [customSize, setCustomSize] = useState('');
  const [useCustomSize, setUseCustomSize] = useState(false);

  const [referenceFiles, setReferenceFiles] = useState([]);

  const [description, setDescription] = useState('');
  const [subjectsCount, setSubjectsCount] = useState(1);
  const [background, setBackground] = useState('Artist choice / natural soft blend');
  const [colors, setColors] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [deadline, setDeadline] = useState('');

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [newAddress, setNewAddress] = useState({
    recipientName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });
  const [useNewAddress, setUseNewAddress] = useState(false);

  useEffect(() => {
    setPageTitle('Commission Custom Artwork');

    const applyCategories = (list) => {
      const cats = list && list.length > 0 ? list : STUDIO_CATEGORIES;
      setCategories(cats);
      const queryCatSlug = searchParams.get('category');
      if (queryCatSlug) {
        const match = cats.find((c) => c.slug === queryCatSlug);
        if (match) {
          setSelectedCategory(match._id);
          setMedium(match.name);
          return;
        }
      }
      if (cats.length > 0) {
        setSelectedCategory(cats[0]._id);
        setMedium(cats[0].name);
      }
    };

    api
      .get('/categories')
      .then((res) => {
        if (res.data?.success && res.data.data?.length > 0) {
          applyCategories(res.data.data);
        } else {
          applyCategories(STUDIO_CATEGORIES);
        }
      })
      .catch(() => {
        applyCategories(STUDIO_CATEGORIES);
      });

    const queryArtwork = searchParams.get('artwork');
    if (queryArtwork) {
      setDescription(
        `I would like a custom artwork inspired by the style and atmosphere of "${queryArtwork}".`
      );
    }
  }, [searchParams, setPageTitle]);

  useEffect(() => {
    if (user?.addresses && user.addresses.length > 0) {
      setSavedAddresses(user.addresses);
      const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      setSelectedAddressId(defaultAddr._id);
      setUseNewAddress(false);
    } else {
      setUseNewAddress(true);
      if (user) {
        setNewAddress((prev) => ({
          ...prev,
          recipientName: user.name || '',
          phone: user.phone || '',
        }));
      }
    }
  }, [user]);

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    const cat = categories.find((c) => c._id === catId);
    if (cat) {
      setMedium(cat.name);
    }
  };

  const validateStep = (stepNum) => {
    if (stepNum === 1) {
      if (!selectedCategory) {
        toast.error('Please select an art medium.');
        return false;
      }
      if (useCustomSize && !customSize.trim()) {
        toast.error('Please specify your custom dimensions.');
        return false;
      }
      return true;
    }
    if (stepNum === 2) {
      if (referenceFiles.length === 0) {
        toast.error('Please upload at least one reference photograph.');
        return false;
      }
      return true;
    }
    if (stepNum === 3) {
      if (!description.trim()) {
        toast.error('Please describe what you would like created.');
        return false;
      }
      return true;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 3 && !isAuthenticated) {
        toast.error('Please sign in or create an account to submit your commission.');
        navigate('/login', { state: { from: { pathname: '/custom-order' } } });
        return;
      }
      setCurrentStep((prev) => Math.min(prev + 1, 4));
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleSubmitOrder = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to submit your custom order.');
      navigate('/login');
      return;
    }

    let addressSnapshot = null;
    if (useNewAddress || savedAddresses.length === 0) {
      if (
        !newAddress.recipientName ||
        !newAddress.phone ||
        !newAddress.street ||
        !newAddress.city ||
        !newAddress.state ||
        !newAddress.postalCode
      ) {
        toast.error('Please fill in all delivery address fields.');
        return;
      }
      addressSnapshot = newAddress;
    } else {
      const selected = savedAddresses.find((a) => a._id === selectedAddressId);
      if (!selected) {
        toast.error('Please select a delivery address.');
        return;
      }
      addressSnapshot = {
        recipientName: selected.recipientName,
        phone: selected.phone,
        street: selected.street,
        city: selected.city,
        state: selected.state,
        postalCode: selected.postalCode,
        country: selected.country || 'India',
      };
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('categoryId', selectedCategory);
      formData.append('medium', medium);
      formData.append('size', useCustomSize ? customSize : size);
      formData.append('description', description);
      formData.append('subjectsCount', subjectsCount);
      formData.append('background', background);
      formData.append('colors', colors);
      formData.append('specialInstructions', specialInstructions);
      if (deadline) formData.append('deadline', deadline);
      formData.append('addressSnapshot', JSON.stringify(addressSnapshot));

      referenceFiles.forEach((item) => {
        if (item.file) {
          formData.append('images', item.file);
        }
      });

      const res = await api.post('/orders', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.success) {
        toast.success(res.data.message || 'Custom order placed successfully!');
        navigate(`/my-orders/${res.data.data._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place custom order.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 pb-20 space-y-6 sm:space-y-8">
      <div className="text-center space-y-2">
        <span className="eyebrow">Bespoke Art Studio</span>
        <h1 className="editorial-serif text-4xl sm:text-6xl text-[#111827] font-normal leading-none">
          Commission Custom Artwork
        </h1>
        <p className="text-[13px] sm:text-[14px] text-[#6e6e73] max-w-xl mx-auto leading-relaxed">
          Share your reference photos and personal story. Chulbul will review your details and reply with an INR quote before painting starts.
        </p>
      </div>

      {/* Rounded Pill Stepper Bar */}
      <div className="rounded-[24px] bg-white border border-[#eae9ee] p-3 sm:p-4 shadow-[0_6px_24px_rgba(0,0,0,0.03)]">
        <div className="grid grid-cols-4 gap-2">
          {STEPS.map((s) => {
            const isDone = currentStep > s.step;
            const isCurrent = currentStep === s.step;
            const StepIcon = s.icon;

            return (
              <button
                key={s.step}
                type="button"
                onClick={() => {
                  if (s.step < currentStep) setCurrentStep(s.step);
                }}
                className={`flex flex-col sm:flex-row items-center gap-2 p-2.5 rounded-[16px] transition-all text-center sm:text-left ${
                  isCurrent
                    ? 'bg-[#111827] text-white'
                    : isDone
                    ? 'bg-[#ffe5ee] text-[#ff0155] cursor-pointer'
                    : 'text-[#8e8e93] opacity-65 cursor-not-allowed'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isDone
                      ? 'bg-[#ff0457] text-white'
                      : isCurrent
                      ? 'bg-white text-[#111827]'
                      : 'bg-[#f2f1f6] text-[#8e8e93]'
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4" /> : <StepIcon className="w-4 h-4" />}
                </div>
                <div className="hidden sm:block min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                    Step {s.step}
                  </p>
                  <p className="text-[12px] font-bold truncate">{s.title}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Card */}
      <div className="rounded-[28px] bg-white border border-[#eae9ee] p-5 sm:p-9 shadow-[0_10px_36px_rgba(0,0,0,0.04)]">
        {currentStep === 1 && (
          <div className="space-y-7">
            <div className="space-y-1 border-b border-[#f2f1f6] pb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-[-0.02em]">
                1. Choose Medium &amp; Canvas Dimensions
              </h2>
              <p className="text-[13px] text-[#6e6e73]">
                Pick your preferred medium surface and artwork proportions.
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-[12px] font-bold uppercase tracking-wider text-[#111827]">
                Select Art Medium <span className="text-[#ff0457]">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <div
                    key={cat._id}
                    onClick={() => handleCategoryChange(cat._id)}
                    className={`p-4 rounded-[18px] border cursor-pointer transition-all ${
                      selectedCategory === cat._id
                        ? 'border-[#ff0457] bg-[#ffe5ee]/45 ring-2 ring-[#ff0457]/15'
                        : 'border-[#eae9ee] bg-[#f8f7fb] hover:border-[#c8c8d0]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[14px] font-bold text-[#111827]">
                        {cat.name}
                      </p>
                      {selectedCategory === cat._id && (
                        <span className="w-5 h-5 rounded-full bg-[#ff0457] text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-[#6e6e73] line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                    <p className="text-[12px] font-bold text-[#111827] mt-2">
                      Starts at {formatPrice(cat.startingPrice)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-[#f2f1f6]">
              <div className="flex items-center justify-between">
                <label className="block text-[12px] font-bold uppercase tracking-wider text-[#111827]">
                  Select Canvas Size <span className="text-[#ff0457]">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setUseCustomSize(!useCustomSize)}
                  className="text-[12px] text-[#ff0457] font-semibold hover:underline"
                >
                  {useCustomSize ? 'Choose standard size' : 'Need a custom size?'}
                </button>
              </div>

              {!useCustomSize ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {STANDARD_SIZES.map((item) => (
                    <div
                      key={item.size}
                      onClick={() => setSize(item.size)}
                      className={`p-4 rounded-[18px] border cursor-pointer transition-all ${
                        size === item.size
                          ? 'border-[#ff0457] bg-[#ffe5ee]/45 ring-2 ring-[#ff0457]/15'
                          : 'border-[#eae9ee] bg-[#f8f7fb] hover:border-[#c8c8d0]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[14px] font-bold text-[#111827]">
                          {item.size}
                        </span>
                        {size === item.size && (
                          <span className="w-4 h-4 rounded-full bg-[#ff0457] text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] text-[#6e6e73] mt-1">{item.desc}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <Input
                  placeholder="e.g. 20 x 30 inches, or 50 x 70 cm"
                  value={customSize}
                  onChange={(e) => setCustomSize(e.target.value)}
                  helperText="Specify custom dimensions with inches or cm"
                />
              )}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="space-y-1 border-b border-[#f2f1f6] pb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-[-0.02em]">
                2. Upload Reference Photographs
              </h2>
              <p className="text-[13px] text-[#6e6e73]">
                Upload up to 5 clear photos. We can also combine people or pets from separate photos onto one portrait.
              </p>
            </div>

            <ImageUploader
              files={referenceFiles}
              onChange={setReferenceFiles}
              maxFiles={5}
              maxSizeMB={5}
              label="Reference Photos (1 to 5 images)"
              description="Clear facial lighting produces the richest realism."
            />

            <div className="rounded-[18px] bg-[#ffe5ee]/40 border border-[#ffc6da] p-4 text-[12px] text-[#3c3c43] space-y-1">
              <div className="flex items-center gap-2 font-bold text-[#ff0155]">
                <ShieldCheck className="w-4 h-4" />
                <span>Private Studio Guarantee</span>
              </div>
              <p className="leading-relaxed">
                Your uploaded reference photos are strictly private to Chulbul and never shared publicly without your consent.
              </p>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="space-y-1 border-b border-[#f2f1f6] pb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-[-0.02em]">
                3. Describe Your Vision
              </h2>
              <p className="text-[13px] text-[#6e6e73]">
                Share mood, subjects count, background preferences, and gift deadline details.
              </p>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#111827] mb-1.5 pl-1">
                Artwork Description &amp; Story <span className="text-[#ff0457]">*</span>
              </label>
              <textarea
                rows={5}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell the artist about the occasion, emotion, expressions, or how separate reference photos should be merged..."
                className="w-full bg-white rounded-[16px] border border-[#e2e2e7] p-3.5 text-[14px] text-[#111827] focus:border-[#ff0457] focus:ring-4 focus:ring-[#ff0457]/12 focus:outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#111827] mb-1.5 pl-1">
                  Subjects Count
                </label>
                <select
                  value={subjectsCount}
                  onChange={(e) => setSubjectsCount(Number(e.target.value))}
                  className="w-full bg-white rounded-[14px] border border-[#e2e2e7] px-4 py-2.5 text-[14px] text-[#111827] focus:border-[#ff0457] focus:outline-none"
                >
                  <option value={1}>1 Subject (Single Person / Pet)</option>
                  <option value={2}>2 Subjects (Couple / Duo)</option>
                  <option value={3}>3 Subjects (Small Family)</option>
                  <option value={4}>4 Subjects</option>
                  <option value={5}>5+ Subjects (Group)</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#111827] mb-1.5 pl-1">
                  Background Preference
                </label>
                <select
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  className="w-full bg-white rounded-[14px] border border-[#e2e2e7] px-4 py-2.5 text-[14px] text-[#111827] focus:border-[#ff0457] focus:outline-none"
                >
                  <option value="Artist choice / natural soft blend">Artist Choice / Soft Vignette</option>
                  <option value="Plain monochromatic backdrop">Plain Monochromatic Backdrop</option>
                  <option value="Keep original background from photo">Keep Original Photo Backdrop</option>
                  <option value="Custom landscape or floral background">Custom Landscape / Floral Backdrop</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Color Palette Notes (Optional)"
                placeholder="e.g. Warm sepia, muted pastels"
                value={colors}
                onChange={(e) => setColors(e.target.value)}
              />
              <Input
                label="Target Gift Date (Optional)"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                helperText="Let us know if timed for a celebration"
              />
            </div>

            <Input
              label="Special Framing / Margin Notes (Optional)"
              placeholder="e.g. Keep 1 inch clean margin for framing"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
            />
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-7">
            <div className="space-y-1 border-b border-[#f2f1f6] pb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-[-0.02em]">
                4. Shipping Address &amp; Final Review
              </h2>
              <p className="text-[13px] text-[#6e6e73]">
                Confirm where your crated finished artwork should be delivered.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-[12px] font-bold uppercase tracking-wider text-[#111827]">
                  Delivery Address <span className="text-[#ff0457]">*</span>
                </label>
                {savedAddresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setUseNewAddress(!useNewAddress)}
                    className="text-[12px] text-[#ff0457] font-semibold hover:underline"
                  >
                    {useNewAddress ? 'Choose saved address' : '+ Use new address'}
                  </button>
                )}
              </div>

              {!useNewAddress && savedAddresses.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedAddresses.map((addr) => (
                    <div
                      key={addr._id}
                      onClick={() => setSelectedAddressId(addr._id)}
                      className={`p-4 rounded-[18px] border cursor-pointer transition-all ${
                        selectedAddressId === addr._id
                          ? 'border-[#ff0457] bg-[#ffe5ee]/45'
                          : 'border-[#eae9ee] bg-[#f8f7fb]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-bold text-[#111827]">
                          {addr.recipientName}
                        </span>
                        {selectedAddressId === addr._id && (
                          <span className="w-4 h-4 rounded-full bg-[#ff0457] text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] text-[#6e6e73] mt-1">{addr.phone}</p>
                      <p className="text-[12px] text-[#6e6e73] mt-0.5 leading-relaxed">
                        {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {(useNewAddress || savedAddresses.length === 0) && (
                <div className="rounded-[20px] bg-[#f8f7fb] border border-[#eae9ee] p-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Recipient Name"
                      placeholder="e.g. Aarav Sharma"
                      value={newAddress.recipientName}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, recipientName: e.target.value })
                      }
                      required
                    />
                    <Input
                      label="Contact Phone"
                      placeholder="e.g. +91 98765 43210"
                      value={newAddress.phone}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, phone: e.target.value })
                      }
                      required
                    />
                  </div>

                  <Input
                    label="Street Address / Flat"
                    placeholder="e.g. Flat 302, Green Meadows"
                    value={newAddress.street}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, street: e.target.value })
                    }
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                      label="City"
                      placeholder="Mumbai"
                      value={newAddress.city}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, city: e.target.value })
                      }
                      required
                    />
                    <Input
                      label="State"
                      placeholder="Maharashtra"
                      value={newAddress.state}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, state: e.target.value })
                      }
                      required
                    />
                    <Input
                      label="PIN Code"
                      placeholder="400001"
                      value={newAddress.postalCode}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, postalCode: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-[20px] bg-[#f8f7fb] border border-[#eae9ee] p-5 space-y-4">
              <h3 className="text-[14px] font-bold text-[#111827] border-b border-[#eae9ee] pb-2">
                Commission Summary
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[12px]">
                <div>
                  <span className="text-[#8e8e93] block">Medium</span>
                  <span className="font-bold text-[#111827]">{medium}</span>
                </div>
                <div>
                  <span className="text-[#8e8e93] block">Size</span>
                  <span className="font-bold text-[#111827]">
                    {useCustomSize ? customSize : size}
                  </span>
                </div>
                <div>
                  <span className="text-[#8e8e93] block">Subjects</span>
                  <span className="font-bold text-[#111827]">{subjectsCount} Subject(s)</span>
                </div>
                <div>
                  <span className="text-[#8e8e93] block">Photos</span>
                  <span className="font-bold text-[#111827]">{referenceFiles.length} Uploaded</span>
                </div>
              </div>

              <p className="text-[12px] text-[#3c3c43] bg-white rounded-xl p-3 border border-[#eae9ee]">
                <strong className="text-[#ff0457]">No upfront payment required.</strong> Chulbul reviews your photo and replies with your bespoke INR quote first.
              </p>
            </div>
          </div>
        )}

        {/* Footer Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-[#f2f1f6] mt-8 gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={submitting}
              className="px-5 py-3 rounded-full bg-[#f2f1f6] hover:bg-[#e5e4ea] text-[#111827] text-[13px] font-semibold inline-flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-7 py-3 rounded-full bg-[#111827] hover:bg-black text-white text-[13px] font-bold inline-flex items-center gap-2 transition-all hover:-translate-y-0.5"
            >
              <span>Continue to Step {currentStep + 1}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmitOrder}
              className="px-7 py-3.5 rounded-full bg-[#ff0457] hover:bg-[#d90349] text-white text-[13px] font-bold shadow-[0_8px_22px_rgba(255,4,87,0.28)] inline-flex items-center gap-2 disabled:opacity-60 transition-all hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>{submitting ? 'Submitting...' : 'Submit Commission Request'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomOrderForm;
