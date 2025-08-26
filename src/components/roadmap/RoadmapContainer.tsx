
import React from 'react';
import { StageCard } from './StageCard';
import { useUnlockLogic } from '@/hooks/useUnlockLogic';

interface RoadmapContainerProps {
  skillId: string;
  stages: Array<{
    id: string;
    title: string;
    description: string;
    duration: string;
    topics: number;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  }>;
  onStageSelect: (stageId: string) => void;
}

export function RoadmapContainer({ skillId, stages, onStageSelect }: RoadmapContainerProps) {
  const {
    progress,
    updateVideoProgress,
    completeQuiz,
    isStageUnlocked,
    getOverallProgress,
    getCurrentStage,
  } = useUnlockLogic(skillId);

  const handleStartStage = (stageId: string) => {
    onStageSelect(stageId);
    // Here you could navigate to the learning page
    // For demo purposes, let's simulate some progress
    if (Math.random() > 0.5) {
      setTimeout(() => updateVideoProgress(stageId, 35), 1000);
      setTimeout(() => completeQuiz(stageId), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stages.map((stage, index) => {
          const isUnlocked = isStageUnlocked(index);
          const stageProgress = progress[stage.id];
          
          return (
            <StageCard
              key={stage.id}
              stage={stage}
              isUnlocked={isUnlocked}
              isCompleted={stageProgress?.isCompleted || false}
              videoProgress={stageProgress?.videoWatchPercentage || 0}
              quizCompleted={stageProgress?.quizCompleted || false}
              onStartStage={() => handleStartStage(stage.id)}
            />
          );
        })}
      </div>
    </div>
  );
}
