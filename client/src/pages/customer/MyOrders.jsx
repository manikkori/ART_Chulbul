import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Eye, Paintbrush } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { formatPrice, formatDate, getStatusBadgeStyle } from '../../utils/formatters';
import EmptyState from '../../components/common/EmptyState';
import { Skeleton } from '../../components/common/Skeleton';
import api from '../../services/api';

const STATUS_FILTERS = [
  { label: 'All Orders', value: 'all' },
  { label: 'Pending Review', value: 'Pending Review' },
  { label: 'Quote Received', value: 'Quoted' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Shipped', value: 'Shipped' },
  { label: 'Delivered', value: 'Delivered' },
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
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, authLoading, selectedStatus, setPageTitle]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = selectedStatus !== 'all' ? { status: selectedStatus } : {};
      const res = await api.get('/orders/my', { params });
      if (res.data?.success) {
        setOrders(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 pb-20 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="eyebrow">Commission Dashboard</span>
          <h1 className="editorial-serif text-4xl sm:text-5xl text-[#111827] font-normal mt-0.5">
            My Custom Orders
          </h1>
          <p className="text-[13px] sm:text-[14px] text-[#6e6e73] mt-1">
            Review quotes, follow progress snapshots, and message the artist directly.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/custom-order')}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#ff0457] hover:bg-[#d90349] text-white text-[13px] font-bold shadow-[0_8px_22px_rgba(255,4,87,0.28)] transition-all hover:-translate-y-0.5 shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>New Commission</span>
        </button>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {STATUS_FILTERS.map((f) => (
          <button
            type="button"
            key={f.value}
            onClick={() => setSelectedStatus(f.value)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all ${
              selectedStatus === f.value
                ? 'bg-[#111827] text-white shadow-xs'
                : 'bg-white text-[#3c3c43] border border-[#e5e5ea] hover:border-[#111827]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-3">
          <Skeleton count={3} className="h-32 rounded-[24px]" />
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={Paintbrush}
          title="No commissions found"
          description={
            selectedStatus === 'all'
              ? 'You have not commissioned a custom painting yet. Share your photo to start!'
              : `No orders currently in "${selectedStatus}" status.`
          }
          actionText="Commission Custom Art"
          onAction={() => navigate('/custom-order')}
        />
      ) : (
        <div className="space-y-3.5">
          {orders.map((ord) => {
            const badgeStyle = getStatusBadgeStyle(ord.status);
            return (
              <div
                key={ord._id}
                className="rounded-[24px] bg-white border border-[#eae9ee] p-4 sm:p-6 shadow-[0_6px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                <div className="flex items-start gap-4">
                  {ord.referenceImages?.[0]?.url ? (
                    <img
                      src={ord.referenceImages[0].url}
                      alt="Reference"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-[16px] object-cover border border-[#eae9ee] shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[16px] bg-[#ffe5ee] flex items-center justify-center shrink-0">
                      <Paintbrush className="w-7 h-7 text-[#ff0457]" />
                    </div>
                  )}

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[14px] font-bold text-[#111827]">
                        Order #{ord.orderNumber || ord._id.substring(18)}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badgeStyle.bg}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`} />
                        {ord.status}
                      </span>
                    </div>

                    <p className="text-[13px] font-semibold text-[#3c3c43]">
                      {ord.medium} • {ord.size}
                    </p>

                    <p className="text-[12px] text-[#6e6e73] line-clamp-1 max-w-md">
                      {ord.description}
                    </p>

                    <p className="text-[11px] text-[#8e8e93]">
                      Placed on {formatDate(ord.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between gap-2.5 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#f2f1f6]">
                  <div className="md:text-right">
                    <span className="text-[11px] font-semibold text-[#8e8e93] block">
                      {ord.finalPrice ? 'Agreed Price' : 'Quote Status'}
                    </span>
                    <span className="text-[16px] font-bold text-[#111827]">
                      {ord.finalPrice ? formatPrice(ord.finalPrice) : 'Pending Review'}
                    </span>
                  </div>

                  <Link
                    to={`/my-orders/${ord._id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#111827] hover:bg-black text-white text-[12px] font-semibold transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Order</span>
                  </Link>
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
