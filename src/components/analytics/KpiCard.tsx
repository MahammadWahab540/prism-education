import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export interface KpiCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  delta?: { value: number; direction: 'up' | 'down' } | null;
  sparkline?: number[];
  info?: string;
  onClick?: () => void;
  'data-testid'?: string;
}

export function KpiCard({ icon: Icon, title, value, delta, sparkline, info, onClick, ...rest }: KpiCardProps) {
  const deltaText = delta ? `${delta.direction === 'up' ? '▲' : '▼'} ${Math.abs(delta.value).toFixed(1)}% vs previous period` : undefined;
  return (
    <Card
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : -1}
      onClick={onClick}
      onKeyDown={(e) => { if (onClick && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onClick(); } }}
      className={cn('glass-card focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer')}
      {...rest}
    >
      <CardContent className="p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-md bg-primary/10 text-primary flex items-center justify-center" aria-hidden>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            {info && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-xs text-muted-foreground underline decoration-dotted cursor-help" aria-label={`Info: ${title}`}>info</span>
                </TooltipTrigger>
                <TooltipContent>{info}</TooltipContent>
              </Tooltip>
            )}
          </div>
          <div className="flex items-end justify-between mt-1">
            <p className="text-2xl font-bold">{value}</p>
            <div className="flex items-center gap-3">
              {delta && (
                <span className={cn('text-xs px-2 py-0.5 rounded-full', delta.direction === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}
                      aria-label={deltaText}
                >
                  {deltaText}
                </span>
              )}
              {sparkline && sparkline.length > 1 && (
                <svg width="64" height="24" viewBox="0 0 64 24" aria-hidden>
                  {(() => {
                    const max = Math.max(...sparkline);
                    const min = Math.min(...sparkline);
                    const points = sparkline.map((v, i) => {
                      const x = (i / (sparkline.length - 1)) * 64;
                      const y = 24 - ((v - min) / (max - min || 1)) * 22 - 1;
                      return `${x},${y}`;
                    }).join(' ');
                    return <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
                  })()}
                </svg>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

