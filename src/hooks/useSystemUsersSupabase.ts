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

// Fetch real system users from Supabase

const getDefaultPermissions = (role: SystemUser['role']): string[] => {
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

const getTenantName = (tenantId: string): string => {
  const tenantNames: { [key: string]: string } = {
    '1': 'TechCorp Inc.',
    '2': 'EduLearn Academy',
    '3': 'StartupHub'
  };
  return tenantNames[tenantId] || 'Unknown Tenant';
};

export function useSystemUsersSupabase() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: systemUsers = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['system-users'],
    queryFn: async (): Promise<SystemUser[]> => {
      // Check authentication
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error('User not authenticated:', sessionError);
        return [];
      }

      // Fetch users with platform_owner, system_admin, tenant_admin, or content_manager roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role,
          tenant_id
        `)
        .in('role', ['platform_owner', 'tenant_admin']);

      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
        throw rolesError;
      }

      if (!userRoles || userRoles.length === 0) {
        return [];
      }

      // Fetch user profiles
      const userIds = [...new Set(userRoles.map(r => r.user_id))];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Fetch tenant names
      const tenantIds = [...new Set(userRoles.filter(r => r.tenant_id).map(r => r.tenant_id))];
      const { data: tenants, error: tenantsError } = await supabase
        .from('tenants')
        .select('id, name')
        .in('id', tenantIds);

      if (tenantsError) throw tenantsError;

      const tenantMap = new Map(tenants?.map(t => [t.id, t.name]) || []);

      // Combine the data
      const users: SystemUser[] = profiles?.map(profile => {
        const userRole = userRoles.find(r => r.user_id === profile.id);
        const role = userRole?.role as SystemUser['role'];
        
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: role || 'tenant_admin',
          status: profile.is_active ? 'active' : 'inactive',
          lastLogin: undefined, // Can be tracked separately if needed
          createdAt: new Date(profile.created_at),
          permissions: getDefaultPermissions(role || 'tenant_admin'),
          tenantId: userRole?.tenant_id,
          tenantName: userRole?.tenant_id ? tenantMap.get(userRole.tenant_id) : undefined,
        };
      }) || [];

      return users;
    },
    enabled: !!user && user.role === 'platform_owner',
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const createUserMutation = useMutation({
    mutationFn: async (newUser: {
      name: string;
      email: string;
      role: SystemUser['role'];
      tenantId?: string;
    }) => {
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newUser.email,
        email_confirm: true,
        user_metadata: {
          name: newUser.name,
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');

      // Insert into profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: newUser.email,
          name: newUser.name,
          tenant_id: newUser.tenantId,
          is_active: true,
        });

      if (profileError) throw profileError;

      // Insert role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: authData.user.id,
          role: newUser.role === 'system_admin' || newUser.role === 'content_manager' 
            ? 'platform_owner' 
            : newUser.role,
          tenant_id: newUser.tenantId,
        });

      if (roleError) throw roleError;

      const permissions = getDefaultPermissions(newUser.role);
      const user: SystemUser = {
        id: authData.user.id,
        ...newUser,
        status: 'pending',
        createdAt: new Date(),
        permissions,
        tenantName: undefined, // Will be fetched on next query
      };
      
      return user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-users'] });
      toast({
        title: "User Created",
        description: "System user has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Creating User",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<SystemUser> }) => {
      // Update profile
      if (updates.name || updates.status !== undefined) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            name: updates.name,
            is_active: updates.status === 'active',
          })
          .eq('id', id);

        if (profileError) throw profileError;
      }

      // Update role if changed
      if (updates.role) {
        const mappedRole = updates.role === 'system_admin' || updates.role === 'content_manager'
          ? 'platform_owner'
          : updates.role;
          
        const { error: roleError } = await supabase
          .from('user_roles')
          .update({ role: mappedRole })
          .eq('user_id', id);

        if (roleError) throw roleError;
      }

      return { id, updates };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-users'] });
      toast({
        title: "User Updated",
        description: "System user has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Updating User",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      // Delete user from Supabase Auth (cascades to profiles and user_roles)
      const { error } = await supabase.auth.admin.deleteUser(id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-users'] });
      toast({
        title: "User Deleted",
        description: "System user has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Deleting User",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  // Statistics
  const activeUsers = systemUsers.filter(u => u.status === 'active').length;
  const pendingUsers = systemUsers.filter(u => u.status === 'pending').length;
  const tenantAdmins = systemUsers.filter(u => u.role === 'tenant_admin').length;

  return {
    // Data
    systemUsers,
    activeUsers,
    pendingUsers,
    tenantAdmins,
    
    // Loading states
    isLoading,
    error,
    
    // Operations
    createUser: createUserMutation.mutate,
    updateUser: updateUserMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
    
    // Loading states for operations
    isCreatingUser: createUserMutation.isPending,
    isUpdatingUser: updateUserMutation.isPending,
    isDeletingUser: deleteUserMutation.isPending,
    
    // Helper functions
    getDefaultPermissions,
    getTenantName,
  };
}