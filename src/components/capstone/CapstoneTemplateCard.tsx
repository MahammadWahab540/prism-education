import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { CapstoneTemplate } from '@/types/capstone';

interface Props {
  template: CapstoneTemplate;
  onSelect: (t: CapstoneTemplate) => void;
}

export function CapstoneTemplateCard({ template, onSelect }: Props) {
  return (
    <Card className="hover:shadow-elevated transition-all">
      <CardHeader>
        <CardTitle className="text-base">{template.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex flex-wrap gap-1">
          <Badge variant="secondary">{template.difficulty}</Badge>
          {template.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
        </div>
        <div className="text-sm">
          <div className="font-medium">Problem</div>
          <div className="text-muted-foreground line-clamp-2">{template.overview.problem}</div>
        </div>
        <div className="text-sm">
          <div className="font-medium">Objective</div>
          <div className="text-muted-foreground line-clamp-2">{template.overview.objective}</div>
        </div>
        <Button className="w-full" onClick={() => onSelect(template)}>Select Capstone</Button>
      </CardContent>
    </Card>
  );
}

