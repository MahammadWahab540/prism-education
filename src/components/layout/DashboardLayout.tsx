
import React from 'react';
import { RoleSidebar } from '@/components/navigation/RoleSidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen w-full bg-gradient-pearl">
      <RoleSidebar />
      
      {/* Main Content */}
      <main className="flex-1 ml-12 transition-all duration-200 ease-out">
        <div className="h-full overflow-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
