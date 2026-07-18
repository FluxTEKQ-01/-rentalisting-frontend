import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/endpoints';
import { Card, LoadingSpinner } from '../../components/ui';

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminApi.getDashboard(),
  });

  const stats = data?.data;

  const widgets = [
    { label: 'Total Listings', value: stats?.totalListings || 0, color: 'bg-primary/10 text-primary', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { label: 'Pending Review', value: stats?.pendingListings || 0, color: 'bg-secondary/10 text-secondary', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Approved', value: stats?.approvedListings || 0, color: 'bg-success/10 text-success', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Rejected', value: stats?.rejectedListings || 0, color: 'bg-error/10 text-error', icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Total Users', value: stats?.totalUsers || 0, color: 'bg-primary/10 text-primary', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { label: 'Total Reviews', value: stats?.totalReviews || 0, color: 'bg-accent/10 text-accent', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
  ];

  if (isLoading) return <LoadingSpinner className="py-20" />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary font-display">Admin Dashboard</h1>
        <p className="text-neutral-700">Overview of your rental platform</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {widgets.map((widget) => (
          <Card key={widget.label} className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-700">{widget.label}</p>
                <p className="stat-value mt-1">{widget.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${widget.color} flex items-center justify-center`}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={widget.icon} />
                </svg>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {stats && stats.pendingListings > 0 && (
        <Card className="p-6 mt-8 bg-secondary/5 border border-secondary/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-lg text-primary font-display">Pending Review</h2>
              <p className="text-neutral-700">
                {stats.pendingListings} listing{stats.pendingListings > 1 ? 's' : ''} waiting for your review
              </p>
            </div>
            <Link to="/admin/listings" className="btn-primary">Review Now</Link>
          </div>
        </Card>
      )}
    </div>
  );
}
