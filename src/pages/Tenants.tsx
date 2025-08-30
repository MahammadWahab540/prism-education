import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TenantManagement } from '@/components/tenant/TenantManagement';

export default function TenantsPage() {
  return (
    <DashboardLayout>
      <TenantManagement />
    </DashboardLayout>
  );
}