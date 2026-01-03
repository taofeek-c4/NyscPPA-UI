import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: 'approved' | 'rejected' | 'submitted' | 'draft' | 'pending';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    approved: {
      label: 'Approved',
      className: 'badge-approved',
      icon: CheckCircle,
    },
    rejected: {
      label: 'Rejected',
      className: 'badge-rejected',
      icon: XCircle,
    },
    submitted: {
      label: 'Submitted',
      className: 'badge-pending',
      icon: Clock,
    },
    pending: {
      label: 'Pending',
      className: 'badge-pending',
      icon: Clock,
    },
    draft: {
      label: 'Draft',
      className: 'bg-muted text-muted-foreground border-muted-foreground/20',
      icon: Clock,
    },
  }[status];

  const Icon = config.icon;

  return (
    <span className={cn('badge-status', config.className)}>
      <Icon className="w-3.5 h-3.5 mr-1.5" />
      {config.label}
    </span>
  );
}
