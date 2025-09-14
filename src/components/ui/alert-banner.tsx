import React from 'react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';

export type AlertVariant = 'success' | 'warning' | 'error' | 'info';

interface AlertBannerProps {
  variant: AlertVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const alertConfig = {
  success: {
    className: 'border-accent-success/20 bg-accent-success/5 text-accent-success [&>svg]:text-accent-success',
    icon: CheckCircle,
  },
  warning: {
    className: 'border-accent-warning/20 bg-accent-warning/5 text-accent-warning [&>svg]:text-accent-warning',
    icon: AlertTriangle,
  },
  error: {
    className: 'border-accent-error/20 bg-accent-error/5 text-accent-error [&>svg]:text-accent-error',
    icon: XCircle,
  },
  info: {
    className: 'border-primary/20 bg-primary/5 text-primary [&>svg]:text-primary',
    icon: Info,
  },
};

export function AlertBanner({ variant, title, children, className }: AlertBannerProps) {
  const config = alertConfig[variant];
  const Icon = config.icon;

  return (
    <Alert className={cn(config.className, className)}>
      <Icon className="h-4 w-4" />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}