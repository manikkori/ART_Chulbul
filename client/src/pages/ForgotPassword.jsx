import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, Heart } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import Button from '../components/common/Button';
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
    <div className="max-w-md mx-auto px-4 py-8 sm:py-16 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#fde8ef] rounded-full blur-3xl opacity-70 pointer-events-none -z-10" />

      <div className="bg-white border-2 border-[#121212] p-8 sm:p-10 shadow-[6px_6px_0px_#f7cbd7] space-y-6 relative">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 font-montserrat text-xs font-bold uppercase tracking-wider text-gray-700 hover:text-[#121212]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </Link>

        {submitted ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-12 h-12 rounded-full bg-[#fde8ef] text-[#121212] mx-auto flex items-center justify-center border-2 border-[#121212] shadow-[2px_2px_0px_#f7cbd7]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="font-montserrat font-extrabold text-2xl text-[#121212] uppercase tracking-wide">
              Check Your Inbox
            </h2>
            <p className="font-sans text-xs text-gray-600 leading-relaxed">
              If an account is associated with <strong>{email}</strong>, we have dispatched instructions to reset your password.
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-block bg-[#121212] text-white font-montserrat text-xs font-bold uppercase tracking-wider px-6 py-2.5 border-2 border-[#121212] shadow-[3px_3px_0px_#f7cbd7]"
              >
                Return to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center space-y-1">
              <span className="font-script text-3xl text-[#121212] block">Recovery</span>
              <h1 className="font-montserrat font-extrabold text-2xl text-[#121212] uppercase tracking-[0.08em]">
                RESET PASSWORD
              </h1>
              <p className="font-sans text-xs text-gray-600 max-w-xs mx-auto">
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
                className="w-full bg-[#121212] text-white hover:bg-black font-montserrat text-xs font-bold uppercase tracking-[0.18em] py-3.5 border-2 border-[#121212] shadow-[3px_3px_0px_#f7cbd7] hover:shadow-[5px_5px_0px_#ebb0c0] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {submitting ? 'SENDING LINK...' : 'SEND RESET LINK'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
