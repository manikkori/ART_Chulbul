import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import ScribbleStackLoader from './components/common/ScribbleStackLoader';
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';

// Public Pages
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Categories from './pages/Categories';
import CategoryDetail from './pages/CategoryDetail';
import ArtworkDetail from './pages/ArtworkDetail';
import About from './pages/About';
import PricingGuide from './pages/PricingGuide';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import RefundPolicy from './pages/RefundPolicy';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';

// Customer Private Pages
import CustomOrderForm from './pages/customer/CustomOrderForm';
import MyOrders from './pages/customer/MyOrders';
import OrderDetail from './pages/customer/OrderDetail';
import Profile from './pages/customer/Profile';
import Wishlist from './pages/customer/Wishlist';

// Admin Studio Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminOrderDetail from './pages/admin/AdminOrderDetail';
import AdminArtworks from './pages/admin/AdminArtworks';
import AdminCategories from './pages/admin/AdminCategories';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminQueries from './pages/admin/AdminQueries';
import AdminReviews from './pages/admin/AdminReviews';
import AdminAboutManager from './pages/admin/AdminAboutManager';
import AdminSiteSettings from './pages/admin/AdminSiteSettings';

export const App = () => {
  const [showIntro, setShowIntro] = useState(
    () => typeof window !== 'undefined' && window.location.pathname === '/'
  );

  return (
    <>
      {showIntro && <ScribbleStackLoader onComplete={() => setShowIntro(false)} />}

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3200,
          style: {
            background: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(14px)',
            color: '#111827',
            border: '1px solid #e5e5ea',
            borderRadius: '120px',
            padding: '10px 18px',
            fontSize: '0.84rem',
            fontWeight: 500,
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.09)',
          },
          success: {
            iconTheme: {
              primary: '#ff0457',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />

      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:slug" element={<CategoryDetail />} />
          <Route path="/artworks/:slug" element={<ArtworkDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<PricingGuide />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/refund" element={<RefundPolicy />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Customer Area Routes */}
          <Route path="/custom-order" element={<CustomOrderForm />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/my-orders/:id" element={<OrderDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/wishlist" element={<Wishlist />} />

          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin Studio Protected Area */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id" element={<AdminOrderDetail />} />
          <Route path="artworks" element={<AdminArtworks />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="queries" element={<AdminQueries />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="about" element={<AdminAboutManager />} />
          <Route path="settings" element={<AdminSiteSettings />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
