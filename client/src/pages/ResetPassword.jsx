import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import Button from '../components/common/Button';
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
    <div className="max-w-md mx-auto px-4 py-8 sm:py-16 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#fde8ef] rounded-full blur-3xl opacity-70 pointer-events-none -z-10" />

      <div className="bg-white border-2 border-[#121212] p-8 sm:p-10 shadow-[6px_6px_0px_#f7cbd7] space-y-6 relative">
        <div className="space-y-1 text-center">
          <span className="font-script text-3xl text-[#121212] block">Secure Account</span>
          <h1 className="font-montserrat font-extrabold text-2xl text-[#121212] uppercase tracking-[0.08em]">
            CREATE NEW PASSWORD
          </h1>
          <p className="font-sans text-xs text-gray-600">
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
            className="w-full bg-[#121212] text-white hover:bg-black font-montserrat text-xs font-bold uppercase tracking-[0.18em] py-3.5 border-2 border-[#121212] shadow-[3px_3px_0px_#f7cbd7] hover:shadow-[5px_5px_0px_#ebb0c0] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {submitting ? 'UPDATING...' : 'UPDATE PASSWORD'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
