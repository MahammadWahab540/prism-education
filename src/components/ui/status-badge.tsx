import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertTriangle, Clock, XCircle, Info } from 'lucide-react';

export type StatusType =
  | 'default'
  | 'success'
  | 'warning'
  | 'error'
  | 'pending'
  | 'info'
  | 'destructive'
  | 'outline';

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Visual status to render */
  status?: StatusType;
  /** Optional custom icon (overrides default for the status) */
  icon?: React.ReactNode;
  /** Show the status icon */
  showIcon?: boolean;
  /** Content inside the badge */
  children: React.ReactNode;
  /** Extra classes */
  className?: string;
}

/**
 * StatusBadge — shadcn Badge-based status pill with sensible colors + icons.
 */
export function StatusBadge({
  status = 'default',
  icon,
  showIcon = true,
  className,
  children,
  ...props
}: StatusBadgeProps) {
  const config = statusStyles[status] ?? statusStyles.default;
  const Icon = config.icon;

  return (
    <Badge
      // Keep Badge variants simple; rely mostly on utility classes for color
      variant={config.variant}
      className={cn(
        // Ensure pill look + consistent spacing
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        config.className,
        className
      )}
      {...props}
    >
      {showIcon && (icon ?? <Icon className="mr-1 h-3 w-3" aria-hidden="true" />)}
      {children}
    </Badge>
  );
}

const statusStyles: Record<
  StatusType,
  {
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    className: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }
> = {
  default: {
    variant: 'default',
    className:
      'border-transparent bg-primary text-primary-foreground hover:bg-primary/90',
    icon: Info,
  },
  success: {
    variant: 'default',
    className:
      'border-accent-success/20 bg-accent-success/10 text-accent-success hover:bg-accent-success/20',
    icon: CheckCircle,
  },
  warning: {
    variant: 'secondary',
    className:
      'border-accent-warning/20 bg-accent-warning/10 text-accent-warning hover:bg-accent-warning/20',
    icon: AlertTriangle,
  },
  error: {
    variant: 'destructive',
    className:
      'border-accent-error/20 bg-accent-error/10 text-accent-error hover:bg-accent-error/20',
    icon: XCircle,
  },
  destructive: {
    variant: 'destructive',
    className:
      'border-accent-error/30 bg-accent-error/15 text-accent-error hover:bg-accent-error/25',
    icon: XCircle,
  },
  pending: {
    variant: 'outline',
    className:
      'border-muted-foreground/20 bg-muted/50 text-muted-foreground hover:bg-muted',
    icon: Clock,
  },
  info: {
    variant: 'default',
    className:
      'border-primary/20 bg-primary/10 text-primary hover:bg-primary/20',
    icon: Info,
  },
  outline: {
    variant: 'outline',
    className: 'text-foreground',
    icon: Info,
  },
};