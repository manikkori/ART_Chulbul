import React, { useState } from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Palette,
  FolderTree,
  Users,
  MessageSquare,
  Star,
  UserCheck,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import Button from '../common/Button';

export const AdminLayout = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { siteName } = useSettings();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If not admin, redirect
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-cream-200 text-center space-y-4 shadow-card">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-charcoal-900">
            Admin Access Required
          </h2>
          <p className="text-xs text-charcoal-600 leading-relaxed">
            You must be logged in as an administrator to access the {siteName} management studio.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Button variant="primary" onClick={() => navigate('/login')}>
              Sign In as Admin
            </Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const menuItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Custom Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Artworks Showcase', path: '/admin/artworks', icon: Palette },
    { label: 'Categories / Mediums', path: '/admin/categories', icon: FolderTree },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Queries Inbox', path: '/admin/queries', icon: MessageSquare },
    { label: 'Customer Reviews', path: '/admin/reviews', icon: Star },
    { label: 'About Page Manager', path: '/admin/about', icon: UserCheck },
    { label: 'Site Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#fdf7f1] flex flex-col md:flex-row text-[#3d2c33]">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-[#eadfd9] p-4 flex items-center justify-between">
        <Link to="/admin" className="font-display text-xl font-bold text-[#3d2c33] flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#b0456f] text-white flex items-center justify-center">
            <Palette className="w-3.5 h-3.5" />
          </div>
          <span>{siteName} Studio</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl text-[#3d2c33] hover:bg-[#fdf7f1]"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-white border-r border-[#eadfd9] flex flex-col justify-between
          transition-transform duration-300 ease-in-out md:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Studio Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-full bg-[#b0456f] text-white flex items-center justify-center shadow-[2px_2px_0px_#f6dcb0]">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display text-lg font-bold tracking-tight text-[#3d2c33] block group-hover:text-[#b0456f] transition-colors">
                {siteName}
              </span>
              <span className="text-[10px] font-display uppercase tracking-widest text-[#b0456f] font-bold">
                Admin Studio
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-display font-semibold transition-all ${
                      isActive
                        ? 'bg-[#b0456f] text-white shadow-[2px_2px_0px_#f6dcb0]'
                        : 'text-[#3d2c33] hover:bg-[#fdf7f1] hover:text-[#b0456f]'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#eadfd9] bg-[#fdf7f1]/50 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-display font-medium text-[#6e5a60] hover:text-[#b0456f] hover:bg-white"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-display font-medium text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Studio Workspace */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
