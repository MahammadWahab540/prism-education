import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TenantAnalyticsDashboard } from '@/components/tenant-analytics/TenantAnalyticsDashboard';

export default function TenantReportsPage() {
  return (
    <DashboardLayout>
      {/* Alias: show the updated Student Analytics & Reports experience here too */}
      <TenantAnalyticsDashboard />
    </DashboardLayout>
  );
}
