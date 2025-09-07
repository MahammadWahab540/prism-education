import React from 'react';
import type { CapstoneTemplate } from '@/types/capstone';
import { CapstoneTemplateCard } from './CapstoneTemplateCard';

interface Props {
  templates: CapstoneTemplate[];
  onSelect: (t: CapstoneTemplate) => void;
}

export function CapstoneTemplateGallery({ templates, onSelect }: Props) {
  if (!templates.length) return <div className="text-sm text-muted-foreground">No Capstones available yet.</div>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map(t => (
        <CapstoneTemplateCard key={t.id} template={t} onSelect={onSelect} />
      ))}
    </div>
  );
}

