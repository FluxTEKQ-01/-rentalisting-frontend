import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '../../api/endpoints';
import { Card, Button, LoadingSpinner, EmptyState } from '../../components/ui';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { Notification } from '../../types';

export default function OwnerNotifications() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.list(),
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationApi.markAsRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markAllMutation = useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('All notifications marked as read');
    },
  });

  const notifications = data?.data || [];
  const unreadCount = (data as any)?.unreadCount || 0;

  const getNotificationLink = (notif: Notification) => {
    if (notif.type === 'listing_rejected' || notif.type === 'feedback_available') {
      const propertyId = (notif.metadata as any)?.propertyId;
      return propertyId ? `/owner/listings/${propertyId}/edit` : '#';
    }
    return '/owner/listings';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary font-display">Notifications</h1>
          <p className="text-neutral-700">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={() => markAllMutation.mutate()} loading={markAllMutation.isPending}>
            Mark All Read
          </Button>
        )}
      </div>

      {isLoading ? (
        <LoadingSpinner className="py-12" />
      ) : notifications.length === 0 ? (
        <EmptyState
          title="No notifications"
          description="You'll see notifications here when your listings are reviewed"
        />
      ) : (
        <div className="space-y-2">
          {notifications.map((notif: Notification) => (
            <Link key={notif._id} to={getNotificationLink(notif)} onClick={() => { if (!notif.isRead) markReadMutation.mutate(notif._id); }}>
              <Card className={`p-4 hover:shadow-md transition-shadow ${!notif.isRead ? 'border-l-4 border-primary bg-primary/5' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${!notif.isRead ? 'text-primary' : 'text-neutral-900'}`}>
                      {notif.title}
                    </p>
                    <p className="text-sm text-neutral-700 mt-1">{notif.message}</p>
                    <p className="text-xs text-neutral-700/40 mt-1">
                      {new Date(notif.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {!notif.isRead && (
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
