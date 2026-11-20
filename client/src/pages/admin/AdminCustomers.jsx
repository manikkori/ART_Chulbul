import React, { useEffect, useState } from 'react';
import { Search, UserX, UserCheck, ShoppingBag, Eye } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { formatDate } from '../../utils/formatters';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Skeleton from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const AdminCustomers = () => {
  const { setPageTitle } = useSettings();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Customer Orders Modal
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersModalOpen, setOrdersModalOpen] = useState(false);

  useEffect(() => {
    setPageTitle('Manage Registered Customers');
    fetchCustomers();
  }, [setPageTitle]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const params = search.trim() ? { search: search.trim() } : {};
      const res = await api.get('/admin/customers', { params });
      if (res.data?.success) setCustomers(res.data.data);
    } catch (err) {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (cust) => {
    try {
      const res = await api.patch(`/admin/customers/${cust._id}/toggle-block`);
      if (res.data?.success) {
        toast.success(res.data.message);
        setCustomers((prev) =>
          prev.map((c) => (c._id === cust._id ? { ...c, isBlocked: !c.isBlocked } : c))
        );
      }
    } catch (err) {
      toast.error('Failed to change customer block status');
    }
  };

  const handleViewOrders = async (cust) => {
    setSelectedCustomer(cust);
    setOrdersModalOpen(true);
    setLoadingOrders(true);
    try {
      const res = await api.get(`/admin/customers/${cust._id}/orders`);
      if (res.data?.success) setCustomerOrders(res.data.data);
    } catch (err) {
      toast.error('Failed to load customer orders');
    } finally {
      setLoadingOrders(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-200 pb-6">
        <div>
          <span className="eyebrow">USER DIRECTORY</span>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">
            Registered Customers
          </h1>
          <p className="text-xs text-charcoal-500 mt-1">
            Review collectors, view custom commission history, or manage active status.
          </p>
        </div>
      </div>

      <div className="max-w-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchCustomers();
          }}
        >
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={Search}
          />
        </form>
      </div>

      <div className="bg-white rounded-3xl border border-cream-200 shadow-card overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            <Skeleton count={5} className="h-12" />
          </div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center">
            <EmptyState
              title="No customers found"
              description="No registered customer accounts match your search criteria."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-100/60 uppercase tracking-wider text-charcoal-500 font-semibold border-b border-cream-200">
                <tr>
                  <th className="py-3 px-6">Customer</th>
                  <th className="py-3 px-6">Email</th>
                  <th className="py-3 px-6">Total Commissions</th>
                  <th className="py-3 px-6">Joined On</th>
                  <th className="py-3 px-6">Account Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {customers.map((c) => (
                  <tr key={c._id} className="hover:bg-cream-50/60 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-cream-200 text-charcoal-700 font-bold flex items-center justify-center shrink-0">
                        {c.avatar?.url ? (
                          <img
                            src={c.avatar.url}
                            alt={c.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          c.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <span className="font-bold text-charcoal-900">{c.name}</span>
                    </td>
                    <td className="py-4 px-6 text-charcoal-700">{c.email}</td>
                    <td className="py-4 px-6 font-bold text-charcoal-900">
                      {c.orderCount || 0} Orders
                    </td>
                    <td className="py-4 px-6 text-charcoal-500">{formatDate(c.createdAt)}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          c.isBlocked
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {c.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleViewOrders(c)}
                      >
                        View Orders
                      </Button>
                      <button
                        onClick={() => handleToggleBlock(c)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          c.isBlocked
                            ? 'text-emerald-600 hover:bg-emerald-50'
                            : 'text-rose-600 hover:bg-rose-50'
                        }`}
                        title={c.isBlocked ? 'Reactivate customer' : 'Deactivate customer'}
                      >
                        {c.isBlocked ? (
                          <UserCheck className="w-4 h-4" />
                        ) : (
                          <UserX className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Orders Modal */}
      <Modal
        isOpen={ordersModalOpen}
        onClose={() => setOrdersModalOpen(false)}
        maxWidth="max-w-2xl"
        title={`Commissions by ${selectedCustomer?.name}`}
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {loadingOrders ? (
            <Skeleton count={3} className="h-16" />
          ) : customerOrders.length === 0 ? (
            <p className="text-center text-xs text-charcoal-400 py-6">
              This customer has not placed any custom orders yet.
            </p>
          ) : (
            customerOrders.map((ord) => (
              <div
                key={ord._id}
                className="p-4 rounded-2xl bg-cream-100/50 border border-cream-200 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-charcoal-900 block">{ord.orderNumber}</span>
                  <span className="text-charcoal-500">
                    {ord.medium} • {formatDate(ord.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-charcoal-800">
                    {ord.quote?.amount ? `₹${ord.quote.amount}` : 'Quote Pending'}
                  </span>
                  <Badge variant="default">{ord.status}</Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
};

export default AdminCustomers;
