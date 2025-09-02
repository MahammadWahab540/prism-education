import { useState, useEffect } from 'react';
import { useLearningPath } from '@/contexts/LearningPathContext';
import { mockSkills } from '@/lib/mockData';

export interface UpcomingDeadline {
  id: string;
  title: string;
  skillName: string;
  stageNumber: number;
  dueDate: string;
  urgent: boolean;
  estimatedHours: number;
}

export function useUpcomingDeadlines() {
  const { status } = useLearningPath();
  const [deadlines, setDeadlines] = useState<UpcomingDeadline[]>([]);

  useEffect(() => {
    if (!status.hasActiveSkills) {
      setDeadlines([]);
      return;
    }

    // Get enrolled skills from localStorage
    const enrolledSkills = getEnrolledSkills();
    if (enrolledSkills.length === 0) {
      setDeadlines([]);
      return;
    }

    const calculatedDeadlines: UpcomingDeadline[] = [];

    enrolledSkills.forEach(skillId => {
      const skill = mockSkills.find(s => s.id === skillId);
      if (!skill) return;

      // Get progress for this skill from localStorage
      const progress = getSkillProgress(skillId.toString());
      const currentStage = getCurrentStageForSkill(progress);

      // Calculate deadlines for next 2-3 incomplete stages
      for (let stageNum = currentStage; stageNum <= Math.min(currentStage + 2, 6); stageNum++) {
        const stageId = `stage-${stageNum}`;
        const stageProgress = progress[stageId];

        if (!stageProgress?.isCompleted) {
          const daysToAdd = (stageNum - currentStage + 1) * 7; // 1 week per stage
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + daysToAdd);

          const isUrgent = daysToAdd <= 3;

          calculatedDeadlines.push({
            id: `${skillId}-${stageId}`,
            title: `Stage ${stageNum} Completion`,
            skillName: skill.name,
            stageNumber: stageNum,
            dueDate: formatDueDate(dueDate),
            urgent: isUrgent,
            estimatedHours: Math.ceil(skill.estimated_hours / 6) // Divide total hours by 6 stages
          });
        }
      }
    });

    // Sort by due date (urgent first)
    calculatedDeadlines.sort((a, b) => {
      if (a.urgent && !b.urgent) return -1;
      if (!a.urgent && b.urgent) return 1;
      return 0;
    });

    setDeadlines(calculatedDeadlines.slice(0, 3)); // Show max 3 deadlines
  }, [status.hasActiveSkills, status.lastUpdated]);

  return {
    deadlines,
    hasDeadlines: deadlines.length > 0
  };
}

function getEnrolledSkills(): number[] {
  try {
    const stored = localStorage.getItem('learning-selections-student-1'); // Mock student ID
    if (!stored) return [];

    const selections = JSON.parse(stored);
    return selections.skills?.map((skill: any) => skill.id) || [];
  } catch {
    // Fallback: return some mock enrolled skills for demo
    return [1, 2, 3];
  }
}

function getSkillProgress(skillId: string) {
  try {
    const stored = localStorage.getItem(`progress-${skillId}`);
    if (!stored) {
      // Return initial progress structure
      const initialProgress: any = {};
      for (let i = 1; i <= 6; i++) {
        initialProgress[`stage-${i}`] = {
          videoWatchPercentage: 0,
          quizCompleted: false,
          isCompleted: false,
        };
      }
      return initialProgress;
    }
    return JSON.parse(stored);
  } catch {
    return {};
  }
}

function getCurrentStageForSkill(progress: any): number {
  for (let i = 1; i <= 6; i++) {
    if (!progress[`stage-${i}`]?.isCompleted) {
      return i;
    }
  }
  return 6; // All completed
}

function formatDueDate(date: Date): string {
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays <= 7) return `In ${diffDays} days`;
  if (diffDays <= 14) return `Next week`;
  return `In ${Math.ceil(diffDays / 7)} weeks`;
}