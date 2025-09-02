import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressCircleProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showValue?: boolean;
}

export function ProgressCircle({ 
  value, 
  size = 'md', 
  className,
  showValue = true 
}: ProgressCircleProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24', 
    lg: 'w-32 h-32'
  };

  const strokeWidth = {
    sm: 3,
    md: 4,
    lg: 6
  };

  const radius = {
    sm: 18,
    md: 40,
    lg: 58
  };

  const circumference = 2 * Math.PI * radius[size];
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      <svg
        className="w-full h-full transform -rotate-90"
        viewBox={`0 0 ${radius[size] * 2 + strokeWidth[size] * 2} ${radius[size] * 2 + strokeWidth[size] * 2}`}
      >
        {/* Background circle */}
        <circle
          cx={radius[size] + strokeWidth[size]}
          cy={radius[size] + strokeWidth[size]}
          r={radius[size]}
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth[size]}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={radius[size] + strokeWidth[size]}
          cy={radius[size] + strokeWidth[size]}
          r={radius[size]}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth[size]}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-700 ease-out"
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(235 75% 65%)" />
          </linearGradient>
        </defs>
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn(
            'font-bold text-foreground',
            size === 'sm' && 'text-xs',
            size === 'md' && 'text-lg',
            size === 'lg' && 'text-2xl'
          )}>
            {value}
          </span>
        </div>
      )}
    </div>
  );
}