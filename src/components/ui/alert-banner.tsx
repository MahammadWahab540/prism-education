import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { AlertTriangle, CheckCircle, Info, X } from "lucide-react"

const alertBannerVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive: "border-accent-error/50 text-accent-error-foreground [&>svg]:text-accent-error",
        success: "border-accent-success/50 text-accent-success-foreground [&>svg]:text-accent-success",
        warning: "border-accent-warning/50 text-accent-warning-foreground [&>svg]:text-accent-warning",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const AlertBanner = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertBannerVariants> & {
    icon?: React.ReactNode
    dismissible?: boolean
    onDismiss?: () => void
  }
>(({ className, variant, icon, dismissible, onDismiss, children, ...props }, ref) => {
  const getDefaultIcon = () => {
    switch (variant) {
      case "destructive":
        return <AlertTriangle className="h-4 w-4" />
      case "success":
        return <CheckCircle className="h-4 w-4" />
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertBannerVariants({ variant }), className)}
      {...props}
    >
      {icon || getDefaultIcon()}
      <div className="flex-1">{children}</div>
      {dismissible && (
        <button
          onClick={onDismiss}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      )}
    </div>
  )
})
AlertBanner.displayName = "AlertBanner"

export { AlertBanner, alertBannerVariants }