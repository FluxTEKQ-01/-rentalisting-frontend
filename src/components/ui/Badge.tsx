import type { ReactNode } from 'react';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'info';
  children: ReactNode;
}

const variants = {
  success: 'badge-success',
  warning: 'badge-warning',
  error: 'badge-error',
  info: 'badge-info',
};

export default function Badge({ variant = 'info', children }: BadgeProps) {
  return <span className={variants[variant]}>{children}</span>;
}
