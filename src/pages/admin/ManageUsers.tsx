import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api/endpoints';
import { Card, Button, Select, LoadingSpinner, EmptyState, Pagination, Badge } from '../../components/ui';
import toast from 'react-hot-toast';

export default function ManageUsers() {
  const queryClient = useQueryClient();
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', { role: roleFilter, page: String(page) }],
    queryFn: () => adminApi.getUsers({ role: roleFilter || undefined, page: String(page), limit: '20' }),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (id: string) => adminApi.toggleUserStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User status updated');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update user'),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary font-display">Manage Users</h1>
          <p className="text-neutral-700">View and manage platform users</p>
        </div>
        <div className="w-48">
          <Select
            options={[
              { value: '', label: 'All Roles' },
              { value: 'admin', label: 'Admin' },
              { value: 'owner', label: 'Owner' },
              { value: 'visitor', label: 'Visitor' },
            ]}
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner className="py-12" />
      ) : !data?.data?.length ? (
        <EmptyState title="No users found" />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-neutral-700 border-b border-neutral-900/5">
                  <th className="pb-3 font-medium">User</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Mobile</th>
                  <th className="pb-3 font-medium">Role</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Joined</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((user: any) => (
                  <tr key={user._id} className="border-b border-neutral-900/5 text-sm">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xs">
                          {user.name?.charAt(0) || '?'}
                        </div>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-neutral-700">{user.email}</td>
                    <td className="py-3 text-neutral-700">{user.mobile}</td>
                    <td className="py-3">
                      <Badge variant={user.role === 'admin' ? 'error' : user.role === 'owner' ? 'info' : 'warning'}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Badge variant={user.isActive ? 'success' : 'error'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="py-3 text-neutral-700">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      <Button
                        variant={user.isActive ? 'ghost' : 'primary'}
                        size="sm"
                        onClick={() => toggleStatusMutation.mutate(user._id)}
                        loading={toggleStatusMutation.isPending}
                      >
                        {user.isActive ? 'Suspend' : 'Activate'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination page={page} totalPages={data.pagination.totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
