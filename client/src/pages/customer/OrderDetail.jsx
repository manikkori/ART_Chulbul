import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Paintbrush,
  MessageSquare,
  Truck,
  Send,
  Maximize2,
  X,
  Star,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { formatPrice, formatDate, getStatusBadgeStyle } from '../../utils/formatters';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import StatusTimeline from '../../components/common/StatusTimeline';
import Modal from '../../components/common/Modal';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const OrderDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { setPageTitle, siteName } = useSettings();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const [acceptingQuote, setAcceptingQuote] = useState(false);
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [decliningQuote, setDecliningQuote] = useState(false);

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const [messages, setMessages] = useState([]);
  const [chatText, setChatText] = useState('');
  const [chatSending, setChatSending] = useState(false);
  const chatBottomRef = useRef(null);

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
        setMessages(res.data.data || []);
      }
    } catch (err) {
      // Quiet fail while polling
    }
  };

  useEffect(() => {
    fetchOrder();
    fetchMessages();
    const interval = setInterval(() => {
      fetchMessages();
    }, 3500);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAcceptQuote = async () => {
    setAcceptingQuote(true);
    try {
      const res = await api.post(`/orders/${id}/accept-quote`);
      if (res.data?.success) {
        toast.success('Quote accepted! The artist will begin crafting your piece.');
        fetchOrder();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept quote');
    } finally {
      setAcceptingQuote(false);
    }
  };

  const handleDeclineQuote = async () => {
    setDecliningQuote(true);
    try {
      const res = await api.post(`/orders/${id}/decline-quote`, {
        reason: declineReason,
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

  const handleCancelOrder = async () => {
    setCancelling(true);
    try {
      const res = await api.post(`/orders/${id}/cancel`, {
        reason: cancelReason,
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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatText.trim()) return;

    setChatSending(true);
    try {
      const res = await api.post(`/messages/${id}`, { text: chatText });
      if (res.data?.success) {
        setChatText('');
        setMessages((prev) => [...prev, res.data.data]);
        fetchMessages();
      }
    } catch (err) {
      toast.error('Failed to send message');
    } finally {
      setChatSending(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      toast.error('Please share your experience in the comment.');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await api.post('/reviews', {
        rating,
        comment: reviewComment,
        orderId: id,
      });
      if (res.data?.success) {
        toast.success('Thank you! Your review has been submitted.');
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
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 pb-20 space-y-5">
        <div className="h-6 w-36 scribble-shimmer rounded-full" />
        <div className="h-36 scribble-shimmer rounded-[24px]" />
        <div className="h-80 scribble-shimmer rounded-[24px]" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="editorial-serif text-4xl text-[#111827]">Order Not Found</h2>
        <Button variant="primary" onClick={() => navigate('/my-orders')}>
          Return to My Orders
        </Button>
      </div>
    );
  }

  const badgeStyle = getStatusBadgeStyle(order.status);
  const canCancel = ['Pending Review', 'Quoted', 'Accepted'].includes(order.status);

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 pb-20 space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/my-orders"
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-[#e2e2e7] text-[12px] font-semibold text-[#111827] hover:border-[#111827] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>My Custom Orders</span>
        </Link>

        {canCancel && (
          <Button
            variant="ghost"
            size="sm"
            className="text-[#ef4444] hover:bg-[#fff1f2]"
            onClick={() => setCancelModalOpen(true)}
          >
            Cancel Order
          </Button>
        )}
      </div>

      {/* Receipt Header Card */}
      <div className="rounded-[24px] bg-white border border-[#eae9ee] p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="editorial-serif text-3xl sm:text-4xl text-[#111827] font-normal">
              Order {order.orderNumber}
            </h1>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${badgeStyle.bg}`}
            >
              <span className={`w-2 h-2 rounded-full ${badgeStyle.dot}`} />
              {badgeStyle.label}
            </span>
          </div>
          <p className="text-[12px] sm:text-[13px] text-[#6e6e73]">
            Placed on {formatDate(order.createdAt, true)} • {order.medium} • {order.size}
          </p>
        </div>

        {order.status === 'Delivered' && (
          <Button
            variant="pink"
            size="md"
            icon={Star}
            onClick={() => setReviewModalOpen(true)}
          >
            Rate &amp; Review Commission
          </Button>
        )}
      </div>

      {/* Status Timeline */}
      <div className="rounded-[24px] bg-white border border-[#eae9ee] p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] space-y-5">
        <h3 className="text-[16px] font-bold text-[#111827]">
          Creation &amp; Delivery Timeline
        </h3>
        <StatusTimeline currentStatus={order.status} statusHistory={order.statusHistory} />
      </div>

      {/* Quote Banner Box */}
      {order.status === 'Quoted' && order.quote?.amount && (
        <div className="rounded-[24px] bg-[#fff8eb] border border-[#fde68a] p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#fde68a]">
            <div>
              <Badge variant="amber">Artist Quote Ready</Badge>
              <h3 className="text-2xl font-bold text-[#111827] mt-1.5">
                Custom Quote: {formatPrice(order.quote.amount)}
              </h3>
              <p className="text-[12px] text-[#6e6e73] mt-0.5">
                Estimated completion: <strong>{order.quote.estimatedDays} working days</strong>
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Button variant="pink" size="md" loading={acceptingQuote} onClick={handleAcceptQuote}>
                Accept Quote
              </Button>
              <Button variant="outline" size="md" onClick={() => setDeclineModalOpen(true)}>
                Decline
              </Button>
            </div>
          </div>

          {order.quote.note && (
            <div className="rounded-[16px] bg-white p-4 border border-[#fde68a] text-[13px] text-[#3c3c43]">
              <p className="font-bold text-[#111827] mb-1">Artist Note</p>
              <p className="leading-relaxed whitespace-pre-line">{order.quote.note}</p>
            </div>
          )}
        </div>
      )}

      {/* Agreed Quote Summary */}
      {order.quote?.amount &&
        ['Accepted', 'In Progress', 'Completed', 'Shipped', 'Delivered'].includes(order.status) && (
          <div className="rounded-[24px] bg-[#ecfdf5] border border-[#a7f3d0] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#047857]">
                Agreed Commission Price
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold text-[#065f46]">
                  {formatPrice(order.quote.amount)}
                </span>
                <span className="text-[12px] text-[#047857]">
                  (Est. {order.quote.estimatedDays} days)
                </span>
              </div>
            </div>
            <span className="text-[12px] text-[#047857] font-semibold bg-white px-3.5 py-1.5 rounded-full border border-[#a7f3d0]">
              Accepted on {formatDate(order.quote.acceptedAt || order.updatedAt)}
            </span>
          </div>
        )}

      {/* Shipping Tracking */}
      {order.shipping?.trackingNumber && (
        <div className="rounded-[24px] bg-white border border-[#eae9ee] p-6 space-y-3 shadow-[0_6px_24px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-2 text-[#111827] font-bold text-[14px]">
            <Truck className="w-4 h-4 text-[#ff0457]" />
            <span>Courier Dispatch &amp; Tracking</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[13px]">
            <div>
              <span className="text-[#8e8e93] block text-[11px] uppercase font-semibold">Courier</span>
              <span className="font-bold text-[#111827]">{order.shipping.courier || 'Domestic Courier'}</span>
            </div>
            <div>
              <span className="text-[#8e8e93] block text-[11px] uppercase font-semibold">Tracking Number</span>
              <span className="font-bold text-[#111827] font-mono">{order.shipping.trackingNumber}</span>
            </div>
            {order.shipping.trackingUrl && (
              <div className="flex items-end">
                <a
                  href={order.shipping.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] font-bold text-[#ff0457] hover:underline"
                >
                  Track Shipment →
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Progress Photos */}
      {order.progressUpdates && order.progressUpdates.length > 0 && (
        <div className="rounded-[24px] bg-white border border-[#eae9ee] p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] space-y-5">
          <div className="flex items-center gap-2">
            <Paintbrush className="w-4 h-4 text-[#ff0457]" />
            <h3 className="text-[16px] font-bold text-[#111827]">
              Work-in-Progress Studio Photos
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {order.progressUpdates.map((item, idx) => (
              <div
                key={idx}
                className="rounded-[18px] bg-[#f8f7fb] overflow-hidden border border-[#eae9ee] group"
              >
                <div
                  className="aspect-[4/3] overflow-hidden cursor-zoom-in relative"
                  onClick={() => setActiveLightboxImg(item.image?.url)}
                >
                  <img
                    src={item.image?.url}
                    alt={item.caption || `Progress ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="p-3.5 space-y-0.5">
                  <p className="text-[13px] font-semibold text-[#111827]">
                    {item.caption || 'Progress snap'}
                  </p>
                  <p className="text-[11px] text-[#8e8e93]">
                    {formatDate(item.date, true)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Left Specs & Reference Photos + Right Order Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-[24px] bg-white border border-[#eae9ee] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] space-y-4">
            <h3 className="text-[16px] font-bold text-[#111827]">
              Reference Photos ({order.referenceImages?.length || 0})
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {order.referenceImages?.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveLightboxImg(img.url)}
                  className="aspect-square rounded-[16px] overflow-hidden bg-[#f8f7fb] border border-[#eae9ee] cursor-zoom-in relative group"
                >
                  <img
                    src={img.url}
                    alt={`Reference ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] bg-white border border-[#eae9ee] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] space-y-4">
            <h3 className="text-[16px] font-bold text-[#111827] border-b border-[#f2f1f6] pb-2">
              Commission Specs
            </h3>
            <div className="space-y-3 text-[13px]">
              <div>
                <span className="text-[#8e8e93] block text-[11px] uppercase font-semibold">Vision</span>
                <p className="text-[#111827] mt-0.5 whitespace-pre-line leading-relaxed">
                  {order.description}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#f2f1f6]">
                <div>
                  <span className="text-[#8e8e93] block text-[11px] uppercase font-semibold">Subjects</span>
                  <span className="font-semibold text-[#111827]">{order.preferences?.subjectsCount} Subject(s)</span>
                </div>
                <div>
                  <span className="text-[#8e8e93] block text-[11px] uppercase font-semibold">Background</span>
                  <span className="font-semibold text-[#111827]">{order.preferences?.background}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-[#f2f1f6]">
                <span className="text-[#8e8e93] block text-[11px] uppercase font-semibold">Shipping To</span>
                <p className="font-bold text-[#111827] mt-0.5">
                  {order.addressSnapshot?.recipientName} ({order.addressSnapshot?.phone})
                </p>
                <p className="text-[#6e6e73] leading-relaxed">
                  {order.addressSnapshot?.street}, {order.addressSnapshot?.city}, {order.addressSnapshot?.state} - {order.addressSnapshot?.postalCode}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Direct Order Chat */}
        <div
          id="chat"
          className="lg:col-span-7 rounded-[24px] bg-white border border-[#eae9ee] shadow-[0_8px_30px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col h-[580px]"
        >
          <div className="p-4 sm:p-5 border-b border-[#f2f1f6] bg-[#f8f7fb] flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ff0457] text-white flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[#111827]">
                Direct Chat with {siteName}
              </h3>
              <p className="text-[11px] text-[#8e8e93]">
                Live commission thread for feedback and updates
              </p>
            </div>
          </div>

          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#f8f7fb]/40">
            {messages.length === 0 ? (
              <div className="text-center py-16 space-y-2">
                <MessageSquare className="w-8 h-8 text-[#d4d4d8] mx-auto" />
                <p className="text-[13px] text-[#8e8e93]">
                  No messages yet. Say hello or ask Chulbul about your quote!
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = (msg.sender?._id || msg.sender)?.toString() === user?._id?.toString();
                return (
                  <div
                    key={msg._id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[10px] text-[#8e8e93] mb-1 px-1">
                      {isMe ? 'You' : `${siteName} (Artist)`} • {formatDate(msg.createdAt, true)}
                    </span>
                    <div
                      className={`max-w-[85%] rounded-[18px] px-4 py-2.5 text-[13px] leading-relaxed ${
                        isMe
                          ? 'bg-[#ff0457] text-white rounded-tr-sm'
                          : 'bg-white text-[#111827] border border-[#eae9ee] rounded-tl-sm shadow-xs'
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
            className="p-3 sm:p-4 border-t border-[#f2f1f6] bg-white flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Write a message to the artist..."
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              className="flex-1 bg-[#f2f1f6] rounded-full px-4 py-2.5 text-[13px] text-[#111827] placeholder-[#8e8e93] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#ff0457]/30 transition-all"
            />
            <Button type="submit" variant="pink" size="sm" loading={chatSending} icon={Send}>
              Send
            </Button>
          </form>
        </div>
      </div>

      {/* Lightbox */}
      {activeLightboxImg && (
        <div
          className="fixed inset-0 z-[150] bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveLightboxImg(null)}
        >
          <button
            type="button"
            onClick={() => setActiveLightboxImg(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/15 text-white hover:bg-white/25"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={activeLightboxImg}
            alt="Preview"
            className="max-w-full max-h-[85vh] object-contain rounded-[18px]"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Decline Modal */}
      <Modal
        isOpen={declineModalOpen}
        onClose={() => setDeclineModalOpen(false)}
        title="Decline Custom Quote"
        subtitle="Share optional feedback so the artist can propose an adjustment"
      >
        <div className="space-y-4">
          <textarea
            rows={3}
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
            placeholder="e.g. Budget exceeds target or need an A4 scale instead..."
            className="w-full p-3.5 rounded-[16px] bg-[#f8f7fb] border border-[#e2e2e7] text-[13px] text-[#111827]"
          />
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setDeclineModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" loading={decliningQuote} onClick={handleDeclineQuote}>
              Confirm Decline
            </Button>
          </div>
        </div>
      </Modal>

      {/* Cancel Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Custom Order"
        subtitle="Are you sure you want to cancel this request?"
      >
        <div className="space-y-4">
          <textarea
            rows={3}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Optional reason for cancelling..."
            className="w-full p-3.5 rounded-[16px] bg-[#f8f7fb] border border-[#e2e2e7] text-[13px] text-[#111827]"
          />
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setCancelModalOpen(false)}>
              Keep Order
            </Button>
            <Button variant="danger" loading={cancelling} onClick={handleCancelOrder}>
              Cancel Order
            </Button>
          </div>
        </div>
      </Modal>

      {/* Review Modal */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Review Your Commission"
        subtitle="Share how your artwork arrived and your experience with the studio"
      >
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="block text-[12px] font-bold uppercase text-[#111827] mb-1.5">
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
                      star <= rating ? 'fill-[#f59e0b] text-[#f59e0b]' : 'text-[#e5e5ea]'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <textarea
            rows={4}
            required
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="How did the painting look in person? How was the packaging?"
            className="w-full p-3.5 rounded-[16px] bg-[#f8f7fb] border border-[#e2e2e7] text-[13px] text-[#111827]"
          />

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setReviewModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="pink" loading={submittingReview}>
              Submit Review
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default OrderDetail;
