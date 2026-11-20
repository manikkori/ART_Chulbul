import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Palette } from 'lucide-react';
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
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-cream-200 shadow-card space-y-6">
        <div className="text-center space-y-2">
          {settings?.logo?.url ? (
            <img src={settings.logo.url} alt={siteName} className="w-12 h-12 rounded-full object-contain mx-auto shadow-sm" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-terracotta-50 text-terracotta-500 mx-auto flex items-center justify-center border border-terracotta-100">
              <Palette className="w-6 h-6" />
            </div>
          )}
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
            Join {siteName}
          </h1>
          <p className="text-xs text-charcoal-500">
            Create an account to commission bespoke art, save references, and track progress
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Your Name"
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
            placeholder="Re-enter password"
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
            Create My Account
          </Button>
        </form>

        <div className="pt-4 border-t border-cream-200 text-center">
          <p className="text-xs text-charcoal-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-terracotta-600 hover:text-terracotta-700 underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
