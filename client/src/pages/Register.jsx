import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import Button from '../components/common/Button';
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
    <div className="max-w-md mx-auto px-4 py-8 sm:py-16 relative">
      {/* Decorative Blush Brush in background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#fde8ef] rounded-full blur-3xl opacity-70 pointer-events-none -z-10" />

      <div className="bg-white border-2 border-[#121212] p-8 sm:p-10 shadow-[6px_6px_0px_#f7cbd7] space-y-6 relative">
        {/* Header with Romantic Script & Bold Sans */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1 font-script text-3xl sm:text-4xl text-[#121212]">
            <span>Join Us</span>
            <Heart className="w-4 h-4 text-[#dc8da3] fill-[#f7cbd7] inline-block" />
          </div>
          <h1 className="font-montserrat font-extrabold text-2xl sm:text-3xl text-[#121212] uppercase tracking-[0.08em]">
            CREATE ACCOUNT
          </h1>
          <p className="font-sans text-xs text-gray-600 max-w-xs mx-auto">
            Commission bespoke paintings, upload reference photos, and track order progress in real time.
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
            className="w-full bg-[#121212] text-white hover:bg-black font-montserrat text-xs font-bold uppercase tracking-[0.18em] py-3.5 border-2 border-[#121212] shadow-[3px_3px_0px_#f7cbd7] hover:shadow-[5px_5px_0px_#ebb0c0] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {submitting ? 'CREATING ACCOUNT...' : 'CREATE MY ACCOUNT'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#f7cbd7] text-center">
          <p className="font-montserrat text-xs text-gray-600">
            Already have a collector account?{' '}
            <Link
              to="/login"
              className="font-bold text-[#121212] hover:underline underline-offset-4 inline-flex items-center gap-1"
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
