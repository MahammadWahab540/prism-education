
import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
    const {
      progress,
      updateVideoProgress,
      completeQuiz,
      isStageUnlocked,
    } = useUnlockLogic(skillId, stages.length);

  const handleStartStage = (stageId: string) => {
    // Navigate to the learning page
    navigate(`/learn/${skillId}/${stageId}`);
    onStageSelect(stageId);
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
