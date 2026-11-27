import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Paintbrush,
  Camera,
  FileText,
  MapPin,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Calendar,
  Plus,
  ShieldCheck,
  Heart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { formatPrice } from '../../utils/formatters';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import ImageUploader from '../../components/common/ImageUploader';
import api from '../../services/api';
import toast from 'react-hot-toast';

const STEPS = [
  { step: 1, title: 'Medium & Size', icon: Paintbrush },
  { step: 2, title: 'Reference Photos', icon: Camera },
  { step: 3, title: 'Art Preferences', icon: FileText },
  { step: 4, title: 'Address & Review', icon: MapPin },
];

const STANDARD_SIZES = [
  { size: 'A4 (8.3 x 11.7 in)', desc: 'Perfect for single face portrait or small desk display' },
  { size: 'A3 (11.7 x 16.5 in)', desc: 'Most popular. Great for couple portraits and family walls' },
  { size: 'A2 (16.5 x 23.4 in)', desc: 'Large statement piece for living rooms and wedding memories' },
  { size: '16 x 20 inches', desc: 'Classical stretched canvas proportion for fine oils and acrylics' },
  { size: '18 x 24 inches', desc: 'Gallery scale canvas with dramatic impact' },
  { size: '24 x 36 inches', desc: 'Museum scale custom artwork for luxury spaces' }
];

