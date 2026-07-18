import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewApi, adminApi } from '../../api/endpoints';
import { Card, Button, LoadingSpinner, EmptyState } from '../../components/ui';
import toast from 'react-hot-toast';

export default function ManageReviews() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: () => adminApi.getReviews(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => reviewApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      toast.success('Review deleted');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to delete review'),
  });

  if (isLoading) return <LoadingSpinner className="py-12" />;

  const reviews = data?.data || [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary font-display">Manage Reviews</h1>
        <p className="text-neutral-700">View and moderate user reviews</p>
      </div>

      {reviews.length === 0 ? (
        <EmptyState title="No reviews yet" description="Reviews from users will appear here" />
      ) : (
        <div className="space-y-3">
          {reviews.map((review: any) => (
            <Card key={review._id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                    {review.user?.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-sm">{review.user?.name || 'Anonymous'}</p>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-3.5 h-3.5 ${i < review.rating ? 'text-secondary' : 'text-neutral-900/15'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-neutral-700">{review.comment}</p>
                    <p className="text-xs text-neutral-700/40 mt-1">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    if (window.confirm('Delete this review?')) {
                      deleteMutation.mutate(review._id);
                    }
                  }}
                  loading={deleteMutation.isPending}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
