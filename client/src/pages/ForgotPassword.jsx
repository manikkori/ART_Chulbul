import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import ScribbleWordmark from '../components/common/ScribbleWordmark';
import Input from '../components/common/Input';
import api from '../services/api';
import toast from 'react-hot-toast';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { setPageTitle, siteName } = useSettings();
  const wordmarkShort = (siteName || "chulbul's").split(' ')[0].toLowerCase();

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
    <div className="min-h-[calc(100vh-7rem)] flex flex-col items-center justify-center px-4 py-10 bg-white">
      <div className="w-full max-w-[420px] space-y-6">
        <div className="flex justify-center">
          <ScribbleWordmark text={wordmarkShort} variant="white" size="lg" />
        </div>

        <div className="rounded-[24px] bg-white border border-[#eae9ee] p-7 sm:p-9 shadow-[0_16px_48px_rgba(0,0,0,0.06)] space-y-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#6e6e73] hover:text-[#111827] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>

          {submitted ? (
            <div className="text-center space-y-4 py-2">
              <div className="w-12 h-12 rounded-full bg-[#ffe5ee] text-[#ff0457] mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="editorial-serif text-3xl text-[#111827]">
                Check Your Inbox
              </h2>
              <p className="text-[13px] text-[#6e6e73] leading-relaxed">
                If an account is linked to <strong className="text-[#111827]">{email}</strong>, we have dispatched instructions to reset your password.
              </p>
              <Link
                to="/login"
                className="inline-block w-full py-3 rounded-full bg-[#111827] text-white text-[13px] font-bold text-center"
              >
                Return to Sign In
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center space-y-1.5">
                <span className="eyebrow">Account Recovery</span>
                <h1 className="editorial-serif text-4xl text-[#111827] font-normal">
                  Reset Password
                </h1>
                <p className="text-[13px] text-[#6e6e73] leading-relaxed">
                  Enter your account email and we will send you a secure reset link.
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
                  className="w-full py-3.5 rounded-full bg-[#111827] hover:bg-black text-white text-[14px] font-bold transition-all disabled:opacity-60"
                >
                  {submitting ? 'Sending Link...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
