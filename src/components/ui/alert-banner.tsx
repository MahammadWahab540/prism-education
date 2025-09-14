import * as React from 'react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export type AlertVariant =
  | 'default'
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'destructive';

interface AlertBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  /** Override the default icon for the chosen variant */
  icon?: React.ReactNode;
  /** Show a close button on the right */
  dismissible?: boolean;
  /** Called when the close button is pressed */
  onDismiss?: () => void;
  className?: string;
  children: React.ReactNode;
}

const variantConfig: Record<
  AlertVariant,
  { className: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }
> = {
  default: {
    className:
      'border-border/80 bg-card text-card-foreground [&>svg]:text-foreground',
    icon: Info,
  },
  info: {
    className:
      'border-primary/20 bg-primary/5 text-primary [&>svg]:text-primary',
    icon: Info,
  },
  success: {
    className:
      'border-accent-success/20 bg-accent-success/5 text-accent-success [&>svg]:text-accent-success',
    icon: CheckCircle,
  },
  warning: {
    className:
      'border-accent-warning/20 bg-accent-warning/5 text-accent-warning [&>svg]:text-accent-warning',
    icon: AlertTriangle,
  },
  error: {
    className:
      'border-accent-error/20 bg-accent-error/5 text-accent-error [&>svg]:text-accent-error',
    icon: XCircle,
  },
  destructive: {
    className:
      'border-accent-error/50 bg-accent-error/5 text-accent-error [&>svg]:text-accent-error',
    icon: AlertTriangle,
  },
};

export const AlertBanner = React.forwardRef<HTMLDivElement, AlertBannerProps>(
  (
    {
      variant = 'default',
      title,
      icon,
      dismissible,
      onDismiss,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const cfg = variantConfig[variant];
    const Icon = cfg.icon;

    return (
      <Alert
        ref={ref}
        role="alert"
        className={cn(
          'relative w-full rounded-lg p-4',
          // Keep shadcn alert flow with leading icon
          // and ensure spacing/positioning feels right.
          '[&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4',
          cfg.className,
          className
        )}
        {...props}
      >
        {icon ?? <Icon className="h-4 w-4" aria-hidden="true" />}
        <div className="flex-1">
          {title && <AlertTitle>{title}</AlertTitle>}
          <AlertDescription>{children}</AlertDescription>
        </div>

        {dismissible && (
          <button
            type="button"
            onClick={onDismiss}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </Alert>
    );
  }
);

AlertBanner.displayName = 'AlertBanner';