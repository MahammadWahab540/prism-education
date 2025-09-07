import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface AdminActivityItem {
  id: string;
  action: string;
  entity: string;
  at: string; // timestamp or relative
}

export function RecentAdminActivity({ items = [] as AdminActivityItem[] }) {
  const navigate = useNavigate();
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2"><Activity className="w-4 h-4" /> Recent Admin Activity</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        {items.length === 0 && (
          <div className="text-sm text-muted-foreground">No recent activity.</div>
        )}
        {items.slice(0,5).map((it) => (
          <div key={it.id} className="flex items-center justify-between p-2 rounded border bg-background/50">
            <div>
              <div className="text-sm font-medium">{it.action}</div>
              <div className="text-xs text-muted-foreground">{it.entity}</div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{it.at}</span>
            </div>
          </div>
        ))}
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={() => navigate('/activity')}>View all</Button>
        </div>
      </CardContent>
    </Card>
  );
}

