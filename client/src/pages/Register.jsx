import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import ScribbleWordmark from '../components/common/ScribbleWordmark';
import Input from '../components/common/Input';
import toast from 'react-hot-toast';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register, isAuthenticated } = useAuth();
  const { setPageTitle, siteName } = useSettings();
  const navigate = useNavigate();
  const wordmarkShort = (siteName || "chulbul's").split(' ')[0].toLowerCase();

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
    <div className="min-h-[calc(100vh-7rem)] flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden bg-white">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-[#ffe5ee]/55 blur-3xl pointer-events-none" />

      <div className="w-full max-w-[440px] relative z-10 space-y-6">
        <div className="flex justify-center">
          <ScribbleWordmark text={wordmarkShort} variant="white" size="lg" />
        </div>

        <div className="rounded-[24px] bg-white border border-[#eae9ee] p-7 sm:p-9 shadow-[0_16px_48px_rgba(0,0,0,0.06)] space-y-6">
          <div className="text-center space-y-1.5">
            <span className="eyebrow">Join the Studio</span>
            <h1 className="editorial-serif text-4xl text-[#111827] font-normal">
              Create Account
            </h1>
            <p className="text-[13px] text-[#6e6e73] leading-relaxed">
              Commission bespoke paintings, upload reference photos, and follow live brushstroke updates.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
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
              className="w-full py-3.5 rounded-full bg-[#ff0457] hover:bg-[#d90349] text-white text-[14px] font-bold shadow-[0_8px_24px_rgba(255,4,87,0.28)] transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <span>{submitting ? 'Creating Account...' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-[#f2f1f6] text-center">
            <p className="text-[13px] text-[#6e6e73]">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[#111827] hover:text-[#ff0457] hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
