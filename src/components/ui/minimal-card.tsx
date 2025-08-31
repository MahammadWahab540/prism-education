import * as React from "react"
import { cn } from "@/lib/utils"

const MinimalCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "group relative overflow-hidden rounded-lg bg-card border border-border transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1",
      className
    )}
    {...props}
  />
))
MinimalCard.displayName = "MinimalCard"

const MinimalCardImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, ...props }, ref) => (
  <img
    ref={ref}
    className={cn(
      "aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105",
      className
    )}
    {...props}
  />
))
MinimalCardImage.displayName = "MinimalCardImage"

const MinimalCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "px-4 pt-4 pb-2 text-lg font-semibold leading-none tracking-tight text-foreground",
      className
    )}
    {...props}
  />
))
MinimalCardTitle.displayName = "MinimalCardTitle"

const MinimalCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "px-4 pb-4 text-sm text-muted-foreground leading-relaxed",
      className
    )}
    {...props}
  />
))
MinimalCardDescription.displayName = "MinimalCardDescription"

export { MinimalCard, MinimalCardImage, MinimalCardTitle, MinimalCardDescription }