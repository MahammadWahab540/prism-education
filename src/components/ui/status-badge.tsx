import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertTriangle, Clock, XCircle } from 'lucide-react';

export type StatusType = 'success' | 'warning' | 'error' | 'pending' | 'info';

interface StatusBadgeProps {
  status: StatusType;
  children: React.ReactNode;
  showIcon?: boolean;
  className?: string;
}

const statusConfig = {
  success: {
    variant: 'default' as const,
    className: 'bg-accent-success/10 text-accent-success border-accent-success/20 hover:bg-accent-success/20',
    icon: CheckCircle,
  },
  warning: {
    variant: 'secondary' as const,
    className: 'bg-accent-warning/10 text-accent-warning border-accent-warning/20 hover:bg-accent-warning/20',
    icon: AlertTriangle,
  },
  error: {
    variant: 'destructive' as const,
    className: 'bg-accent-error/10 text-accent-error border-accent-error/20 hover:bg-accent-error/20',
    icon: XCircle,
  },
  pending: {
    variant: 'outline' as const,
    className: 'bg-muted/50 text-muted-foreground border-muted-foreground/20',
    icon: Clock,
  },
  info: {
    variant: 'default' as const,
    className: 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20',
    icon: CheckCircle,
  },
};

export function StatusBadge({ status, children, showIcon = true, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge 
      variant={config.variant}
      className={cn(config.className, className)}
    >
      {showIcon && <Icon className="w-3 h-3 mr-1" />}
      {children}
    </Badge>
  );
}