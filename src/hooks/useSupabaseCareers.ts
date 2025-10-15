import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface CareerCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  isGlobal: boolean;
  tenantId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CareerGoal {
  id: string;
  categoryId: string;
  name: string;
  icon?: string;
  shortDescription?: string;
  longDescription?: string;
  durationMinMonths: number;
  durationMaxMonths: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  isGlobal: boolean;
  tenantId?: string;
  linkedSkillIds: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useSupabaseCareers() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [categories, setCategories] = useState<CareerCategory[]>([]);
  const [goals, setGoals] = useState<CareerGoal[]>([]);
  const [loading, setLoading] = useState(true);

  // Load categories and goals
  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load categories (global + tenant-specific)
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('career_categories')
        .select('*')
        .or(`is_global.eq.true${user?.tenantId ? `,and(is_global.eq.false,tenant_id.eq.${user.tenantId})` : ''}`);

      if (categoriesError) {
        console.error('Error loading categories:', categoriesError);
        toast({ title: 'Error', description: 'Failed to load career categories', variant: 'destructive' });
        return;
      }

      // Transform to match interface
      const transformedCategories: CareerCategory[] = categoriesData?.map(cat => ({
        id: cat.id,
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        isGlobal: cat.is_global,
        tenantId: cat.tenant_id,
        createdAt: cat.created_at,
        updatedAt: cat.updated_at,
      })) || [];

      // Load goals with linked skills
      const { data: goalsData, error: goalsError } = await supabase
        .from('career_goals')
        .select(`
          *,
          career_goal_skills!inner(skill_id)
        `)
        .eq('is_active', true)
        .or(`is_global.eq.true${user?.tenantId ? `,and(is_global.eq.false,tenant_id.eq.${user.tenantId})` : ''}`);

      if (goalsError) {
        console.error('Error loading goals:', goalsError);
        toast({ title: 'Error', description: 'Failed to load career goals', variant: 'destructive' });
        return;
      }

      // Transform goals data
      const transformedGoals: CareerGoal[] = goalsData?.map(goal => ({
        id: goal.id,
        categoryId: goal.category_id,
        name: goal.name,
        icon: goal.icon,
        shortDescription: goal.short_description,
        longDescription: goal.long_description,
        durationMinMonths: goal.duration_min_months,
        durationMaxMonths: goal.duration_max_months,
        difficulty: goal.difficulty,
        isGlobal: goal.is_global,
        tenantId: goal.tenant_id,
        linkedSkillIds: goal.career_goal_skills?.map((cgs: any) => cgs.skill_id) || [],
        isActive: goal.is_active,
        createdAt: goal.created_at,
        updatedAt: goal.updated_at,
      })) || [];

      setCategories(transformedCategories);
      setGoals(transformedGoals);
      
    } catch (error) {
      console.error('Error in loadData:', error);
      toast({ title: 'Error', description: 'Failed to load career data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (input: {
    name: string;
    description?: string;
    icon?: string;
    isGlobal: boolean;
    tenantId?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('career_categories')
        .insert({
          name: input.name.trim(),
          description: input.description,
          icon: input.icon,
          is_global: input.isGlobal,
          tenant_id: input.isGlobal ? null : (input.tenantId || user?.tenantId),
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique violation
          throw new Error('Category already exists for this scope');
        }
        throw error;
      }

      const newCategory: CareerCategory = {
        id: data.id,
        name: data.name,
        description: data.description,
        icon: data.icon,
        isGlobal: data.is_global,
        tenantId: data.tenant_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      setCategories(prev => [...prev, newCategory]);
      toast({ title: 'Success', description: 'Career category created successfully' });
      
      return newCategory;
    } catch (error: any) {
      console.error('Error creating category:', error);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      throw error;
    }
  };

  const createGoal = async (input: {
    categoryId: string;
    name: string;
    icon?: string;
    shortDescription?: string;
    longDescription?: string;
    durationMinMonths: number;
    durationMaxMonths: number;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    isGlobal: boolean;
    tenantId?: string;
    linkedSkillIds?: string[];
    isActive?: boolean;
  }) => {
    try {
      // Validate duration
      if (input.durationMinMonths <= 0 || input.durationMaxMonths <= 0) {
        throw new Error('Duration must be positive numbers');
      }
      if (input.durationMinMonths > input.durationMaxMonths) {
        throw new Error('Min duration cannot exceed max');
      }

      const { data, error } = await supabase
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
          tenant_id: input.isGlobal ? null : (input.tenantId || user?.tenantId),
          is_active: input.isActive ?? true,
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique violation
          throw new Error('Goal already exists in this category and scope');
        }
        throw error;
      }

      // Link skills if provided
      if (input.linkedSkillIds && input.linkedSkillIds.length > 0) {
        const skillLinks = input.linkedSkillIds.map(skillId => ({
          career_goal_id: data.id,
          skill_id: skillId
        }));

        const { error: linkError } = await supabase
          .from('career_goal_skills')
          .insert(skillLinks);

        if (linkError) {
          console.error('Error linking skills:', linkError);
          // Don't fail the entire operation for this
        }
      }

      await loadData(); // Reload to get updated data with skills
      toast({ title: 'Success', description: 'Career goal created successfully' });
      
      return data;
    } catch (error: any) {
      console.error('Error creating goal:', error);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      throw error;
    }
  };

  const listCategoriesForTenant = (tenantId?: string) => {
    return categories.filter(c => 
      c.isGlobal || (tenantId && c.tenantId === tenantId)
    );
  };

  const listGoalsForTenant = (tenantId?: string) => {
    return goals.filter(g => 
      g.isActive && (g.isGlobal || (tenantId && g.tenantId === tenantId))
    );
  };

  const listGoalsByCategoryForTenant = (categoryId: string, tenantId?: string) => {
    return listGoalsForTenant(tenantId).filter(g => g.categoryId === categoryId);
  };

  return {
    categories,
    goals,
    loading,
    // Category API
    createCategory,
    listCategoriesForTenant,
    // Goal API
    createGoal,
    listGoalsForTenant,
    listGoalsByCategoryForTenant,
    // Utilities
    refresh: loadData,
  };
}