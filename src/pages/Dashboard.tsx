
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PlatformOwnerDashboard } from '@/components/dashboard/PlatformOwnerDashboard';
import { TenantAdminDashboard } from '@/components/dashboard/TenantAdminDashboard';
import { StudentDashboard } from '@/components/dashboard/StudentDashboard';
import { LoginForm } from '@/components/auth/LoginForm';

export default function Dashboard() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'platform_owner':
        return <PlatformOwnerDashboard />;
      case 'tenant_admin':
        return <TenantAdminDashboard />;
      case 'student':
        return <StudentDashboard />;
      default:
        return (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Invalid Role</h2>
              <p className="text-muted-foreground">Your account role is not recognized. Please contact support.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <DashboardLayout>
      {renderDashboard()}
    </DashboardLayout>
  );
}
