
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from '@/contexts/AuthContext';
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import MySkills from "@/pages/MySkills";
import Roadmap from "@/pages/Roadmap";
import LearningPage from "@/pages/LearningPage";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <Router>
          <div className="min-h-screen bg-background font-sans antialiased">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/my-skills" element={<MySkills />} />
              <Route path="/roadmap/:skillId" element={<Roadmap />} />
              <Route path="/learn/:skillId/:stageId" element={<LearningPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Toaster />
        </Router>
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;
