import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface LearningPathStatus {
  hasActiveSkills: boolean;
  hasCareerGoal: boolean;
  skillsCount: number;
  lastUpdated: string | null;
}

interface LearningPath {
  id: string;
  userId: string;
  careerGoalId: string;
  selectedSkills: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export function useSupabaseLearningPath() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [status, setStatus] = useState<LearningPathStatus>({
    hasActiveSkills: false,
    hasCareerGoal: false,
    skillsCount: 0,
    lastUpdated: null
  });
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);

  const needsOnboarding = user?.role === 'student' && (!status.hasCareerGoal || !status.hasActiveSkills);

  useEffect(() => {
    if (user?.role === 'student') {
      loadLearningPaths();
    }
  }, [user]);

  const loadLearningPaths = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('learning_paths')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (error) {
        console.error('Error loading learning paths:', error);
        toast({ title: 'Error', description: 'Failed to load learning paths', variant: 'destructive' });
        return;
      }

      const transformedPaths: LearningPath[] = data?.map(path => ({
        id: path.id,
        userId: path.user_id,
        careerGoalId: path.career_goal_id,
        selectedSkills: path.selected_skills || [],
        status: path.status,
        createdAt: path.created_at,
        updatedAt: path.updated_at,
      })) || [];

      setLearningPaths(transformedPaths);

      // Calculate status
      const totalSkills = transformedPaths.reduce((acc, path) => acc + path.selectedSkills.length, 0);
      const newStatus: LearningPathStatus = {
        hasActiveSkills: totalSkills > 0,
        hasCareerGoal: transformedPaths.length > 0,
        skillsCount: totalSkills,
        lastUpdated: transformedPaths.length > 0 ? transformedPaths[0].updatedAt : null
      };

      setStatus(newStatus);
      
    } catch (error) {
      console.error('Error in loadLearningPaths:', error);
      toast({ title: 'Error', description: 'Failed to load learning paths', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const updateLearningPath = async (goalId: string, skills: string[]) => {
    if (!user || user.role !== 'student') return;

    try {
      // First, deactivate any existing learning paths
      await supabase
        .from('learning_paths')
        .update({ status: 'inactive' })
        .eq('user_id', user.id);

      // Create new learning path
      const { data, error } = await supabase
        .from('learning_paths')
        .insert({
          user_id: user.id,
          career_goal_id: goalId,
          selected_skills: skills,
          status: 'active'
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      await loadLearningPaths(); // Reload data
      toast({ title: 'Success', description: 'Learning path updated successfully' });
      
      return data;
    } catch (error: any) {
      console.error('Error updating learning path:', error);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      throw error;
    }
  };

  const markOnboardingComplete = async () => {
    if (!user || user.role !== 'student') return;

    try {
      // Update user profile to mark onboarding as complete
      const { error } = await supabase
        .from('profiles')
        .update({ 
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Reload learning paths to reflect changes
      await loadLearningPaths();
      
    } catch (error: any) {
      console.error('Error completing onboarding:', error);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  return {
    status,
    learningPaths,
    loading,
    needsOnboarding,
    updateLearningPath,
    markOnboardingComplete,
    refresh: loadLearningPaths,
  };
}