import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface ApprovalItem {
  id: string;
  type: string;
  subject: string;
  age: string; // e.g., "2h"
}

interface ApprovalsListProps {
  items?: ApprovalItem[];
}

export function ApprovalsList({ items = [] }: ApprovalsListProps) {
  const navigate = useNavigate();
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2"><ClipboardList className="w-4 h-4" /> Approvals & Alerts</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        {items.length === 0 && (
          <div className="text-sm text-muted-foreground">No pending approvals. You're all set.</div>
        )}
        {items.slice(0,5).map((it) => (
          <div key={it.id} className="flex items-center justify-between p-2 rounded border bg-background/50">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <div>
                <div className="text-sm font-medium">{it.type}: {it.subject}</div>
                <div className="text-xs text-muted-foreground">ID: {it.id}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{it.age}</Badge>
              <Button size="sm" onClick={() => navigate('/approvals')}>Review</Button>
            </div>
          </div>
        ))}
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={() => navigate('/approvals')}>View all</Button>
        </div>
      </CardContent>
    </Card>
  );
}

