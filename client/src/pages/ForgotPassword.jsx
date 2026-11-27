import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import Input from '../components/common/Input';
import api from '../services/api';
import toast from 'react-hot-toast';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { setPageTitle } = useSettings();

  useEffect(() => {
    setPageTitle('Forgot Password');
  }, [setPageTitle]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
      toast.success(res.data?.message || 'Password reset link sent.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to dispatch reset email.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-20 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#faa9b0]/25 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] border border-[#1c1a17]/10 p-8 sm:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.04)] space-y-6 relative">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#ffdda4]/85 backdrop-blur-sm -rotate-2 rounded-sm shadow-sm pointer-events-none border border-[#e5c58a]/40" />

        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 font-sans text-xs font-medium text-[#1c1a17]/60 hover:text-[#1c1a17] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </Link>

        {submitted ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-12 h-12 rounded-full bg-[#f8f4ea] text-[#1c1a17] mx-auto flex items-center justify-center border border-[#d4a373]/30">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <h2 className="font-playfair text-2xl text-[#1c1a17]">
              Check Your Inbox
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#1c1a17]/70 leading-relaxed">
              If an account is associated with <strong>{email}</strong>, we have dispatched instructions to reset your password.
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-block bg-[#1c1a17] text-white font-sans text-xs font-medium px-6 py-2.5 rounded-full shadow-sm hover:bg-black transition-all"
              >
                Return to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center space-y-2">
              <span className="font-caveat text-3xl sm:text-4xl text-[#f19b72] block">Account Recovery</span>
              <h1 className="font-playfair text-2xl sm:text-3xl text-[#1c1a17]">
                Reset Password
              </h1>
              <p className="font-sans text-xs sm:text-sm text-[#1c1a17]/65 max-w-xs mx-auto">
                Enter your account email and we will send you a secure link to create a new password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={Mail}
                required
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#1c1a17] text-white hover:bg-black rounded-full py-3.5 px-6 font-sans text-sm font-medium tracking-wide shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {submitting ? 'Sending link...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
