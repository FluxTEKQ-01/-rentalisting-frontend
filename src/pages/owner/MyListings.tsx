import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { propertyApi } from '../../api/endpoints';
import { Card, StatusBadge, EmptyState, LoadingSpinner, Button } from '../../components/ui';
import type { Property, PropertyStatus } from '../../types';

type TabDef = {
  label: string;
  statuses: PropertyStatus[];
};

const tabs: TabDef[] = [
  { label: 'All', statuses: [] },
  { label: 'Draft', statuses: ['draft'] },
  { label: 'Pending', statuses: ['submitted', 'pending_review'] },
  { label: 'Published', statuses: ['published'] },
  { label: 'Rejected', statuses: ['rejected'] },
];

export default function MyListings() {
  const [activeTab, setActiveTab] = useState<string>('All');
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['owner-listings', { limit: '100' }],
    queryFn: () => propertyApi.getMyListings({ limit: '100' }),
  });

  const allListings = data?.data || [];
  const currentTab = tabs.find(t => t.label === activeTab) || tabs[0];
  const filteredListings = currentTab.statuses.length === 0
    ? allListings
    : allListings.filter((p: Property) => currentTab.statuses.includes(p.status));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary font-display">My Listings</h1>
          <p className="text-neutral-700">Manage your property listings</p>
        </div>
        <Link to="/owner/listings/create">
          <Button>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Listing
          </Button>
        </Link>
      </div>

      <div className="flex gap-1 mb-6 bg-surface rounded-lg p-1 shadow-sm border border-[#E2E8F0] overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.label
                ? 'bg-primary text-white'
                : 'text-neutral-700 hover:text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingSpinner className="py-12" />
      ) : filteredListings.length === 0 ? (
        <EmptyState
          title="No listings found"
          description={activeTab === 'All' ? 'Create your first listing to get started' : `No ${activeTab.toLowerCase()} listings`}
          action={activeTab === 'All' ? { label: 'Create Listing', onClick: () => navigate('/owner/listings/create') } : undefined}
        />
      ) : (
        <div className="space-y-3">
          {filteredListings.map((property: Property) => (
            <Link key={property._id} to={`/owner/listings/${property._id}/edit`}>
              <Card className={`p-4 hover:shadow-md transition-shadow ${property.status === 'rejected' ? 'border-l-4 border-error' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-16 h-16 rounded-lg bg-[#E2E8F0] overflow-hidden shrink-0">
                      {property.images?.[0]?.url ? (
                        <img src={property.images[0].url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-700/40">
                          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-neutral-900 truncate">{property.title}</p>
                      <p className="text-sm text-neutral-700">
                        {property.location.city} — ₹{property.price.toLocaleString()}/mo
                      </p>
                      {property.status === 'rejected' && property.feedback && (
                        <p className="text-xs text-error mt-1 bg-error/5 px-2 py-1 rounded inline-block">
                          Feedback: {property.feedback}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={property.status} />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
