import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Heart, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import Input from '../components/common/Input';
import toast from 'react-hot-toast';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, isAuthenticated, isAdmin } = useAuth();
  const { setPageTitle, siteName, settings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setPageTitle('Sign In');
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || (isAdmin ? '/admin' : '/my-orders');
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate, location, setPageTitle]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter your email and password');
      return;
    }

    setSubmitting(true);
    try {
      const loggedUser = await login(email, password);
      const destination = location.state?.from?.pathname || (loggedUser.role === 'admin' ? '/admin' : '/my-orders');
      navigate(destination, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-20 relative">
      {/* Decorative Pastel Glows in background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#faa9b0]/25 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-60 h-60 bg-[#ffc96f]/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] border border-[#1c1a17]/10 p-8 sm:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.04)] space-y-6 relative">
        {/* Jhankoo Washi Tape Accent */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#ffdda4]/85 backdrop-blur-sm -rotate-2 rounded-sm shadow-sm pointer-events-none border border-[#e5c58a]/40" />

        {/* Header with Caveat Script & Playfair Serif */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center gap-1 font-caveat text-3xl sm:text-4xl text-[#f19b72]">
            <span>Welcome Back</span>
            <Sparkles className="w-4 h-4 text-[#faa9b0] inline-block" />
          </div>
          <h1 className="font-playfair font-normal text-2xl sm:text-3xl text-[#1c1a17]">
            Collector Sign In
          </h1>
          <p className="font-sans text-xs sm:text-sm text-[#1c1a17]/65 max-w-xs mx-auto">
            Sign in to track custom orders, review progress sketches, and chat with the artist.
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

          <div className="space-y-1.5">
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              required
            />
            <div className="flex justify-end pt-0.5">
              <Link
                to="/forgot-password"
                className="font-sans text-xs text-[#1c1a17]/60 hover:text-[#1c1a17] hover:underline transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#1c1a17] text-white hover:bg-black rounded-full py-3.5 px-6 font-sans text-sm font-medium tracking-wide shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
          >
            {submitting ? 'Signing in...' : 'Sign In to Studio'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#1c1a17]/10 text-center">
          <p className="font-sans text-xs text-[#1c1a17]/70">
            Don't have an account yet?{' '}
            <Link
              to="/register"
              className="font-semibold text-[#1c1a17] hover:text-[#f19b72] underline underline-offset-4 inline-flex items-center gap-1 transition-colors"
            >
              Create Account →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
