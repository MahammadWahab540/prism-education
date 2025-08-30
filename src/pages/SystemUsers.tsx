import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SystemUserManagement } from '@/components/system-users/SystemUserManagement';

export default function SystemUsersPage() {
  return (
    <DashboardLayout>
      <SystemUserManagement />
    </DashboardLayout>
  );
}