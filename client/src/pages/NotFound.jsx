import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Palette, Home, ArrowLeft } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import Button from '../components/common/Button';

export const NotFound = () => {
  const { setPageTitle } = useSettings();
  const navigate = useNavigate();

  useEffect(() => {
    setPageTitle('404 Page Not Found');
  }, [setPageTitle]);

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-terracotta-50 text-terracotta-500 mx-auto flex items-center justify-center border border-terracotta-100 shadow-sm">
        <Palette className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="eyebrow">LOST CANVAS</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-charcoal-900">
          Page Not Found
        </h1>
        <p className="text-sm text-charcoal-600 leading-relaxed max-w-sm mx-auto">
          The artwork or page you are searching for might have been moved, renamed, or does not exist.
        </p>
      </div>

      <div className="flex justify-center gap-4 pt-2">
        <Button variant="primary" icon={Home} onClick={() => navigate('/')}>
          Return Home
        </Button>
        <Button variant="outline" icon={ArrowLeft} onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
