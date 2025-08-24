
import React from 'react';
import { RoleSidebar } from '@/components/navigation/RoleSidebar';

export function SidebarDemo() {
  return (
    <div className="flex h-screen w-screen flex-row bg-gradient-pearl">
      <RoleSidebar />
      <main className="flex h-screen grow flex-col overflow-auto ml-12">
        <div className="flex-1 p-8">
          <div className="glass-card p-8 rounded-xl">
            <h1 className="text-2xl font-bold text-gradient-luxury mb-4">
              Role-Based Sidebar Demo
            </h1>
            <p className="text-muted-foreground">
              The sidebar adapts based on your user role. Try logging in with different demo accounts to see different navigation options.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
