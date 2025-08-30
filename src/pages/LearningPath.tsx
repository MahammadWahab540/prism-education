import { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CareerGoalSelector } from '@/components/learning-path/CareerGoalSelector';
import { SkillsSelector } from '@/components/learning-path/SkillsSelector';
import { useToast } from '@/hooks/use-toast';
import { Target, BookOpen, Trophy } from 'lucide-react';
import { useLearningPath } from '@/contexts/LearningPathContext';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function LearningPath() {
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [selectedSkills, setSelectedSkills] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState<'goal' | 'skills' | 'confirmation'>('goal');
  const { toast } = useToast();
  const { updateLearningPath } = useLearningPath();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get the reason for showing learning path (from URL params)
  const reason = searchParams.get('reason');
  const redirectPath = searchParams.get('redirect');

  const handleGoalSelect = (goal: any) => {
    setSelectedGoal(goal);
    setSelectedSkills([]);
    setCurrentStep('skills');
  };

  const handleSkillsSelect = (skills: any[]) => {
    setSelectedSkills(skills);
    if (skills.length > 0) {
      setCurrentStep('confirmation');
    }
  };

  const handleSaveLearningPath = () => {
    // Update learning path context (mock backend integration)
    updateLearningPath(selectedGoal?.id, selectedSkills);
    
    toast({
      title: "Learning path saved!",  
      description: `Your career goal and ${selectedSkills.length} skills have been saved.`,
    });
    
    // Redirect back to original page or dashboard
    if (redirectPath) {
      navigate(redirectPath);
    } else {
      navigate('/dashboard');
    }
  };

  const handleBackToGoals = () => {
    setCurrentStep('goal');
    setSelectedGoal(null);
    setSelectedSkills([]);
  };

  const handleBackToSkills = () => {
    setCurrentStep('skills');
    setSelectedSkills([]);
  };

  const getProgressPercentage = () => {
    switch (currentStep) {
      case 'goal': return 33;
      case 'skills': return 66;
      case 'confirmation': return 100;
      default: return 0;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent-luxury">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Choose Your Learning Path</h1>
              <p className="text-muted-foreground">
                {reason === 'no-active-skills' 
                  ? "Complete your learning path setup to access all features"
                  : "Define your career goals and select the skills you want to master"
                }
              </p>
            </div>
          </motion.div>

          {/* Progress Bar */}
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Progress</span>
                  <span className="text-muted-foreground">{getProgressPercentage()}% Complete</span>
                </div>
                <Progress value={getProgressPercentage()} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className={currentStep === 'goal' ? 'text-primary font-medium' : ''}>
                    Career Goal
                  </span>
                  <span className={currentStep === 'skills' ? 'text-primary font-medium' : ''}>
                    Skills Selection
                  </span>
                  <span className={currentStep === 'confirmation' ? 'text-primary font-medium' : ''}>
                    Confirmation
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 'goal' && (
            <CareerGoalSelector onGoalSelect={handleGoalSelect} />
          )}

          {currentStep === 'skills' && selectedGoal && (
            <div className="space-y-6">
              {/* Selected Goal Summary */}
              <Card className="glass-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-lg">Selected Career Goal</CardTitle>
                        <CardDescription>Continue to select your skills</CardDescription>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleBackToGoals}>
                      Change Goal
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="px-3 py-1">
                      {selectedGoal.name}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {selectedGoal.description}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <SkillsSelector 
                careerGoal={selectedGoal} 
                onSkillsSelect={handleSkillsSelect}
                selectedSkills={selectedSkills}
              />
            </div>
          )}

          {currentStep === 'confirmation' && (
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Trophy className="h-6 w-6 text-accent-success" />
                  <div>
                    <CardTitle className="text-xl">Ready to Start Your Journey!</CardTitle>
                    <CardDescription>
                      Review your learning path and confirm to get started
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Goal Summary */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Career Goal</h3>
                  <div className="rounded-lg border bg-primary-soft p-4">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">{selectedGoal?.name}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {selectedGoal?.description}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Skills Summary */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Selected Skills ({selectedSkills.length})</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {selectedSkills.map((skill, index) => (
                      <div key={skill.id} className="rounded-lg border bg-card p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{skill.name}</p>
                            <p className="text-sm text-muted-foreground">{skill.category}</p>
                          </div>
                          <Badge variant="outline">{skill.difficulty}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleBackToSkills} variant="outline" className="flex-1">
                    Back to Skills
                  </Button>
                  <Button onClick={handleSaveLearningPath} className="flex-1">
                    Start Learning Journey
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}