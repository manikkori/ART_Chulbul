import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import {
  Search,
  Bell,
  Heart,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Sparkles,
  User,
  Package,
  LogOut,
  ShieldCheck,
  ArrowUpRight,
  CheckCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { useNotifications } from '../../context/NotificationContext';
import ScribbleWordmark from '../common/ScribbleWordmark';
import ConfirmDialog from '../common/ConfirmDialog';

const EXPLORE_CARDS = [
  {
    title: 'For Portrait Lovers',
    subtitle: 'Hand-shaded charcoal & graphite portraits from your photo',
    to: '/gallery?medium=Charcoal',
    bg: 'radial-gradient(circle at 25% 25%, #6d1414 0%, #3d0909 55%, #1d0404 100%)',
    img: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=500&q=80',
    tag: 'Charcoal & Graphite',
  },
  {
    title: 'For Memory Keepers',
    subtitle: 'Delicate watercolors preserving moments with warmth',
    to: '/gallery?medium=Watercolor',
    bg: 'radial-gradient(circle at 75% 20%, #d4dbe4 0%, #9da8b8 60%, #5f6c7d 100%)',
    img: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=500&q=80',
    tag: 'Archival Watercolor',
  },
  {
    title: 'For Collectors',
    subtitle: ' Museum-grade oil & palette-knife acrylic canvases',
    to: '/gallery',
    bg: 'radial-gradient(circle at 50% 25%, #2e2f38 0%, #17181d 70%, #0b0b0e 100%)',
    img: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=500&q=80',
    tag: 'Original Canvas',
  },
];

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { siteName } = useSettings();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const [exploreOpen, setExploreOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMediumsOpen, setMobileMediumsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const explorePanelRef = useRef(null);
  const notifRef = useRef(null);
  const accountRef = useRef(null);

  const wordmarkText = (siteName || "chulbul's").split(' ')[0].toLowerCase();

  // Track subtle scroll depth
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus on route navigation
  useEffect(() => {
    setExploreOpen(false);
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setNotifOpen(false);
    setAccountOpen(false);
  }, [location.pathname, location.search]);

  // Outside click & Escape handler
  useEffect(() => {
    const handleOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setExploreOpen(false);
        setMobileMenuOpen(false);
        setSearchOpen(false);
        setNotifOpen(false);
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  // GSAP expand animation for Desktop Explore overlay
  useEffect(() => {
    if (exploreOpen && explorePanelRef.current) {
      document.body.style.overflow = 'hidden';
      gsap.fromTo(
        explorePanelRef.current,
        { opacity: 0, scale: 0.96, y: -12 },
        { opacity: 1, scale: 1, y: 0, duration: 0.36, ease: 'power3.out' }
      );
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [exploreOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    setSearchOpen(false);
    setMobileMenuOpen(false);
    navigate(q ? `/gallery?search=${encodeURIComponent(q)}` : '/gallery');
  };

  const handleConfirmLogout = async () => {
    setLogoutConfirmOpen(false);
    await logout();
    navigate('/');
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[110] pointer-events-none">
        {/* ================= DESKTOP FLOATING PILL HEADER (> 768px) ================= */}
        <div className="hidden md:flex items-center justify-between px-[22px] pt-[18px]">
          {/* Top-Left Wordmark Pill */}
          <Link
            to="/"
            className={`pointer-events-auto inline-flex items-center h-[44px] px-[18px] rounded-full transition-all duration-300 ${
              scrolled
                ? 'bg-white/85 backdrop-blur-xl border border-white/80 shadow-[0_8px_24px_rgba(0,0,0,0.06)]'
                : 'bg-white/75 backdrop-blur-xl border border-white/60 shadow-[0_4px_12px_rgba(0,0,0,0.03)]'
            }`}
            aria-label={`${siteName || "Chulbul's Art"} Home`}
          >
            <ScribbleWordmark text={wordmarkText} variant="white" size="xs" />
          </Link>

          {/* Top-Right Controls Pill */}
          <nav
            aria-label="Primary navigation"
            className={`pointer-events-auto flex items-center gap-1 h-[44px] px-2 rounded-full transition-all duration-300 ${
              scrolled
                ? 'bg-white/88 backdrop-blur-xl border border-white/90 shadow-[0_8px_28px_rgba(0,0,0,0.08)]'
                : 'bg-white/78 backdrop-blur-xl border border-white/70 shadow-[0_4px_16px_rgba(0,0,0,0.04)]'
            }`}
          >
            <button
              type="button"
              onClick={() => setExploreOpen((v) => !v)}
              className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold tracking-[-0.01em] transition-colors ${
                exploreOpen
                  ? 'bg-[#111827] text-white'
                  : 'text-[#111827] hover:bg-black/[0.05]'
              }`}
            >
              Explore
            </button>

            <NavLink
              to="/gallery"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-full text-[13px] font-medium tracking-[-0.01em] transition-colors ${
                  isActive
                    ? 'bg-black/[0.07] text-[#111827] font-semibold'
                    : 'text-[#3c3c43] hover:text-[#111827] hover:bg-black/[0.04]'
                }`
              }
            >
              Gallery
            </NavLink>

            <NavLink
              to="/categories"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-full text-[13px] font-medium tracking-[-0.01em] transition-colors ${
                  isActive
                    ? 'bg-black/[0.07] text-[#111827] font-semibold'
                    : 'text-[#3c3c43] hover:text-[#111827] hover:bg-black/[0.04]'
                }`
              }
            >
              Mediums
            </NavLink>

            <Link
              to="/custom-order"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#ffe5ee] hover:bg-[#ff0457] text-[#ff0155] hover:text-white text-[13px] font-bold tracking-[-0.01em] transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Commission</span>
            </Link>

            {/* Quick Search Button */}
            <button
              type="button"
              onClick={() => setSearchOpen((s) => !s)}
              aria-label="Search artworks"
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#3c3c43] hover:text-[#111827] hover:bg-black/[0.05] transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              aria-label="Saved artworks"
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#3c3c43] hover:text-[#ff0457] hover:bg-[#ffe5ee]/60 transition-colors"
            >
              <Heart className="w-4 h-4" />
            </Link>

            {/* Notifications Bell (Authenticated) */}
            {isAuthenticated && (
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => setNotifOpen((v) => !v)}
                  aria-label="Notifications"
                  className="relative w-8 h-8 rounded-full flex items-center justify-center text-[#3c3c43] hover:text-[#111827] hover:bg-black/[0.05] transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ff0457] ring-2 ring-white" />
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-xl rounded-[20px] border border-[#eae9ee] shadow-[0_20px_50px_rgba(0,0,0,0.14)] overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[#f0eff4]">
                      <span className="text-[13px] font-bold text-[#111827]">
                        Notifications {unreadCount > 0 && `(${unreadCount})`}
                      </span>
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={markAllAsRead}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#ff0457] hover:underline"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          Mark read
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-[#f2f1f6]">
                      {notifications.length === 0 ? (
                        <p className="p-5 text-center text-[12px] text-[#8e8e93]">
                          You are all caught up.
                        </p>
                      ) : (
                        notifications.slice(0, 6).map((n) => (
                          <div
                            key={n._id}
                            onClick={() => {
                              markAsRead(n._id);
                              setNotifOpen(false);
                              if (n.link) navigate(n.link);
                            }}
                            className={`px-4 py-3 text-[12px] cursor-pointer transition-colors hover:bg-[#f8f7fb] ${
                              !n.isRead ? 'bg-[#ffe5ee]/25' : ''
                            }`}
                          >
                            <p className="text-[#111827] font-medium leading-snug">
                              {n.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Account Dropdown or Sign In Pill */}
            {isAuthenticated ? (
              <div className="relative" ref={accountRef}>
                <button
                  type="button"
                  onClick={() => setAccountOpen((v) => !v)}
                  className="inline-flex items-center gap-1.5 pl-2.5 pr-3 py-1 rounded-full bg-[#111827] text-white text-[12px] font-semibold hover:bg-black transition-colors"
                >
                  <span className="w-5 h-5 rounded-full bg-[#ff0457] text-[10px] font-bold flex items-center justify-center uppercase">
                    {(user?.name || 'A')[0]}
                  </span>
                  <span className="max-w-[82px] truncate">{user?.name?.split(' ')[0]}</span>
                  <ChevronDown className="w-3 h-3 opacity-70" />
                </button>

                {accountOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-xl rounded-[20px] border border-[#eae9ee] shadow-[0_20px_50px_rgba(0,0,0,0.14)] p-2 space-y-0.5">
                    <div className="px-3 py-2 border-b border-[#f0eff4] mb-1">
                      <p className="text-[13px] font-bold text-[#111827] truncate">
                        {user?.name}
                      </p>
                      <p className="text-[11px] text-[#8e8e93] truncate">{user?.email}</p>
                    </div>
                    <Link
                      to="/my-orders"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium text-[#111827] hover:bg-[#f2f1f6] transition-colors"
                    >
                      <Package className="w-4 h-4 text-[#6e6e73]" />
                      My Commissions
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium text-[#111827] hover:bg-[#f2f1f6] transition-colors"
                    >
                      <User className="w-4 h-4 text-[#6e6e73]" />
                      Studio Profile
                    </Link>
                    <Link
                      to="/wishlist"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium text-[#111827] hover:bg-[#f2f1f6] transition-colors"
                    >
                      <Heart className="w-4 h-4 text-[#ff0457]" />
                      Saved Artworks
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-semibold text-[#ff0155] bg-[#ffe5ee]/60 hover:bg-[#ffe5ee] transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Artist Studio Admin
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setAccountOpen(false);
                        setLogoutConfirmOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium text-[#ef4444] hover:bg-[#fff1f2] transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-1.5 rounded-full bg-[#111827] text-white text-[12px] font-semibold hover:bg-black transition-colors"
              >
                Sign in
              </Link>
            )}
          </nav>
        </div>

        {/* Inline Floating Search Pill (Desktop toggle) */}
        {searchOpen && (
          <div className="hidden md:flex justify-end px-[22px] pt-2 pointer-events-none">
            <form
              onSubmit={handleSearchSubmit}
              className="pointer-events-auto flex items-center gap-2 w-80 bg-white/95 backdrop-blur-xl rounded-full px-4 py-2 border border-[#eae9ee] shadow-[0_14px_34px_rgba(0,0,0,0.1)]"
            >
              <Search className="w-4 h-4 text-[#8e8e93] shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search charcoal, oil, portrait..."
                className="flex-1 bg-transparent text-[13px] text-[#111827] placeholder-[#8e8e93] focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="submit"
                  className="px-2.5 py-0.5 rounded-full bg-[#ff0457] text-white text-[11px] font-bold"
                >
                  Go
                </button>
              )}
            </form>
          </div>
        )}

        {/* ================= MOBILE FLOATING PILLS HEADER (<= 768px) ================= */}
        <div className="flex md:hidden items-center justify-between px-3 pt-3">
          <Link
            to="/"
            className="pointer-events-auto inline-flex items-center h-[46px] px-4 rounded-full bg-white/80 backdrop-blur-xl border border-white shadow-[0_4px_14px_rgba(0,0,0,0.06)]"
            aria-label={`${siteName || "Chulbul's Art"} Home`}
          >
            <ScribbleWordmark text={wordmarkText} variant="white" size="xs" />
          </Link>

          <div className="pointer-events-auto flex items-center gap-1 h-[46px] px-1.5 rounded-full bg-white/80 backdrop-blur-xl border border-white shadow-[0_4px_14px_rgba(0,0,0,0.06)]">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-[#111827] active:bg-black/5 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link
              to={isAuthenticated ? '/my-orders' : '/custom-order'}
              aria-label={isAuthenticated ? 'My Orders' : 'Commission Art'}
              className="relative w-[38px] h-[38px] rounded-full flex items-center justify-center text-[#111827] active:bg-black/5 transition-colors"
            >
              {isAuthenticated ? (
                <Package className="w-4 h-4" />
              ) : (
                <Sparkles className="w-4 h-4 text-[#ff0457]" />
              )}
              {isAuthenticated && unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ff0457]" />
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* ================= DESKTOP EXPLORE OVERLAY SHOWCASE ================= */}
      {exploreOpen && (
        <div className="hidden md:flex fixed inset-0 z-[140] items-center justify-center p-[22px] bg-black/25 backdrop-blur-md">
          <div
            ref={explorePanelRef}
            className="w-full h-full max-w-[1400px] max-h-[calc(100vh-44px)] bg-white/95 backdrop-blur-2xl rounded-[24px] border border-white shadow-[0_24px_80px_rgba(0,0,0,0.18)] flex flex-col justify-between p-6 lg:p-8 overflow-y-auto"
          >
            {/* Overlay Top Bar */}
            <div className="flex items-center justify-between gap-4 pb-5 border-b border-black/[0.06]">
              <div className="flex items-baseline gap-2.5">
                <ScribbleWordmark text={wordmarkText} variant="white" size="xs" />
                <span className="text-[13px] font-medium text-[#8e8e93]">
                  Studio Showcase
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-1 bg-[#f2f1f6] p-1 rounded-full">
                {[
                  { label: 'Gallery', to: '/gallery' },
                  { label: 'Mediums', to: '/categories' },
                  { label: 'Pricing', to: '/pricing' },
                  { label: 'About', to: '/about' },
                  { label: 'Contact', to: '/contact' },
                  { label: 'Orders', to: '/my-orders' },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setExploreOpen(false)}
                    className="whitespace-nowrap px-3.5 py-1.5 rounded-full text-[13px] font-medium text-[#111827] hover:bg-white transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setExploreOpen(false)}
                aria-label="Close explore menu"
                className="w-10 h-10 rounded-full bg-[#f2f1f6] hover:bg-[#111827] text-[#111827] hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Wide Commission Feature Banner */}
            <div className="my-5 relative overflow-hidden rounded-[22px] bg-[#141418] text-white p-7 lg:p-9 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <img
                src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80"
                alt="Artist studio brushes"
                className="absolute inset-0 w-full h-full object-cover opacity-35"
              />
              <div className="relative z-10 max-w-xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff0457] text-white text-[11px] font-bold uppercase tracking-wider mb-3">
                  <Sparkles className="w-3 h-3" /> Bespoke Studio
                </span>
                <h2 className="editorial-serif text-3xl lg:text-5xl text-white font-normal leading-[1.05]">
                  Turn Your Favorite Photo Into Museum-Grade Original Art
                </h2>
                <p className="text-[13px] text-white/75 mt-2">
                  Upload your reference photograph, pick Charcoal, Watercolor, Oil, or Acrylic, and receive a tailored artist quote.
                </p>
              </div>
              <Link
                to="/custom-order"
                onClick={() => setExploreOpen(false)}
                className="relative z-10 inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#ff0457] hover:bg-[#d90349] text-white text-[14px] font-bold shadow-[0_12px_30px_rgba(255,4,87,0.4)] transition-all hover:scale-[1.02] shrink-0"
              >
                <span>Start Commission</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 3 Visual Editorial Showcase Cards matching myscribble Explore drawer */}
            <div className="grid grid-cols-3 gap-4">
              {EXPLORE_CARDS.map((card) => (
                <Link
                  key={card.title}
                  to={card.to}
                  onClick={() => setExploreOpen(false)}
                  className="group relative rounded-[20px] overflow-hidden p-6 min-h-[210px] flex flex-col justify-between text-white transition-transform duration-300 hover:-translate-y-1"
                  style={{ background: card.bg }}
                >
                  <img
                    src={card.img}
                    alt={card.title}
                    className="absolute right-2.5 bottom-2.5 w-20 lg:w-24 h-24 lg:h-28 object-cover rounded-[12px] shadow-xl rotate-3 opacity-85 group-hover:rotate-6 group-hover:scale-105 transition-all duration-300 border border-white/20"
                  />
                  <span className="relative z-10 self-start px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-semibold tracking-wide">
                    {card.tag}
                  </span>
                  <div className="relative z-10 pr-20 lg:pr-24">
                    <h3 className="editorial-serif text-2xl text-white font-normal leading-tight">
                      {card.title}
                    </h3>
                    <p className="text-[12px] text-white/75 mt-1 leading-snug">
                      {card.subtitle}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= MOBILE FLOATING ROUNDED DRAWER CARD ================= */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[150] md:hidden bg-black/35 backdrop-blur-md p-3 overflow-y-auto"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-full bg-white rounded-[24px] shadow-[0_24px_60px_rgba(0,0,0,0.25)] p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Action Circles Row */}
            <div className="flex items-center justify-between pb-3 border-b border-[#f0eff4]">
              <div className="flex items-center gap-2">
                <Link
                  to={isAuthenticated ? '/profile' : '/login'}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Account"
                  className="w-10 h-10 rounded-full bg-[#f2f1f6] flex items-center justify-center text-[#111827]"
                >
                  <User className="w-4 h-4" />
                </Link>
                <Link
                  to="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Saved artworks"
                  className="w-10 h-10 rounded-full bg-[#f2f1f6] flex items-center justify-center text-[#ff0457]"
                >
                  <Heart className="w-4 h-4" />
                </Link>
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close drawer"
                className="w-10 h-10 rounded-full bg-[#f2f1f6] flex items-center justify-center text-[#111827]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Inline Quick Search Input */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2 bg-[#f2f1f6] rounded-full px-3.5 py-2.5"
            >
              <Search className="w-4 h-4 text-[#8e8e93]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search paintings, charcoal, oil..."
                className="flex-1 bg-transparent text-[14px] text-[#111827] placeholder-[#8e8e93] focus:outline-none"
              />
            </form>

            {/* Menu Stack */}
            <nav className="flex flex-col space-y-1 text-[16px] font-medium text-[#111827]">
              <Link
                to="/gallery"
                className="flex items-center justify-between px-3 py-2.5 rounded-2xl hover:bg-[#f2f1f6]"
              >
                <span>Gallery & Showcase</span>
                <ChevronRight className="w-4 h-4 text-[#8e8e93]" />
              </Link>

              {/* Mediums Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => setMobileMediumsOpen((v) => !v)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-2xl hover:bg-[#f2f1f6] text-left"
                >
                  <span>Mediums & Styles</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#8e8e93] transition-transform ${
                      mobileMediumsOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {mobileMediumsOpen && (
                  <div className="pl-4 pr-2 py-1 space-y-1 text-[14px] text-[#3c3c43]">
                    {[
                      { label: 'All Mediums', to: '/categories' },
                      { label: 'Charcoal Portraits', to: '/gallery?medium=Charcoal' },
                      { label: 'Watercolor Art', to: '/gallery?medium=Watercolor' },
                      { label: 'Oil on Canvas', to: '/gallery?medium=Oil' },
                      { label: 'Acrylic Artworks', to: '/gallery?medium=Acrylic' },
                    ].map((sub) => (
                      <Link
                        key={sub.to}
                        to={sub.to}
                        className="block px-3 py-2 rounded-xl hover:bg-[#f2f1f6]"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                to="/custom-order"
                className="flex items-center justify-between px-3 py-2.5 rounded-2xl bg-[#ffe5ee] text-[#ff0155] font-bold"
              >
                <span className="inline-flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Commission Custom Art
                </span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>

              <Link
                to="/pricing"
                className="flex items-center justify-between px-3 py-2.5 rounded-2xl hover:bg-[#f2f1f6]"
              >
                <span>Sizing & Pricing</span>
              </Link>
              <Link
                to="/about"
                className="flex items-center justify-between px-3 py-2.5 rounded-2xl hover:bg-[#f2f1f6]"
              >
                <span>About the Artist</span>
              </Link>
              <Link
                to="/contact"
                className="flex items-center justify-between px-3 py-2.5 rounded-2xl hover:bg-[#f2f1f6]"
              >
                <span>Contact Studio</span>
              </Link>
            </nav>

            {/* Bottom Account Strip */}
            <div className="pt-3 border-t border-[#f0eff4] flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/my-orders"
                    className="flex items-center justify-between px-4 py-3 rounded-full bg-[#111827] text-white text-[14px] font-semibold"
                  >
                    <span>My Orders</span>
                    <Package className="w-4 h-4" />
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center justify-between px-4 py-2.5 rounded-full bg-[#ffe5ee] text-[#ff0155] text-[14px] font-bold"
                    >
                      <span>Artist Admin Studio</span>
                      <ShieldCheck className="w-4 h-4" />
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setLogoutConfirmOpen(true);
                    }}
                    className="text-center py-2 text-[13px] font-semibold text-[#ef4444]"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    className="text-center py-3 rounded-full bg-[#f2f1f6] text-[#111827] text-[14px] font-semibold"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="text-center py-3 rounded-full bg-[#111827] text-white text-[14px] font-semibold"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Sign out of Studio?"
        message="You can sign back in anytime to view your commission quotes and progress updates."
        confirmText="Sign Out"
        cancelText="Stay"
      />
    </>
  );
};

export default Navbar;
