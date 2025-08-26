
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target } from 'lucide-react';

interface ProgressTrackerProps {
  currentStage: number;
  totalStages: number;
  overallProgress: number;
  skillTitle: string;
}

export function ProgressTracker({ 
  currentStage, 
  totalStages, 
  overallProgress, 
  skillTitle 
}: ProgressTrackerProps) {
  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent-luxury flex items-center justify-center">
            <Target className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{skillTitle} Roadmap</h2>
            <p className="text-sm text-muted-foreground">
              Stage {currentStage} of {totalStages}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-primary">
          <Trophy className="h-5 w-5" />
          <span className="font-bold text-lg">{overallProgress}%</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="text-foreground font-medium">{overallProgress}% Complete</span>
        </div>
        <Progress 
          value={overallProgress} 
          className="h-3 bg-muted" 
        />
      </div>
    </div>
  );
}
