import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import ScribbleWordmark from '../components/common/ScribbleWordmark';
import Input from '../components/common/Input';
import api from '../services/api';
import toast from 'react-hot-toast';

export const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { setPageTitle, siteName } = useSettings();
  const wordmarkShort = (siteName || "chulbul's").split(' ')[0].toLowerCase();

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
        toast.success('Password updated! You can now sign in.');
        navigate('/login');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired reset link.');
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
          <div className="text-center space-y-1.5">
            <span className="eyebrow">Security</span>
            <h1 className="editorial-serif text-4xl text-[#111827] font-normal">
              New Password
            </h1>
            <p className="text-[13px] text-[#6e6e73]">
              Choose a strong password for your collector account.
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
              className="w-full py-3.5 rounded-full bg-[#ff0457] hover:bg-[#d90349] text-white text-[14px] font-bold flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <span>{submitting ? 'Updating...' : 'Update Password'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
