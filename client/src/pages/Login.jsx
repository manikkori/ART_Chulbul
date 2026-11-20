import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Palette } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import Button from '../components/common/Button';
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
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-cream-200 shadow-card space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-terracotta-50 text-terracotta-500 mx-auto flex items-center justify-center border border-terracotta-100">
            <Palette className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
            Welcome Back
          </h1>
          <p className="text-xs text-charcoal-500">
            Sign in to track custom orders and chat with the artist at {siteName}
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

          <div className="space-y-1">
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              required
            />
            <div className="flex justify-end pt-1">
              <Link
                to="/forgot-password"
                className="text-xs text-charcoal-500 hover:text-terracotta-600 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            loading={submitting}
            icon={ArrowRight}
            iconPosition="right"
          >
            Sign In
          </Button>
        </form>

        <div className="pt-4 border-t border-cream-200 text-center">
          <p className="text-xs text-charcoal-600">
            Don't have an account yet?{' '}
            <Link
              to="/register"
              className="font-semibold text-terracotta-600 hover:text-terracotta-700 underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
