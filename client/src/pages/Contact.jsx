import React, { useEffect, useState } from 'react';
import { Send, MessageSquare, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatters';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import api from '../services/api';
import toast from 'react-hot-toast';

export const Contact = () => {
  const { setPageTitle, siteName } = useSettings();
  const { user, isAuthenticated } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [myQueries, setMyQueries] = useState([]);
  const [activeTab, setActiveTab] = useState('new'); // 'new' | 'history'

  useEffect(() => {
    setPageTitle('Direct Artist Inquiry');
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      fetchMyQueries();
    }
  }, [user, setPageTitle]);

  const fetchMyQueries = async () => {
    try {
      const res = await api.get('/queries/my');
      if (res.data?.success) {
        setMyQueries(res.data.data);
      }
    } catch (err) {
      // Quiet fail if not logged in
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      toast.error('Please fill out all fields.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/queries', {
        name,
        email,
        subject,
        message,
      });

      if (res.data?.success) {
        toast.success(res.data.message || 'Query submitted successfully!');
        setSubject('');
        setMessage('');
        if (isAuthenticated) {
          fetchMyQueries();
          setActiveTab('history');
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit inquiry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-20">
      <div className="text-center space-y-3">
        <span className="eyebrow">IN-SITE COLLABORATION</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-charcoal-900">
          Ask the Artist Directly
        </h1>
        <p className="text-sm text-charcoal-600 max-w-xl mx-auto leading-relaxed">
          Have questions before commissioning an artwork? Send a message directly to the artist. All replies appear right inside your site dashboard.
        </p>
      </div>

      {/* Tabs if logged in */}
      {isAuthenticated && (
        <div className="flex justify-center border-b border-cream-200">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('new')}
              className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
                activeTab === 'new'
                  ? 'border-terracotta-500 text-terracotta-600'
                  : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
              }`}
            >
              Send New Inquiry
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'border-terracotta-500 text-terracotta-600'
                  : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
              }`}
            >
              <span>My Inquiries & Replies</span>
              {myQueries.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-cream-200 text-charcoal-700 text-xs flex items-center justify-center font-bold">
                  {myQueries.length}
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Tab 1: Form */}
      {activeTab === 'new' && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-cream-200 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="Your Full Name"
                placeholder="e.g. Priyanshu Roy"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Your Email Address"
                type="email"
                placeholder="e.g. name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Input
              label="Subject / Topic"
              placeholder="e.g. Combining two vintage photos into one oil painting"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Your Message <span className="text-terracotta-600">*</span>
              </label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your ideas, questions on dimensions, custom medium preferences, or timelines..."
                className="w-full rounded-2xl bg-white border border-cream-300 p-4 text-sm text-charcoal-900 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-terracotta-100 focus:border-terracotta-500 transition-all"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-charcoal-500">
                <Clock className="w-4 h-4 text-terracotta-500" />
                <span>The artist typically replies within 12-24 hours.</span>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                icon={Send}
                loading={submitting}
              >
                Send Inquiry
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: My Query History */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          {myQueries.length === 0 ? (
            <EmptyState
              title="No previous inquiries"
              description="You haven't submitted any questions yet. Use the 'Send New Inquiry' tab whenever you need guidance."
              actionText="Ask a Question"
              onAction={() => setActiveTab('new')}
            />
          ) : (
            myQueries.map((q) => (
              <div
                key={q._id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cream-100 pb-3">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-charcoal-900">
                      {q.subject}
                    </h3>
                    <p className="text-xs text-charcoal-400">
                      Sent on {formatDate(q.createdAt, true)}
                    </p>
                  </div>
                  <Badge variant={q.status === 'resolved' ? 'sage' : 'amber'}>
                    {q.status === 'resolved' ? 'Replied / Resolved' : 'Pending Review'}
                  </Badge>
                </div>

                {/* Original Question */}
                <div className="bg-cream-100/60 p-4 rounded-2xl text-xs sm:text-sm text-charcoal-700 whitespace-pre-line leading-relaxed">
                  {q.message}
                </div>

                {/* Replies Thread */}
                {q.replies && q.replies.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-terracotta-600 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" />
                      Artist Replies
                    </h4>
                    {q.replies.map((reply, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-terracotta-50/60 border border-terracotta-200 text-xs sm:text-sm text-charcoal-800 space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-[11px] text-terracotta-700 font-semibold">
                          <span>{reply.senderRole === 'admin' ? `${siteName} (Artist)` : 'You'}</span>
                          <span>{formatDate(reply.sentAt, true)}</span>
                        </div>
                        <p className="leading-relaxed whitespace-pre-line">{reply.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Contact;
