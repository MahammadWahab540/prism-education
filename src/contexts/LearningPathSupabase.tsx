import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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
  isLoading: boolean;
}

const LearningPathContext = createContext<LearningPathContextType | undefined>(undefined);

export function LearningPathProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Query for existing learning path
  const { data: learningPath, isLoading } = useQuery({
    queryKey: ['learning-path', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('learning_paths')
        .select(`
          *,
          career_goals (
            name,
            category_id
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (error) {
        console.error('Error fetching learning path:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!user,
  });

  // Calculate status based on learning path data
  const status: LearningPathStatus = React.useMemo(() => {
    if (!learningPath) {
      return {
        hasActiveSkills: false,
        hasCareerGoal: false,
        skillsCount: 0,
        lastUpdated: null
      };
    }

    return {
      hasActiveSkills: learningPath.selected_skills?.length > 0,
      hasCareerGoal: !!learningPath.career_goal_id,
      skillsCount: learningPath.selected_skills?.length || 0,
      lastUpdated: learningPath.updated_at
    };
  }, [learningPath]);

  // Check if student needs onboarding
  const needsOnboarding = user?.role === 'student' && (!status.hasCareerGoal || !status.hasActiveSkills);

  // Mutation to update learning path
  const updateLearningPathMutation = useMutation({
    mutationFn: async ({ goalId, skillIds }: { goalId: string; skillIds: string[] }) => {
      if (!user) throw new Error('User not authenticated');

      // First try to update existing path
      const { data: existingPath } = await supabase
        .from('learning_paths')
        .select('id')
        .eq('user_id', user.id)
        .eq('career_goal_id', goalId)
        .maybeSingle();

      if (existingPath) {
        // Update existing
        const { data, error } = await supabase
          .from('learning_paths')
          .update({
            selected_skills: skillIds,
            status: 'active',
          })
          .eq('id', existingPath.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new
        const { data, error } = await supabase
          .from('learning_paths')
          .insert({
            user_id: user.id,
            career_goal_id: goalId,
            selected_skills: skillIds,
            status: 'active',
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning-path', user?.id] });
      
      // Create skill progress entries for selected skills
      if (user && learningPath?.selected_skills) {
        learningPath.selected_skills.forEach(async (skillId: string) => {
          await supabase
            .from('skill_progress')
            .upsert({
              user_id: user.id,
              skill_id: skillId,
              overall_progress_percent: 0,
              average_quiz_score: 0,
            }, {
              onConflict: 'user_id,skill_id'
            });
        });
      }
    },
  });

  const updateLearningPath = (goalId: string, skills: any[]) => {
    if (!user || user.role !== 'student') return;
    
    const skillIds = skills.map(skill => skill.id);
    updateLearningPathMutation.mutate({ goalId, skillIds });
  };

  const markOnboardingComplete = () => {
    // This is handled automatically when a learning path is created
    queryClient.invalidateQueries({ queryKey: ['learning-path', user?.id] });
  };

  return (
    <LearningPathContext.Provider value={{
      status,
      updateLearningPath,
      needsOnboarding,
      markOnboardingComplete,
      isLoading,
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