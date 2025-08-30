import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Mail, 
  Building2, 
  Users, 
  Calendar,
  MoreHorizontal,
  Send,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Tenant {
  id: string;
  name: string;
  email: string;
  domain: string;
  description: string;
  status: 'active' | 'pending' | 'suspended';
  userCount: number;
  createdAt: Date;
  lastLogin?: Date;
}

export function TenantManagement() {
  const [tenants, setTenants] = useState<Tenant[]>([
    {
      id: '1',
      name: 'TechCorp Inc.',
      email: 'admin@techcorp.com',
      domain: 'techcorp',
      description: 'Leading technology company specializing in software development and AI solutions.',
      status: 'active',
      userCount: 45,
      createdAt: new Date('2024-01-15'),
      lastLogin: new Date('2024-08-25')
    },
    {
      id: '2',
      name: 'EduLearn Academy',
      email: 'contact@edulearn.org',
      domain: 'edulearn',
      description: 'Educational institution focused on online learning and skill development.',
      status: 'active',
      userCount: 128,
      createdAt: new Date('2024-02-20'),
      lastLogin: new Date('2024-08-26')
    },
    {
      id: '3',
      name: 'StartupHub',
      email: 'info@startuphub.io',
      domain: 'startuphub',
      description: 'Innovation hub for startups and entrepreneurs.',
      status: 'pending',
      userCount: 0,
      createdAt: new Date('2024-08-20')
    }
  ]);

  const [isCreateTenantOpen, setIsCreateTenantOpen] = useState(false);
  const [isSendInviteOpen, setIsSendInviteOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [newTenant, setNewTenant] = useState({
    name: '',
    email: '',
    domain: '',
    description: ''
  });
  const [inviteData, setInviteData] = useState({
    email: '',
    message: 'Welcome to our learning platform! Please find your login credentials below.'
  });

  const handleCreateTenant = () => {
    const tenant: Tenant = {
      id: Date.now().toString(),
      ...newTenant,
      status: 'pending',
      userCount: 0,
      createdAt: new Date()
    };
    setTenants([...tenants, tenant]);
    setIsCreateTenantOpen(false);
    setNewTenant({
      name: '',
      email: '',
      domain: '',
      description: ''
    });
  };

  const handleSendInvite = () => {
    // UI only - simulate sending invite
    console.log('Sending invite to:', inviteData.email);
    setIsSendInviteOpen(false);
    setInviteData({
      email: '',
      message: 'Welcome to our learning platform! Please find your login credentials below.'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'suspended':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'suspended':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const activeTenants = tenants.filter(t => t.status === 'active').length;
  const pendingTenants = tenants.filter(t => t.status === 'pending').length;
  const totalUsers = tenants.reduce((sum, t) => sum + t.userCount, 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient-luxury">Tenant Management</h1>
          <p className="text-muted-foreground mt-2">Manage organizations and send access credentials</p>
        </div>
        <div className="flex gap-3">
          <Dialog open={isSendInviteOpen} onOpenChange={setIsSendInviteOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                Send Invite
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Send Access Invitation</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Recipient Email"
                  type="email"
                  value={inviteData.email}
                  onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                />
                <Textarea
                  placeholder="Custom message (optional)"
                  value={inviteData.message}
                  onChange={(e) => setInviteData({ ...inviteData, message: e.target.value })}
                  rows={4}
                />
                <Button onClick={handleSendInvite} className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Send Invitation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isCreateTenantOpen} onOpenChange={setIsCreateTenantOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-accent-luxury shadow-medium">
                <Plus className="w-4 h-4 mr-2" />
                Add Tenant
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Tenant</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Organization Name"
                  value={newTenant.name}
                  onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                />
                <Input
                  placeholder="Admin Email"
                  type="email"
                  value={newTenant.email}
                  onChange={(e) => setNewTenant({ ...newTenant, email: e.target.value })}
                />
                <Input
                  placeholder="Domain (e.g., techcorp)"
                  value={newTenant.domain}
                  onChange={(e) => setNewTenant({ ...newTenant, domain: e.target.value })}
                />
                <Textarea
                  placeholder="Description"
                  value={newTenant.description}
                  onChange={(e) => setNewTenant({ ...newTenant, description: e.target.value })}
                  rows={3}
                />
                <Button onClick={handleCreateTenant} className="w-full">
                  Create Tenant
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tenants</p>
                <p className="text-2xl font-bold">{tenants.length}</p>
              </div>
              <Building2 className="w-8 h-8 text-primary opacity-60" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Tenants</p>
                <p className="text-2xl font-bold text-green-600">{activeTenants}</p>
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
                <p className="text-2xl font-bold text-yellow-600">{pendingTenants}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500 opacity-60" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-primary opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tenants" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tenants">All Tenants</TabsTrigger>
          <TabsTrigger value="pending">Pending Access</TabsTrigger>
        </TabsList>

        <TabsContent value="tenants" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Tenant Organizations</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organization</TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead>Admin Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tenants.map((tenant) => (
                    <TableRow key={tenant.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{tenant.name}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {tenant.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{tenant.domain}</Badge>
                      </TableCell>
                      <TableCell>{tenant.email}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(tenant.status)}>
                          {getStatusIcon(tenant.status)}
                          <span className="ml-1 capitalize">{tenant.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>{tenant.userCount}</TableCell>
                      <TableCell>{tenant.createdAt.toLocaleDateString()}</TableCell>
                      <TableCell>
                        {tenant.lastLogin ? tenant.lastLogin.toLocaleDateString() : 'Never'}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Mail className="w-4 h-4 mr-2" />
                              Send Credentials
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Tenant
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Tenant
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

        <TabsContent value="pending" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Pending Access Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tenants.filter(t => t.status === 'pending').map((tenant) => (
                  <div key={tenant.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{tenant.name}</h3>
                          <p className="text-sm text-muted-foreground">{tenant.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-yellow-600">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                      <Button
                        size="sm"
                        onClick={() => {
                          setInviteData({ ...inviteData, email: tenant.email });
                          setIsSendInviteOpen(true);
                        }}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send Credentials
                      </Button>
                    </div>
                  </div>
                ))}
                {tenants.filter(t => t.status === 'pending').length === 0 && (
                  <div className="text-center p-8 text-muted-foreground">
                    <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No pending access requests</p>
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