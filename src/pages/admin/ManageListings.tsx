import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { propertyApi } from '../../api/endpoints';
import { Card, StatusBadge, SearchBar, Select, LoadingSpinner, EmptyState, Pagination } from '../../components/ui';
import type { Property } from '../../types';

const statusFilters = [
  { value: '', label: 'All Status' },
  { value: 'submitted,pending_review', label: 'Pending Review' },
  { value: 'published', label: 'Published' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'archived', label: 'Archived' },
];

export default function ManageListings() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('submitted,pending_review');
  const [page, setPage] = useState(1);

  const queryParams: Record<string, string | undefined> = {
    page: String(page),
    limit: '20',
  };
  if (search) queryParams.keyword = search;
  if (statusFilter) queryParams.status = statusFilter;

  const { data, isLoading } = useQuery({
    queryKey: ['admin-listings', queryParams],
    queryFn: () => propertyApi.list(queryParams),
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary font-display">Manage Listings</h1>
        <p className="text-neutral-700">Review and manage all property listings</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar value={search} onChange={setSearch} placeholder="Search listings..." />
        </div>
        <div className="w-full md:w-48">
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
        <EmptyState title="No listings found" description="Try adjusting your filters" />
      ) : (
        <>
          <div className="space-y-3">
            {data.data.map((property: Property) => (
              <Link key={property._id} to={`/admin/listings/${property._id}/review`}>
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="w-14 h-14 rounded-lg bg-[#E2E8F0] overflow-hidden shrink-0">
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
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-neutral-900 truncate">{property.title}</p>
                          <StatusBadge status={property.status} />
                        </div>
                        <p className="text-sm text-neutral-700">
                          {property.owner?.name} — {property.location.city} — ₹{property.price.toLocaleString()}/mo
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-neutral-700/40 shrink-0">
                      {new Date(property.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          <Pagination page={page} totalPages={data.pagination.totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
