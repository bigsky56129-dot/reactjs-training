import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/use-auth';
import { hasPermission } from '../../utils/rbac';
import { getAllKYCReviews, submitKYCReview, fetchUserById, KYCReview, APIUser } from '../../services/api';

type ReviewWithUser = KYCReview & { user?: APIUser };

const ReviewPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewStatus, setReviewStatus] = useState<'approved' | 'rejected'>('approved');
  const [submitting, setSubmitting] = useState(false);

  // Check permissions
  useEffect(() => {
    if (!currentUser || !hasPermission(currentUser.role, 'access:review-page')) {
      navigate('/pages/unauthorized');
    }
  }, [currentUser, navigate]);

  // Load all reviews
  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const reviewsData = await getAllKYCReviews();
        
        // Fetch user details for each review
        const reviewsWithUsers = await Promise.all(
          reviewsData.map(async (review) => {
            try {
              const user = await fetchUserById(review.userId);
              return { ...review, user };
            } catch (err) {
              return review;
            }
          })
        );

        setReviews(reviewsWithUsers);
      } catch (err: any) {
        console.error(err);
        setError(err?.message ?? 'Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && hasPermission(currentUser.role, 'access:review-page')) {
      loadReviews();
    }
  }, [currentUser]);

  const handleSubmitReview = async () => {
    if (!selectedUserId || !currentUser) return;

    setSubmitting(true);
    setError(null);

    try {
      const review: KYCReview = {
        id: `review-${Date.now()}`,
        userId: selectedUserId,
        status: reviewStatus,
        reviewedBy: currentUser.name,
        reviewedAt: new Date().toISOString(),
        notes: reviewNotes,
      };

      await submitKYCReview(review);

      // Reload reviews
      const reviewsData = await getAllKYCReviews();
      const reviewsWithUsers = await Promise.all(
        reviewsData.map(async (r) => {
          try {
            const user = await fetchUserById(r.userId);
            return { ...r, user };
          } catch (err) {
            return r;
          }
        })
      );

      setReviews(reviewsWithUsers);
      setSelectedUserId(null);
      setReviewNotes('');
      setReviewStatus('approved');
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">KYC Review Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Review and approve user KYC submissions
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reviews List */}
        <div className="bg-white shadow rounded-lg p-6 dark:bg-gray-800">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">All Reviews</h2>
          
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No reviews submitted yet</p>
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {review.user
                          ? `${review.user.firstName ?? ''} ${review.user.lastName ?? ''}`.trim()
                          : `User #${review.userId}`}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {review.user?.email}
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        review.status === 'approved'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : review.status === 'rejected'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                      {review.status}
                    </span>
                  </div>
                  {review.notes && (
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Notes:</span> {review.notes}
                    </div>
                  )}
                  {review.reviewedBy && (
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Reviewed by {review.reviewedBy} on{' '}
                      {new Date(review.reviewedAt!).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Review Form */}
        <div className="bg-white shadow rounded-lg p-6 dark:bg-gray-800">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Submit New Review</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                User ID
              </label>
              <input
                type="text"
                value={selectedUserId ?? ''}
                onChange={(e) => setSelectedUserId(e.target.value)}
                placeholder="Enter user ID to review"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Review Status
              </label>
              <select
                value={reviewStatus}
                onChange={(e) => setReviewStatus(e.target.value as 'approved' | 'rejected')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Review Notes
              </label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={4}
                placeholder="Add notes about this review..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <button
              onClick={handleSubmitReview}
              disabled={!selectedUserId || submitting}
              className="w-full px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
