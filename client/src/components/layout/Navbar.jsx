import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Palette, Menu, X, User, LogOut, ChevronDown, Bell, Paintbrush } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { useNotifications } from '../../context/NotificationContext';
import Button from '../common/Button';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { settings, siteName } = useSettings();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Categories', path: '/categories' },
    { label: 'About', path: '/about' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    await logout();
    navigate('/');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#fdf7f1]/90 backdrop-blur-md shadow-sm border-b border-[#eadfd9] py-3'
          : 'bg-[#fdf7f1]/70 backdrop-blur-sm py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Wordmark */}
          <Link to="/" className="flex items-center gap-2.5 group">
            {settings?.logo?.url ? (
              <img
                src={settings.logo.url}
                alt={siteName}
                className="h-9 w-auto object-contain"
              />
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#b0456f] text-white flex items-center justify-center shadow-[2px_2px_0px_#f6dcb0] group-hover:rotate-12 transition-transform duration-300">
                  <Palette className="w-5 h-5" />
                </div>
                <span className="font-display text-2xl font-bold tracking-tight text-[#3d2c33] group-hover:text-[#b0456f] transition-colors">
                  {siteName}
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `font-display text-sm transition-colors hover:text-[#b0456f] ${
                    isActive ? 'text-[#b0456f] font-semibold' : 'text-[#3d2c33] font-medium'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3.5">
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => {
                    setNotifDropdownOpen(!notifDropdownOpen);
                    setUserDropdownOpen(false);
                  }}
                  className="p-2 rounded-full border border-[#eadfd9] bg-white text-[#3d2c33] hover:text-[#b0456f] hover:border-[#b0456f] transition-all relative"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#b0456f] text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#eadfd9] overflow-hidden z-50">
                    <div className="p-3 bg-[#fdf7f1] border-b border-[#eadfd9] flex items-center justify-between">
                      <span className="font-display text-xs font-bold text-[#3d2c33] uppercase tracking-wider">
                        Notifications {unreadCount > 0 && `(${unreadCount})`}
                      </span>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="font-display text-[11px] text-[#b0456f] hover:underline font-semibold"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-[#f1e9e3]">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-[#6e5a60]">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.slice(0, 6).map((notif) => (
                          <div
                            key={notif._id}
                            onClick={() => {
                              markAsRead(notif._id);
                              setNotifDropdownOpen(false);
                              if (notif.link) navigate(notif.link);
                            }}
                            className={`p-3.5 hover:bg-[#fdf7f1] cursor-pointer transition-colors space-y-1 ${
                              !notif.isRead ? 'bg-[#f8e4ed]/40' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-display text-xs font-bold text-[#3d2c33]">
                                {notif.title}
                              </span>
                              {!notif.isRead && (
                                <span className="w-2 h-2 rounded-full bg-[#b0456f] shrink-0" />
                              )}
                            </div>
                            <p className="font-sans text-xs text-[#6e5a60] line-clamp-2 leading-relaxed">
                              {notif.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-3 pr-2 rounded-full border border-[#eadfd9] bg-white hover:border-[#b0456f] transition-all text-xs font-display font-semibold text-[#3d2c33] shadow-sm"
                >
                  {user.avatar?.url ? (
                    <img
                      src={user.avatar.url}
                      alt={user.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#f8e4ed] text-[#b0456f] flex items-center justify-center text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#6e5a60]" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#eadfd9] py-2 z-50">
                    <div className="px-4 py-2 border-b border-[#f1e9e3]">
                      <p className="font-display text-xs font-semibold text-[#3d2c33] truncate">{user.name}</p>
                      <p className="font-sans text-[11px] text-[#6e5a60] truncate">{user.email}</p>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 font-display text-xs font-semibold text-[#b0456f] hover:bg-[#f8e4ed] transition-colors"
                      >
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      to="/my-orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 font-display text-xs text-[#3d2c33] hover:bg-[#fdf7f1] transition-colors"
                    >
                      My Custom Orders
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 font-display text-xs text-[#3d2c33] hover:bg-[#fdf7f1] transition-colors"
                    >
                      Profile & Saved Addresses
                    </Link>

                    <Link
                      to="/wishlist"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 font-display text-xs text-[#3d2c33] hover:bg-[#fdf7f1] transition-colors"
                    >
                      My Wishlist
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 font-display text-xs text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="font-display text-xs font-semibold uppercase tracking-wider text-[#3d2c33] hover:text-[#b0456f] px-3 py-2 transition-colors"
              >
                Sign In
              </Link>
            )}

            <Button
              variant="primary"
              size="sm"
              icon={Paintbrush}
              onClick={() => navigate('/custom-order')}
            >
              Order Custom Art
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              className="px-3 py-1.5 text-xs"
              onClick={() => navigate('/custom-order')}
            >
              Order Art
            </Button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full border border-[#eadfd9] bg-white text-[#3d2c33] hover:text-[#b0456f]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Slide-out */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-cream-200 px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? 'bg-terracotta-50 text-terracotta-600 font-semibold' : 'text-charcoal-800 hover:bg-cream-100'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="pt-3 border-t border-cream-200">
            {isAuthenticated ? (
              <div className="space-y-1">
                <div className="px-3 py-2">
                  <p className="text-xs font-semibold text-charcoal-900">{user.name}</p>
                  <p className="text-[11px] text-charcoal-500">{user.email}</p>
                </div>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm text-terracotta-600 font-semibold rounded-xl hover:bg-terracotta-50"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <Link
                  to="/my-orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-charcoal-800 rounded-xl hover:bg-cream-100"
                >
                  My Custom Orders
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-charcoal-800 rounded-xl hover:bg-cream-100"
                >
                  Profile & Addresses
                </Link>
                <Link
                  to="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-charcoal-800 rounded-xl hover:bg-cream-100"
                >
                  Wishlist
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-rose-600 rounded-xl hover:bg-rose-50"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-sm font-semibold text-charcoal-800 border border-cream-300 rounded-full hover:bg-cream-100"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-sm font-semibold bg-terracotta-500 text-white rounded-full hover:bg-terracotta-600"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
