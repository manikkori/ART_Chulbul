import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
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
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-cream-200 shadow-card space-y-6">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-600 hover:text-terracotta-600"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </Link>

        {submitted ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-charcoal-900">
              Check Your Inbox
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
              If an account is associated with <strong>{email}</strong>, we have sent instructions to reset your password.
            </p>
            <Button
              variant="outline"
              size="md"
              className="mt-4"
              onClick={() => setSubmitted(false)}
            >
              Try another email
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
                Reset Password
              </h1>
              <p className="text-xs text-charcoal-500 leading-relaxed">
                Enter your registered email address and we'll send you a secure link to create a new password.
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

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2"
                loading={submitting}
              >
                Send Reset Link
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
