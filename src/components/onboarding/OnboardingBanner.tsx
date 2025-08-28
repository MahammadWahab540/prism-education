import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLearningPath } from '@/contexts/LearningPathContext';
import { Target, ArrowRight, Clock } from 'lucide-react';

export function OnboardingBanner() {
  const { user } = useAuth();
  const { needsOnboarding, status } = useLearningPath();
  const navigate = useNavigate();

  // Only show for students who need onboarding
  if (user?.role !== 'student' || !needsOnboarding) {
    return null;
  }

  const handleStartLearningPath = () => {
    navigate('/learning-path?reason=onboarding-banner');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent-luxury/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent-luxury">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">Complete Your Learning Path</h3>
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">
                    <Clock className="h-3 w-3 mr-1" />
                    Required
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {!status.hasCareerGoal && !status.hasActiveSkills 
                    ? "Choose your career goal and select skills to get started with personalized learning."
                    : !status.hasCareerGoal 
                    ? "Select your career goal to unlock personalized learning paths."
                    : "Choose skills to master based on your career goal."
                  }
                </p>
              </div>
            </div>
            <Button onClick={handleStartLearningPath} className="gap-2">
              {status.hasCareerGoal ? 'Add Skills' : 'Get Started'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}