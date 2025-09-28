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

// Mock data generation for now since we don't have the actual tables yet
const generateMockSystemUsers = (): SystemUser[] => [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@platform.com',
    role: 'platform_owner',
    status: 'active',
    lastLogin: new Date('2024-08-26'),
    createdAt: new Date('2024-01-01'),
    permissions: ['all_access', 'user_management', 'tenant_management', 'analytics', 'system_settings']
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@platform.com',
    role: 'system_admin',
    status: 'active',
    lastLogin: new Date('2024-08-25'),
    createdAt: new Date('2024-01-15'),
    permissions: ['user_management', 'tenant_management', 'analytics', 'content_management']
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike.wilson@techcorp.com',
    role: 'tenant_admin',
    status: 'active',
    lastLogin: new Date('2024-08-24'),
    createdAt: new Date('2024-02-01'),
    permissions: ['tenant_users', 'content_access', 'reports'],
    tenantId: '1',
    tenantName: 'TechCorp Inc.'
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@platform.com',
    role: 'content_manager',
    status: 'active',
    lastLogin: new Date('2024-08-23'),
    createdAt: new Date('2024-03-01'),
    permissions: ['content_management', 'course_creation', 'skill_management']
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david.brown@edulearn.org',
    role: 'tenant_admin',
    status: 'pending',
    createdAt: new Date('2024-08-20'),
    permissions: ['tenant_users', 'content_access'],
    tenantId: '2',
    tenantName: 'EduLearn Academy'
  }
];

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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return generateMockSystemUsers();
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const createUserMutation = useMutation({
    mutationFn: async (newUser: {
      name: string;
      email: string;
      role: SystemUser['role'];
      tenantId?: string;
    }) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const permissions = getDefaultPermissions(newUser.role);
      const user: SystemUser = {
        id: Date.now().toString(),
        ...newUser,
        status: 'pending',
        createdAt: new Date(),
        permissions,
        tenantName: newUser.tenantId ? getTenantName(newUser.tenantId) : undefined
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
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