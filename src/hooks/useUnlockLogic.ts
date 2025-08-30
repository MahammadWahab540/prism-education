
import { useState, useEffect } from 'react';

export interface StageProgress {
  videoWatchPercentage: number;
  quizCompleted: boolean;
  isCompleted: boolean;
}

export interface RoadmapProgress {
  [stageId: string]: StageProgress;
}

export function useUnlockLogic(skillId: string, totalStages: number) {
  const [progress, setProgress] = useState<RoadmapProgress>({});
  const storageKey = `progress-${skillId}`;

  // Initialize progress for all stages or load from localStorage
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
    if (stored) {
      try {
        setProgress(JSON.parse(stored));
        return;
      } catch {
        // If parsing fails, fall back to initialization below
      }
    }

    const initialProgress: RoadmapProgress = {};
    for (let i = 1; i <= totalStages; i++) {
      initialProgress[`stage-${i}`] = {
        videoWatchPercentage: 0,
        quizCompleted: false,
        isCompleted: false,
      };
    }
    setProgress(initialProgress);
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(initialProgress));
    }
  }, [skillId, totalStages]);

  const updateVideoProgress = (stageId: string, percentage: number) => {
    setProgress(prev => {
      const updated = {
        ...prev,
        [stageId]: {
          ...prev[stageId],
          videoWatchPercentage: percentage,
          isCompleted: percentage >= 30 && prev[stageId]?.quizCompleted,
        },
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const completeQuiz = (stageId: string) => {
    setProgress(prev => {
      const updated = {
        ...prev,
        [stageId]: {
          ...prev[stageId],
          quizCompleted: true,
          isCompleted: prev[stageId]?.videoWatchPercentage >= 30,
        },
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const isStageUnlocked = (stageIndex: number): boolean => {
    if (stageIndex === 0) return true; // First stage always unlocked

    const previousStageId = `stage-${stageIndex}`;
    return progress[previousStageId]?.isCompleted || false;
  };

  const getOverallProgress = (): number => {
    const completedStages = Object.values(progress).filter(stage => stage.isCompleted).length;
    return Math.round((completedStages / totalStages) * 100);
  };

  const getCurrentStage = (): number => {
    for (let i = 1; i <= totalStages; i++) {
      if (!progress[`stage-${i}`]?.isCompleted) {
        return i;
      }
    }
    return totalStages; // All completed
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
