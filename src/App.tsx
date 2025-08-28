
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { LearningPathProvider } from '@/contexts/LearningPathContext';
import { StudentRouteGuard } from '@/components/guards/StudentRouteGuard';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import MySkills from '@/pages/MySkills';
import Roadmap from '@/pages/Roadmap';
import LearningPage from '@/pages/LearningPage';
import CourseManagement from '@/pages/CourseManagement';
import Tenants from '@/pages/Tenants';
import Analytics from '@/pages/Analytics';
import SystemUsers from '@/pages/SystemUsers';
import Students from '@/pages/Students';
import TenantAnalytics from '@/pages/TenantAnalytics';
import TenantReports from '@/pages/TenantReports';
import HelpSupport from '@/pages/HelpSupport';
import Settings from '@/pages/Settings';
import LearningPath from '@/pages/LearningPath';
import NotFound from '@/pages/NotFound';

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
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/my-skills" element={<MySkills />} />
                  <Route path="/roadmap/:skillId" element={<Roadmap />} />
                  <Route path="/learn/:skillId/:stageId" element={<LearningPage />} />
                  <Route path="/course-management" element={<CourseManagement />} />
                  <Route path="/tenants" element={<Tenants />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/tenant-analytics" element={<TenantAnalytics />} />
                  <Route path="/tenant-reports" element={<TenantReports />} />
                  <Route path="/system-users" element={<SystemUsers />} />
                  <Route path="/students" element={<Students />} />
                  <Route path="/help-support" element={<HelpSupport />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/learning-path" element={<LearningPath />} />
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
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
