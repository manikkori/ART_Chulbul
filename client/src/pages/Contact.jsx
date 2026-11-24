import React, { useEffect, useState } from 'react';
import { Send, MessageSquare, Clock, CheckCircle2, AlertCircle, Heart } from 'lucide-react';
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-20 pt-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1 font-script text-3xl sm:text-4xl text-[#121212]">
          <span>Studio Inquiry</span>
          <Heart className="w-4 h-4 text-[#dc8da3] fill-[#f7cbd7] inline-block" />
        </div>
        <h1 className="font-montserrat font-extrabold text-3xl sm:text-5xl text-[#121212] uppercase tracking-[0.08em]">
          ASK THE ARTIST DIRECTLY
        </h1>
        <p className="font-sans text-xs sm:text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
          Have questions before commissioning an artwork? Send a message directly to the artist. All replies appear right inside your site dashboard.
        </p>
      </div>

      {/* Tabs if logged in */}
      {isAuthenticated && (
        <div className="flex justify-center border-b-2 border-[#121212]">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('new')}
              className={`pb-3 text-xs font-montserrat font-bold uppercase tracking-wider border-b-4 transition-all ${
                activeTab === 'new'
                  ? 'border-[#121212] text-[#121212]'
                  : 'border-transparent text-gray-500 hover:text-[#121212]'
              }`}
            >
              Send New Inquiry
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`pb-3 text-xs font-montserrat font-bold uppercase tracking-wider border-b-4 transition-all flex items-center gap-2 ${
                activeTab === 'history'
                  ? 'border-[#121212] text-[#121212]'
                  : 'border-transparent text-gray-500 hover:text-[#121212]'
              }`}
            >
              <span>Past Inquiries</span>
              {myQueries.length > 0 && (
                <span className="bg-[#fde8ef] border border-[#121212] text-[#121212] text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {myQueries.length}
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Form or History */}
      {activeTab === 'new' ? (
        <div className="bg-white border-2 border-[#121212] p-8 sm:p-12 shadow-[6px_6px_0px_#f7cbd7] space-y-6">
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
              <label className="block text-xs font-montserrat font-bold uppercase tracking-wider text-[#121212] mb-1.5">
                Your Message / Reference Details <span className="text-[#dc8da3]">*</span>
              </label>
              <textarea
                rows={5}
                required
                placeholder="Tell us about the photograph, sizing questions, delivery deadlines, or any special requests..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-white border-2 border-[#121212] shadow-[2px_2px_0px_#f7cbd7] focus:shadow-[3px_3px_0px_#ebb0c0] focus:ring-2 focus:ring-[#f7cbd7] text-sm text-[#121212] p-3 font-sans focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-[#121212] text-white hover:bg-black font-montserrat text-xs font-bold uppercase tracking-[0.18em] px-8 py-3.5 border-2 border-[#121212] shadow-[3px_3px_0px_#f7cbd7] hover:shadow-[5px_5px_0px_#ebb0c0] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <Send className="w-4 h-4 text-[#f7cbd7]" />
              <span>{submitting ? 'SENDING INQUIRY...' : 'DISPATCH MESSAGE TO ARTIST'}</span>
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
                className="bg-white border-2 border-[#121212] p-6 shadow-[4px_4px_0px_#f7cbd7] space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-montserrat font-extrabold text-base text-[#121212]">
                      {q.subject}
                    </h3>
                    <p className="font-montserrat text-[11px] text-gray-500">
                      Dispatched on {formatDate(q.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`font-montserrat text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 border border-[#121212] ${
                      q.status === 'replied'
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-[#fde8ef] text-[#121212]'
                    }`}
                  >
                    {q.status === 'replied' ? 'Replied by Artist' : 'Pending Review'}
                  </span>
                </div>

                <div className="p-3 bg-[#fff7f9] border border-[#121212] text-xs font-sans text-gray-700">
                  <p className="font-bold font-montserrat text-[10px] text-gray-500 uppercase mb-1">Your Message:</p>
                  <p className="leading-relaxed">{q.message}</p>
                </div>

                {q.reply && (
                  <div className="p-4 bg-white border-2 border-[#121212] shadow-[3px_3px_0px_#f7cbd7] space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#121212]" />
                      <span className="font-montserrat text-xs font-extrabold text-[#121212] uppercase tracking-wider">
                        Artist Reply
                      </span>
                    </div>
                    <p className="text-xs font-sans text-gray-800 leading-relaxed whitespace-pre-line">
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
