import React, { useEffect, useState } from 'react';
import { Star, CheckCircle2, XCircle, Trash2, Home } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { formatDate } from '../../utils/formatters';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Skeleton from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const AdminReviews = () => {
  const { setPageTitle } = useSettings();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'approved'
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    setPageTitle('Moderate Customer Reviews');
    fetchReviews();
  }, [filter, setPageTitle]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const res = await api.get('/reviews', { params });
      if (res.data?.success) setReviews(res.data.data);
    } catch (err) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleApprove = async (rev) => {
    try {
      const res = await api.put(`/reviews/${rev._id}`, {
        isApproved: !rev.isApproved
      });
      if (res.data?.success) {
        toast.success(rev.isApproved ? 'Review unapproved' : 'Review approved for public display');
        fetchReviews();
      }
    } catch (err) {
      toast.error('Failed to update review approval');
    }
  };

  const handleToggleHome = async (rev) => {
    try {
      const res = await api.put(`/reviews/${rev._id}`, {
        showOnHome: !rev.showOnHome
      });
      if (res.data?.success) {
        toast.success(rev.showOnHome ? 'Removed from homepage' : 'Pinned to homepage testimonials');
        fetchReviews();
      }
    } catch (err) {
      toast.error('Failed to toggle homepage display');
    }
  };

  const handleDeleteReview = async () => {
    if (!deletingId) return;
    try {
      await api.delete(`/reviews/${deletingId}`);
      toast.success('Review deleted');
      setDeletingId(null);
      fetchReviews();
    } catch (err) {
      toast.error('Failed to delete review');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-200 pb-6">
        <div>
          <span className="eyebrow">REPUTATION & REVIEWS</span>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">
            Customer Commission Reviews
          </h1>
          <p className="text-xs text-charcoal-500 mt-1">
            Approve verified client feedback and choose testimonials for the homepage carousel.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['all', 'pending', 'approved'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                filter === f
                  ? 'bg-terracotta-500 text-white'
                  : 'bg-white text-charcoal-700 border border-cream-200 hover:bg-cream-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-cream-200 shadow-card overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            <Skeleton count={4} className="h-16" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center">
            <EmptyState
              icon={Star}
              title="No reviews found"
              description="No customer reviews submitted under this filter."
            />
          </div>
        ) : (
          <div className="divide-y divide-cream-100">
            {reviews.map((rev) => (
              <div key={rev._id} className="p-6 hover:bg-cream-50/50 transition-colors space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-serif font-bold text-sm text-charcoal-900">
                      {rev.customer?.name || 'Customer'}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-cream-300'
                          }`}
                        />
                      ))}
                    </div>
                    {rev.artwork && (
                      <span className="text-xs text-charcoal-500">
                        ({rev.artwork.title})
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={rev.isApproved ? 'sage' : 'amber'}>
                      {rev.isApproved ? 'Approved' : 'Pending Approval'}
                    </Badge>
                    {rev.showOnHome && (
                      <Badge variant="terracotta">On Homepage</Badge>
                    )}
                    <span className="text-xs text-charcoal-400">
                      {formatDate(rev.createdAt)}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-charcoal-700 italic bg-cream-100/50 p-3.5 rounded-2xl leading-relaxed">
                  "{rev.comment}"
                </p>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    variant={rev.isApproved ? 'secondary' : 'primary'}
                    size="sm"
                    onClick={() => handleToggleApprove(rev)}
                  >
                    {rev.isApproved ? 'Unapprove' : 'Approve Review'}
                  </Button>

                  {rev.isApproved && (
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Home}
                      onClick={() => handleToggleHome(rev)}
                    >
                      {rev.showOnHome ? 'Remove from Home' : 'Feature on Home'}
                    </Button>
                  )}

                  <button
                    onClick={() => setDeletingId(rev._id)}
                    className="p-2 text-charcoal-400 hover:text-rose-600 rounded-lg"
                    title="Delete review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteReview}
        title="Delete Review?"
        message="This review will be permanently deleted from the database."
      />
    </div>
  );
};

export default AdminReviews;
