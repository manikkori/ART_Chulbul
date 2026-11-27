import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import Input from '../components/common/Input';
import toast from 'react-hot-toast';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register, isAuthenticated } = useAuth();
  const { setPageTitle, siteName, settings } = useSettings();
  const navigate = useNavigate();

  useEffect(() => {
    setPageTitle('Create Account');
    if (isAuthenticated) {
      navigate('/my-orders');
    }
  }, [isAuthenticated, navigate, setPageTitle]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      await register(name, email, password);
      navigate('/my-orders');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-20 relative">
      {/* Decorative Pastel Glows in background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#faa9b0]/25 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-60 h-60 bg-[#ffc96f]/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] border border-[#1c1a17]/10 p-8 sm:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.04)] space-y-6 relative">
        {/* Jhankoo Washi Tape Accent */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#ffdda4]/85 backdrop-blur-sm -rotate-2 rounded-sm shadow-sm pointer-events-none border border-[#e5c58a]/40" />

        {/* Header with Caveat Script & Playfair Serif */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center gap-1 font-caveat text-3xl sm:text-4xl text-[#f19b72]">
            <span>Join the Studio</span>
            <Sparkles className="w-4 h-4 text-[#faa9b0] inline-block" />
          </div>
          <h1 className="font-playfair font-normal text-2xl sm:text-3xl text-[#1c1a17]">
            Create Account
          </h1>
          <p className="font-sans text-xs sm:text-sm text-[#1c1a17]/65 max-w-xs mx-auto">
            Commission bespoke paintings, upload photos, and track your artwork progress in real-time.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Your Full Name"
            placeholder="e.g. Radhika Verma"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={User}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={Mail}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={Lock}
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Repeat password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={Lock}
            required
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#1c1a17] text-white hover:bg-black rounded-full py-3.5 px-6 font-sans text-sm font-medium tracking-wide shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
          >
            {submitting ? 'Creating account...' : 'Create My Account'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#1c1a17]/10 text-center">
          <p className="font-sans text-xs text-[#1c1a17]/70">
            Already have a collector account?{' '}
            <Link
              to="/login"
              className="font-semibold text-[#1c1a17] hover:text-[#f19b72] underline underline-offset-4 inline-flex items-center gap-1 transition-colors"
            >
              Sign In →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
