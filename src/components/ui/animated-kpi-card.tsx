
"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface AnimatedKpiCardProps {
  label: string
  value: string
  change?: string
  trend?: 'up' | 'down'
  icon: LucideIcon
  className?: string
  animationType?: 'progress' | 'pulse' | 'wave' | 'geometric'
}

const ProgressVisual: React.FC<{ progress: number; hovered: boolean }> = ({ progress, hovered }) => {
  const radius = 35
  const circumference = 2 * Math.PI * radius
  const dashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="absolute inset-0 z-[5] flex items-center justify-center">
      <svg width="100" height="100" viewBox="0 0 100 100" className="transform -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="hsl(var(--border))"
          strokeWidth="6"
          fill="transparent"
          opacity={0.2}
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="hsl(var(--primary))"
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={hovered ? dashoffset : circumference}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
    </div>
  )
}

const WaveVisual: React.FC<{ hovered: boolean }> = ({ hovered }) => {
  return (
    <div className="absolute inset-0 z-[5] overflow-hidden">
      <svg
        className="absolute bottom-0 left-0 w-full h-full"
        viewBox="0 0 200 100"
        fill="none"
      >
        <path
          d="M0,80 Q50,40 100,60 T200,50 L200,100 L0,100 Z"
          fill="hsl(var(--primary) / 0.1)"
          className={cn(
            "transition-all duration-1000 ease-in-out",
            hovered ? "translate-y-0" : "translate-y-4"
          )}
        />
        <path
          d="M0,85 Q50,45 100,65 T200,55 L200,100 L0,100 Z"
          fill="hsl(var(--accent-luxury) / 0.1)"
          className={cn(
            "transition-all duration-1000 ease-in-out",
            hovered ? "translate-y-0" : "translate-y-2"
          )}
          style={{ transitionDelay: "200ms" }}
        />
      </svg>
    </div>
  )
}

const GeometricVisual: React.FC<{ hovered: boolean }> = ({ hovered }) => {
  return (
    <div className="absolute inset-0 z-[5] flex items-center justify-center">
      <div className="relative">
        <div
          className={cn(
            "w-8 h-8 bg-primary/20 rounded-lg transition-all duration-1000 ease-in-out",
            hovered ? "rotate-180 scale-125" : "rotate-0 scale-100"
          )}
        />
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "absolute w-2 h-2 bg-accent-luxury/40 rounded-full transition-all duration-1000 ease-in-out",
              hovered ? "opacity-100" : "opacity-60"
            )}
            style={{
              top: "50%",
              left: "50%",
              transform: hovered
                ? `translate(-50%, -50%) rotate(${i * 120 + 180}deg) translateX(30px) rotate(-${i * 120 + 180}deg)`
                : `translate(-50%, -50%) rotate(${i * 120}deg) translateX(20px) rotate(-${i * 120}deg)`,
              transitionDelay: `${i * 150}ms`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

const PulseVisual: React.FC<{ hovered: boolean }> = ({ hovered }) => {
  return (
    <div className="absolute inset-0 z-[5]">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "absolute inset-2 rounded-full border-2 border-primary/20 transition-all duration-1000 ease-out",
            hovered ? "animate-ping" : ""
          )}
          style={{
            animationDelay: `${i * 300}ms`,
            animationDuration: "2s"
          }}
        />
      ))}
    </div>
  )
}

export function AnimatedKpiCard({ 
  label, 
  value, 
  change, 
  trend = 'up', 
  icon: Icon, 
  className,
  animationType = 'progress'
}: AnimatedKpiCardProps) {
  const [hovered, setHovered] = useState(false)
  const [progress] = useState(Math.floor(Math.random() * 40) + 60) // Random progress between 60-100

  const renderAnimation = () => {
    switch (animationType) {
      case 'progress':
        return <ProgressVisual progress={progress} hovered={hovered} />
      case 'wave':
        return <WaveVisual hovered={hovered} />
      case 'geometric':
        return <GeometricVisual hovered={hovered} />
      case 'pulse':
        return <PulseVisual hovered={hovered} />
      default:
        return <ProgressVisual progress={progress} hovered={hovered} />
    }
  }

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border/50 glass-card p-6 transition-all duration-500 hover:shadow-elevated hover:scale-105 cursor-pointer",
        className
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Animated Background */}
      {renderAnimation()}
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold mt-2 transition-all duration-300 group-hover:scale-110">
            {value}
          </p>
          {change && (
            <div className="flex items-center mt-2">
              <span className={cn(
                "text-sm transition-colors duration-300",
                trend === 'up' ? "text-accent-success" : "text-accent-error"
              )}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent-luxury/20 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </div>
  )
}
