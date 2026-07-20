import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { propertyApi, adminApi, propertyCategories } from '../../api/endpoints';
import { toEmbedUrl } from '../../utils/video';
import { Button, Card, Modal, LoadingSpinner, Badge } from '../../components/ui';

export default function ReviewListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackError, setFeedbackError] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: () => propertyApi.getById(id!),
    enabled: !!id,
  });

  const invalidateAfterReview = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-listings'] });
    queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
  };

  const approveMutation = useMutation({
    mutationFn: () => adminApi.approveProperty(id!),
    onSuccess: () => {
      invalidateAfterReview();
      toast.success('Listing approved and published!');
      navigate('/admin/listings');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to approve'),
  });

  const rejectMutation = useMutation({
    mutationFn: () => adminApi.rejectProperty(id!, feedback),
    onSuccess: () => {
      invalidateAfterReview();
      toast.success('Listing rejected with feedback');
      setRejectModalOpen(false);
      navigate('/admin/listings');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to reject'),
  });

  const handleReject = () => {
    if (!feedback || feedback.trim().length < 10) {
      setFeedbackError('Feedback must be at least 10 characters');
      return;
    }
    setFeedbackError('');
    rejectMutation.mutate();
  };

  if (isLoading) return <LoadingSpinner className="py-20" />;
  if (!data?.data?.property) return <div className="text-center py-20 text-neutral-800/60">Property not found</div>;

  const property = data.data.property;
  const isPending = property.status === 'submitted' || property.status === 'pending_review';
  const categoryLabel = propertyCategories.find((c) => c.value === property.propertyType)?.label || property.propertyType;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary font-display">Review Listing</h1>
          <p className="text-neutral-700">Review and take action on this property listing</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/listings')}>Back</Button>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-xl font-bold text-primary font-display">{property.title}</h2>
                <Badge variant={property.status === 'rejected' ? 'error' : property.status === 'published' ? 'success' : 'warning'}>
                  {property.status}
                </Badge>
              </div>
              <p className="text-neutral-700">
                {property.location.address && `${property.location.address}, `}{property.location.city}, {property.location.state}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-accent">₹{property.price.toLocaleString()}</p>
              <p className="text-sm text-neutral-700/60">per month</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 py-4 border-y border-[#E2E8F0] mb-4">
            {property.bedrooms > 0 && <span className="text-sm"><strong>{property.bedrooms}</strong> Beds</span>}
            {property.bathrooms > 0 && <span className="text-sm"><strong>{property.bathrooms}</strong> Baths</span>}
            <span className="text-sm"><strong>{property.area}</strong> {property.areaUnit}</span>
            <span className="text-sm"><Badge variant="info">{categoryLabel}</Badge></span>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold text-primary font-display mb-2">Description</h3>
            <p className="text-neutral-700 text-sm whitespace-pre-line">{property.description}</p>
          </div>

          {property.amenities?.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold text-primary font-display mb-2">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((a: string) => (
                  <span key={a} className="px-2 py-1 bg-primary/5 text-primary rounded text-xs font-medium">{a}</span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-neutral-700/60">Owner:</span>
              <p className="font-medium">{property.owner?.name}</p>
              <p className="text-neutral-700/60">{property.owner?.email}</p>
            </div>
            <div>
              <span className="text-neutral-700/60">Submitted:</span>
              <p className="font-medium">
                {new Date(property.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </Card>

        {property.images && property.images.length > 0 && (
          <Card className="p-6">
            <h3 className="font-semibold text-primary font-display mb-3">Images ({property.images.length})</h3>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
              {property.images.map((img: any, i: number) => (
                <a key={i} href={img.url} target="_blank" rel="noopener noreferrer" className="aspect-square rounded-lg overflow-hidden bg-[#E2E8F0]">
                  <img src={img.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                </a>
              ))}
            </div>
          </Card>
        )}

        {property.videoUrl && (
          <Card className="p-6">
            <h3 className="font-semibold text-primary font-display mb-3">Video</h3>
            <div className="aspect-video rounded-xl overflow-hidden bg-[#E2E8F0]">
               <iframe src={toEmbedUrl(property.videoUrl)} className="w-full h-full" allowFullScreen title="Property video" />
            </div>
          </Card>
        )}

        {isPending && (
          <Card className="p-6">
            <h3 className="font-semibold text-primary font-display mb-4">Actions</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => approveMutation.mutate()}
                loading={approveMutation.isPending}
                className="flex-1"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Approve & Publish
              </Button>
              <Button
                variant="danger"
                onClick={() => setRejectModalOpen(true)}
                className="flex-1"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Reject with Feedback
              </Button>
            </div>
          </Card>
        )}

        {property.feedback && (
          <Card className="p-6 border-l-4 border-error">
            <h3 className="font-semibold text-error mb-2">Previous Feedback</h3>
            <p className="text-sm text-neutral-700">{property.feedback}</p>
          </Card>
        )}
      </div>

      <Modal isOpen={rejectModalOpen} onClose={() => { setRejectModalOpen(false); setFeedback(''); setFeedbackError(''); }} title="Reject Listing">
        <div className="space-y-4">
          <p className="text-sm text-neutral-700">
            You are about to reject <strong>{property.title}</strong>. Feedback is required so the owner can make corrections.
          </p>
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-1.5">
              Feedback <span className="text-error">*</span>
            </label>
            <textarea
              value={feedback}
              onChange={(e) => { setFeedback(e.target.value); setFeedbackError(''); }}
              placeholder="Explain why this listing is being rejected. What needs to be corrected?"
              rows={5}
              className={`input-field resize-none ${feedbackError ? 'ring-2 ring-error/30 border-error' : ''}`}
            />
            {feedbackError && <p className="mt-1 text-sm text-error">{feedbackError}</p>}
            <p className="mt-1 text-xs text-neutral-700/40">{feedback.length} / 1000 characters (min 10 required)</p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => { setRejectModalOpen(false); setFeedback(''); setFeedbackError(''); }}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleReject}
              loading={rejectMutation.isPending}
              disabled={feedback.trim().length < 10}
            >
              Confirm Reject
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
