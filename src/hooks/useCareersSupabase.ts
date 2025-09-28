import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { CareerCategory, CareerGoal, DifficultyLevel } from '@/types/careers';

// Convert database types to frontend types
type DbCareerCategory = {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  is_global: boolean;
  tenant_id?: string;
  created_at: string;
  updated_at: string;
};

type DbCareerGoal = {
  id: string;
  category_id: string;
  name: string;
  icon?: string;
  short_description?: string;
  long_description?: string;
  duration_min_months: number;
  duration_max_months: number;
  difficulty: DifficultyLevel;
  is_global: boolean;
  tenant_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

const convertDbCategory = (dbCat: DbCareerCategory): CareerCategory => ({
  id: dbCat.id,
  name: dbCat.name,
  description: dbCat.description,
  icon: dbCat.icon,
  isGlobal: dbCat.is_global,
  tenantId: dbCat.tenant_id,
  createdAt: dbCat.created_at,
  updatedAt: dbCat.updated_at,
});

const convertDbGoal = (dbGoal: DbCareerGoal): CareerGoal => ({
  id: dbGoal.id,
  categoryId: dbGoal.category_id,
  name: dbGoal.name,
  icon: dbGoal.icon,
  shortDescription: dbGoal.short_description,
  longDescription: dbGoal.long_description,
  durationMinMonths: dbGoal.duration_min_months,
  durationMaxMonths: dbGoal.duration_max_months,
  difficulty: dbGoal.difficulty,
  isGlobal: dbGoal.is_global,
  tenantId: dbGoal.tenant_id,
  linkedSkillIds: [], // Will be populated separately
  isActive: dbGoal.is_active,
  createdAt: dbGoal.created_at,
  updatedAt: dbGoal.updated_at,
});

export function useCareersSupabase() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Queries
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError
  } = useQuery({
    queryKey: ['career-categories', user?.tenantId],
    queryFn: async (): Promise<CareerCategory[]> => {
      const { data, error } = await supabase
        .from('career_categories')
        .select('*')
        .or(`is_global.eq.true${user?.tenantId ? `,tenant_id.eq.${user.tenantId}` : ''}`)
        .order('name');

      if (error) throw error;
      return data.map(convertDbCategory);
    },
    enabled: !!user,
  });

  const {
    data: goals = [],
    isLoading: goalsLoading,
    error: goalsError
  } = useQuery({
    queryKey: ['career-goals', user?.tenantId],
    queryFn: async (): Promise<CareerGoal[]> => {
      // Get goals with their linked skills
      const { data: goalsData, error: goalsError } = await supabase
        .from('career_goals')
        .select(`
          *,
          career_goal_skills (
            skill_id
          )
        `)
        .eq('is_active', true)
        .or(`is_global.eq.true${user?.tenantId ? `,tenant_id.eq.${user.tenantId}` : ''}`)
        .order('name');

      if (goalsError) throw goalsError;

      return goalsData.map((goal: any) => {
        const converted = convertDbGoal(goal);
        converted.linkedSkillIds = goal.career_goal_skills?.map((link: any) => link.skill_id) || [];
        return converted;
      });
    },
    enabled: !!user,
  });

  // Mutations
  const createCategoryMutation = useMutation({
    mutationFn: async (input: { name: string; description?: string; icon?: string; isGlobal: boolean; tenantId?: string }) => {
      const { data, error } = await supabase
        .from('career_categories')
        .insert({
          name: input.name.trim(),
          description: input.description,
          icon: input.icon,
          is_global: input.isGlobal,
          tenant_id: input.isGlobal ? null : input.tenantId,
        })
        .select()
        .single();

      if (error) throw error;
      return convertDbCategory(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['career-categories'] });
      toast({
        title: "Category created",
        description: "Career category has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating category",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  const createGoalMutation = useMutation({
    mutationFn: async (input: {
      categoryId: string;
      name: string;
      icon?: string;
      shortDescription?: string;
      longDescription?: string;
      durationMinMonths: number;
      durationMaxMonths: number;
      difficulty: DifficultyLevel;
      isGlobal: boolean;
      tenantId?: string;
      linkedSkillIds?: string[];
      isActive?: boolean;
    }) => {
      // Validate duration
      if (input.durationMinMonths <= 0 || input.durationMaxMonths <= 0) {
        throw new Error('Duration must be positive numbers');
      }
      if (input.durationMinMonths > input.durationMaxMonths) {
        throw new Error('Min duration cannot exceed max');
      }

      const { data: goalData, error: goalError } = await supabase
        .from('career_goals')
        .insert({
          category_id: input.categoryId,
          name: input.name.trim(),
          icon: input.icon,
          short_description: input.shortDescription,
          long_description: input.longDescription,
          duration_min_months: input.durationMinMonths,
          duration_max_months: input.durationMaxMonths,
          difficulty: input.difficulty,
          is_global: input.isGlobal,
          tenant_id: input.isGlobal ? null : input.tenantId,
          is_active: input.isActive ?? true,
        })
        .select()
        .single();

      if (goalError) throw goalError;

      // Link skills if provided
      if (input.linkedSkillIds && input.linkedSkillIds.length > 0) {
        const skillLinks = input.linkedSkillIds.map(skillId => ({
          career_goal_id: goalData.id,
          skill_id: skillId,
        }));

        const { error: linksError } = await supabase
          .from('career_goal_skills')
          .insert(skillLinks);

        if (linksError) throw linksError;
      }

      return convertDbGoal(goalData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['career-goals'] });
      toast({
        title: "Goal created",
        description: "Career goal has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating goal",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  const updateGoalMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CareerGoal> }) => {
      const { data, error } = await supabase
        .from('career_goals')
        .update({
          name: updates.name?.trim(),
          icon: updates.icon,
          short_description: updates.shortDescription,
          long_description: updates.longDescription,
          duration_min_months: updates.durationMinMonths,
          duration_max_months: updates.durationMaxMonths,
          difficulty: updates.difficulty,
          is_active: updates.isActive,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return convertDbGoal(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['career-goals'] });
      toast({
        title: "Goal updated",
        description: "Career goal has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating goal",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  const deleteGoalMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('career_goals')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['career-goals'] });
      toast({
        title: "Goal deleted",
        description: "Career goal has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting goal",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  // Utility functions
  const listCategoriesForTenant = (tenantId?: string) => {
    return categories.filter(c => c.isGlobal || (!!tenantId && c.tenantId === tenantId));
  };

  const listGoalsForTenant = (tenantId?: string) => {
    return goals.filter(g => g.isActive && (g.isGlobal || (!!tenantId && g.tenantId === tenantId)));
  };

  const listGoalsByCategoryForTenant = (categoryId: string, tenantId?: string) => {
    return listGoalsForTenant(tenantId).filter(g => g.categoryId === categoryId);
  };

  return {
    // Data
    categories,
    goals,
    
    // Loading states
    isLoading: categoriesLoading || goalsLoading,
    error: categoriesError || goalsError,
    
    // Category operations
    createCategory: createCategoryMutation.mutate,
    isCreatingCategory: createCategoryMutation.isPending,
    
    // Goal operations
    createGoal: createGoalMutation.mutate,
    updateGoal: updateGoalMutation.mutate,
    deleteGoal: deleteGoalMutation.mutate,
    isCreatingGoal: createGoalMutation.isPending,
    isUpdatingGoal: updateGoalMutation.isPending,
    isDeletingGoal: deleteGoalMutation.isPending,
    
    // Utility functions
    listCategoriesForTenant,
    listGoalsForTenant,
    listGoalsByCategoryForTenant,
  };
}