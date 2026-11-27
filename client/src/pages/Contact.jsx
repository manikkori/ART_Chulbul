import React, { useEffect, useState } from 'react';
import { Send, MessageSquare, Clock, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-20 pt-4">
      <div className="text-center space-y-2 pt-2">
        <div className="inline-flex items-center gap-1.5 font-caveat text-3xl sm:text-4xl text-[#f19b72]">
          <span>Studio Inquiry ✦</span>
          <Sparkles className="w-4 h-4 text-[#faa9b0] inline-block" />
        </div>
        <h1 className="font-playfair text-3xl sm:text-5xl text-[#1c1a17]">
          Ask the Artist Directly
        </h1>
        <p className="font-sans text-xs sm:text-sm text-[#1c1a17]/70 max-w-xl mx-auto leading-relaxed">
          Have questions before commissioning an artwork? Send a message directly to the artist. All replies appear right inside your site dashboard.
        </p>
      </div>

      {/* Tabs if logged in */}
      {isAuthenticated && (
        <div className="flex justify-center border-b border-[#1c1a17]/10">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('new')}
              className={`pb-3 text-xs font-sans font-semibold tracking-wide border-b-2 transition-all ${
                activeTab === 'new'
                  ? 'border-[#1c1a17] text-[#1c1a17]'
                  : 'border-transparent text-[#1c1a17]/50 hover:text-[#1c1a17]'
              }`}
            >
              Send New Inquiry
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`pb-3 text-xs font-sans font-semibold tracking-wide border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'history'
                  ? 'border-[#1c1a17] text-[#1c1a17]'
                  : 'border-transparent text-[#1c1a17]/50 hover:text-[#1c1a17]'
              }`}
            >
              <span>Past Inquiries</span>
              {myQueries.length > 0 && (
                <span className="bg-[#f8f4ea] border border-[#d4a373]/30 text-[#1c1a17] text-[10px] px-2 py-0.5 rounded-full font-medium">
                  {myQueries.length}
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Form or History */}
      {activeTab === 'new' ? (
        <div className="bg-white rounded-[2.5rem] border border-[#1c1a17]/10 p-8 sm:p-12 shadow-[0_15px_40px_rgba(0,0,0,0.03)] space-y-6 relative">
          {/* Jhankoo Washi Tape Accent */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#ffdda4]/85 backdrop-blur-sm -rotate-2 rounded-sm shadow-xs border border-[#e5c58a]/40" />

          <form onSubmit={handleSubmit} className="space-y-5">
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
              placeholder="e.g. Question about 18x24 Oil Painting of wedding couple"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />

            <div>
              <label className="block text-xs font-sans font-semibold tracking-wide text-[#1c1a17]/80 mb-1.5">
                Your Message / Reference Details <span className="text-[#f19b72]">*</span>
              </label>
              <textarea
                rows={5}
                required
                placeholder="Tell us about the photograph, sizing questions, delivery deadlines, or any special requests..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-white border border-[#1c1a17]/15 rounded-2xl p-4 text-sm text-[#1c1a17] focus:ring-2 focus:ring-[#faa9b0]/30 focus:border-[#faa9b0] focus:outline-none transition-all placeholder-[#1c1a17]/40 font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-[#1c1a17] text-white hover:bg-black font-sans text-xs font-medium px-8 py-3.5 rounded-full shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <Send className="w-4 h-4 text-[#faa9b0]" />
              <span>{submitting ? 'Sending inquiry...' : 'Dispatch Message to Artist'}</span>
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          {myQueries.length === 0 ? (
            <EmptyState
              title="No past inquiries yet"
              description="When you send inquiries to the artist, they will be archived here with their replies."
              actionText="Send an inquiry"
              onAction={() => setActiveTab('new')}
            />
          ) : (
            myQueries.map((q) => (
              <div
                key={q._id}
                className="bg-white rounded-[2rem] border border-[#1c1a17]/10 p-6 shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-playfair text-base text-[#1c1a17]">
                      {q.subject}
                    </h3>
                    <p className="font-sans text-[11px] text-[#1c1a17]/50 mt-0.5">
                      Dispatched on {formatDate(q.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`font-sans text-[11px] font-medium px-3 py-1 rounded-full border ${
                      q.status === 'replied'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-[#f8f4ea] text-[#1c1a17] border-[#d4a373]/30'
                    }`}
                  >
                    {q.status === 'replied' ? 'Replied by Artist' : 'Pending Review'}
                  </span>
                </div>

                <div className="p-4 bg-[#f8f4ea] rounded-2xl border border-[#d4a373]/30 text-xs font-sans text-[#1c1a17]/80">
                  <p className="font-semibold text-[10px] text-[#1c1a17]/60 uppercase tracking-wider mb-1">Your Message:</p>
                  <p className="leading-relaxed">{q.message}</p>
                </div>

                {q.reply && (
                  <div className="p-4 bg-white rounded-2xl border border-[#1c1a17]/10 shadow-2xs space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#1c1a17]" />
                      <span className="font-sans text-xs font-semibold text-[#1c1a17]">
                        Artist Reply
                      </span>
                    </div>
                    <p className="text-xs font-sans text-[#1c1a17]/85 leading-relaxed whitespace-pre-line">
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
