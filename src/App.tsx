import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { LearningPathProvider } from '@/contexts/LearningPathContext';
import { StudentRouteGuard } from '@/components/guards/StudentRouteGuard';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from 'next-themes';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import MySkills from '@/pages/MySkills';
import Roadmap from '@/pages/Roadmap';
import LearningPage from '@/pages/LearningPage';
import CourseManagement from '@/pages/CourseManagement';
import Capstone from '@/pages/Capstone';
import CapstoneDetailView from '@/pages/CapstoneDetailView';
import CapstoneInstance from '@/pages/CapstoneInstance';
import Tenants from '@/pages/Tenants';
import Analytics from '@/pages/Analytics';
import CareerManagement from '@/pages/CareerManagement';
import SystemUsers from '@/pages/SystemUsers';
import Students from '@/pages/Students';
import AdminCapstoneSubmissions from '@/pages/AdminCapstoneSubmissions';
import AdminCapstoneDetail from '@/pages/admin/CapstoneDetail';
import TenantAnalytics from '@/pages/TenantAnalytics';
import TenantReports from '@/pages/TenantReports';
import HelpSupport from '@/pages/HelpSupport';
import LearningPath from '@/pages/LearningPath';
import { Profile } from '@/pages/Profile';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Auth from '@/pages/Auth';

const AccountSettingsRoute = React.lazy(() => import('@/pages/AccountSettingsRoute'));
const LearningHistory = React.lazy(() => import('@/pages/LearningHistory'));

function AppContent() {
  const { user } = useAuth();

  return (
    <NotificationProvider userId={user?.id || 'guest'}>
      <LearningPathProvider>
        <TooltipProvider>
          <Router>
            <div className="min-h-screen bg-background font-sans antialiased">
              <StudentRouteGuard>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/my-skills" element={<ProtectedRoute><MySkills /></ProtectedRoute>} />
                  <Route path="/roadmap/:skillId" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
                  <Route path="/learn/:skillId/:stageId" element={<ProtectedRoute><LearningPage /></ProtectedRoute>} />
                  <Route path="/course-management" element={<ProtectedRoute allowedRoles={['platform_owner', 'tenant_admin']}><CourseManagement /></ProtectedRoute>} />
                  <Route path="/capstone/:capstoneId" element={<ProtectedRoute><Capstone /></ProtectedRoute>} />
                  <Route path="/capstone-instance/:instanceId" element={<ProtectedRoute><CapstoneInstance /></ProtectedRoute>} />
                  <Route path="/tenants" element={<ProtectedRoute requiredRole="platform_owner"><Tenants /></ProtectedRoute>} />
                  <Route path="/analytics" element={<ProtectedRoute requiredRole="platform_owner"><Analytics /></ProtectedRoute>} />
                  <Route path="/career-management" element={<ProtectedRoute allowedRoles={['platform_owner', 'tenant_admin']}><CareerManagement /></ProtectedRoute>} />
                  <Route path="/tenant-analytics" element={<ProtectedRoute requiredRole="tenant_admin"><TenantAnalytics /></ProtectedRoute>} />
                  <Route path="/tenant-reports" element={<ProtectedRoute requiredRole="tenant_admin"><TenantReports /></ProtectedRoute>} />
                  <Route path="/admin/capstones/submissions" element={<ProtectedRoute allowedRoles={['platform_owner', 'tenant_admin']}><AdminCapstoneSubmissions /></ProtectedRoute>} />
                  <Route path="/system-users" element={<ProtectedRoute requiredRole="platform_owner"><SystemUsers /></ProtectedRoute>} />
                  <Route path="/admin/capstones/:instanceId" element={<ProtectedRoute allowedRoles={['platform_owner', 'tenant_admin']}><AdminCapstoneDetail /></ProtectedRoute>} />
                  <Route path="/students" element={<ProtectedRoute requiredRole="tenant_admin"><Students /></ProtectedRoute>} />
                  <Route path="/help-support" element={<ProtectedRoute><HelpSupport /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><React.Suspense fallback={<div className="p-6">Loading...</div>}><AccountSettingsRoute /></React.Suspense></ProtectedRoute>} />
                  <Route path="/account/settings" element={<ProtectedRoute><React.Suspense fallback={<div className="p-6">Loading...</div>}><AccountSettingsRoute /></React.Suspense></ProtectedRoute>} />
                  <Route path="/learning-path" element={<ProtectedRoute><LearningPath /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/profile/learning-history" element={<ProtectedRoute><React.Suspense fallback={<div className="p-6">Loading...</div>}><LearningHistory /></React.Suspense></ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </StudentRouteGuard>
            </div>
            <Toaster />
          </Router>
        </TooltipProvider>
      </LearningPathProvider>
    </NotificationProvider>
  );
}

function App() {
  const [queryClient] = React.useState(() => new QueryClient());
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <AppContent />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
