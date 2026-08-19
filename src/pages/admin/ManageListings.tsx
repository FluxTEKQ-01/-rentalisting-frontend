import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { propertyApi } from '../../api/endpoints';
import { Card, StatusBadge, SearchBar, Select, LoadingSpinner, EmptyState, Pagination, Button, Modal } from '../../components/ui';
import type { Property } from '../../types';

const statusTabs = [
  { label: 'Pending Review', value: 'submitted,pending_review' },
  { label: 'Published', value: 'published' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Drafts', value: 'draft' },
  { label: 'All Listings', value: '' },
];

const statusFilters = [
  { value: 'submitted,pending_review', label: 'Pending Review' },
  { value: 'published', label: 'Published' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'draft', label: 'Drafts' },
  { value: 'archived', label: 'Archived' },
  { value: '', label: 'All Status' },
];

export default function ManageListings() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('submitted,pending_review');
  const [page, setPage] = useState(1);
  const [deletingProperty, setDeletingProperty] = useState<Property | null>(null);

  const queryClient = useQueryClient();

  const queryParams: Record<string, string | undefined> = {
    page: String(page),
    limit: '20',
  };
  if (search) queryParams.keyword = search;
  if (statusFilter) queryParams.status = statusFilter;

  const { data, isLoading } = useQuery({
    queryKey: ['admin-listings', queryParams],
    queryFn: () => propertyApi.list(queryParams),
    staleTime: 0,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => propertyApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-listings'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Property listing deleted successfully!');
      setDeletingProperty(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete property listing');
    },
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary font-display">Manage Listings</h1>
          <p className="text-neutral-700">Review pending properties and manage all listings</p>
        </div>
        {statusFilter === 'submitted,pending_review' && data?.pagination?.total ? (
          <div className="inline-flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 text-xs font-bold text-amber-700">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            {data.pagination.total} Property Listing{data.pagination.total > 1 ? 's' : ''} Awaiting Review
          </div>
        ) : null}
      </div>

      {/* Top Status Tabs */}
      <div className="flex gap-1 mb-6 bg-surface rounded-xl p-1 shadow-xs border border-[#E2E8F0] overflow-x-auto">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setStatusFilter(tab.value);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
              statusFilter === tab.value
                ? 'bg-primary text-white shadow-xs'
                : 'text-neutral-700 hover:text-primary hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar value={search} onChange={(val) => { setSearch(val); setPage(1); }} placeholder="Search listings by title, city, or owner..." />
        </div>
        <div className="w-full md:w-56">
          <Select
            options={statusFilters}
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner className="py-12" />
      ) : !data?.data?.length ? (
        <EmptyState
          title={statusFilter === 'submitted,pending_review' ? 'No pending reviews right now' : 'No listings found'}
          description={statusFilter === 'submitted,pending_review' ? 'All submitted properties have been reviewed.' : 'Try adjusting your filters or search terms.'}
        />
      ) : (
        <>
          <div className="space-y-3">
            {data.data.map((property: Property) => (
              <Card key={property._id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-16 h-16 rounded-xl bg-[#E2E8F0] overflow-hidden shrink-0">
                      {property.images?.[0]?.url ? (
                        <img src={property.images[0].url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-700/40">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link to={`/admin/listings/${property._id}/review`} className="font-semibold text-neutral-900 hover:text-primary transition-colors truncate">
                          {property.title}
                        </Link>
                        <StatusBadge status={property.status} />
                      </div>
                      <p className="text-xs text-neutral-700 mt-1">
                        <span className="font-medium text-slate-800">{property.owner?.name || 'Owner'}</span> — {property.location.city} —{' '}
                        <strong className="text-primary font-display">
                          {property.propertyType === 'open_plot_land'
                            ? `₹${property.price.toLocaleString('en-IN')}`
                            : `₹${property.price.toLocaleString('en-IN')}/mo`}
                        </strong>
                        <span className="text-slate-400 mx-1">•</span>
                        <span>{String(property.area || '').match(/[a-zA-Z]/) ? property.area : `${property.area} ${property.areaUnit || 'sqft'}`}</span>
                      </p>
                      <p className="text-[11px] text-neutral-700/50 mt-0.5">
                        Listed on {new Date(property.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <Link to={`/admin/listings/${property._id}/review`}>
                      <Button variant="outline" size="sm" className="text-xs font-semibold">
                        {property.status === 'submitted' || property.status === 'pending_review' ? 'Review & Approve' : 'Details'}
                      </Button>
                    </Link>
                    <button
                      type="button"
                      title="Delete Property"
                      onClick={() => setDeletingProperty(property)}
                      className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Pagination page={page} totalPages={data.pagination.totalPages} onPageChange={setPage} />
        </>
      )}

      {/* Admin Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingProperty}
        onClose={() => setDeletingProperty(null)}
        title="Delete Property Listing"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-700 leading-relaxed">
            Are you sure you want to permanently delete <strong className="text-slate-900">{deletingProperty?.title}</strong>?
            This will permanently remove the listing and all associated data from BookMySpace.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setDeletingProperty(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              loading={deleteMutation.isPending}
              onClick={() => deletingProperty && deleteMutation.mutate(deletingProperty._id)}
            >
              Delete Listing
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
