import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Skill {
  id: string;
  name: string;
  description?: string;
  category?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours?: number;
  isGlobal: boolean;
  tenantId?: string;
  isActive: boolean;
}

export interface SkillProgress {
  id: string;
  userId: string;
  skillId: string;
  overallProgressPercent: number;
  averageQuizScore: number;
  capstoneProjectRequested: boolean;
  startedAt: string;
  completedAt?: string;
  updatedAt: string;
}

const convertDbSkill = (dbSkill: any): Skill => ({
  id: dbSkill.id,
  name: dbSkill.name,
  description: dbSkill.description,
  category: dbSkill.category,
  difficulty: dbSkill.difficulty,
  estimatedHours: dbSkill.estimated_hours,
  isGlobal: dbSkill.is_global,
  tenantId: dbSkill.tenant_id,
  isActive: dbSkill.is_active,
});

const convertDbProgress = (dbProgress: any): SkillProgress => ({
  id: dbProgress.id,
  userId: dbProgress.user_id,
  skillId: dbProgress.skill_id,
  overallProgressPercent: dbProgress.overall_progress_percent,
  averageQuizScore: dbProgress.average_quiz_score,
  capstoneProjectRequested: dbProgress.capstone_project_requested,
  startedAt: dbProgress.started_at,
  completedAt: dbProgress.completed_at,
  updatedAt: dbProgress.updated_at,
});

export function useSkillsSupabase() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query all skills available to user
  const {
    data: skills = [],
    isLoading: skillsLoading,
    error: skillsError
  } = useQuery({
    queryKey: ['skills', user?.tenantId],
    queryFn: async (): Promise<Skill[]> => {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('is_active', true)
        .or(`is_global.eq.true${user?.tenantId ? `,tenant_id.eq.${user.tenantId}` : ''}`)
        .order('name');

      if (error) throw error;
      return data.map(convertDbSkill);
    },
    enabled: !!user,
  });

  // Query user's skill progress
  const {
    data: skillProgress = [],
    isLoading: progressLoading,
    error: progressError
  } = useQuery({
    queryKey: ['skill-progress', user?.id],
    queryFn: async (): Promise<SkillProgress[]> => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('skill_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data.map(convertDbProgress);
    },
    enabled: !!user,
  });

  // Mutation to update skill progress
  const updateProgressMutation = useMutation({
    mutationFn: async ({ 
      skillId, 
      progressUpdate 
    }: { 
      skillId: string; 
      progressUpdate: Partial<Omit<SkillProgress, 'id' | 'userId' | 'skillId'>> 
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('skill_progress')
        .upsert({
          user_id: user.id,
          skill_id: skillId,
          overall_progress_percent: progressUpdate.overallProgressPercent,
          average_quiz_score: progressUpdate.averageQuizScore,
          capstone_project_requested: progressUpdate.capstoneProjectRequested,
          completed_at: progressUpdate.completedAt,
        }, {
          onConflict: 'user_id,skill_id'
        })
        .select()
        .single();

      if (error) throw error;
      return convertDbProgress(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skill-progress', user?.id] });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating progress",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  // Helper functions
  const getSkillById = (skillId: string) => skills.find(s => s.id === skillId);
  const getProgressForSkill = (skillId: string) => skillProgress.find(p => p.skillId === skillId);
  const getSkillsByCategory = (category: string) => skills.filter(s => s.category === category);
  
  return {
    // Data
    skills,
    skillProgress,
    
    // Loading states
    isLoading: skillsLoading || progressLoading,
    error: skillsError || progressError,
    
    // Operations
    updateProgress: updateProgressMutation.mutate,
    isUpdatingProgress: updateProgressMutation.isPending,
    
    // Helper functions
    getSkillById,
    getProgressForSkill,
    getSkillsByCategory,
  };
}