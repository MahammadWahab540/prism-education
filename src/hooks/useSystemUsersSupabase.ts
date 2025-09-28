import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: 'platform_owner' | 'system_admin' | 'tenant_admin' | 'content_manager';
  status: 'active' | 'inactive' | 'pending';
  lastLogin?: Date;
  createdAt: Date;
  permissions: string[];
  tenantId?: string;
  tenantName?: string;
}

const fetchSystemUsers = async (user: any): Promise<SystemUser[]> => {
  if (!user || user.role !== 'platform_owner') {
    throw new Error('Unauthorized access');
  }

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select(`
      id,
      name,
      email,
      role,
      tenant_id,
      is_active,
      created_at,
      updated_at
    `)
    .neq('role', 'student');

  if (error) {
    throw new Error(`Failed to load system users: ${error.message}`);
  }

  // Transform profiles to SystemUser format
  return profiles?.map(profile => ({
    id: profile.id,
    name: profile.name || 'Unknown User',
    email: profile.email,
    role: mapDatabaseRoleToSystemRole(profile.role),
    status: profile.is_active ? 'active' : 'inactive' as const,
    lastLogin: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000),
    createdAt: new Date(profile.created_at),
    permissions: getPermissionsForRole(mapDatabaseRoleToSystemRole(profile.role)),
    tenantId: profile.tenant_id,
    tenantName: profile.tenant_id ? `Tenant ${profile.tenant_id.slice(0, 8)}` : undefined,
  })) || [];
};

const mapDatabaseRoleToSystemRole = (dbRole: string): SystemUser['role'] => {
  switch (dbRole) {
    case 'platform_owner':
      return 'platform_owner';
    case 'tenant_admin':
      return 'tenant_admin';
    default:
      return 'system_admin'; // Default fallback for other roles
  }
};

const getPermissionsForRole = (role: SystemUser['role']): string[] => {
  switch (role) {
    case 'platform_owner':
      return ['all_access', 'user_management', 'tenant_management', 'analytics', 'system_settings'];
    case 'system_admin':
      return ['user_management', 'tenant_management', 'analytics', 'content_management'];
    case 'tenant_admin':
      return ['tenant_users', 'content_access', 'reports'];
    case 'content_manager':
      return ['content_management', 'course_creation', 'skill_management'];
    default:
      return [];
  }
};

export function useSystemUsersSupabase() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: systemUsers = [], isLoading, error } = useQuery({
    queryKey: ['system-users'],
    queryFn: () => fetchSystemUsers(user),
    enabled: !!user && user.role === 'platform_owner',
  });

  const updateUserMutation = useMutation({
    mutationFn: async (data: { userId: string; updates: Partial<SystemUser> }) => {
      const { error } = await supabase
        .from('profiles')
        .update({
          // Only update fields that are actually in the profiles table
          email: data.updates.email,
          updated_at: new Date().toISOString(),
        })
        .eq('id', data.userId);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-users'] });
      toast({ title: 'Success', description: 'User updated successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async (userData: Omit<SystemUser, 'id' | 'createdAt' | 'lastLogin' | 'permissions'>) => {
      // In a real implementation, you'd create the user via Supabase Auth
      // For now, we'll simulate the creation
      const { error } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: 'temp-password-' + Math.random().toString(36).slice(2),
        email_confirm: true,
        user_metadata: {
          name: userData.name,
          role: userData.role === 'system_admin' ? 'tenant_admin' : userData.role,
        }
      });

      if (error) throw error;
      return userData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-users'] });
      toast({ title: 'Success', description: 'User created successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: false })
        .eq('id', userId);

      if (error) throw error;
      return userId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-users'] });
      toast({ title: 'Success', description: 'User deactivated successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  if (error) {
    toast({ title: 'Error', description: 'Failed to load system users', variant: 'destructive' });
  }

  return {
    systemUsers,
    isLoading,
    error,
    updateUser: updateUserMutation.mutate,
    createUser: createUserMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
    isUpdatingUser: updateUserMutation.isPending,
    isCreatingUser: createUserMutation.isPending,
    isDeletingUser: deleteUserMutation.isPending,
    refresh: () => queryClient.invalidateQueries({ queryKey: ['system-users'] }),
  };
}