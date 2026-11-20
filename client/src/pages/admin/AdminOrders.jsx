import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Eye, Filter, X, ShoppingBag } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { formatPrice, formatDate, getStatusBadgeStyle } from '../../utils/formatters';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import Skeleton from '../../components/common/Skeleton';
import api from '../../services/api';

const STATUS_OPTIONS = [
  'all',
  'Pending Review',
  'Quoted',
  'Accepted',
  'In Progress',
  'Completed',
  'Shipped',
  'Delivered',
  'Declined',
  'Rejected',
  'Cancelled'
];

export const AdminOrders = () => {
  const { setPageTitle } = useSettings();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0 });

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState(searchParams.get('status') || 'all');

  useEffect(() => {
    setPageTitle('Manage Custom Orders');
    fetchOrders(1);
  }, [status, setPageTitle]);

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 12,
        status: status !== 'all' ? status : undefined,
        search: search.trim() ? search.trim() : undefined
      };
      const res = await api.get('/admin/orders', { params });
      if (res.data?.success) {
        setOrders(res.data.data);
        if (res.data.meta) setMeta(res.data.meta);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrders(1);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-200 pb-6">
        <div>
          <span className="eyebrow">ORDER MANAGEMENT</span>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">
            Custom Art Commissions
          </h1>
          <p className="text-xs text-charcoal-500 mt-1">
            Review references, dispatch price quotes, upload progress photos, and coordinate shipping.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-cream-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleSearch} className="w-full md:max-w-md relative flex items-center">
            <Input
              placeholder="Search by order number, customer name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={Search}
              className="py-2.5"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  fetchOrders(1);
                }}
                className="absolute right-3 text-charcoal-400"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-semibold uppercase text-charcoal-500">
              Status:
            </span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-cream-100 border border-cream-300 rounded-full px-4 py-2 text-xs font-medium text-charcoal-800"
            >
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  {st === 'all' ? 'All Statuses' : st}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-cream-200 shadow-card overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            <Skeleton count={5} className="h-12" />
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <EmptyState
              icon={ShoppingBag}
              title="No orders found"
              description="No custom orders match your current search or status filter."
              actionText="Reset Filter"
              onAction={() => {
                setStatus('all');
                setSearch('');
              }}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-100/60 uppercase tracking-wider text-charcoal-500 font-semibold border-b border-cream-200">
                <tr>
                  <th className="py-3 px-6">Order ID</th>
                  <th className="py-3 px-6">Customer</th>
                  <th className="py-3 px-6">Medium & Size</th>
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-6">Quote (INR)</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {orders.map((ord) => {
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
                          icon={Eye}
                          onClick={() => navigate(`/admin/orders/${ord._id}`)}
                        >
                          Manage
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && (
        <Pagination
          currentPage={meta.page}
          totalPages={meta.pages}
          onPageChange={(p) => fetchOrders(p)}
        />
      )}
    </div>
  );
};

export default AdminOrders;
