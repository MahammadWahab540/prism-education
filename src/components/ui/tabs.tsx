import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      className,
      // Standardized tabs container styling via tokens
      "inline-flex items-center justify-center gap-1 p-1",
      "bg-muted text-muted-foreground border border-border",
      "rounded-[var(--radius)] shadow-soft"
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      className,
      // Standardized trigger: pill, height, padding
      "inline-flex items-center justify-center whitespace-nowrap gap-2",
      "rounded-full h-10 px-3 text-sm font-medium",
      // Focus and disabled states
      "ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      // Default + hover + active states using tokens
      "text-muted-foreground",
      // Inactive → hover to primary with inverted text
      "data-[state=inactive]:hover:bg-primary data-[state=inactive]:hover:text-primary-foreground hover-text-invert",
      // Active → primary with inverted text
      "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-elevated"
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
