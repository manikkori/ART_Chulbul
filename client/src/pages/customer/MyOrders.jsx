import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Paintbrush,
  Eye,
  MessageSquare,
  Clock,
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { formatPrice, formatDate, getStatusBadgeStyle } from '../../utils/formatters';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import Skeleton from '../../components/common/Skeleton';
import api from '../../services/api';

const STATUS_FILTERS = [
  { label: 'All Orders', value: 'all' },
  { label: 'Pending Review', value: 'Pending Review' },
  { label: 'Quote Received', value: 'Quoted' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Shipped', value: 'Shipped' },
  { label: 'Delivered', value: 'Delivered' }
];

export const MyOrders = () => {
  const { setPageTitle } = useSettings();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    setPageTitle('My Custom Orders');
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [isAuthenticated, authLoading, selectedStatus, setPageTitle]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = selectedStatus !== 'all' ? { status: selectedStatus } : {};
      const res = await api.get('/orders/my', { params });
      if (res.data?.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="eyebrow">ORDER DASHBOARD</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
            My Custom Commissions
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Track status, review quotes, chat with the artist, and inspect progress photos.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Paintbrush}
          onClick={() => navigate('/custom-order')}
        >
          New Custom Order
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-cream-200">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setSelectedStatus(f.value)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedStatus === f.value
                ? 'bg-terracotta-500 text-white shadow-sm'
                : 'bg-white text-charcoal-700 hover:bg-cream-100 border border-cream-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton count={3} className="h-44" />
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          title="No custom orders found"
          description={
            selectedStatus === 'all'
              ? "You haven't placed any custom art commissions yet. Turn your memories into handcrafted art today!"
              : `You have no custom orders currently in "${selectedStatus}" status.`
          }
          actionText="Place Your First Order"
          onAction={() => navigate('/custom-order')}
        />
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const badgeStyle = getStatusBadgeStyle(order.status);
            const coverThumb = order.referenceImages?.[0]?.url;

            return (
              <div
                key={order._id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card hover:shadow-soft-hover transition-all space-y-6"
              >
                {/* Top Row: Order Number & Status Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cream-100 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-lg font-bold text-charcoal-900">
                        {order.orderNumber}
                      </span>
                      <span className="text-xs text-charcoal-400">
                        • Placed {formatDate(order.createdAt, true)}
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-500">
                      {order.medium} — {order.size}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badgeStyle.bg}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${badgeStyle.dot}`} />
                      {badgeStyle.label}
                    </span>
                  </div>
                </div>

                {/* Middle Row: Reference Thumbnails & Details */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Left: Thumbnail & Photos Count */}
                  <div className="md:col-span-3 flex items-center gap-3">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-cream-200 border border-cream-200 shrink-0">
                      <img
                        src={coverThumb}
                        alt="Reference"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-1 text-xs">
                      <p className="font-semibold text-charcoal-800">
                        {order.referenceImages?.length || 1} Reference Photo(s)
                      </p>
                      <p className="text-charcoal-500">
                        {order.preferences?.subjectsCount || 1} Subject(s)
                      </p>
                    </div>
                  </div>

                  {/* Center: Quote info if Quoted/Accepted */}
                  <div className="md:col-span-5 bg-cream-100/50 p-4 rounded-2xl border border-cream-200 space-y-1">
                    <p className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-500">
                      Quote Status
                    </p>
                    {order.quote?.amount ? (
                      <div className="flex items-baseline gap-2">
                        <span className="font-serif text-xl font-bold text-terracotta-600">
                          {formatPrice(order.quote.amount)}
                        </span>
                        <span className="text-xs text-charcoal-500">
                          (Estimated: {order.quote.estimatedDays} days)
                        </span>
                      </div>
                    ) : (
                      <p className="text-xs text-charcoal-600 italic">
                        Artist is reviewing reference photos. Quote pending.
                      </p>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-2 justify-end">
                    <Button
                      variant="primary"
                      size="sm"
                      icon={Eye}
                      onClick={() => navigate(`/my-orders/${order._id}`)}
                    >
                      View Details & Timeline
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      icon={MessageSquare}
                      onClick={() => navigate(`/my-orders/${order._id}#chat`)}
                    >
                      Chat with Artist
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
