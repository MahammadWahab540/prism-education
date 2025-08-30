import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  UserPlus, 
  Shield, 
  Crown, 
  Settings,
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Key,
  Users
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';

interface SystemUser {
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

export function SystemUserManagement() {
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>([
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
  ]);

  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'tenant_admin' as SystemUser['role'],
    tenantId: ''
  });

  const handleCreateUser = () => {
    const user: SystemUser = {
      id: Date.now().toString(),
      ...newUser,
      status: 'pending',
      createdAt: new Date(),
      permissions: getDefaultPermissions(newUser.role),
      tenantName: newUser.tenantId ? getTenantName(newUser.tenantId) : undefined
    };
    setSystemUsers([...systemUsers, user]);
    setIsCreateUserOpen(false);
    setNewUser({
      name: '',
      email: '',
      role: 'tenant_admin',
      tenantId: ''
    });
  };

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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'platform_owner':
        return <Crown className="w-4 h-4" />;
      case 'system_admin':
        return <Shield className="w-4 h-4" />;
      case 'tenant_admin':
        return <Users className="w-4 h-4" />;
      case 'content_manager':
        return <Settings className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'platform_owner':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'system_admin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'tenant_admin':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'content_manager':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'inactive':
        return <XCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const activeUsers = systemUsers.filter(u => u.status === 'active').length;
  const pendingUsers = systemUsers.filter(u => u.status === 'pending').length;
  const platformOwners = systemUsers.filter(u => u.role === 'platform_owner').length;
  const tenantAdmins = systemUsers.filter(u => u.role === 'tenant_admin').length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient-luxury">System Users</h1>
          <p className="text-muted-foreground mt-2">Manage platform administrators and internal users</p>
        </div>
        <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-accent-luxury shadow-medium">
              <UserPlus className="w-4 h-4 mr-2" />
              Add System User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create System User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Full Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
              <Input
                placeholder="Email Address"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
              <Select
                value={newUser.role}
                onValueChange={(value) => setNewUser({ ...newUser, role: value as SystemUser['role'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="platform_owner">Platform Owner</SelectItem>
                  <SelectItem value="system_admin">System Administrator</SelectItem>
                  <SelectItem value="tenant_admin">Tenant Administrator</SelectItem>
                  <SelectItem value="content_manager">Content Manager</SelectItem>
                </SelectContent>
              </Select>
              {newUser.role === 'tenant_admin' && (
                <Select
                  value={newUser.tenantId}
                  onValueChange={(value) => setNewUser({ ...newUser, tenantId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Tenant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">TechCorp Inc.</SelectItem>
                    <SelectItem value="2">EduLearn Academy</SelectItem>
                    <SelectItem value="3">StartupHub</SelectItem>
                  </SelectContent>
                </Select>
              )}
              <Button onClick={handleCreateUser} className="w-full">
                Create User
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{systemUsers.length}</p>
              </div>
              <Users className="w-8 h-8 text-primary opacity-60" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500 opacity-60" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingUsers}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500 opacity-60" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tenant Admins</p>
                <p className="text-2xl font-bold">{tenantAdmins}</p>
              </div>
              <Shield className="w-8 h-8 text-primary opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">All Users</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>System Users</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {systemUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>
                          {getRoleIcon(user.role)}
                          <span className="ml-1 capitalize">{user.role.replace('_', ' ')}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.tenantName ? (
                          <Badge variant="outline">{user.tenantName}</Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>
                          {getStatusIcon(user.status)}
                          <span className="ml-1 capitalize">{user.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.lastLogin ? user.lastLogin.toLocaleDateString() : 'Never'}
                      </TableCell>
                      <TableCell>{user.createdAt.toLocaleDateString()}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Key className="w-4 h-4 mr-2" />
                              Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="w-4 h-4 mr-2" />
                              Send Invite
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Role Definitions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Crown className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="font-medium">Platform Owner</p>
                        <p className="text-sm text-muted-foreground">Full system access</p>
                      </div>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">Highest</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium">System Administrator</p>
                        <p className="text-sm text-muted-foreground">Manage users & tenants</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">High</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium">Tenant Administrator</p>
                        <p className="text-sm text-muted-foreground">Manage tenant users</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Medium</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Settings className="w-5 h-5 text-orange-500" />
                      <div>
                        <p className="font-medium">Content Manager</p>
                        <p className="text-sm text-muted-foreground">Manage courses & content</p>
                      </div>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800">Medium</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Permission Matrix</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    'User Management',
                    'Tenant Management', 
                    'Content Management',
                    'Analytics Access',
                    'System Settings'
                  ].map((permission) => (
                    <div key={permission} className="flex items-center justify-between p-2">
                      <span className="text-sm">{permission}</span>
                      <div className="flex gap-2">
                        <Switch defaultChecked />
                        <Switch defaultChecked />
                        <Switch />
                        <Switch />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Pending User Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemUsers.filter(u => u.status === 'pending').map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          {getRoleIcon(user.role)}
                        </div>
                        <div>
                          <h3 className="font-medium">{user.name}</h3>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getRoleColor(user.role)} variant="outline">
                              {user.role.replace('_', ' ')}
                            </Badge>
                            {user.tenantName && (
                              <Badge variant="outline" className="text-xs">
                                {user.tenantName}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Reject
                      </Button>
                      <Button size="sm">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}
                {systemUsers.filter(u => u.status === 'pending').length === 0 && (
                  <div className="text-center p-8 text-muted-foreground">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No pending approvals</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}