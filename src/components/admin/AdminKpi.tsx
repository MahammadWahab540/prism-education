import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AdminKpiProps {
  title: string;
  value: number | string;
  delta?: number; // positive / negative percentage
  icon: React.ElementType;
  sparkline?: number[];
  onClick?: () => void;
}

export function AdminKpi({ title, value, delta, icon: Icon, sparkline, onClick }: AdminKpiProps) {
  const isNumber = typeof value === 'number';
  const formatted = isNumber ? new Intl.NumberFormat().format(value as number) : value;
  const dir: 'up' | 'down' | null = typeof delta === 'number' ? (delta >= 0 ? 'up' : 'down') : null;
  return (
    <Card role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : -1}
      onClick={onClick}
      onKeyDown={(e) => { if (onClick && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onClick(); } }}
      className={cn('glass-card p-3 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer')}
      aria-label={`${title}: ${formatted}`}
    >
      <CardContent className="p-0 flex items-center gap-3">
        <div className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center" aria-hidden>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground truncate">{title}</p>
          <div className="flex items-end justify-between gap-2">
            <p className="text-lg font-bold" aria-live="polite">{formatted}</p>
            <div className="flex items-center gap-2">
              {typeof delta === 'number' && (
                <span className={cn('text-[11px] px-1.5 py-0.5 rounded-full', dir === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>
                  <span aria-hidden>{dir === 'up' ? '▲' : '▼'} {Math.abs(delta).toFixed(1)}%</span>
                  <span className="sr-only">{dir === 'up' ? 'up' : 'down'} vs previous week</span>
                </span>
              )}
              {sparkline && sparkline.length > 1 && (
                <svg width="48" height="18" viewBox="0 0 48 18" aria-hidden>
                  {(() => {
                    const max = Math.max(...sparkline);
                    const min = Math.min(...sparkline);
                    const pts = sparkline.map((v, i) => {
                      const x = (i / (sparkline.length - 1)) * 48;
                      const y = 18 - ((v - min) / (max - min || 1)) * 16 - 1;
                      return `${x},${y}`;
                    }).join(' ');
                    return <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
                  })()}
                </svg>
              )}
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">vs previous week</p>
        </div>
      </CardContent>
    </Card>
  );
}

