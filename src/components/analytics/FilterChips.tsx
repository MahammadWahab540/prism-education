import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface FilterChipsProps {
  audience?: string;
  rangeLabel?: string;
  segment?: string | null;
  onClearAll?: () => void;
  onRemove?: (key: 'audience' | 'range' | 'segment') => void;
}

export function FilterChips({ audience, rangeLabel, segment, onClearAll, onRemove }: FilterChipsProps) {
  const items = [
    audience && { key: 'audience' as const, label: `Audience: ${audience}` },
    rangeLabel && { key: 'range' as const, label: `Range: ${rangeLabel}` },
    segment && { key: 'segment' as const, label: `Segment: ${segment}` },
  ].filter(Boolean) as { key: 'audience' | 'range' | 'segment', label: string }[];

  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      {items.map(it => (
        <Badge key={it.key} variant="secondary" className="rounded-full">
          <span>{it.label}</span>
          <button aria-label={`Clear ${it.key}`} className="ml-2" onClick={() => onRemove?.(it.key)}>×</button>
        </Badge>
      ))}
      <Button variant="ghost" size="sm" onClick={onClearAll}>Clear All</Button>
    </div>
  );
}

