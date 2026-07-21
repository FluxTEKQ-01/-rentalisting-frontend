import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api/endpoints';
import { Button, Select, LoadingSpinner, EmptyState, Pagination, Badge, Modal } from '../../components/ui';
import toast from 'react-hot-toast';

export default function ManageUsers() {
  const queryClient = useQueryClient();
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [deletingUser, setDeletingUser] = useState<any | null>(null);

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

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User profile deleted successfully');
      setDeletingUser(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    },
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
                <tr className="text-left text-sm text-neutral-700 border-b border-[#E2E8F0]">
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
                  <tr key={user._id} className="border-b border-[#E2E8F0] text-sm">
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
                      <div className="flex items-center gap-2">
                        <Button
                          variant={user.isActive ? 'ghost' : 'outline'}
                          size="sm"
                          onClick={() => toggleStatusMutation.mutate(user._id)}
                          loading={toggleStatusMutation.isPending}
                        >
                          {user.isActive ? 'Suspend' : 'Activate'}
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setDeletingUser(user)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination page={page} totalPages={data.pagination.totalPages} onPageChange={setPage} />
        </>
      )}

      {/* Confirmation Modal for User Deletion */}
      <Modal
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        title="Delete User Account"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-red-600 bg-red-50 p-3.5 rounded-lg border border-red-200">
            <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-semibold text-sm">Warning: Permanent Deletion</p>
              <p className="text-xs text-red-700 mt-0.5">This action cannot be undone.</p>
            </div>
          </div>

          <p className="text-sm text-neutral-700 leading-relaxed">
            Are you sure you want to completely delete the user profile for{' '}
            <span className="font-bold text-neutral-900">{deletingUser?.name}</span> ({deletingUser?.email})?
          </p>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeletingUser(null)}
              disabled={deleteUserMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => deletingUser && deleteUserMutation.mutate(deletingUser._id)}
              loading={deleteUserMutation.isPending}
            >
              Yes, Delete User
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
