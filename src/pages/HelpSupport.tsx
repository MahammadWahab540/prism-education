import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PlatformOwnerSupport } from '@/components/support/PlatformOwnerSupport';
import { TenantAdminSupport } from '@/components/support/TenantAdminSupport';
import { StudentSupport } from '@/components/support/StudentSupport';

export default function HelpSupport() {
  const { user } = useAuth();

  if (!user) return null;

  const renderSupportContent = () => {
    switch (user.role) {
      case 'platform_owner':
        return <PlatformOwnerSupport />;
      case 'tenant_admin':
        return <TenantAdminSupport />;
      case 'student':
        return <StudentSupport />;
      default:
        return (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-muted-foreground">You don't have access to the support system.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <DashboardLayout>
      {renderSupportContent()}
    </DashboardLayout>
  );
}