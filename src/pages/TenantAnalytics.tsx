import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TenantAnalyticsDashboard } from '@/components/tenant-analytics/TenantAnalyticsDashboard';

export default function TenantAnalyticsPage() {
  return (
    <DashboardLayout>
      <TenantAnalyticsDashboard />
    </DashboardLayout>
  );
}