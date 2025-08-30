import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TenantReportsDashboard } from '@/components/tenant-reports/TenantReportsDashboard';

export default function TenantReportsPage() {
  return (
    <DashboardLayout>
      <TenantReportsDashboard />
    </DashboardLayout>
  );
}