import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Palette, Menu, X, User, LogOut, ChevronDown, Bell, Paintbrush, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { useNotifications } from '../../context/NotificationContext';
import Button from '../common/Button';
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
    { label: 'PORTFOLIO', path: '/gallery' },
    { label: 'MEDIUMS', path: '/categories' },
    { label: 'PRICING', path: '/pricing' },
    { label: 'ABOUT THE ARTIST', path: '/about' },
    { label: 'CONTACT', path: '/contact' },
  ];

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    await logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Announcement Bar - Blush Pink & Black tracking strip (as in mockup) */}
      <div className="bg-[#fce4ec] border-b border-[#f7cbd7] text-[#121212] py-1.5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-[11px] sm:text-xs font-montserrat tracking-[0.18em] uppercase font-semibold">
          <Sparkles className="w-3 h-3 text-[#dc8da3] animate-pulse hidden sm:inline" />
          <span>HANDCRAFTED CUSTOM ART • COMMISSION YOUR ORIGINAL PAINTING TODAY</span>
          <span className="hidden md:inline text-[#dc8da3]">•</span>
          <span className="hidden md:inline">FREE ART CONSULTATION & SAFE CRATED SHIPPING</span>
          <Sparkles className="w-3 h-3 text-[#dc8da3] animate-pulse hidden sm:inline" />
        </div>
      </div>

      {/* Main Navbar */}
      <div
        className={`transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[#f7cbd7] py-2.5'
            : 'bg-[#fffdfd]/90 backdrop-blur-sm border-b border-[#fde8ef] py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo / Wordmark in Blush & Black aesthetic */}
            <Link to="/" className="flex items-center gap-2 group">
              {settings?.logo?.url ? (
                <img
                  src={settings.logo.url}
                  alt={siteName}
                  className="h-9 w-9 object-contain rounded-full border-2 border-[#121212] shadow-[2px_2px_0px_#f7cbd7] group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#121212] text-white flex items-center justify-center border-2 border-[#121212] shadow-[2px_2px_0px_#f7cbd7] group-hover:rotate-6 transition-transform">
                  <Palette className="w-4 h-4 text-[#f7cbd7]" />
                </div>
              )}
              <div className="flex items-baseline gap-1">
                <span className="font-montserrat font-extrabold text-lg sm:text-xl tracking-tight text-[#121212]">
                  {siteName ? siteName.toUpperCase() : "CHULBUL'S"}
                </span>
                <span className="font-script text-2xl sm:text-3xl text-[#121212] font-normal lowercase leading-none">
                  : art
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-[12px] font-montserrat tracking-[0.14em] transition-all relative py-1 ${
                      isActive
                        ? 'text-[#121212] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#121212]'
                        : 'text-[#555] font-medium hover:text-[#121212]'
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
                    className="p-2 rounded-full border border-[#121212] bg-white text-[#121212] hover:bg-[#fde8ef] transition-colors relative"
                    aria-label="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#121212] text-[#f7cbd7] rounded-full text-[10px] font-bold flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {notifDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border-2 border-[#121212] overflow-hidden z-50">
                      <div className="p-3 bg-[#fde8ef] border-b border-[#f7cbd7] flex items-center justify-between">
                        <span className="font-montserrat text-xs font-bold text-[#121212] uppercase tracking-wider">
                          Notifications {unreadCount > 0 && `(${unreadCount})`}
                        </span>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="font-montserrat text-[11px] text-[#121212] hover:underline font-semibold"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-[#f7cbd7]/40">
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
                              className={`p-3.5 hover:bg-[#fff7f9] cursor-pointer transition-colors space-y-1 ${
                                !notif.isRead ? 'bg-[#fde8ef]/50' : ''
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-montserrat text-xs font-bold text-[#121212]">
                                  {notif.title}
                                </span>
                                {!notif.isRead && (
                                  <span className="w-2 h-2 rounded-full bg-[#121212] shrink-0" />
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
                    className="flex items-center gap-2 p-1.5 pl-3 pr-2 rounded-full border-2 border-[#121212] bg-white hover:bg-[#fde8ef] transition-all text-xs font-montserrat font-bold text-[#121212] shadow-[2px_2px_0px_#f7cbd7]"
                  >
                    {user.avatar?.url ? (
                      <img
                        src={user.avatar.url}
                        alt={user.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-[#121212] text-white flex items-center justify-center text-xs font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#121212]" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border-2 border-[#121212] py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-montserrat text-xs font-bold text-[#121212] truncate">{user.name}</p>
                        <p className="font-sans text-[11px] text-gray-500 truncate">{user.email}</p>
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-4 py-2 font-montserrat text-xs font-bold text-[#121212] hover:bg-[#fde8ef] transition-colors"
                        >
                          Admin Studio
                        </Link>
                      )}

                      <Link
                        to="/my-orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 font-montserrat text-xs text-gray-700 hover:bg-[#fde8ef] transition-colors"
                      >
                        My Custom Orders
                      </Link>

                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 font-montserrat text-xs text-gray-700 hover:bg-[#fde8ef] transition-colors"
                      >
                        Profile & Addresses
                      </Link>

                      <Link
                        to="/wishlist"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 font-montserrat text-xs text-gray-700 hover:bg-[#fde8ef] transition-colors"
                      >
                        My Wishlist
                      </Link>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setLogoutConfirmOpen(true);
                        }}
                        className="w-full text-left px-4 py-2 font-montserrat text-xs text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1.5 font-semibold"
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
                  className="font-montserrat text-xs font-bold uppercase tracking-wider text-[#121212] hover:text-[#dc8da3] px-3 py-2 transition-colors"
                >
                  Sign In
                </Link>
              )}

              {/* Commission Art Button - Blush & Black Noir Button */}
              <button
                onClick={() => navigate('/custom-order')}
                className="bg-[#121212] text-white hover:bg-black font-montserrat text-xs font-bold uppercase tracking-[0.16em] px-5 py-2.5 border-2 border-[#121212] shadow-[3px_3px_0px_#f7cbd7] hover:shadow-[4px_4px_0px_#ebb0c0] hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <Paintbrush className="w-3.5 h-3.5 text-[#f7cbd7]" />
                <span>ORDER CUSTOM</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => navigate('/custom-order')}
                className="bg-[#121212] text-white font-montserrat text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 border border-[#121212] shadow-[2px_2px_0px_#f7cbd7]"
              >
                Order
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 border-2 border-[#121212] bg-white text-[#121212] hover:bg-[#fde8ef]"
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
        <div className="md:hidden bg-white border-b-2 border-[#121212] px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 font-montserrat text-xs font-bold tracking-wider transition-colors ${
                    isActive ? 'bg-[#fde8ef] text-[#121212] border-l-4 border-[#121212]' : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="pt-3 border-t border-[#f7cbd7]">
            {isAuthenticated ? (
              <div className="space-y-1">
                <div className="px-3 py-2">
                  <p className="font-montserrat text-xs font-bold text-[#121212]">{user.name}</p>
                  <p className="font-sans text-[11px] text-gray-500">{user.email}</p>
                </div>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 font-montserrat text-xs font-bold text-[#121212] hover:bg-[#fde8ef]"
                  >
                    Admin Studio
                  </Link>
                )}
                <Link
                  to="/my-orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 font-montserrat text-xs text-gray-700 hover:bg-[#fde8ef]"
                >
                  My Custom Orders
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 font-montserrat text-xs text-gray-700 hover:bg-[#fde8ef]"
                >
                  Profile & Addresses
                </Link>
                <Link
                  to="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 font-montserrat text-xs text-gray-700 hover:bg-[#fde8ef]"
                >
                  Wishlist
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setLogoutConfirmOpen(true);
                  }}
                  className="w-full text-left px-3 py-2 font-montserrat text-xs text-rose-600 font-bold hover:bg-rose-50"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 font-montserrat text-xs font-bold text-[#121212] border-2 border-[#121212] hover:bg-[#fde8ef]"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 font-montserrat text-xs font-bold bg-[#121212] text-white hover:bg-black"
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
