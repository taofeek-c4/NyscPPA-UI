import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: number;
  icon?: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
  className?: string;
}

export function StatCard({ label, value, icon, variant = 'default', className }: StatCardProps) {
  const valueColorClass = {
    default: 'text-foreground',
    success: 'text-success',
    warning: 'text-warning',
    destructive: 'text-destructive',
  }[variant];

  return (
    <div className={cn('card-stat', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="stat-number mb-2 tabular-nums" style={{ color: `hsl(var(--${variant === 'default' ? 'foreground' : variant}))` }}>
            {value}
          </p>
          <p className="stat-label">{label}</p>
        </div>
        {icon && (
          <div className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center',
            variant === 'default' && 'bg-primary/10 text-primary',
            variant === 'success' && 'bg-success/10 text-success',
            variant === 'warning' && 'bg-warning/10 text-warning',
            variant === 'destructive' && 'bg-destructive/10 text-destructive',
          )}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
