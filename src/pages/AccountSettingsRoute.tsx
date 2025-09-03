import React, { Suspense, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAccountPrefs, AccountPrefs } from '@/lib/account';
import { logEvent } from '@/lib/telemetry';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const Settings = React.lazy(() => import('@/pages/Settings'));

export default function AccountSettingsRoute() {
  const { user, isLoading } = useAuth();
  const [prefs, setPrefs] = useState<AccountPrefs | null>(null);
  const [error, setError] = useState<null | { message: string; status?: number }>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!user) return; // handled below
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAccountPrefs(user.id);
      setPrefs(data);
    } catch (e: any) {
      setError({ message: e?.message || 'Failed to load settings', status: e?.status });
      logEvent('account_settings_error', { userId: user?.id, status: e?.status, message: e?.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    logEvent('account_settings_open', { userId: user?.id });
  }, [user?.id]);

  useEffect(() => {
    if (user) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
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
              <p className="text-muted-foreground">You must be signed in to view Account Settings.</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (loading && !prefs) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Unable to load settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{error.message} {error.status ? `(HTTP ${error.status})` : ''}</p>
              <Button onClick={load}>Retry</Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <Suspense
      fallback={
        <DashboardLayout>
          <div className="max-w-6xl mx-auto space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </DashboardLayout>
      }
    >
      <Settings />
    </Suspense>
  );
}

