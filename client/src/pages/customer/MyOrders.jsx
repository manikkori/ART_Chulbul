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
import { formatPrice, formatDate } from '../../utils/formatters';
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1c1a17]/10 pb-6 pt-2">
        <div>
          <div className="inline-flex items-center gap-1.5 font-caveat text-3xl text-[#f19b72]">
            <span>Collector Studio</span>
            <Sparkles className="w-4 h-4 text-[#faa9b0] inline-block" />
          </div>
          <h1 className="font-playfair text-3xl sm:text-4xl text-[#1c1a17]">
            My Custom Commissions
          </h1>
          <p className="font-sans text-xs sm:text-sm text-[#1c1a17]/65 mt-1">
            Track status, review quotes, chat with the artist, and inspect in-progress progress sketches.
          </p>
        </div>

        <button
          onClick={() => navigate('/custom-order')}
          className="bg-[#1c1a17] text-white hover:bg-black font-sans text-xs font-medium px-6 py-3 rounded-full shadow-sm hover:shadow transition-all flex items-center gap-2 shrink-0 self-start sm:self-auto"
        >
          <Paintbrush className="w-4 h-4 text-[#faa9b0]" />
          <span>New Custom Order</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setSelectedStatus(f.value)}
            className={`px-4 py-1.5 text-xs font-sans font-medium rounded-full whitespace-nowrap transition-all border ${
              selectedStatus === f.value
                ? 'bg-[#1c1a17] text-white border-[#1c1a17] shadow-sm'
                : 'bg-[#f8f4ea] text-[#1c1a17] border-[#d4a373]/30 hover:bg-[#f1e8d6]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton count={3} className="h-32 rounded-[2rem] bg-white border border-[#1c1a17]/10" />
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
              className="bg-white rounded-[2rem] border border-[#1c1a17]/10 p-6 shadow-[0_8px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              {/* Order Info */}
              <div className="flex items-start gap-4">
                {ord.referenceImages?.[0]?.url ? (
                  <img
                    src={ord.referenceImages[0].url}
                    alt="Reference"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-[#1c1a17]/10 shadow-2xs shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#f8f4ea] rounded-2xl border border-[#d4a373]/30 flex items-center justify-center shrink-0">
                    <Paintbrush className="w-8 h-8 text-[#d4a373]" />
                  </div>
                )}

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-sans font-semibold text-sm text-[#1c1a17]">
                      Order #{ord.orderNumber || ord._id.substring(18)}
                    </span>
                    <span className="bg-[#f8f4ea] border border-[#d4a373]/30 font-sans text-[11px] font-medium px-2.5 py-0.5 rounded-full text-[#1c1a17]">
                      {ord.status}
                    </span>
                  </div>

                  <p className="font-playfair text-sm text-[#1c1a17]">
                    {ord.medium} • {ord.size}
                  </p>

                  <p className="font-sans text-xs text-[#1c1a17]/65 line-clamp-1 max-w-md">
                    {ord.description}
                  </p>

                  <p className="font-sans text-[11px] text-[#1c1a17]/50">
                    Placed on {formatDate(ord.createdAt)}
                  </p>
                </div>
              </div>

              {/* Status & Action */}
              <div className="flex md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#1c1a17]/10">
                <div className="text-right">
                  <span className="font-sans text-[11px] font-medium text-[#1c1a17]/60 block">
                    {ord.finalPrice ? 'Agreed Price' : 'Estimated Quote'}
                  </span>
                  <span className="font-sans text-base sm:text-lg font-bold text-[#1c1a17]">
                    {ord.finalPrice ? formatPrice(ord.finalPrice) : 'Pending Review'}
                  </span>
                </div>

                <Link
                  to={`/my-orders/${ord._id}`}
                  className="bg-[#1c1a17] text-white hover:bg-black font-sans text-xs font-medium px-5 py-2.5 rounded-full shadow-2xs flex items-center gap-1.5 transition-all"
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
