import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { AIServices } from '@/services/aiServices';

export interface CapstoneTemplate {
  id: string;
  skillId: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  overview: {
    problem: string;
    objective: string;
  };
}

export interface CapstoneInstance {
  id: string;
  userId: string;
  tenantId?: string;
  templateId?: string;
  skillId: string;
  status: 'Active' | 'Completed' | 'Submitted' | 'Graded' | 'Paused';
  roadmap?: any;
  progress?: any;
  createdAt: string;
  updatedAt: string;
}

export interface CapstoneSubmission {
  id: string;
  instanceId: string;
  submissionType: 'repo' | 'report' | 'demo' | 'assignment';
  title?: string;
  description?: string;
  submissionUrl?: string;
  metadata?: any;
  submittedAt: string;
  gradedAt?: string;
  grade?: number;
  feedback?: string;
  gradedBy?: string;
}

const convertDbTemplate = (dbTemplate: any): CapstoneTemplate => ({
  id: dbTemplate.id,
  skillId: dbTemplate.skill_id,
  title: dbTemplate.title,
  difficulty: dbTemplate.difficulty,
  tags: dbTemplate.tags || [],
  overview: dbTemplate.overview,
});

const convertDbInstance = (dbInstance: any): CapstoneInstance => ({
  id: dbInstance.id,
  userId: dbInstance.user_id,
  tenantId: dbInstance.tenant_id,
  templateId: dbInstance.template_id,
  skillId: dbInstance.skill_id,
  status: dbInstance.status,
  roadmap: dbInstance.roadmap,
  progress: dbInstance.progress,
  createdAt: dbInstance.created_at,
  updatedAt: dbInstance.updated_at,
});

const convertDbSubmission = (dbSubmission: any): CapstoneSubmission => ({
  id: dbSubmission.id,
  instanceId: dbSubmission.instance_id,
  submissionType: dbSubmission.submission_type,
  title: dbSubmission.title,
  description: dbSubmission.description,
  submissionUrl: dbSubmission.submission_url,
  metadata: dbSubmission.metadata,
  submittedAt: dbSubmission.submitted_at,
  gradedAt: dbSubmission.graded_at,
  grade: dbSubmission.grade,
  feedback: dbSubmission.feedback,
  gradedBy: dbSubmission.graded_by,
});

export function useCapstoneSupabase() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query capstone templates
  const {
    data: templates = [],
    isLoading: templatesLoading,
    error: templatesError
  } = useQuery({
    queryKey: ['capstone-templates', user?.tenantId],
    queryFn: async (): Promise<CapstoneTemplate[]> => {
      const { data, error } = await supabase
        .from('capstone_templates')
        .select('*')
        .eq('is_active', true)
        .or(`tenant_id.is.null${user?.tenantId ? `,tenant_id.eq.${user.tenantId}` : ''}`)
        .order('title');

      if (error) throw error;
      return data.map(convertDbTemplate);
    },
    enabled: !!user,
  });

  // Query user's capstone instances
  const {
    data: instances = [],
    isLoading: instancesLoading,
    error: instancesError
  } = useQuery({
    queryKey: ['capstone-instances', user?.id],
    queryFn: async (): Promise<CapstoneInstance[]> => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('capstone_instances')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(convertDbInstance);
    },
    enabled: !!user,
  });

  // Query submissions for user's instances
  const {
    data: submissions = [],
    isLoading: submissionsLoading,
    error: submissionsError
  } = useQuery({
    queryKey: ['capstone-submissions', user?.id],
    queryFn: async (): Promise<CapstoneSubmission[]> => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('capstone_submissions')
        .select(`
          *,
          capstone_instances!inner (
            user_id
          )
        `)
        .eq('capstone_instances.user_id', user.id)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      return data.map(convertDbSubmission);
    },
    enabled: !!user,
  });

  // Mutation to create capstone instance with AI roadmap
  const createInstanceMutation = useMutation({
    mutationFn: async (params: {
      templateId: string;
      customRequirements?: string;
      difficulty?: string;
      timeframe?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      return await AIServices.generateCapstoneRoadmap({
        ...params,
        userId: user.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['capstone-instances'] });
      toast({
        title: "Capstone Created",
        description: "Your AI-generated capstone roadmap is ready!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Creating Capstone",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  // Mutation to submit capstone deliverable
  const submitDeliverableMutation = useMutation({
    mutationFn: async (params: {
      instanceId: string;
      submissionType: 'repo' | 'report' | 'demo' | 'assignment';
      title: string;
      description?: string;
      submissionUrl: string;
      metadata?: any;
    }) => {
      const { data, error } = await supabase
        .from('capstone_submissions')
        .insert({
          instance_id: params.instanceId,
          submission_type: params.submissionType,
          title: params.title,
          description: params.description,
          submission_url: params.submissionUrl,
          metadata: params.metadata || {},
        })
        .select()
        .single();

      if (error) throw error;
      return convertDbSubmission(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['capstone-submissions'] });
      queryClient.invalidateQueries({ queryKey: ['capstone-instances'] });
      toast({
        title: "Submission Complete",
        description: "Your capstone deliverable has been submitted for review.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Submitting Deliverable",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  // Mutation to update instance progress
  const updateProgressMutation = useMutation({
    mutationFn: async ({ instanceId, progress }: { instanceId: string; progress: any }) => {
      const { data, error } = await supabase
        .from('capstone_instances')
        .update({ progress })
        .eq('id', instanceId)
        .select()
        .single();

      if (error) throw error;
      return convertDbInstance(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['capstone-instances'] });
    },
  });

  // Helper functions
  const getTemplatesBySkill = (skillId: string) => {
    return templates.filter(t => t.skillId === skillId);
  };

  const getActiveInstance = () => {
    return instances.find(i => i.status === 'Active');
  };

  const getInstanceById = (instanceId: string) => {
    return instances.find(i => i.id === instanceId);
  };

  const getSubmissionsForInstance = (instanceId: string) => {
    return submissions.filter(s => s.instanceId === instanceId);
  };

  return {
    // Data
    templates,
    instances,
    submissions,
    
    // Loading states
    isLoading: templatesLoading || instancesLoading || submissionsLoading,
    error: templatesError || instancesError || submissionsError,
    
    // Operations
    createInstance: createInstanceMutation.mutate,
    submitDeliverable: submitDeliverableMutation.mutate,
    updateProgress: updateProgressMutation.mutate,
    
    // Loading states for operations
    isCreatingInstance: createInstanceMutation.isPending,
    isSubmittingDeliverable: submitDeliverableMutation.isPending,
    isUpdatingProgress: updateProgressMutation.isPending,
    
    // Helper functions
    getTemplatesBySkill,
    getActiveInstance,
    getInstanceById,
    getSubmissionsForInstance,
  };
}