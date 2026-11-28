import React, { useEffect, useState } from 'react';
import { Send } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatters';
import Input from '../components/common/Input';
import EmptyState from '../components/common/EmptyState';
import api from '../services/api';
import toast from 'react-hot-toast';

export const Contact = () => {
  const { setPageTitle } = useSettings();
  const { user, isAuthenticated } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [myQueries, setMyQueries] = useState([]);
  const [activeTab, setActiveTab] = useState('new');

  useEffect(() => {
    setPageTitle('Contact Studio');
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
        setMyQueries(res.data.data || []);
      }
    } catch (err) {
      // Quiet fail if guest
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
        toast.success(res.data.message || 'Inquiry dispatched to the studio!');
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
    <div className="max-w-3xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 pb-20 space-y-8">
      <div className="text-center space-y-2">
        <span className="eyebrow">Direct Studio Line</span>
        <h1 className="editorial-serif text-4xl sm:text-6xl text-[#111827] font-normal leading-none">
          Ask the Artist
        </h1>
        <p className="text-[13px] sm:text-[14px] text-[#6e6e73] max-w-lg mx-auto leading-relaxed">
          Have questions about dimensions, reference photos, or urgent gifting deadlines? Message Chulbul directly.
        </p>
      </div>

      {/* Pill Tabs */}
      {isAuthenticated && (
        <div className="flex justify-center">
          <div className="inline-flex p-1 rounded-full bg-white border border-[#eae9ee] shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab('new')}
              className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-all ${
                activeTab === 'new'
                  ? 'bg-[#111827] text-white'
                  : 'text-[#6e6e73] hover:text-[#111827]'
              }`}
            >
              Send New Inquiry
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-[13px] font-semibold transition-all ${
                activeTab === 'history'
                  ? 'bg-[#111827] text-white'
                  : 'text-[#6e6e73] hover:text-[#111827]'
              }`}
            >
              <span>Past Inquiries</span>
              {myQueries.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#ff0457] text-white text-[10px] font-bold">
                  {myQueries.length}
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'new' ? (
        <div className="rounded-[24px] bg-white border border-[#eae9ee] p-6 sm:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Your Name"
                placeholder="e.g. Radhika Verma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Input
              label="Subject / Medium Interest"
              placeholder="e.g. Question about 18×24 Oil Painting of wedding couple"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />

            <div>
              <label className="block text-[12px] font-semibold text-[#111827] mb-1.5 pl-1">
                Your Message <span className="text-[#ff0457]">*</span>
              </label>
              <textarea
                rows={5}
                required
                placeholder="Tell us about your photograph, preferred size, delivery city, or special details..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-white rounded-[16px] border border-[#e2e2e7] focus:border-[#ff0457] focus:ring-4 focus:ring-[#ff0457]/12 text-[14px] text-[#111827] placeholder-[#a1a1aa] p-3.5 font-sans focus:outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#ff0457] hover:bg-[#d90349] text-white text-[13px] font-bold shadow-[0_8px_22px_rgba(255,4,87,0.28)] transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Sending...' : 'Send Inquiry'}</span>
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          {myQueries.length === 0 ? (
            <EmptyState
              title="No past inquiries yet"
              description="Inquiries you send to Chulbul will appear here along with studio replies."
              actionText="Send an Inquiry"
              onAction={() => setActiveTab('new')}
            />
          ) : (
            myQueries.map((q) => (
              <div
                key={q._id}
                className="rounded-[24px] bg-white border border-[#eae9ee] p-6 space-y-3 shadow-[0_6px_24px_rgba(0,0,0,0.03)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[16px] font-bold text-[#111827]">{q.subject}</h3>
                    <p className="text-[12px] text-[#8e8e93]">
                      Sent on {formatDate(q.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                      q.status === 'replied'
                        ? 'bg-[#ecfdf5] text-[#047857]'
                        : 'bg-[#ffe5ee] text-[#ff0155]'
                    }`}
                  >
                    {q.status === 'replied' ? 'Replied' : 'Pending Review'}
                  </span>
                </div>

                <div className="rounded-[14px] bg-[#f8f7fb] p-3.5 text-[13px] text-[#3c3c43]">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#8e8e93] mb-1">
                    Your Message
                  </p>
                  <p className="leading-relaxed">{q.message}</p>
                </div>

                {q.reply && (
                  <div className="rounded-[14px] bg-[#ffe5ee]/45 border border-[#ffc2d7] p-4 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff0155]">
                      Artist Reply
                    </span>
                    <p className="text-[13px] text-[#111827] leading-relaxed whitespace-pre-line">
                      {q.reply}
                    </p>
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
