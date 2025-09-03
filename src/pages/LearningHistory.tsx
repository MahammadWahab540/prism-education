import React, { useEffect, useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { fetchLearningHistory, LearningItem } from '@/lib/learningHistory';
import { logEvent } from '@/lib/telemetry';

export default function LearningHistory() {
  const { user, isLoading } = useAuth();
  const [items, setItems] = useState<LearningItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [total, setTotal] = useState(0);

  const cacheKey = useMemo(() => `lh-cache-${user?.id ?? 'guest'}`, [user?.id]);

  const load = async (p = page) => {
    if (!user) return; // handled below
    try {
      setLoading(true);
      setError(null);
      const resp = await fetchLearningHistory(user.id, p, pageSize);
      setItems(resp.items);
      setTotal(resp.total);
      setPage(p);
      // Cache last success page
      try { localStorage.setItem(cacheKey, JSON.stringify(resp)); } catch {}
      logEvent('learning_history_page_view', { userId: user.id, page: p, pageSize });
    } catch (e: any) {
      setError(e?.message || 'Failed to load learning history');
      logEvent('learning_history_error', { userId: user?.id, message: e?.message });
      // Try to show cached page
      try {
        const raw = localStorage.getItem(cacheKey);
        if (raw) {
          const cached = JSON.parse(raw);
          setItems(cached.items || []);
          setTotal(cached.total || 0);
        }
      } catch {}
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    logEvent('learning_history_open', { userId: user?.id });
  }, [user?.id]);

  useEffect(() => {
    if (user) load(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const changePage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    load(p);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Not authorized</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">You must be signed in to view your learning history.</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Learning History</h1>
          <p className="text-muted-foreground">Your most recent activity, newest first</p>
        </div>

        {loading && items.length === 0 ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : error && items.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">{error}</p>
                <Button onClick={() => load(page)}>Retry</Button>
              </div>
            </CardContent>
          </Card>
        ) : items.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center space-y-2">
                <p className="font-medium">No activity yet</p>
                <p className="text-muted-foreground text-sm">When you complete lessons or courses, they will appear here.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {items.map((it) => (
              <Card key={it.id}>
                <CardContent className="py-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{it.title}</div>
                    <div className="text-xs text-muted-foreground capitalize">{it.type} • {new Date(it.completedAt).toLocaleString()}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">{it.durationMinutes} min</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => changePage(page - 1)} disabled={page <= 1 || loading}>Previous</Button>
          <div className="text-sm text-muted-foreground">Page {page} of {totalPages}</div>
          <Button variant="outline" onClick={() => changePage(page + 1)} disabled={page >= totalPages || loading}>Next</Button>
        </div>
      </div>
    </DashboardLayout>
  );
}

