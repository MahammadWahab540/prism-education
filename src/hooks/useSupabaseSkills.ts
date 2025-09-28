import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Skill {
  id: string;
  name: string;
  description?: string;
  category?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours?: number;
  isGlobal: boolean;
  tenantId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const fetchSkills = async (user: any): Promise<Skill[]> => {
  if (!user) return [];

  const { data: skillsData, error } = await supabase
    .from('skills')
    .select('*')
    .eq('is_active', true)
    .or(`is_global.eq.true${user?.tenantId ? `,and(is_global.eq.false,tenant_id.eq.${user.tenantId})` : ''}`);

  if (error) {
    throw new Error(`Failed to load skills: ${error.message}`);
  }

  return skillsData?.map(skill => ({
    id: skill.id,
    name: skill.name,
    description: skill.description,
    category: skill.category,
    difficulty: skill.difficulty,
    estimatedHours: skill.estimated_hours,
    isGlobal: skill.is_global,
    tenantId: skill.tenant_id,
    isActive: skill.is_active,
    createdAt: skill.created_at,
    updatedAt: skill.updated_at,
  })) || [];
};

export function useSupabaseSkills() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: skills = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['skills', user?.tenantId],
    queryFn: () => fetchSkills(user),
    enabled: !!user,
  });

  if (error) {
    toast({ title: 'Error', description: 'Failed to load skills', variant: 'destructive' });
  }

  const createSkillMutation = useMutation({
    mutationFn: async (input: {
      name: string;
      description?: string;
      category?: string;
      difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
      estimatedHours?: number;
      isGlobal: boolean;
      tenantId?: string;
    }) => {
      const { data, error } = await supabase
        .from('skills')
        .insert({
          name: input.name.trim(),
          description: input.description,
          category: input.category,
          difficulty: input.difficulty || 'Beginner',
          estimated_hours: input.estimatedHours,
          is_global: input.isGlobal,
          tenant_id: input.isGlobal ? null : (input.tenantId || user?.tenantId),
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique violation
          throw new Error('Skill already exists for this scope');
        }
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      toast({ title: 'Success', description: 'Skill created successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const getAllSkills = () => {
    return skills;
  };

  const getSkillsByCategory = (category: string) => {
    return skills.filter(skill => skill.category === category);
  };

  return {
    skills,
    loading,
    error,
    createSkill: createSkillMutation.mutate,
    isCreatingSkill: createSkillMutation.isPending,
    getAllSkills,
    getSkillsByCategory,
    refresh: refetch,
  };
}