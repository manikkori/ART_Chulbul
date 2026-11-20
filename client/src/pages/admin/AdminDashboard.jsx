import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  IndianRupee,
  Users,
  MessageSquare,
  Star,
  Palette,
  Clock,
  ArrowRight,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { formatPrice, formatDate, getStatusBadgeStyle } from '../../utils/formatters';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Skeleton from '../../components/common/Skeleton';
import api from '../../services/api';

export const AdminDashboard = () => {
  const { setPageTitle, siteName } = useSettings();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPageTitle('Admin Studio Dashboard');
    fetchDashboardStats();
  }, [setPageTitle]);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/dashboard');
      if (res.data?.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-8 w-48 bg-cream-300 animate-pulse rounded-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton count={4} className="h-32" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  const ordersByStatus = stats?.ordersByStatus || {};
  const statusKeys = [
    'Pending Review',
    'Quoted',
    'Accepted',
    'In Progress',
    'Completed',
    'Shipped',
    'Delivered'
  ];

  return (
    <div className="space-y-10">
      {/* Top Welcome Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-200 pb-6">
        <div>
          <span className="eyebrow">ARTIST STUDIO CONTROL</span>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">
            {siteName} Studio Overview
          </h1>
          <p className="text-xs text-charcoal-500 mt-1">
            Real-time pipeline metrics for commissions, queries, and gallery showcase.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/orders')}
          >
            Manage Orders
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/admin/artworks')}
          >
            + Add Showcase Artwork
          </Button>
        </div>
      </div>

      {/* Metric Tiles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Quoted Value */}
        <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
              Accepted Quoted Value
            </span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-charcoal-900">
            {formatPrice(stats?.quotedValue || 0)}
          </p>
          <p className="text-[11px] text-charcoal-400">
            Cumulative total of accepted & delivered works
          </p>
        </div>

        {/* New Orders This Week */}
        <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
              New Orders This Week
            </span>
            <div className="w-9 h-9 rounded-2xl bg-terracotta-50 text-terracotta-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-charcoal-900">
            {stats?.newOrdersThisWeek || 0}
          </p>
          <p className="text-[11px] text-charcoal-400">
            Commissions received in past 7 days
          </p>
        </div>

        {/* Pending Queries */}
        <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
              Inquiries Awaiting Reply
            </span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="font-serif text-3xl font-bold text-charcoal-900">
              {stats?.pendingQueries || 0}
            </p>
            {stats?.pendingQueries > 0 && (
              <Link
                to="/admin/queries"
                className="text-xs text-amber-700 hover:underline font-semibold"
              >
                Reply now →
              </Link>
            )}
          </div>
          <p className="text-[11px] text-charcoal-400">
            Customer questions in query inbox
          </p>
        </div>

        {/* Pending Reviews */}
        <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
              Pending Reviews
            </span>
            <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Star className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="font-serif text-3xl font-bold text-charcoal-900">
              {stats?.pendingReviews || 0}
            </p>
            {stats?.pendingReviews > 0 && (
              <Link
                to="/admin/reviews"
                className="text-xs text-purple-700 hover:underline font-semibold"
              >
                Review now →
              </Link>
            )}
          </div>
          <p className="text-[11px] text-charcoal-400">
            Awaiting approval for homepage display
          </p>
        </div>
      </div>

      {/* Orders Status Pipeline Breakdown */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card space-y-4">
        <h3 className="font-serif text-lg font-bold text-charcoal-900">
          Commission Status Pipeline
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {statusKeys.map((status) => {
            const count = ordersByStatus[status] || 0;
            const style = getStatusBadgeStyle(status);
            return (
              <Link
                key={status}
                to={`/admin/orders?status=${status}`}
                className="p-4 rounded-2xl border border-cream-200 bg-cream-50/50 hover:bg-cream-100 transition-colors space-y-1 block"
              >
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                  <span className="text-[11px] font-bold text-charcoal-700 truncate">
                    {status}
                  </span>
                </div>
                <p className="font-serif text-2xl font-bold text-charcoal-900">
                  {count}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl border border-cream-200 shadow-card overflow-hidden space-y-4">
        <div className="p-6 border-b border-cream-100 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-charcoal-900">
              Recent Custom Orders
            </h3>
            <p className="text-xs text-charcoal-500">
              Latest incoming commission requests from customers
            </p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-semibold text-terracotta-600 hover:text-terracotta-700 flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-100/60 uppercase tracking-wider text-charcoal-500 font-semibold border-b border-cream-200">
              <tr>
                <th className="py-3 px-6">Order</th>
                <th className="py-3 px-6">Customer</th>
                <th className="py-3 px-6">Medium & Size</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Quote (INR)</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {stats?.recentOrders?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-charcoal-400">
                    No orders placed yet.
                  </td>
                </tr>
              ) : (
                stats?.recentOrders?.map((ord) => {
                  const style = getStatusBadgeStyle(ord.status);
                  return (
                    <tr key={ord._id} className="hover:bg-cream-50/60 transition-colors">
                      <td className="py-4 px-6 font-bold text-charcoal-900">
                        {ord.orderNumber}
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-semibold text-charcoal-900">
                          {ord.customer?.name || 'Customer'}
                        </p>
                        <p className="text-[11px] text-charcoal-500">
                          {ord.customer?.email}
                        </p>
                      </td>
                      <td className="py-4 px-6 text-charcoal-700">
                        {ord.medium} ({ord.size})
                      </td>
                      <td className="py-4 px-6 text-charcoal-500">
                        {formatDate(ord.createdAt)}
                      </td>
                      <td className="py-4 px-6 font-semibold text-charcoal-900">
                        {ord.quote?.amount ? formatPrice(ord.quote.amount) : '-'}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${style.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => navigate(`/admin/orders/${ord._id}`)}
                        >
                          Manage
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
