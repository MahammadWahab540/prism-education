
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Map } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProgressTracker } from '@/components/roadmap/ProgressTracker';
import { RoadmapContainer } from '@/components/roadmap/RoadmapContainer';
import { Button } from '@/components/ui/button';
import { useUnlockLogic } from '@/hooks/useUnlockLogic';

const Roadmap = () => {
  const { skillId } = useParams();
  const navigate = useNavigate();
  
  // Mock skill data - in real app, this would come from API
  const skillData = {
    'javascript-typescript': {
      title: 'JavaScript & TypeScript',
      icon: '⚛️',
    },
    'react-nextjs': {
      title: 'React & Next.js',
      icon: '🔷',
    },
    'nodejs-backend': {
      title: 'Node.js & Backend',
      icon: '⚙️',
    },
  };

  const currentSkill = skillData[skillId as keyof typeof skillData] || skillData['javascript-typescript'];
  
  const { getOverallProgress, getCurrentStage } = useUnlockLogic(skillId || 'javascript-typescript');

  // Mock stages data
  const stages = [
    {
      id: 'stage-1',
      title: 'Fundamentals',
      description: 'Learn the basic concepts, syntax, and core features. Build a solid foundation.',
      duration: '2-3 hours',
      topics: 8,
      difficulty: 'Beginner' as const,
    },
    {
      id: 'stage-2',
      title: 'Core Concepts',
      description: 'Dive deeper into advanced concepts, patterns, and best practices.',
      duration: '3-4 hours',
      topics: 12,
      difficulty: 'Beginner' as const,
    },
    {
      id: 'stage-3',
      title: 'Advanced Features',
      description: 'Master advanced features, async programming, and modern techniques.',
      duration: '4-5 hours',
      topics: 15,
      difficulty: 'Intermediate' as const,
    },
    {
      id: 'stage-4',
      title: 'Practical Projects',
      description: 'Apply your knowledge by building real-world applications and projects.',
      duration: '5-6 hours',
      topics: 10,
      difficulty: 'Intermediate' as const,
    },
    {
      id: 'stage-5',
      title: 'Professional Tools',
      description: 'Learn industry tools, testing frameworks, and development workflows.',
      duration: '3-4 hours',
      topics: 18,
      difficulty: 'Advanced' as const,
    },
    {
      id: 'stage-6',
      title: 'Mastery & Beyond',
      description: 'Advanced patterns, performance optimization, and expert-level techniques.',
      duration: '4-6 hours',
      topics: 20,
      difficulty: 'Advanced' as const,
    },
  ];

  const handleStageSelect = (stageId: string) => {
    console.log('Navigate to learning page for stage:', stageId);
    // Here you would navigate to the actual learning page
    // navigate(`/learn/${skillId}/${stageId}`);
  };

  const handleBackToSkills = () => {
    navigate('/my-skills');
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBackToSkills}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Skills
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent-luxury flex items-center justify-center text-white text-lg">
              {currentSkill.icon}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Map className="h-6 w-6 text-primary" />
                Learning Roadmap
              </h1>
              <p className="text-muted-foreground">
                Follow the structured path to master {currentSkill.title}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Tracker */}
        <ProgressTracker
          currentStage={getCurrentStage()}
          totalStages={6}
          overallProgress={getOverallProgress()}
          skillTitle={currentSkill.title}
        />

        {/* Roadmap Container */}
        <RoadmapContainer
          skillId={skillId || 'javascript-typescript'}
          stages={stages}
          onStageSelect={handleStageSelect}
        />

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-primary/10 to-accent-luxury/10 border border-primary/20 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
            💡 Learning Tips
          </h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Watch at least 30% of each video to unlock the quiz</li>
            <li>• Complete both video and quiz to unlock the next stage</li>
            <li>• Take notes and practice coding along with the videos</li>
            <li>• Don't rush - focus on understanding concepts deeply</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Roadmap;
