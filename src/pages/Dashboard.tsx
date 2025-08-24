
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PlatformOwnerDashboard } from '@/components/dashboard/PlatformOwnerDashboard';
import { TenantAdminDashboard } from '@/components/dashboard/TenantAdminDashboard';
import { StudentDashboard } from '@/components/dashboard/StudentDashboard';

export default function Dashboard() {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'platform_owner':
        return <PlatformOwnerDashboard />;
      case 'tenant_admin':
        return <TenantAdminDashboard />;
      case 'student':
        return <StudentDashboard />;
      default:
        return <div>Invalid role</div>;
    }
  };

  return (
    <DashboardLayout>
      {renderDashboard()}
    </DashboardLayout>
  );
}
