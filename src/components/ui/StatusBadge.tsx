import Badge from './Badge';
import type { PropertyStatus } from '../../types';

const statusConfig: Record<PropertyStatus, { label: string; variant: 'success' | 'warning' | 'error' | 'info' }> = {
  draft: { label: 'Draft', variant: 'info' },
  submitted: { label: 'Submitted', variant: 'warning' },
  pending_review: { label: 'Pending Review', variant: 'warning' },
  approved: { label: 'Approved', variant: 'success' },
  rejected: { label: 'Rejected', variant: 'error' },
  published: { label: 'Published', variant: 'success' },
  archived: { label: 'Archived', variant: 'info' },
};

export default function StatusBadge({ status }: { status: PropertyStatus }) {
  const config = statusConfig[status] || { label: status, variant: 'info' as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
