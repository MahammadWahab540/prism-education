import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Student {
  id: string;
  name: string;
  email: string;
  graduationYear: number;
  batch: string;
  careerChoice?: string;
  enrolledSkills: number;
  completedSkills: number;
  overallProgress: number;
  lastActive: Date;
  enrollmentDate: Date;
  status: 'active' | 'inactive' | 'suspended';
  currentSkill?: string;
  totalWatchTime: number;
  quizzesCompleted: number;
  averageScore: number;
  tenantId: string;
}

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  studentCount: number;
}

const fetchStudents = async (user: any, tenantId?: string): Promise<Student[]> => {
  if (!user) return [];

  // For platform owners, we can filter by tenant
  // For tenant admins, we only show their tenant's students
  let query = supabase
    .from('profiles')
    .select(`
      id,
      name,
      email,
      tenant_id,
      total_watch_time_hours,
      streak_days,
      engagement_score,
      created_at,
      updated_at
    `)
    .eq('role', 'student');

  if (user.role === 'tenant_admin') {
    query = query.eq('tenant_id', user.tenantId);
  } else if (tenantId && tenantId !== 'all') {
    query = query.eq('tenant_id', tenantId);
  }

  const { data: profiles, error } = await query;

  if (error) {
    throw new Error(`Failed to load students: ${error.message}`);
  }

  // Transform profiles to match Student interface
  // For now, we'll use mock data structure with real profile data where available
  return profiles?.map((profile, index) => ({
    id: profile.id,
    name: profile.name || `Student ${index + 1}`,
    email: profile.email,
    graduationYear: new Date().getFullYear() + Math.floor(Math.random() * 3) + 1,
    batch: `CS-${new Date().getFullYear() + 1}-A`,
    careerChoice: ['Software Engineer', 'Data Scientist', 'Product Manager', 'DevOps Engineer'][Math.floor(Math.random() * 4)],
    enrolledSkills: Math.floor(Math.random() * 8) + 2,
    completedSkills: Math.floor(Math.random() * 5) + 1,
    overallProgress: Math.floor(Math.random() * 100),
    lastActive: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000),
    enrollmentDate: new Date(profile.created_at),
    status: 'active' as const,
    currentSkill: ['Machine Learning', 'Web Development', 'Data Analysis', 'Cloud Computing'][Math.floor(Math.random() * 4)],
    totalWatchTime: profile.total_watch_time_hours || Math.floor(Math.random() * 2000) + 500,
    quizzesCompleted: Math.floor(Math.random() * 20) + 5,
    averageScore: Math.floor(Math.random() * 30) + 70,
    tenantId: profile.tenant_id || 'default-tenant',
  })) || [];
};

const fetchTenants = async (): Promise<Tenant[]> => {
  const { data: tenants, error } = await supabase
    .from('tenants')
    .select('id, name, domain')
    .eq('is_active', true);

  if (error) {
    throw new Error(`Failed to load tenants: ${error.message}`);
  }

  return tenants?.map(tenant => ({
    id: tenant.id,
    name: tenant.name,
    domain: tenant.domain,
    studentCount: Math.floor(Math.random() * 50) + 10, // Mock student count for now
  })) || [];
};

export function useStudentsSupabase(tenantId?: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: students = [], isLoading: studentsLoading, error: studentsError } = useQuery({
    queryKey: ['students', user?.id, tenantId],
    queryFn: () => fetchStudents(user, tenantId),
    enabled: !!user,
  });

  const { data: tenants = [], isLoading: tenantsLoading, error: tenantsError } = useQuery({
    queryKey: ['tenants-for-students'],
    queryFn: fetchTenants,
    enabled: !!user && user.role === 'platform_owner',
  });

  const updateStudentMutation = useMutation({
    mutationFn: async (data: { studentId: string; updates: Partial<Student> }) => {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: data.updates.name,
          email: data.updates.email,
          updated_at: new Date().toISOString(),
        })
        .eq('id', data.studentId);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({ title: 'Success', description: 'Student updated successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const deleteStudentMutation = useMutation({
    mutationFn: async (studentId: string) => {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: false })
        .eq('id', studentId);

      if (error) throw error;
      return studentId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({ title: 'Success', description: 'Student removed successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  if (studentsError) {
    toast({ title: 'Error', description: 'Failed to load students', variant: 'destructive' });
  }

  if (tenantsError) {
    toast({ title: 'Error', description: 'Failed to load tenants', variant: 'destructive' });
  }

  return {
    students,
    tenants,
    isLoading: studentsLoading || tenantsLoading,
    studentsLoading,
    tenantsLoading,
    error: studentsError || tenantsError,
    updateStudent: updateStudentMutation.mutate,
    deleteStudent: deleteStudentMutation.mutate,
    isUpdatingStudent: updateStudentMutation.isPending,
    isDeletingStudent: deleteStudentMutation.isPending,
    refresh: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['tenants-for-students'] });
    },
  };
}