import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Palette, Menu, X, User, LogOut, ChevronDown, Bell, Paintbrush, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { useNotifications } from '../../context/NotificationContext';
import ConfirmDialog from '../common/ConfirmDialog';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { settings, siteName } = useSettings();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'HOME', path: '/' },
    { label: 'SHOWCASE', path: '/gallery' },
    { label: 'MEDIUMS', path: '/categories' },
    { label: 'PRICING', path: '/pricing' },
    { label: 'OUR STORY', path: '/about' },
    { label: 'CONTACT', path: '/contact' },
  ];

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    await logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Announcement Bar - Jhankoo Soft Pink Tint */}
      <div className="bg-[#faa9b0]/25 border-b border-[#faa9b0]/40 text-[#1c1a17] py-1.5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-[11px] sm:text-xs font-sans tracking-[0.16em] uppercase font-semibold">
          <span className="text-[#e85c76] hidden sm:inline">✦</span>
          <span>HANDCRAFTED CUSTOM ART • COMMISSION YOUR ORIGINAL HEIRLOOM TODAY</span>
          <span className="hidden md:inline text-[#e85c76]">•</span>
          <span className="hidden md:inline">FREE ART CONSULTATION & SAFE CRATED SHIPPING</span>
          <span className="text-[#e85c76] hidden sm:inline">✧</span>
        </div>
      </div>

      {/* Main Navbar - Jhankoo Warm Butter & Frosted Blur */}
      <div
        className={`transition-all duration-300 ${
          isScrolled
            ? 'bg-[#f8f4ea]/95 backdrop-blur-md shadow-sm border-b border-[#1c1a17]/10 py-2.5'
            : 'bg-[#f8f4ea]/85 backdrop-blur-sm border-b border-[#1c1a17]/5 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo in Jhankoo Caveat Cursive */}
            <Link to="/" className="flex items-center gap-2.5 group">
              {settings?.logo?.url ? (
                <img
                  src={settings.logo.url}
                  alt={siteName}
                  className="h-9 w-9 object-contain rounded-full shadow-sm group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#faa9b0] text-white flex items-center justify-center shadow-xs group-hover:rotate-12 transition-transform">
                  <Palette className="w-4 h-4 text-white" />
                </div>
              )}
              <div className="flex items-baseline">
                <span className="font-caveat text-3xl sm:text-4xl font-bold tracking-tight text-[#e85c76] group-hover:scale-105 transition-transform">
                  Chulbul'<span className="text-[#f19b72]">s Art</span>
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 xl:gap-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-[12px] font-sans tracking-[0.14em] transition-all relative py-1 font-semibold ${
                      isActive
                        ? 'text-[#e85c76] after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#e85c76]'
                        : 'text-[#1c1a17]/75 hover:text-[#e85c76]'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated && (
                <div className="relative">
                  <button
                    onClick={() => {
                      setNotifDropdownOpen(!notifDropdownOpen);
                      setUserDropdownOpen(false);
                    }}
                    className="p-2 rounded-full border border-[#1c1a17]/15 bg-white/80 text-[#1c1a17] hover:bg-[#faa9b0]/20 transition-colors relative"
                    aria-label="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#e85c76] text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {notifDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#1c1a17]/10 overflow-hidden z-50">
                      <div className="p-3 bg-[#f8f4ea] border-b border-[#1c1a17]/10 flex items-center justify-between">
                        <span className="font-sans text-xs font-bold text-[#1c1a17] uppercase tracking-wider">
                          Notifications {unreadCount > 0 && `(${unreadCount})`}
                        </span>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="font-sans text-[11px] text-[#e85c76] hover:underline font-semibold"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-xs text-gray-500">
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
                              className={`p-3.5 hover:bg-[#f8f4ea] cursor-pointer transition-colors space-y-1 ${
                                !notif.isRead ? 'bg-[#faa9b0]/15' : ''
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-sans text-xs font-bold text-[#1c1a17]">
                                  {notif.title}
                                </span>
                                {!notif.isRead && (
                                  <span className="w-2 h-2 rounded-full bg-[#e85c76] shrink-0" />
                                )}
                              </div>
                              <p className="font-sans text-xs text-gray-600 line-clamp-2 leading-relaxed">
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
                    className="flex items-center gap-2 p-1.5 pl-3 pr-2 rounded-full border border-[#1c1a17]/15 bg-white/90 hover:bg-[#faa9b0]/20 transition-all text-xs font-sans font-bold text-[#1c1a17] shadow-xs"
                  >
                    {user.avatar?.url ? (
                      <img
                        src={user.avatar.url}
                        alt={user.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-[#faa9b0] text-white flex items-center justify-center text-xs font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#1c1a17]/10 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-sans text-xs font-bold text-[#1c1a17] truncate">{user.name}</p>
                        <p className="font-sans text-[11px] text-gray-500 truncate">{user.email}</p>
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-4 py-2 font-sans text-xs font-bold text-[#e85c76] hover:bg-[#faa9b0]/15 transition-colors"
                        >
                          Admin Studio
                        </Link>
                      )}

                      <Link
                        to="/my-orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 font-sans text-xs text-gray-700 hover:bg-[#f8f4ea] transition-colors"
                      >
                        My Custom Orders
                      </Link>

                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 font-sans text-xs text-gray-700 hover:bg-[#f8f4ea] transition-colors"
                      >
                        Profile & Addresses
                      </Link>

                      <Link
                        to="/wishlist"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 font-sans text-xs text-gray-700 hover:bg-[#f8f4ea] transition-colors"
                      >
                        My Wishlist
                      </Link>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setLogoutConfirmOpen(true);
                        }}
                        className="w-full text-left px-4 py-2 font-sans text-xs text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1.5 font-semibold"
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
                  className="font-sans text-xs font-bold uppercase tracking-wider text-[#1c1a17] hover:text-[#e85c76] px-3 py-2 transition-colors"
                >
                  Sign In
                </Link>
              )}

              {/* Order Custom Button - Jhankoo Pink Rounded Pill */}
              <button
                onClick={() => navigate('/custom-order')}
                className="bg-[#faa9b0] hover:bg-[#e85c76] text-white font-sans text-xs font-bold uppercase tracking-[0.14em] px-5 py-2.5 rounded-full shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Paintbrush className="w-3.5 h-3.5 text-white" />
                <span>ORDER CUSTOM</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => navigate('/custom-order')}
                className="bg-[#faa9b0] text-white font-sans text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full"
              >
                Order
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-full border border-[#1c1a17]/15 bg-white text-[#1c1a17] hover:bg-[#faa9b0]/20"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Slide-out */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#f8f4ea] border-b border-[#1c1a17]/15 px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 font-sans text-xs font-bold tracking-wider rounded-xl transition-colors ${
                    isActive ? 'bg-[#faa9b0]/30 text-[#e85c76]' : 'text-gray-700 hover:bg-white/60'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="pt-3 border-t border-[#1c1a17]/10">
            {isAuthenticated ? (
              <div className="space-y-1">
                <div className="px-3 py-2">
                  <p className="font-sans text-xs font-bold text-[#1c1a17]">{user.name}</p>
                  <p className="font-sans text-[11px] text-gray-500">{user.email}</p>
                </div>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 font-sans text-xs font-bold text-[#e85c76] hover:bg-[#faa9b0]/20 rounded-xl"
                  >
                    Admin Studio
                  </Link>
                )}
                <Link
                  to="/my-orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 font-sans text-xs text-gray-700 hover:bg-white/60 rounded-xl"
                >
                  My Custom Orders
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 font-sans text-xs text-gray-700 hover:bg-white/60 rounded-xl"
                >
                  Profile & Addresses
                </Link>
                <Link
                  to="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 font-sans text-xs text-gray-700 hover:bg-white/60 rounded-xl"
                >
                  Wishlist
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setLogoutConfirmOpen(true);
                  }}
                  className="w-full text-left px-3 py-2 font-sans text-xs text-rose-600 font-bold hover:bg-rose-50 rounded-xl"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 font-sans text-xs font-bold text-[#1c1a17] border border-[#1c1a17]/20 rounded-full hover:bg-white"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 font-sans text-xs font-bold bg-[#faa9b0] text-white rounded-full hover:bg-[#e85c76]"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        onConfirm={handleLogout}
        title="Sign Out Confirmation"
        message="Are you sure you want to sign out from your account?"
        confirmText="Yes, Sign Out"
        cancelText="Cancel"
        confirmVariant="danger"
      />
    </header>
  );
};

export default Navbar;
