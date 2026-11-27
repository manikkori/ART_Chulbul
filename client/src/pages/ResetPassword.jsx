import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import Input from '../components/common/Input';
import api from '../services/api';
import toast from 'react-hot-toast';

export const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { setPageTitle } = useSettings();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setPageTitle('Set New Password');
  }, [setPageTitle]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.put(`/auth/reset-password/${token}`, { password });
      if (res.data?.success) {
        toast.success('Password updated successfully! You can now log in.');
        navigate('/login');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired reset token.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-20 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#faa9b0]/25 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] border border-[#1c1a17]/10 p-8 sm:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.04)] space-y-6 relative">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#ffdda4]/85 backdrop-blur-sm -rotate-2 rounded-sm shadow-sm pointer-events-none border border-[#e5c58a]/40" />

        <div className="space-y-2 text-center pt-2">
          <span className="font-caveat text-3xl sm:text-4xl text-[#f19b72] block">Secure Account</span>
          <h1 className="font-playfair text-2xl sm:text-3xl text-[#1c1a17]">
            Create New Password
          </h1>
          <p className="font-sans text-xs sm:text-sm text-[#1c1a17]/65">
            Choose a strong password to protect your collector account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="New Password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={Lock}
            required
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Repeat new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={Lock}
            required
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#1c1a17] text-white hover:bg-black rounded-full py-3.5 px-6 font-sans text-sm font-medium tracking-wide shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {submitting ? 'Updating...' : 'Update Password'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
