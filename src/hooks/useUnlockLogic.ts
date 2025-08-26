
import { useState, useEffect } from 'react';

export interface StageProgress {
  videoWatchPercentage: number;
  quizCompleted: boolean;
  isCompleted: boolean;
}

export interface RoadmapProgress {
  [stageId: string]: StageProgress;
}

export function useUnlockLogic(skillId: string) {
  const [progress, setProgress] = useState<RoadmapProgress>({});

  // Initialize progress for all stages
  useEffect(() => {
    const initialProgress: RoadmapProgress = {};
    for (let i = 1; i <= 6; i++) {
      initialProgress[`stage-${i}`] = {
        videoWatchPercentage: i === 1 ? 0 : 0, // First stage starts unlocked
        quizCompleted: false,
        isCompleted: false,
      };
    }
    setProgress(initialProgress);
  }, [skillId]);

  const updateVideoProgress = (stageId: string, percentage: number) => {
    setProgress(prev => ({
      ...prev,
      [stageId]: {
        ...prev[stageId],
        videoWatchPercentage: percentage,
        isCompleted: percentage >= 30 && prev[stageId]?.quizCompleted
      }
    }));
  };

  const completeQuiz = (stageId: string) => {
    setProgress(prev => ({
      ...prev,
      [stageId]: {
        ...prev[stageId],
        quizCompleted: true,
        isCompleted: prev[stageId]?.videoWatchPercentage >= 30
      }
    }));
  };

  const isStageUnlocked = (stageIndex: number): boolean => {
    if (stageIndex === 0) return true; // First stage always unlocked
    
    const previousStageId = `stage-${stageIndex}`;
    return progress[previousStageId]?.isCompleted || false;
  };

  const getOverallProgress = (): number => {
    const totalStages = 6;
    const completedStages = Object.values(progress).filter(stage => stage.isCompleted).length;
    return Math.round((completedStages / totalStages) * 100);
  };

  const getCurrentStage = (): number => {
    for (let i = 1; i <= 6; i++) {
      if (!progress[`stage-${i}`]?.isCompleted) {
        return i;
      }
    }
    return 6; // All completed
  };

  return {
    progress,
    updateVideoProgress,
    completeQuiz,
    isStageUnlocked,
    getOverallProgress,
    getCurrentStage,
  };
}
