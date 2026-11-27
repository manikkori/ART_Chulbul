import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Paintbrush,
  Eye,
  MessageSquare,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
  Heart
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-20 pt-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#121212] pb-6">
        <div>
          <div className="inline-flex items-center gap-1 font-script text-3xl text-[#121212]">
            <span>Order Dashboard</span>
            <Heart className="w-4 h-4 text-[#dc8da3] fill-[#f7cbd7] inline-block" />
          </div>
          <h1 className="font-montserrat font-extrabold text-2xl sm:text-4xl text-[#121212] uppercase tracking-[0.06em]">
            MY CUSTOM COMMISSIONS
          </h1>
          <p className="font-sans text-xs sm:text-sm text-gray-600 mt-1">
            Track status, review quotes, chat with the artist, and inspect in-progress photos.
          </p>
        </div>

        <button
          onClick={() => navigate('/custom-order')}
          className="bg-[#121212] text-white hover:bg-black font-montserrat text-xs font-bold uppercase tracking-wider px-6 py-3 border-2 border-[#121212] shadow-[3px_3px_0px_#f7cbd7] flex items-center gap-2 shrink-0"
        >
          <Paintbrush className="w-4 h-4 text-[#f7cbd7]" />
          <span>New Custom Order</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setSelectedStatus(f.value)}
            className={`px-4 py-1.5 text-xs font-montserrat font-bold uppercase tracking-wider whitespace-nowrap transition-all border-2 border-[#121212] ${
              selectedStatus === f.value
                ? 'bg-[#121212] text-white shadow-[2px_2px_0px_#f7cbd7]'
                : 'bg-white text-gray-700 hover:bg-[#fde8ef]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton count={3} className="h-32 border-2 border-[#121212]" />
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          title="No custom orders found"
          description={
            selectedStatus === 'all'
              ? 'You have not commissioned any custom artwork yet. Start by sharing your reference photograph!'
              : `No orders currently in "${selectedStatus}" status.`
          }
          actionText="Commission Custom Artwork"
          onAction={() => navigate('/custom-order')}
        />
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div
              key={ord._id}
              className="bg-white border-2 border-[#121212] p-6 shadow-[5px_5px_0px_#f7cbd7] hover:shadow-[7px_7px_0px_#ebb0c0] hover:-translate-y-0.5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              {/* Order Info */}
              <div className="flex items-start gap-4">
                {ord.referenceImages?.[0]?.url ? (
                  <img
                    src={ord.referenceImages[0].url}
                    alt="Reference"
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover border-2 border-[#121212] shadow-[2px_2px_0px_#f7cbd7] shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#fde8ef] border-2 border-[#121212] flex items-center justify-center shrink-0">
                    <Paintbrush className="w-8 h-8 text-[#121212]" />
                  </div>
                )}

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-montserrat font-extrabold text-sm uppercase text-[#121212]">
                      Order #{ord.orderNumber || ord._id.substring(18)}
                    </span>
                    <span className="bg-[#fde8ef] border border-[#121212] font-montserrat text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 text-[#121212]">
                      {ord.status}
                    </span>
                  </div>

                  <p className="font-montserrat text-xs font-bold text-gray-700">
                    {ord.medium} • {ord.size}
                  </p>

                  <p className="font-sans text-xs text-gray-500 line-clamp-1 max-w-md">
                    {ord.description}
                  </p>

                  <p className="font-montserrat text-[11px] text-gray-400">
                    Placed on {formatDate(ord.createdAt)}
                  </p>
                </div>
              </div>

              {/* Status & Action */}
              <div className="flex md:flex-col items-center md:items-end justify-between gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#f7cbd7]">
                <div className="text-right">
                  <span className="font-montserrat text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                    {ord.finalPrice ? 'Agreed Price' : 'Estimated Quote'}
                  </span>
                  <span className="font-montserrat text-base sm:text-lg font-extrabold text-[#121212]">
                    {ord.finalPrice ? formatPrice(ord.finalPrice) : 'Pending Review'}
                  </span>
                </div>

                <Link
                  to={`/my-orders/${ord._id}`}
                  className="bg-[#121212] text-white hover:bg-black font-montserrat text-xs font-bold uppercase tracking-wider px-4 py-2 border-2 border-[#121212] shadow-[2px_2px_0px_#f7cbd7] flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Manage Order</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
