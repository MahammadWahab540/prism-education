
import React from 'react';
import { RoleSidebar } from '@/components/navigation/RoleSidebar';
import { NotificationPanel } from '@/components/layout/NotificationPanel';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { ProfilePanelProvider } from '@/contexts/ProfilePanelContext';
import { ProfilePanelDrawer } from '@/components/dashboard/ProfilePanelDrawer';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ProfilePanelProvider>
      <div className="flex h-screen w-full bg-gradient-pearl">
        <RoleSidebar />
        
        {/* Main Content */}
        <main className="flex-1 ml-12 transition-all duration-200 ease-out">
          <div className="h-full overflow-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="flex justify-end mb-4">
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <NotificationPanel />
                </div>
              </div>
              {children}
            </div>
          </div>
        </main>

        {/* Left Drawer Overlay */}
        <ProfilePanelDrawer />
      </div>
    </ProfilePanelProvider>
  );
}
