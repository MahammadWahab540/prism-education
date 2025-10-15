import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Mail, Edit, Trash2, MoreHorizontal, Building2, CheckCircle, PauseCircle, Users, Copy, ExternalLink } from 'lucide-react';
import { fetchTenants, TenantsQueryKey, Tenant, getTenantUrl } from '@/services/tenants';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { SendCredentialsModal } from '@/components/platform-owner/tenant/SendCredentialsModal';
import { EditTenantDrawer } from '@/components/platform-owner/tenant/EditTenantDrawer';
import { DeleteTenantDialog } from '@/components/platform-owner/tenant/DeleteTenantDialog';

function StatusBadge({ status }: { status: Tenant['status'] }) {
  const variant = status === 'active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200';
  const Icon = status === 'active' ? CheckCircle : PauseCircle;
  return (
    <Badge variant="outline" className={variant}>
      <Icon className="w-4 h-4 mr-1" />
      {status}
    </Badge>
  );
}

export function TenantManagement() {
  const { user } = useAuth();
  const canManage = user?.role === 'platform_owner';
  const { data: tenants = [] } = useQuery({ queryKey: TenantsQueryKey, queryFn: fetchTenants });
  const { toast } = useToast();

  const [selected, setSelected] = React.useState<Tenant | null>(null);
  const [openSend, setOpenSend] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);

  const copyTenantLink = async (tenant: Tenant) => {
    const url = getTenantUrl(tenant.slug);
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: `Tenant access link copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const openTenantPortal = (tenant: Tenant) => {
    const url = getTenantUrl(tenant.slug);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const onAction = (t: Tenant, action: 'send' | 'edit' | 'delete') => {
    setSelected(t);
    if (action === 'send') setOpenSend(true);
    if (action === 'edit') setOpenEdit(true);
    if (action === 'delete') setOpenDelete(true);
  };

  const activeCount = tenants.filter((t) => t.status === 'active').length;
  const totalUsers = tenants.reduce((sum, t) => sum + (t.usedSeats ?? 0), 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient-luxury">Tenant Management</h1>
          <p className="text-muted-foreground mt-2">Manage organizations and send access credentials</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Tenants</p>
              <p className="text-2xl font-bold">{tenants.length}</p>
            </div>
            <Building2 className="w-8 h-8 text-primary opacity-60" />
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Tenants</p>
              <p className="text-2xl font-bold text-green-600">{activeCount}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500 opacity-60" />
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">{totalUsers}</p>
            </div>
            <Users className="w-8 h-8 text-primary opacity-60" />
          </CardContent>
        </Card>
      </div>

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
                <TableHead>Tenant Access Link</TableHead>
                <TableHead>Admin Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Created</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.map((t) => {
                const sendDisabled = t.status !== 'active' || !canManage;
                const tenantUrl = getTenantUrl(t.slug);
                const isActive = t.status === 'active';
                
                return (
                  <TableRow key={t.id}>
                    <TableCell>
                      <div className="font-medium">{t.name}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{t.slug}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => isActive ? openTenantPortal(t) : undefined}
                              disabled={!isActive}
                              className={`text-sm font-mono flex items-center gap-1 hover:underline ${
                                isActive ? 'text-primary cursor-pointer' : 'text-muted-foreground cursor-not-allowed'
                              }`}
                            >
                              <span className="truncate max-w-[200px]">{tenantUrl}</span>
                              {isActive && <ExternalLink className="w-3 h-3 flex-shrink-0" />}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {isActive ? 'Open tenant portal in new tab' : 'Activate tenant to access portal'}
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyTenantLink(t)}
                              className="h-8 w-8 p-0"
                              aria-label={`Copy access link for ${t.name}`}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Copy tenant access link</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                    <TableCell>{t.adminEmail}</TableCell>
                    <TableCell>
                      <StatusBadge status={t.status} />
                    </TableCell>
                    <TableCell>
                      {t.usedSeats ?? 0} / {t.accountQuota ?? 0}
                    </TableCell>
                    <TableCell>{new Date(t.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" aria-label={`Actions for ${t.name}`}>
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onSelect={(e) => {
                              e.preventDefault();
                              copyTenantLink(t);
                            }}
                          >
                            <Copy className="w-4 h-4 mr-2" /> Copy Access Link
                          </DropdownMenuItem>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => {
                                  e.preventDefault();
                                  if (!isActive) return;
                                  openTenantPortal(t);
                                }}
                                disabled={!isActive}
                              >
                                <ExternalLink className="w-4 h-4 mr-2" /> Open Tenant Portal
                              </DropdownMenuItem>
                            </TooltipTrigger>
                            {!isActive && <TooltipContent>Activate tenant to open portal</TooltipContent>}
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => {
                                  e.preventDefault();
                                  if (sendDisabled) return;
                                  onAction(t, 'send');
                                }}
                                disabled={sendDisabled}
                              >
                                <Mail className="w-4 h-4 mr-2" /> Send Credentials
                              </DropdownMenuItem>
                            </TooltipTrigger>
                            {(t.status !== 'active') && <TooltipContent>Activate tenant to send credentials</TooltipContent>}
                          </Tooltip>

                          <DropdownMenuItem
                            onSelect={(e) => {
                              e.preventDefault();
                              if (!canManage) return;
                              onAction(t, 'edit');
                            }}
                            disabled={!canManage}
                          >
                            <Edit className="w-4 h-4 mr-2" /> Edit Tenant
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="text-red-600"
                            onSelect={(e) => {
                              e.preventDefault();
                              if (!canManage) return;
                              onAction(t, 'delete');
                            }}
                            disabled={!canManage}
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete Tenant
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <SendCredentialsModal open={openSend} onOpenChange={setOpenSend} tenant={selected} canManage={!!canManage} />
      <EditTenantDrawer open={openEdit} onOpenChange={setOpenEdit} tenant={selected} canManage={!!canManage} />
      <DeleteTenantDialog open={openDelete} onOpenChange={setOpenDelete} tenant={selected} canManage={!!canManage} />
    </div>
  );
}

