import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { propertyApi } from '../../api/endpoints';
import { Card, LoadingSpinner, StatusBadge } from '../../components/ui';
import type { Property } from '../../types';

const statCards = [
  { label: 'Total Listings', key: '', color: 'bg-primary/10 text-primary', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { label: 'Published', key: 'published', color: 'bg-success/10 text-success', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { label: 'Pending', key: 'pending', color: 'bg-secondary/10 text-secondary', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { label: 'Rejected', key: 'rejected', color: 'bg-error/10 text-error', icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' },
];

export default function OwnerDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['owner-listings', { limit: '100' }],
    queryFn: () => propertyApi.getMyListings({ limit: '100' }),
  });

  const allListings = data?.data || [];
  const stats = {
    total: allListings.length,
    published: allListings.filter((p: Property) => p.status === 'published').length,
    pending: allListings.filter((p: Property) => p.status === 'pending_review' || p.status === 'submitted').length,
    rejected: allListings.filter((p: Property) => p.status === 'rejected').length,
  };

  const recentListings = allListings.slice(0, 5);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary font-display">Owner Dashboard</h1>
        <p className="text-neutral-700">Manage your property listings</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <Card key={card.label} className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-700">{card.label}</p>
                <p className="stat-value mt-1">
                  {card.key === '' ? stats.total : stats[card.key as keyof typeof stats]}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center`}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={card.icon} />
                </svg>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-primary font-display">Recent Listings</h2>
        <Link to="/owner/listings" className="text-sm text-primary font-medium hover:underline">View All</Link>
      </div>

      {isLoading ? (
        <LoadingSpinner className="py-8" />
      ) : recentListings.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-neutral-700 mb-4">You haven't created any listings yet</p>
          <Link to="/owner/listings/create">
            <button className="btn-primary">Create Your First Listing</button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {recentListings.map((property: Property) => (
            <Link key={property._id} to={`/owner/listings/${property._id}/edit`}>
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-lg bg-neutral overflow-hidden shrink-0">
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
                    <div className="min-w-0">
                      <p className="font-semibold text-neutral-900 truncate">{property.title}</p>
                      <p className="text-sm text-neutral-700">₹{property.price.toLocaleString()}/mo</p>
                    </div>
                  </div>
                  <StatusBadge status={property.status} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
