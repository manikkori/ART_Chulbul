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
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-cream-200 shadow-card space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
            Create New Password
          </h1>
          <p className="text-xs text-charcoal-500">
            Choose a strong password to protect your account
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
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={Lock}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            loading={submitting}
            icon={ArrowRight}
            iconPosition="right"
          >
            Update Password & Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
