import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import ScribbleWordmark from '../components/common/ScribbleWordmark';
import Input from '../components/common/Input';
import toast from 'react-hot-toast';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, isAuthenticated, isAdmin } = useAuth();
  const { setPageTitle, siteName } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const wordmarkShort = (siteName || "chulbul's").split(' ')[0].toLowerCase();

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
      const destination =
        location.state?.from?.pathname || (loggedUser.role === 'admin' ? '/admin' : '/my-orders');
      navigate(destination, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-7rem)] flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden bg-white">
      {/* Subtle Ambient Soft Glow matching myscribble.in minimalist auth */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-[#ffe5ee]/55 blur-3xl pointer-events-none" />

      <div className="w-full max-w-[420px] relative z-10 space-y-6">
        <div className="flex justify-center">
          <ScribbleWordmark text={wordmarkShort} variant="white" size="lg" />
        </div>

        <div className="rounded-[24px] bg-white border border-[#eae9ee] p-7 sm:p-9 shadow-[0_16px_48px_rgba(0,0,0,0.06)] space-y-6">
          <div className="text-center space-y-1.5">
            <span className="eyebrow">Collector Portal</span>
            <h1 className="editorial-serif text-4xl text-[#111827] font-normal">
              Welcome Back
            </h1>
            <p className="text-[13px] text-[#6e6e73] leading-relaxed">
              Sign in to view custom quotes, preview progress sketches, and chat with the artist.
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
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-[12px] font-medium text-[#6e6e73] hover:text-[#ff0457] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-full bg-[#111827] hover:bg-black text-white text-[14px] font-bold shadow-[0_8px_24px_rgba(17,24,39,0.18)] transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <span>{submitting ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-[#f2f1f6] text-center">
            <p className="text-[13px] text-[#6e6e73]">
              New to {siteName || "Chulbul's Art"}?{' '}
              <Link
                to="/register"
                className="font-bold text-[#ff0457] hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
