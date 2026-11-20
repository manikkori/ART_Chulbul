import React, { useEffect, useState } from 'react';
import { MessageSquare, Send, CheckCircle2, Clock } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { formatDate } from '../../utils/formatters';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Skeleton from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const AdminQueries = () => {
  const { setPageTitle } = useSettings();
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // Reply Modal
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  useEffect(() => {
    setPageTitle('Customer Inquiries Inbox');
    fetchQueries();
  }, [statusFilter, setPageTitle]);

  const fetchQueries = async () => {
    setLoading(true);
    try {
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const res = await api.get('/queries', { params });
      if (res.data?.success) setQueries(res.data.data);
    } catch (err) {
      toast.error('Failed to load queries');
    } finally {
      setLoading(false);
    }
  };

  const openReplyModal = (q) => {
    setSelectedQuery(q);
    setReplyText('');
    setReplyModalOpen(true);
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setSubmittingReply(true);
    try {
      const res = await api.post(`/queries/${selectedQuery._id}/reply`, {
        message: replyText
      });
      if (res.data?.success) {
        toast.success('Reply posted. The user will see it on their contact page.');
        setReplyModalOpen(false);
        fetchQueries();
      }
    } catch (err) {
      toast.error('Failed to post reply');
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleToggleStatus = async (q) => {
    const newStatus = q.status === 'pending' ? 'resolved' : 'pending';
    try {
      await api.put(`/queries/${q._id}/status`, { status: newStatus });
      toast.success(`Query marked as ${newStatus}`);
      fetchQueries();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-200 pb-6">
        <div>
          <span className="eyebrow">COMMUNICATION HUB</span>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">
            Customer Inquiries Inbox
          </h1>
          <p className="text-xs text-charcoal-500 mt-1">
            Answer questions from collectors prior to placing custom commission orders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['all', 'pending', 'resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                statusFilter === st
                  ? 'bg-terracotta-500 text-white'
                  : 'bg-white text-charcoal-700 border border-cream-200 hover:bg-cream-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-cream-200 shadow-card overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            <Skeleton count={4} className="h-16" />
          </div>
        ) : queries.length === 0 ? (
          <div className="p-12 text-center">
            <EmptyState
              icon={MessageSquare}
              title="No queries found"
              description="Your inquiry inbox is clear."
            />
          </div>
        ) : (
          <div className="divide-y divide-cream-100">
            {queries.map((q) => (
              <div key={q._id} className="p-6 hover:bg-cream-50/50 transition-colors space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-base text-charcoal-900">
                      {q.subject}
                    </span>
                    <Badge variant={q.status === 'resolved' ? 'sage' : 'amber'}>
                      {q.status}
                    </Badge>
                  </div>
                  <span className="text-xs text-charcoal-400">
                    {formatDate(q.createdAt, true)}
                  </span>
                </div>

                <div className="text-xs text-charcoal-600 bg-cream-100/50 p-4 rounded-2xl whitespace-pre-line leading-relaxed">
                  <div className="text-[11px] font-bold text-charcoal-800 mb-1">
                    From: {q.name} ({q.email})
                  </div>
                  {q.message}
                </div>

                {q.replies && q.replies.length > 0 && (
                  <div className="pl-4 border-l-2 border-terracotta-300 space-y-1">
                    <p className="text-[11px] font-bold uppercase text-terracotta-600">
                      Your Replies ({q.replies.length}):
                    </p>
                    {q.replies.map((r, i) => (
                      <p key={i} className="text-xs text-charcoal-700 italic">
                        "{r.message}" — <span className="text-charcoal-400">{formatDate(r.sentAt)}</span>
                      </p>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(q)}
                  >
                    Mark {q.status === 'pending' ? 'Resolved' : 'Pending'}
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Send}
                    onClick={() => openReplyModal(q)}
                  >
                    Reply
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reply Modal */}
      <Modal
        isOpen={replyModalOpen}
        onClose={() => setReplyModalOpen(false)}
        title="Reply to Customer Inquiry"
        subtitle={`Replying to "${selectedQuery?.subject}" from ${selectedQuery?.name}`}
      >
        <form onSubmit={handleSendReply} className="space-y-4">
          <div className="p-3 bg-cream-100 rounded-2xl text-xs text-charcoal-700">
            <strong>Customer Question:</strong>
            <p className="mt-1 italic whitespace-pre-line">{selectedQuery?.message}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-charcoal-700 mb-1">
              Your Reply Message
            </label>
            <textarea
              rows={4}
              required
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your response to the customer..."
              className="w-full p-3 rounded-2xl bg-white border border-cream-300 text-xs text-charcoal-900"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-cream-100">
            <Button variant="secondary" onClick={() => setReplyModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submittingReply} icon={Send}>
              Dispatch Reply
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminQueries;
