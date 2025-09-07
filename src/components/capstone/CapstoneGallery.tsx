import React from 'react';
import { CapstoneCard } from './CapstoneCard';
import type { CapstoneConfig } from '@/types/capstone';

interface Props {
  capstones: CapstoneConfig[];
  locked?: boolean;
  onSelect: (c: CapstoneConfig) => void;
}

export function CapstoneGallery({ capstones, locked, onSelect }: Props) {
  if (!capstones.length) {
    return <div className="text-sm text-muted-foreground">No capstones configured for this skill.</div>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {capstones.map(cs => (
        <CapstoneCard key={cs.id} capstone={cs} locked={locked} onSelect={onSelect} />
      ))}
    </div>
  );
}

