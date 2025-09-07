import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { CapstoneConfig } from '@/types/capstone';
import { Timer, BookOpenCheck } from 'lucide-react';

interface Props {
  capstone: CapstoneConfig;
  locked?: boolean;
  onSelect?: (capstone: CapstoneConfig) => void;
}

export function CapstoneCard({ capstone, locked, onSelect }: Props) {
  return (
    <Card className="hover:shadow-elevated transition-all">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{capstone.title}</CardTitle>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="secondary">{capstone.difficulty}</Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Timer className="h-4 w-4" />
                <span>{capstone.timeEstimate}</span>
              </div>
            </div>
          </div>
          <Badge>{capstone.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-3">{capstone.overview.description}</p>
        <div className="text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <BookOpenCheck className="h-4 w-4" />
            <span>Deliverables: {capstone.expectedDeliverables.join(', ')}</span>
          </div>
        </div>
        <Button className="w-full" disabled={locked} onClick={() => onSelect?.(capstone)}>
          {locked ? 'Locked' : 'View Capstone'}
        </Button>
      </CardContent>
    </Card>
  );
}

