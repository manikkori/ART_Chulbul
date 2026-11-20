import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Camera,
  Maximize2,
  Download,
  Send,
  Truck,
  Paintbrush,
  CheckCircle2,
  XCircle,
  FileText,
  DollarSign,
  AlertTriangle,
  X
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { formatPrice, formatDate, getStatusBadgeStyle } from '../../utils/formatters';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import StatusTimeline from '../../components/common/StatusTimeline';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const AdminOrderDetail = () => {
  const { id } = useParams();
  const { setPageTitle } = useSettings();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Quote Modal state
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteAmount, setQuoteAmount] = useState('');
  const [quoteDays, setQuoteDays] = useState(7);
  const [quoteNote, setQuoteNote] = useState('');
  const [submittingQuote, setSubmittingQuote] = useState(false);

  // Status Change state
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Reject Modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [submittingReject, setSubmittingReject] = useState(false);

  // Progress Update Modal state
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [progressCaption, setProgressCaption] = useState('');
  const [progressFile, setProgressFile] = useState(null);
  const [uploadingProgress, setUploadingProgress] = useState(false);

  // Shipping Modal state
  const [shippingModalOpen, setShippingModalOpen] = useState(false);
  const [courierName, setCourierName] = useState('BlueDart Express');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [updatingShipping, setUpdatingShipping] = useState(false);

  // Internal Admin Notes state
  const [adminNotes, setAdminNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  // Chat states
  const [messages, setMessages] = useState([]);
  const [chatText, setChatText] = useState('');
  const [chatSending, setChatSending] = useState(false);
  const chatBottomRef = useRef(null);

  // Lightbox
  const [activeLightboxImg, setActiveLightboxImg] = useState(null);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      if (res.data?.success) {
        const ord = res.data.data;
        setOrder(ord);
        setSelectedStatus(ord.status);
        setAdminNotes(ord.adminNotes || '');
        if (ord.quote?.amount) {
          setQuoteAmount(ord.quote.amount);
          setQuoteDays(ord.quote.estimatedDays || 7);
          setQuoteNote(ord.quote.note || '');
        }
        setPageTitle(`Manage Order ${ord.orderNumber}`);
      }
    } catch (err) {
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/messages/${id}`);
      if (res.data?.success) {
        setMessages(res.data.data);
      }
    } catch (err) {
      // Quiet fail if polling
    }
  };

  useEffect(() => {
    fetchOrder();
    fetchMessages();
    const interval = setInterval(fetchMessages, 3500);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Actions
  const handleSendQuote = async (e) => {
    e.preventDefault();
    if (!quoteAmount || Number(quoteAmount) <= 0) {
      toast.error('Please enter a valid price in INR.');
      return;
    }
    setSubmittingQuote(true);
    try {
      const res = await api.post(`/admin/orders/${id}/quote`, {
        amount: quoteAmount,
        estimatedDays: quoteDays,
        note: quoteNote
      });
      if (res.data?.success) {
        toast.success('Quote sent to customer successfully!');
        setQuoteModalOpen(false);
        fetchOrder();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send quote');
    } finally {
      setSubmittingQuote(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (selectedStatus === order.status) return;
    setUpdatingStatus(true);
    try {
      const res = await api.put(`/admin/orders/${id}/status`, {
        status: selectedStatus,
        note: statusNote
      });
      if (res.data?.success) {
        toast.success(`Status updated to ${selectedStatus}`);
        setStatusNote('');
        fetchOrder();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleRejectOrder = async () => {
    if (!rejectReason.trim()) {
      toast.error('Please specify rejection reason.');
      return;
    }
    setSubmittingReject(true);
    try {
      const res = await api.post(`/admin/orders/${id}/reject`, {
        reason: rejectReason
      });
      if (res.data?.success) {
        toast.success('Order marked as rejected.');
        setRejectModalOpen(false);
        fetchOrder();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject order');
    } finally {
      setSubmittingReject(false);
    }
  };

  const handleUploadProgress = async (e) => {
    e.preventDefault();
    if (!progressFile) {
      toast.error('Please select a photo to upload');
      return;
    }
    setUploadingProgress(true);
    try {
      const formData = new FormData();
      formData.append('image', progressFile);
      formData.append('caption', progressCaption);

      const res = await api.post(`/admin/orders/${id}/progress`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data?.success) {
        toast.success('Progress photo uploaded and shared with customer!');
        setProgressModalOpen(false);
        setProgressFile(null);
        setProgressCaption('');
        fetchOrder();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload progress photo');
    } finally {
      setUploadingProgress(false);
    }
  };

  const handleUpdateShipping = async (e) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      toast.error('Please enter tracking number');
      return;
    }
    setUpdatingShipping(true);
    try {
      const res = await api.put(`/admin/orders/${id}/shipping`, {
        courier: courierName,
        trackingNumber,
        trackingUrl
      });
      if (res.data?.success) {
        toast.success('Order marked as Shipped and courier details dispatched!');
        setShippingModalOpen(false);
        fetchOrder();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update shipping');
    } finally {
      setUpdatingShipping(false);
    }
  };

  const handleSaveAdminNotes = async () => {
    setSavingNotes(true);
    try {
      await api.put(`/admin/orders/${id}/notes`, { adminNotes });
      toast.success('Internal notes saved');
    } catch (err) {
      toast.error('Failed to save notes');
    } finally {
      setSavingNotes(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatText.trim()) return;
    setChatSending(true);
    try {
      const res = await api.post(`/messages/${id}`, { text: chatText });
      if (res.data?.success) {
        setChatText('');
        setMessages((prev) => [...prev, res.data.data]);
      }
    } catch (err) {
      toast.error('Failed to send message');
    } finally {
      setChatSending(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-32 bg-cream-300 animate-pulse rounded-full" />
        <Skeleton className="h-44" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-6 text-center py-16 bg-white rounded-3xl p-8 border border-cream-200">
        <h2 className="font-display text-2xl font-bold text-[#3d2c33]">Order Not Found</h2>
        <p className="font-sans text-xs text-[#6e5a60]">This order could not be loaded or may have been deleted.</p>
        <Button variant="primary" onClick={() => navigate('/admin/orders')}>
          Back to Orders
        </Button>
      </div>
    );
  }
  const badgeStyle = getStatusBadgeStyle(order.status);

  return (
    <div className="space-y-8 pb-16">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-200 pb-4">
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-600 hover:text-terracotta-600"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setQuoteModalOpen(true)}
          >
            {order.quote?.amount ? 'Update Quote' : 'Send Quote'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={Paintbrush}
            onClick={() => setProgressModalOpen(true)}
          >
            Upload Progress Photo
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={Truck}
            onClick={() => setShippingModalOpen(true)}
          >
            Add Courier / Ship
          </Button>

          {['Pending Review', 'Quoted'].includes(order.status) && (
            <Button
              variant="ghost"
              size="sm"
              className="text-rose-600 hover:bg-rose-50"
              onClick={() => setRejectModalOpen(true)}
            >
              Reject Order
            </Button>
          )}
        </div>
      </div>

      {/* Main Order Info Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
              {order.orderNumber}
            </h1>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badgeStyle.bg}`}
            >
              <span className={`w-2 h-2 rounded-full ${badgeStyle.dot}`} />
              {badgeStyle.label}
            </span>
          </div>
          <p className="text-xs text-charcoal-500">
            Placed {formatDate(order.createdAt, true)} • Medium: {order.medium} • Size: {order.size}
          </p>
        </div>

        {/* Status Transition Control */}
        <div className="flex items-center gap-2 bg-cream-100 p-2 rounded-2xl border border-cream-200">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-white border border-cream-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-charcoal-800"
          >
            <option value="Pending Review">Pending Review</option>
            <option value="Quoted">Quoted</option>
            <option value="Accepted">Accepted</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Declined">Declined</option>
            <option value="Rejected">Rejected</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <Button
            variant="primary"
            size="sm"
            loading={updatingStatus}
            disabled={selectedStatus === order.status}
            onClick={handleUpdateStatus}
          >
            Save Status
          </Button>
        </div>
      </div>

      {/* Visual Timeline */}
      <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-card space-y-4">
        <h3 className="font-serif text-base font-bold text-charcoal-900">
          Order Lifecycle Timeline
        </h3>
        <StatusTimeline
          currentStatus={order.status}
          statusHistory={order.statusHistory}
        />
      </div>

      {/* Two Column Grid: References & Details (Left) vs Chat & Notes (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column */}
        <div className="lg:col-span-6 space-y-6">
          {/* Reference Photos */}
          <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-card space-y-4">
            <h3 className="font-serif text-lg font-bold text-charcoal-900">
              Customer Reference Photos ({order.referenceImages?.length || 0})
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {order.referenceImages?.map((img, idx) => (
                <div
                  key={idx}
                  className="aspect-square rounded-2xl overflow-hidden bg-cream-200 border border-cream-200 relative group cursor-zoom-in"
                  onClick={() => setActiveLightboxImg(img.url)}
                >
                  <img
                    src={img.url}
                    alt={`Reference ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <a
                    href={img.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    download
                    className="absolute bottom-2 right-2 p-1.5 rounded-full bg-charcoal-900/70 text-white hover:bg-terracotta-500 transition-colors"
                    title="Open original"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Customer & Address Details */}
          <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-card space-y-4 text-xs">
            <h3 className="font-serif text-base font-bold text-charcoal-900 border-b border-cream-100 pb-2">
              Customer & Delivery Address
            </h3>
            <div className="space-y-2">
              <p>
                <span className="text-charcoal-400 font-semibold uppercase">Customer Name:</span>{' '}
                <strong className="text-charcoal-900">{order.customer?.name}</strong>
              </p>
              <p>
                <span className="text-charcoal-400 font-semibold uppercase">Email:</span>{' '}
                <span className="text-charcoal-800">{order.customer?.email}</span>
              </p>
              <p>
                <span className="text-charcoal-400 font-semibold uppercase">Phone:</span>{' '}
                <span className="text-charcoal-800">{order.addressSnapshot?.phone || '-'}</span>
              </p>
              <p className="pt-2 border-t border-cream-100">
                <span className="text-charcoal-400 font-semibold uppercase block">Shipping Address:</span>
                <span className="text-charcoal-800 leading-relaxed block mt-0.5">
                  {order.addressSnapshot?.recipientName}, {order.addressSnapshot?.street}, {order.addressSnapshot?.city}, {order.addressSnapshot?.state} - {order.addressSnapshot?.postalCode}
                </span>
              </p>
            </div>
          </div>

          {/* Customer Requirements */}
          <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-card space-y-3 text-xs">
            <h3 className="font-serif text-base font-bold text-charcoal-900 border-b border-cream-100 pb-2">
              Commission Instructions
            </h3>
            <div>
              <span className="text-charcoal-400 font-semibold uppercase block">Description:</span>
              <p className="text-charcoal-800 mt-1 whitespace-pre-line leading-relaxed">
                {order.description}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-cream-100">
              <p>
                <span className="text-charcoal-400 font-semibold uppercase">Subjects:</span>{' '}
                <strong>{order.preferences?.subjectsCount}</strong>
              </p>
              <p>
                <span className="text-charcoal-400 font-semibold uppercase">Background:</span>{' '}
                <strong>{order.preferences?.background}</strong>
              </p>
            </div>
            {order.preferences?.specialInstructions && (
              <div className="pt-2 border-t border-cream-100">
                <span className="text-charcoal-400 font-semibold uppercase block">Special Notes:</span>
                <p className="text-charcoal-800 mt-0.5">{order.preferences.specialInstructions}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Chat & Internal Admin Notes */}
        <div className="lg:col-span-6 space-y-6">
          {/* Order Chat */}
          <div className="bg-white rounded-3xl border border-cream-200 shadow-card overflow-hidden flex flex-col h-[520px]">
            <div className="p-4 border-b border-cream-200 bg-cream-100/60 flex items-center justify-between">
              <h3 className="font-serif text-sm font-bold text-charcoal-900">
                Order Chat with {order.customer?.name || order.addressSnapshot?.recipientName || 'Customer'}
              </h3>
              <span className="text-[10px] text-charcoal-400">Live thread</span>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-cream-50/40">
              {messages.length === 0 ? (
                <div className="text-center py-16 text-xs text-charcoal-400">
                  No chat messages yet.
                </div>
              ) : (
                messages.map((msg) => {
                  const isArtist = msg.sender?.role === 'admin';
                  const senderName = isArtist ? 'You (Artist)' : (msg.sender?.name || order.customer?.name || order.addressSnapshot?.recipientName || 'Customer');
                  return (
                    <div
                      key={msg._id}
                      className={`flex flex-col ${isArtist ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 text-[10px] text-charcoal-400 mb-1 px-1">
                        <span>{senderName}</span>
                        <span>•</span>
                        <span>{formatDate(msg.createdAt, true)}</span>
                      </div>
                      <div
                        className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                          isArtist
                            ? 'bg-terracotta-500 text-white rounded-tr-none'
                            : 'bg-white text-charcoal-900 border border-cream-200 rounded-tl-none shadow-sm'
                        }`}
                      >
                        <p className="whitespace-pre-line">{msg.text}</p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatBottomRef} />
            </div>

            <form
              onSubmit={handleSendMessage}
              className="p-3 border-t border-cream-200 bg-white flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Reply to customer..."
                value={chatText}
                onChange={(e) => setChatText(e.target.value)}
                className="flex-1 bg-cream-100 border border-cream-300 rounded-full px-4 py-2 text-xs text-charcoal-900"
              />
              <Button type="submit" variant="primary" size="sm" loading={chatSending}>
                Send
              </Button>
            </form>
          </div>

          {/* Internal Admin Notes */}
          <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-sm font-bold text-charcoal-900">
                Internal Studio Notes (Private)
              </h3>
              <Button
                variant="secondary"
                size="sm"
                loading={savingNotes}
                onClick={handleSaveAdminNotes}
              >
                Save Notes
              </Button>
            </div>
            <textarea
              rows={3}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Private notes (materials needed, pigment mix formulas, courier notes)..."
              className="w-full p-3 rounded-2xl bg-cream-50 border border-cream-300 text-xs text-charcoal-900"
            />
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {activeLightboxImg && (
        <div className="fixed inset-0 z-50 bg-charcoal-900/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setActiveLightboxImg(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/20 text-white"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={activeLightboxImg}
            alt="Reference preview"
            className="max-w-full max-h-[85vh] object-contain rounded-2xl"
          />
        </div>
      )}

      {/* Quote Modal */}
      <Modal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        title="Send / Update Quote"
        subtitle={`Set price in INR and estimated delivery timeline for order ${order.orderNumber}`}
      >
        <form onSubmit={handleSendQuote} className="space-y-4">
          <Input
            label="Quote Amount in INR (₹)"
            type="number"
            placeholder="e.g. 3499"
            value={quoteAmount}
            onChange={(e) => setQuoteAmount(e.target.value)}
            required
          />

          <Input
            label="Estimated Handcrafting Days"
            type="number"
            placeholder="e.g. 7"
            value={quoteDays}
            onChange={(e) => setQuoteDays(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold uppercase text-charcoal-700 mb-1">
              Note for Customer (Optional)
            </label>
            <textarea
              rows={3}
              value={quoteNote}
              onChange={(e) => setQuoteNote(e.target.value)}
              placeholder="e.g. Quote includes 300gsm cold-pressed cotton paper and protective fixative..."
              className="w-full p-3 rounded-2xl bg-cream-50 border border-cream-300 text-xs text-charcoal-900"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-cream-100">
            <Button variant="secondary" onClick={() => setQuoteModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submittingQuote}>
              Dispatch Quote
            </Button>
          </div>
        </form>
      </Modal>

      {/* Progress Photo Modal */}
      <Modal
        isOpen={progressModalOpen}
        onClose={() => setProgressModalOpen(false)}
        title="Upload Work-in-Progress Snap"
        subtitle="This photo will be displayed on the customer's timeline and order dashboard"
      >
        <form onSubmit={handleUploadProgress} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-charcoal-700 mb-1">
              Select Progress Image
            </label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => setProgressFile(e.target.files[0])}
              className="text-xs text-charcoal-700 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:bg-terracotta-50 file:text-terracotta-600 hover:file:bg-terracotta-100"
            />
          </div>

          <Input
            label="Caption / Stage Note"
            placeholder="e.g. Underdrawing completed, beginning first layer of watercolor wash"
            value={progressCaption}
            onChange={(e) => setProgressCaption(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-cream-100">
            <Button variant="secondary" onClick={() => setProgressModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={uploadingProgress}>
              Share Progress Photo
            </Button>
          </div>
        </form>
      </Modal>

      {/* Courier & Shipping Modal */}
      <Modal
        isOpen={shippingModalOpen}
        onClose={() => setShippingModalOpen(false)}
        title="Dispatch & Add Tracking"
        subtitle="This marks the order as Shipped and sends tracking details to the customer"
      >
        <form onSubmit={handleUpdateShipping} className="space-y-4">
          <Input
            label="Courier Partner Name"
            value={courierName}
            onChange={(e) => setCourierName(e.target.value)}
            placeholder="e.g. BlueDart / Delhivery / DTDC"
            required
          />

          <Input
            label="Tracking Number (AWB)"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="e.g. BD123456789IN"
            required
          />

          <Input
            label="Direct Tracking Web Link (Optional)"
            value={trackingUrl}
            onChange={(e) => setTrackingUrl(e.target.value)}
            placeholder="https://..."
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-cream-100">
            <Button variant="secondary" onClick={() => setShippingModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={updatingShipping}>
              Mark as Shipped
            </Button>
          </div>
        </form>
      </Modal>

      {/* Reject Order Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Custom Order"
        subtitle="Customer will be informed of this reason"
      >
        <div className="space-y-4">
          <textarea
            rows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Reason for rejecting (e.g. reference photo too blurry, medium unavailable, artist schedule fully booked)..."
            className="w-full p-3 rounded-2xl bg-cream-50 border border-cream-300 text-xs text-charcoal-900"
          />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              loading={submittingReject}
              onClick={handleRejectOrder}
            >
              Confirm Reject
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminOrderDetail;
