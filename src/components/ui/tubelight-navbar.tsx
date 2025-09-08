import React from "react"
import { LucideIcon } from "lucide-react"

interface NavItem {
  name: string
  url?: string
  icon: LucideIcon
  onClick?: () => void
}

interface NavBarProps {
  items: NavItem[]
  className?: string
  activeItem?: string
}

export function TubelightNavbar({}: NavBarProps) {
  // Component intentionally removed per request
  return null
}
