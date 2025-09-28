import { useEffect, useState } from 'react';
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

export function useSupabaseSkills() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSkills();
  }, [user]);

  const loadSkills = async () => {
    try {
      setLoading(true);
      
      // Load skills (global + tenant-specific)
      const { data: skillsData, error } = await supabase
        .from('skills')
        .select('*')
        .eq('is_active', true)
        .or(`is_global.eq.true${user?.tenantId ? `,and(is_global.eq.false,tenant_id.eq.${user.tenantId})` : ''}`);

      if (error) {
        console.error('Error loading skills:', error);
        toast({ title: 'Error', description: 'Failed to load skills', variant: 'destructive' });
        return;
      }

      const transformedSkills: Skill[] = skillsData?.map(skill => ({
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

      setSkills(transformedSkills);
      
    } catch (error) {
      console.error('Error in loadSkills:', error);
      toast({ title: 'Error', description: 'Failed to load skills', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const createSkill = async (input: {
    name: string;
    description?: string;
    category?: string;
    difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
    estimatedHours?: number;
    isGlobal: boolean;
    tenantId?: string;
  }) => {
    try {
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

      await loadSkills(); // Reload skills
      toast({ title: 'Success', description: 'Skill created successfully' });
      
      return data;
    } catch (error: any) {
      console.error('Error creating skill:', error);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      throw error;
    }
  };

  const getAllSkills = () => {
    return skills;
  };

  const getSkillsByCategory = (category: string) => {
    return skills.filter(skill => skill.category === category);
  };

  return {
    skills,
    loading,
    createSkill,
    getAllSkills,
    getSkillsByCategory,
    refresh: loadSkills,
  };
}