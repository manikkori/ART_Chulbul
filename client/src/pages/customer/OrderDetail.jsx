import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Paintbrush,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Truck,
  Send,
  Paperclip,
  Maximize2,
  X,
  AlertTriangle,
  Star,
  Sparkles,
  Camera
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { formatPrice, formatDate, getStatusBadgeStyle } from '../../utils/formatters';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import StatusTimeline from '../../components/common/StatusTimeline';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Modal from '../../components/common/Modal';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const OrderDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { setPageTitle, siteName } = useSettings();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Quote Action states
  const [acceptingQuote, setAcceptingQuote] = useState(false);
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [decliningQuote, setDecliningQuote] = useState(false);

  // Cancellation states
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  // Review states
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

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
        setOrder(res.data.data);
        setPageTitle(`Order ${res.data.data.orderNumber}`);
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

    // Poll chat messages every 10 seconds as specified in Section 4
    const interval = setInterval(() => {
      fetchMessages();
    }, 10000);

    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    // Scroll chat to bottom when messages update
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle Quote Acceptance
  const handleAcceptQuote = async () => {
    setAcceptingQuote(true);
    try {
      const res = await api.post(`/orders/${id}/accept-quote`);
      if (res.data?.success) {
        toast.success('Quote accepted! The artist will now begin creation.');
        fetchOrder();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept quote');
    } finally {
      setAcceptingQuote(false);
    }
  };

  // Handle Quote Decline
  const handleDeclineQuote = async () => {
    setDecliningQuote(true);
    try {
      const res = await api.post(`/orders/${id}/decline-quote`, {
        reason: declineReason
      });
      if (res.data?.success) {
        toast.success('Quote declined.');
        setDeclineModalOpen(false);
        fetchOrder();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to decline quote');
    } finally {
      setDecliningQuote(false);
    }
  };

  // Handle Customer Cancel
  const handleCancelOrder = async () => {
    setCancelling(true);
    try {
      const res = await api.post(`/orders/${id}/cancel`, {
        reason: cancelReason
      });
      if (res.data?.success) {
        toast.success('Order has been cancelled.');
        setCancelModalOpen(false);
        fetchOrder();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  // Handle Send Chat Message
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

  // Handle Submit Review after Delivery
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      toast.error('Please share your thoughts in the review comment.');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await api.post('/reviews', {
        rating,
        comment: reviewComment,
        orderId: id
      });
      if (res.data?.success) {
        toast.success('Thank you! Your review has been submitted for approval.');
        setReviewModalOpen(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div className="h-6 w-32 bg-cream-300 animate-pulse rounded-full" />
        <div className="h-44 bg-cream-300 animate-pulse rounded-3xl" />
        <div className="h-96 bg-cream-300 animate-pulse rounded-3xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-charcoal-900">
          Order Not Found
        </h2>
        <Button variant="primary" onClick={() => navigate('/my-orders')}>
          Return to My Orders
        </Button>
      </div>
    );
  }

  const badgeStyle = getStatusBadgeStyle(order.status);
  const canCancel = ['Pending Review', 'Quoted', 'Accepted'].includes(order.status);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-20">
      {/* Breadcrumb / Back Link */}
      <div className="flex items-center justify-between">
        <Link
          to="/my-orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-600 hover:text-terracotta-600"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Custom Orders
        </Link>

        {canCancel && (
          <Button
            variant="ghost"
            size="sm"
            className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            onClick={() => setCancelModalOpen(true)}
          >
            Cancel Order
          </Button>
        )}
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
              Order {order.orderNumber}
            </h1>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badgeStyle.bg}`}
            >
              <span className={`w-2 h-2 rounded-full ${badgeStyle.dot}`} />
              {badgeStyle.label}
            </span>
          </div>
          <p className="text-xs text-charcoal-500">
            Placed on {formatDate(order.createdAt, true)} • Medium: {order.medium} • Size: {order.size}
          </p>
        </div>

        {/* If Delivered: Review CTA */}
        {order.status === 'Delivered' && (
          <Button
            variant="primary"
            size="md"
            icon={Star}
            onClick={() => setReviewModalOpen(true)}
          >
            Rate & Review Commission
          </Button>
        )}
      </div>

      {/* Visual Status Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card space-y-6">
        <h3 className="font-serif text-lg font-bold text-charcoal-900">
          Creation & Delivery Timeline
        </h3>
        <StatusTimeline
          currentStatus={order.status}
          statusHistory={order.statusHistory}
        />
      </div>

      {/* Quote Banner Box (If Quoted) */}
      {order.status === 'Quoted' && order.quote?.amount && (
        <div className="bg-amber-50 rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-200/60 pb-4">
            <div>
              <Badge variant="amber">ARTIST QUOTE READY</Badge>
              <h3 className="font-serif text-2xl font-bold text-charcoal-900 mt-1">
                Custom Commission Quote: {formatPrice(order.quote.amount)}
              </h3>
              <p className="text-xs text-charcoal-600 mt-1">
                Estimated handcrafting time: <strong>{order.quote.estimatedDays} working days</strong>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                size="md"
                loading={acceptingQuote}
                onClick={handleAcceptQuote}
              >
                Accept Quote
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => setDeclineModalOpen(true)}
              >
                Decline Quote
              </Button>
            </div>
          </div>

          {order.quote.note && (
            <div className="text-xs sm:text-sm text-charcoal-700 bg-white/70 p-4 rounded-2xl border border-amber-200">
              <p className="font-bold text-charcoal-800 mb-1">Artist Note:</p>
              <p className="leading-relaxed whitespace-pre-line">{order.quote.note}</p>
            </div>
          )}

          <p className="text-xs text-charcoal-500">
            Have questions about this quote? Send a message in the <strong>Order Chat</strong> below to discuss adjustments directly with the artist.
          </p>
        </div>
      )}

      {/* Accepted Quote Summary (If accepted or later) */}
      {order.quote?.amount && ['Accepted', 'In Progress', 'Completed', 'Shipped', 'Delivered'].includes(order.status) && (
        <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Agreed Commission Quote
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="font-serif text-2xl font-bold text-emerald-900">
                {formatPrice(order.quote.amount)}
              </span>
              <span className="text-xs text-emerald-700">
                (Est. {order.quote.estimatedDays} days)
              </span>
            </div>
          </div>
          <span className="text-xs text-emerald-800 font-semibold bg-white/80 px-3 py-1 rounded-full border border-emerald-200">
            Quote Accepted on {formatDate(order.quote.acceptedAt || order.updatedAt)}
          </span>
        </div>
      )}

      {/* Courier & Shipping Tracking (If Shipped or Delivered) */}
      {order.shipping?.trackingNumber && (
        <div className="bg-indigo-50 rounded-3xl p-6 border border-indigo-200 space-y-3">
          <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
            <Truck className="w-5 h-5 text-indigo-600" />
            <span>Courier Dispatch & Tracking</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-charcoal-400 font-semibold uppercase block">Courier Service</span>
              <span className="text-charcoal-900 font-bold text-sm">{order.shipping.courier || 'Domestic Courier'}</span>
            </div>
            <div>
              <span className="text-charcoal-400 font-semibold uppercase block">Tracking Number</span>
              <span className="text-charcoal-900 font-bold text-sm font-mono">{order.shipping.trackingNumber}</span>
            </div>
            {order.shipping.trackingUrl && (
              <div className="flex items-end">
                <a
                  href={order.shipping.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline"
                >
                  Track on Courier Website →
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Progress Photos Shared By Artist */}
      {order.progressUpdates && order.progressUpdates.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card space-y-6">
          <div className="flex items-center gap-2">
            <Paintbrush className="w-5 h-5 text-terracotta-500" />
            <h3 className="font-serif text-xl font-bold text-charcoal-900">
              Work-in-Progress Photos from the Artist
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {order.progressUpdates.map((item, idx) => (
              <div
                key={idx}
                className="bg-cream-100/50 rounded-2xl overflow-hidden border border-cream-200 space-y-2 group"
              >
                <div
                  className="aspect-[4/3] overflow-hidden bg-cream-200 cursor-zoom-in relative"
                  onClick={() => setActiveLightboxImg(item.image?.url)}
                >
                  <img
                    src={item.image?.url}
                    alt={item.caption || `Progress ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-2 right-2 p-1.5 rounded-full bg-charcoal-900/60 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="p-3 space-y-1">
                  <p className="text-xs font-semibold text-charcoal-800">
                    {item.caption || 'Progress snap'}
                  </p>
                  <p className="text-[10px] text-charcoal-400">
                    Shared on {formatDate(item.date, true)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two Column Layout: Reference & Specifications (Left) vs Order Chat (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Order Info & Reference Photos */}
        <div className="lg:col-span-5 space-y-6">
          {/* Reference Photos */}
          <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-card space-y-4">
            <h3 className="font-serif text-lg font-bold text-charcoal-900">
              Reference Photographs ({order.referenceImages?.length || 0})
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {order.referenceImages?.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveLightboxImg(img.url)}
                  className="aspect-square rounded-2xl overflow-hidden bg-cream-200 border border-cream-200 cursor-zoom-in relative group"
                >
                  <img
                    src={img.url}
                    alt={`Reference ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-2 right-2 p-1.5 rounded-full bg-charcoal-900/60 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-3 h-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Specifications & Delivery Address */}
          <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-card space-y-4">
            <h3 className="font-serif text-lg font-bold text-charcoal-900 border-b border-cream-100 pb-2">
              Commission Details
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-charcoal-400 font-semibold uppercase block">Customer Vision</span>
                <p className="text-charcoal-800 mt-1 whitespace-pre-line leading-relaxed">
                  {order.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-cream-100">
                <div>
                  <span className="text-charcoal-400 font-semibold uppercase block">Subjects</span>
                  <span className="text-charcoal-800 font-semibold">{order.preferences?.subjectsCount} Subject(s)</span>
                </div>
                <div>
                  <span className="text-charcoal-400 font-semibold uppercase block">Background</span>
                  <span className="text-charcoal-800 font-semibold">{order.preferences?.background}</span>
                </div>
              </div>

              {order.preferences?.colors && (
                <div className="pt-2 border-t border-cream-100">
                  <span className="text-charcoal-400 font-semibold uppercase block">Color Preference</span>
                  <span className="text-charcoal-800">{order.preferences.colors}</span>
                </div>
              )}

              {order.deadline && (
                <div className="pt-2 border-t border-cream-100">
                  <span className="text-charcoal-400 font-semibold uppercase block">Target Deadline</span>
                  <span className="text-charcoal-800 font-semibold">{formatDate(order.deadline)}</span>
                </div>
              )}

              {/* Delivery Address Snapshot */}
              <div className="pt-3 border-t border-cream-100 space-y-1">
                <span className="text-charcoal-400 font-semibold uppercase block">Shipping Address</span>
                <p className="text-charcoal-900 font-bold">{order.addressSnapshot?.recipientName} ({order.addressSnapshot?.phone})</p>
                <p className="text-charcoal-600 leading-relaxed">
                  {order.addressSnapshot?.street}, {order.addressSnapshot?.city}, {order.addressSnapshot?.state} - {order.addressSnapshot?.postalCode}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Per-Order In-Platform Chat */}
        <div id="chat" className="lg:col-span-7 bg-white rounded-3xl border border-cream-200 shadow-card overflow-hidden flex flex-col h-[600px]">
          {/* Chat Header */}
          <div className="p-4 sm:p-5 border-b border-cream-200 bg-cream-100/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-terracotta-500 text-white flex items-center justify-center font-bold text-sm">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-charcoal-900">
                  Order Chat with {siteName}
                </h3>
                <p className="text-[11px] text-charcoal-500">
                  Direct thread for this commission. Polling active.
                </p>
              </div>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-cream-50/40">
            {messages.length === 0 ? (
              <div className="text-center py-16 space-y-2">
                <MessageSquare className="w-8 h-8 text-cream-300 mx-auto" />
                <p className="text-xs text-charcoal-500">
                  No messages yet. Send a greeting to the artist or ask questions about your quote!
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.sender?._id === user?._id || msg.sender === user?._id;
                return (
                  <div
                    key={msg._id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-charcoal-400 mb-1 px-1">
                      <span>{isMe ? 'You' : `${siteName} (Artist)`}</span>
                      <span>•</span>
                      <span>{formatDate(msg.createdAt, true)}</span>
                    </div>

                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                        isMe
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

          {/* Chat Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 sm:p-4 border-t border-cream-200 bg-white flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Type your message to the artist..."
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              className="flex-1 bg-cream-100 border border-cream-300 rounded-full px-4 py-2.5 text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-terracotta-200"
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={chatSending}
              icon={Send}
            >
              Send
            </Button>
          </form>
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeLightboxImg && (
        <div className="fixed inset-0 z-50 bg-charcoal-900/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setActiveLightboxImg(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/20 text-white hover:bg-white/40"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={activeLightboxImg}
            alt="Preview"
            className="max-w-full max-h-[85vh] object-contain rounded-2xl"
          />
        </div>
      )}

      {/* Decline Quote Modal */}
      <Modal
        isOpen={declineModalOpen}
        onClose={() => setDeclineModalOpen(false)}
        title="Decline Custom Art Quote"
        subtitle="Let the artist know why so they can propose an alternative or adjust specs"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-charcoal-700 mb-1">
              Reason / Feedback (Optional)
            </label>
            <textarea
              rows={3}
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="e.g. Budget is slightly higher than expected, or need earlier delivery date..."
              className="w-full p-3 rounded-2xl bg-cream-50 border border-cream-300 text-xs text-charcoal-900"
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="secondary" onClick={() => setDeclineModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              loading={decliningQuote}
              onClick={handleDeclineQuote}
            >
              Confirm Decline
            </Button>
          </div>
        </div>
      </Modal>

      {/* Cancel Order Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Custom Order"
        subtitle="Are you sure? This order will be marked cancelled."
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-charcoal-700 mb-1">
              Reason for Cancellation
            </label>
            <textarea
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Please let us know why you are cancelling..."
              className="w-full p-3 rounded-2xl bg-cream-50 border border-cream-300 text-xs text-charcoal-900"
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="secondary" onClick={() => setCancelModalOpen(false)}>
              Keep Order
            </Button>
            <Button
              variant="danger"
              loading={cancelling}
              onClick={handleCancelOrder}
            >
              Cancel Order
            </Button>
          </div>
        </div>
      </Modal>

      {/* Rate & Review Modal (Post-delivery) */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Review Your Commission"
        subtitle="Share your honest feedback and rating for the artist"
      >
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-charcoal-700 mb-1.5">
              Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 focus:outline-none"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-cream-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-charcoal-700 mb-1">
              Your Review / Experience
            </label>
            <textarea
              rows={4}
              required
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="How did the painting look in person? How was the communication and packaging?..."
              className="w-full p-3 rounded-2xl bg-cream-50 border border-cream-300 text-xs sm:text-sm text-charcoal-900"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setReviewModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submittingReview}>
              Submit Review
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default OrderDetail;
