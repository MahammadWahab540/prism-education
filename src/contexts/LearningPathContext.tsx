import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface LearningPathStatus {
  hasActiveSkills: boolean;
  hasCareerGoal: boolean;
  skillsCount: number;
  lastUpdated: string | null;
}

interface LearningPathContextType {
  status: LearningPathStatus;
  updateLearningPath: (goalId: string, skills: any[]) => void;
  needsOnboarding: boolean;
  markOnboardingComplete: () => void;
}

const LearningPathContext = createContext<LearningPathContextType | undefined>(undefined);

export function LearningPathProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [status, setStatus] = useState<LearningPathStatus>({
    hasActiveSkills: false,
    hasCareerGoal: false,
    skillsCount: 0,
    lastUpdated: null
  });

  // Check if student needs onboarding (no career goal or no active skills)
  const needsOnboarding = user?.role === 'student' && (!status.hasCareerGoal || !status.hasActiveSkills);

  useEffect(() => {
    if (user?.role === 'student') {
      // Load learning path status from localStorage (mock backend)
      const storedStatus = localStorage.getItem(`learning-path-${user.id}`);
      if (storedStatus) {
        setStatus(JSON.parse(storedStatus));
      } else {
        // New student - needs onboarding
        setStatus({
          hasActiveSkills: false,
          hasCareerGoal: false,
          skillsCount: 0,
          lastUpdated: null
        });
      }
    }
  }, [user]);

  const updateLearningPath = (goalId: string, skills: any[]) => {
    if (!user || user.role !== 'student') return;

    const newStatus: LearningPathStatus = {
      hasActiveSkills: skills.length > 0,
      hasCareerGoal: Boolean(goalId),
      skillsCount: skills.length,
      lastUpdated: new Date().toISOString()
    };

    setStatus(newStatus);
    localStorage.setItem(`learning-path-${user.id}`, JSON.stringify(newStatus));

    // Also store the actual selections
    const selections = {
      goalId,
      skills,
      completedAt: new Date().toISOString()
    };
    localStorage.setItem(`learning-selections-${user.id}`, JSON.stringify(selections));
  };

  const markOnboardingComplete = () => {
    if (!user || user.role !== 'student') return;

    const updatedStatus = {
      ...status,
      hasActiveSkills: true,
      hasCareerGoal: true,
      lastUpdated: new Date().toISOString()
    };

    setStatus(updatedStatus);
    localStorage.setItem(`learning-path-${user.id}`, JSON.stringify(updatedStatus));
  };

  return (
    <LearningPathContext.Provider value={{
      status,
      updateLearningPath,
      needsOnboarding,
      markOnboardingComplete
    }}>
      {children}
    </LearningPathContext.Provider>
  );
}

export function useLearningPath() {
  const context = useContext(LearningPathContext);
  if (context === undefined) {
    throw new Error('useLearningPath must be used within a LearningPathProvider');
  }
  return context;
}