export const CustomOrderForm = () => {
  const { user, isAuthenticated } = useAuth();
  const { setPageTitle, siteName } = useSettings();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [currentStep, setCurrentStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
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

  // Address State
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [newAddress, setNewAddress] = useState({
    recipientName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });
  const [useNewAddress, setUseNewAddress] = useState(false);

  useEffect(() => {
    setPageTitle('Commission Custom Artwork');

    // Fetch categories
    api.get('/categories').then((res) => {
      if (res.data?.success) {
        setCategories(res.data.data);
        const queryCatSlug = searchParams.get('category');
        if (queryCatSlug) {
          const match = res.data.data.find((c) => c.slug === queryCatSlug);
          if (match) {
            setSelectedCategory(match._id);
            setMedium(match.name);
          }
        } else if (res.data.data.length > 0) {
          setSelectedCategory(res.data.data[0]._id);
          setMedium(res.data.data[0].name);
        }
      }
      setLoadingCats(false);
    });

    // If pre-filled artwork
    const queryArtwork = searchParams.get('artwork');
    if (queryArtwork) {
      setDescription(`I would like a custom artwork inspired by the style and atmosphere of "${queryArtwork}".`);
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
          phone: user.phone || ''
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

  // Step Validation
  const validateStep = (stepNum) => {
    if (stepNum === 1) {
      if (!selectedCategory) {
        toast.error('Please select an art category/medium.');
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
        toast.error('Please describe what you would like the artist to create.');
        return false;
      }
      return true;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      // Check auth before step 4 if user isn't logged in
      if (currentStep === 3 && !isAuthenticated) {
        toast.error('Please sign in or create an account to submit your commission.');
        navigate('/login', { state: { from: { pathname: '/custom-order' } } });
        return;
      }
      setCurrentStep((prev) => Math.min(prev + 1, 4));
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Final Submit
  const handleSubmitOrder = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to submit your custom order.');
      navigate('/login');
      return;
    }

    // Determine address snapshot
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
        country: selected.country || 'India'
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

      // Append files
      referenceFiles.forEach((item) => {
        if (item.file) {
          formData.append('images', item.file);
        }
      });

      const res = await api.post('/orders', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-20 pt-4">
      {/* Header */}
      <div className="text-center space-y-2 pt-2">
        <div className="inline-flex items-center gap-1.5 font-caveat text-3xl sm:text-4xl text-[#f19b72]">
          <span>Custom Commissions ✦</span>
          <Sparkles className="w-4 h-4 text-[#faa9b0] inline-block" />
        </div>
        <h1 className="font-playfair text-3xl sm:text-5xl text-[#1c1a17]">
          Commission Custom Artwork
        </h1>
        <p className="font-sans text-xs sm:text-sm text-[#1c1a17]/70 max-w-xl mx-auto leading-relaxed">
          Share your reference photographs and personal vision. The artist will review your request and send a tailored quote before painting begins.
        </p>
      </div>

      {/* Stepper Bar - Jhankoo Soft Butter Card */}
      <div className="bg-white/80 backdrop-blur-md border border-[#1c1a17]/10 rounded-[2rem] p-3 sm:p-4 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
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
                className={`flex flex-col sm:flex-row items-center gap-2 p-2 sm:px-4 sm:py-2.5 rounded-2xl transition-all text-center sm:text-left ${
                  isCurrent
                    ? 'bg-[#1c1a17] text-white shadow-sm'
                    : isDone
                    ? 'text-[#1c1a17] bg-[#f8f4ea] border border-[#d4a373]/30 cursor-pointer hover:bg-[#f1e8d6]'
                    : 'text-[#1c1a17]/40 opacity-60 cursor-not-allowed'
                }`}
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs shrink-0 ${
                    isDone
                      ? 'bg-white text-[#1c1a17]'
                      : isCurrent
                      ? 'bg-[#faa9b0] text-[#1c1a17]'
                      : 'bg-white/60 text-[#1c1a17]/50'
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4" /> : <StepIcon className="w-4 h-4" />}
                </div>
                <div className="hidden sm:block">
                  <p className="text-[10px] font-sans font-medium uppercase tracking-wider text-[#1c1a17]/60">
                    Step {s.step}
                  </p>
                  <p className="font-sans text-xs font-semibold truncate">{s.title}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Step Content Card */}
      <div className="bg-white rounded-[2.5rem] border border-[#1c1a17]/10 p-6 sm:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.04)]">
        {/* STEP 1: Medium & Size */}
        {currentStep === 1 && (
          <div className="space-y-8">
            <div className="space-y-1 border-b border-[#1c1a17]/10 pb-4">
              <h2 className="font-playfair text-xl sm:text-2xl text-[#1c1a17]">
                1. Choose Art Medium & Canvas Size
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#1c1a17]/65">
                Select your preferred fine art medium and canvas dimensions.
              </p>
            </div>

            {/* Category Medium Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-sans font-semibold tracking-wide text-[#1c1a17]/80">
                Select Art Category / Medium <span className="text-[#f19b72]">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {categories.map((cat) => (
                  <div
                    key={cat._id}
                    onClick={() => handleCategoryChange(cat._id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedCategory === cat._id
                        ? 'border-[#1c1a17] bg-[#f8f4ea] ring-2 ring-[#faa9b0] shadow-sm'
                        : 'border-[#1c1a17]/10 bg-white hover:border-[#1c1a17]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="font-playfair text-sm text-[#1c1a17]">
                        {cat.name}
                      </p>
                      {selectedCategory === cat._id && (
                        <span className="w-5 h-5 rounded-full bg-[#1c1a17] text-white flex items-center justify-center">
                          <Check className="w-3 h-3 text-[#faa9b0]" />
                        </span>
                      )}
                    </div>
                    <p className="font-sans text-xs text-[#1c1a17]/65 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                    <p className="font-sans text-xs font-semibold text-[#1c1a17] mt-2">
                      Starts from {formatPrice(cat.startingPrice)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-3 pt-4 border-t border-[#1c1a17]/10">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-sans font-semibold tracking-wide text-[#1c1a17]/80">
                  Select Artwork Size <span className="text-[#f19b72]">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setUseCustomSize(!useCustomSize)}
                  className="font-sans text-xs text-[#1c1a17] font-medium underline hover:text-[#f19b72]"
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
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        size === item.size
                          ? 'border-[#1c1a17] bg-[#f8f4ea] ring-2 ring-[#faa9b0] shadow-sm'
                          : 'border-[#1c1a17]/10 bg-white hover:border-[#1c1a17]/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-sans text-xs sm:text-sm font-semibold text-[#1c1a17]">
                          {item.size}
                        </span>
                        {size === item.size && (
                          <span className="w-4 h-4 rounded-full bg-[#1c1a17] text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-[#faa9b0]" />
                          </span>
                        )}
                      </div>
                      <p className="font-sans text-xs text-[#1c1a17]/60 mt-1">{item.desc}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <Input
                    placeholder="e.g. 20 x 30 inches, or 50 x 70 cm"
                    value={customSize}
                    onChange={(e) => setCustomSize(e.target.value)}
                    helperText="Specify custom dimensions with unit (inches or cm)"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: Reference Photos */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="space-y-1 border-b border-[#1c1a17]/10 pb-4">
              <h2 className="font-playfair text-xl sm:text-2xl text-[#1c1a17]">
                2. Upload Your Reference Photographs
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#1c1a17]/65">
                Upload up to 5 clear photos. You can upload multiple pictures if you want subjects combined from different photos.
              </p>
            </div>

            <ImageUploader
              files={referenceFiles}
              onChange={setReferenceFiles}
              maxFiles={5}
              maxSizeMB={5}
              label="Reference Photos (1 to 5 images)"
              description="Upload your high-res photos. Clear facial lighting produces the best realism."
            />

            <div className="bg-[#f8f4ea] p-4 rounded-2xl border border-[#d4a373]/30 text-xs text-[#1c1a17]/80 space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-2 font-sans font-semibold text-[#1c1a17]">
                <ShieldCheck className="w-4 h-4 text-[#d4a373]" />
                <span>Confidential Reference Handling</span>
              </div>
              <p className="leading-relaxed">
                Your photos are strictly used by the artist to compose and paint your commission. They are never published without your explicit consent.
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: Artwork Preferences & Description */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="space-y-1 border-b border-[#1c1a17]/10 pb-4">
              <h2 className="font-playfair text-xl sm:text-2xl text-[#1c1a17]">
                3. Describe Your Vision & Preferences
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#1c1a17]/65">
                Help the artist understand the emotional intent, focus, and timeline of your piece.
              </p>
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold tracking-wide text-[#1c1a17]/80 mb-1.5">
                Artwork Description & Story <span className="text-[#f19b72]">*</span>
              </label>
              <textarea
                rows={5}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell the artist about the occasion, the emotions you want captured, what features are most important, or how subjects from different photos should be placed..."
                className="w-full bg-white border border-[#1c1a17]/15 rounded-2xl p-4 text-sm text-[#1c1a17] focus:ring-2 focus:ring-[#faa9b0]/30 focus:border-[#faa9b0] focus:outline-none transition-all placeholder-[#1c1a17]/40"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-sans font-semibold tracking-wide text-[#1c1a17]/80 mb-1.5">
                  Number of People / Pets
                </label>
                <select
                  value={subjectsCount}
                  onChange={(e) => setSubjectsCount(Number(e.target.value))}
                  className="w-full bg-white border border-[#1c1a17]/15 rounded-2xl px-4 py-2.5 text-sm text-[#1c1a17] font-sans focus:outline-none focus:ring-2 focus:ring-[#faa9b0]/30"
                >
                  <option value={1}>1 Subject (Single Person / Pet)</option>
                  <option value={2}>2 Subjects (Couple / Duo)</option>
                  <option value={3}>3 Subjects (Small Family)</option>
                  <option value={4}>4 Subjects</option>
                  <option value={5}>5+ Subjects (Group)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold tracking-wide text-[#1c1a17]/80 mb-1.5">
                  Background Preference
                </label>
                <select
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  className="w-full bg-white border border-[#1c1a17]/15 rounded-2xl px-4 py-2.5 text-sm text-[#1c1a17] font-sans focus:outline-none focus:ring-2 focus:ring-[#faa9b0]/30"
                >
                  <option value="Artist choice / natural soft blend">Artist Choice / Soft Vignette</option>
                  <option value="Plain monochromatic backdrop">Plain Monochromatic Backdrop</option>
                  <option value="Keep original background from photo">Keep Original Background from Photo</option>
                  <option value="Custom landscape or floral background">Custom Landscape / Floral Background</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="Color Palette Preferences (Optional)"
                placeholder="e.g. Warm sepia, cool blues, vibrant autumn tones"
                value={colors}
                onChange={(e) => setColors(e.target.value)}
              />

              <Input
                label="Preferred Target Date / Deadline (Optional)"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                helperText="If ordering for a birthday or anniversary, let us know"
              />
            </div>

            <Input
              label="Special Instructions / Framing Notes (Optional)"
              placeholder="e.g. Leave 1 inch margin for custom framing, brighten smile in photo 2"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
            />
          </div>
        )}

        {/* STEP 4: Delivery Address & Summary Review */}
        {currentStep === 4 && (
          <div className="space-y-8">
            <div className="space-y-1 border-b border-[#1c1a17]/10 pb-4">
              <h2 className="font-playfair text-xl sm:text-2xl text-[#1c1a17]">
                4. Delivery Address & Order Summary
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#1c1a17]/65">
                Provide the shipping address where the artwork will be safely delivered.
              </p>
            </div>

            {/* Address Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-sans font-semibold tracking-wide text-[#1c1a17]/80">
                  Select Delivery Address <span className="text-[#f19b72]">*</span>
                </label>
                {savedAddresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setUseNewAddress(!useNewAddress)}
                    className="font-sans text-xs text-[#1c1a17] font-medium underline hover:text-[#f19b72]"
                  >
                    {useNewAddress ? 'Select from saved addresses' : '+ Deliver to another address'}
                  </button>
                )}
              </div>

              {/* Saved Addresses list */}
              {!useNewAddress && savedAddresses.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedAddresses.map((addr) => (
                    <div
                      key={addr._id}
                      onClick={() => setSelectedAddressId(addr._id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        selectedAddressId === addr._id
                          ? 'border-[#1c1a17] bg-[#f8f4ea] ring-2 ring-[#faa9b0] shadow-sm'
                          : 'border-[#1c1a17]/10 bg-white hover:border-[#1c1a17]/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-sans text-xs font-semibold text-[#1c1a17]">
                          {addr.recipientName}
                        </span>
                        {selectedAddressId === addr._id && (
                          <span className="w-4 h-4 rounded-full bg-[#1c1a17] text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-[#faa9b0]" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#1c1a17]/65 mt-1">{addr.phone}</p>
                      <p className="text-xs text-[#1c1a17]/60 mt-1 leading-relaxed">
                        {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Address Form */}
              {(useNewAddress || savedAddresses.length === 0) && (
                <div className="p-5 bg-[#f8f4ea] rounded-2xl border border-[#d4a373]/30 space-y-4">
                  <p className="font-sans text-xs font-semibold uppercase tracking-wider text-[#1c1a17]">
                    Enter Shipping Address
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Recipient Full Name"
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
                    label="Street Address / House No. / Building"
                    placeholder="e.g. Flat 302, Green Meadows, 5th Cross"
                    value={newAddress.street}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, street: e.target.value })
                    }
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                      label="City"
                      placeholder="e.g. Mumbai"
                      value={newAddress.city}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, city: e.target.value })
                      }
                      required
                    />
                    <Input
                      label="State"
                      placeholder="e.g. Maharashtra"
                      value={newAddress.state}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, state: e.target.value })
                      }
                      required
                    />
                    <Input
                      label="Postal Code (PIN)"
                      placeholder="e.g. 400001"
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

            {/* Commission Review Summary Card */}
            <div className="p-6 bg-[#f8f4ea] rounded-2xl border border-[#d4a373]/30 space-y-4">
              <h3 className="font-playfair text-base text-[#1c1a17] border-b border-[#1c1a17]/10 pb-2">
                Order Review Summary
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans">
                <div>
                  <span className="text-[#1c1a17]/60 font-medium block">
                    Medium
                  </span>
                  <span className="text-[#1c1a17] font-semibold mt-0.5 block">
                    {medium}
                  </span>
                </div>
                <div>
                  <span className="text-[#1c1a17]/60 font-medium block">
                    Size
                  </span>
                  <span className="text-[#1c1a17] font-semibold mt-0.5 block">
                    {useCustomSize ? customSize : size}
                  </span>
                </div>
                <div>
                  <span className="text-[#1c1a17]/60 font-medium block">
                    Subjects
                  </span>
                  <span className="text-[#1c1a17] font-semibold mt-0.5 block">
                    {subjectsCount} Subject(s)
                  </span>
                </div>
                <div>
                  <span className="text-[#1c1a17]/60 font-medium block">
                    Photos
                  </span>
                  <span className="text-[#1c1a17] font-semibold mt-0.5 block">
                    {referenceFiles.length} Uploaded
                  </span>
                </div>
              </div>

              <div className="text-xs text-[#1c1a17]/80 bg-white/80 p-3.5 rounded-xl border border-[#1c1a17]/10 leading-relaxed">
                <span className="font-semibold text-[#1c1a17]">Payment Note:</span> You do NOT pay right now. The artist will review your reference photos and provide a tailored INR quote with completion estimate. You can accept, negotiate in chat, or decline.
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-8 border-t border-[#1c1a17]/10 mt-8">
          {currentStep > 1 ? (
            <button
              onClick={handlePrevStep}
              disabled={submitting}
              className="bg-white text-[#1c1a17] font-sans text-xs font-medium px-6 py-3 rounded-full border border-[#1c1a17]/15 shadow-2xs hover:bg-[#f8f4ea] transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Step</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              onClick={handleNextStep}
              className="bg-[#1c1a17] text-white hover:bg-black font-sans text-xs font-medium px-8 py-3.5 rounded-full shadow-sm hover:shadow transition-all flex items-center gap-2"
            >
              <span>Continue to Step {currentStep + 1}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              disabled={submitting}
              onClick={handleSubmitOrder}
              className="bg-[#faa9b0] text-[#1c1a17] hover:bg-[#f697a0] font-sans text-sm font-semibold px-8 py-3.5 rounded-full shadow-sm hover:shadow transition-all flex items-center gap-2 disabled:opacity-60"
            >
              <Sparkles className="w-4 h-4 text-[#1c1a17]" />
              <span>{submitting ? 'Submitting Order...' : 'Submit Commission for Review'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomOrderForm;
