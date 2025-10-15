import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

const fetchLearningPaths = async (user: any): Promise<{ paths: LearningPath[], status: LearningPathStatus }> => {
  if (!user || user.role !== 'student') {
    return {
      paths: [],
      status: {
        hasActiveSkills: false,
        hasCareerGoal: false,
        skillsCount: 0,
        lastUpdated: null
      }
    };
  }

  const { data, error } = await supabase
    .from('learning_paths')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active');

  if (error) {
    throw new Error(`Failed to load learning paths: ${error.message}`);
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

  // Calculate status
  const totalSkills = transformedPaths.reduce((acc, path) => acc + path.selectedSkills.length, 0);
  const status: LearningPathStatus = {
    hasActiveSkills: totalSkills > 0,
    hasCareerGoal: transformedPaths.length > 0,
    skillsCount: totalSkills,
    lastUpdated: transformedPaths.length > 0 ? transformedPaths[0].updatedAt : null
  };

  return { paths: transformedPaths, status };
};

export function useSupabaseLearningPath() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading: loading, error } = useQuery({
    queryKey: ['learning-paths', user?.id],
    queryFn: () => fetchLearningPaths(user),
    enabled: !!user && user.role === 'student',
  });

  const learningPaths = data?.paths || [];
  const status = data?.status || {
    hasActiveSkills: false,
    hasCareerGoal: false,
    skillsCount: 0,
    lastUpdated: null
  };

  const needsOnboarding = user?.role === 'student' && (!status.hasCareerGoal || !status.hasActiveSkills);

  if (error) {
    toast({ title: 'Error', description: 'Failed to load learning paths', variant: 'destructive' });
  }

  const updateLearningPathMutation = useMutation({
    mutationFn: async ({ goalId, skills }: { goalId: string, skills: string[] }) => {
      if (!user || user.role !== 'student') throw new Error('User not authorized');

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

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning-paths'] });
      toast({ title: 'Success', description: 'Learning path updated successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const markOnboardingCompleteMutation = useMutation({
    mutationFn: async () => {
      if (!user || user.role !== 'student') throw new Error('User not authorized');

      const { error } = await supabase
        .from('profiles')
        .update({ 
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning-paths'] });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  return {
    status,
    learningPaths,
    loading,
    error,
    needsOnboarding,
    updateLearningPath: (goalId: string, skills: string[]) => updateLearningPathMutation.mutate({ goalId, skills }),
    isUpdatingLearningPath: updateLearningPathMutation.isPending,
    markOnboardingComplete: markOnboardingCompleteMutation.mutate,
    isMarkingOnboardingComplete: markOnboardingCompleteMutation.isPending,
    refresh: () => queryClient.invalidateQueries({ queryKey: ['learning-paths', user?.id] }),
  };
}