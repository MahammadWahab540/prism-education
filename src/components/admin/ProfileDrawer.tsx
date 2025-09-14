import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { AdminKpi } from './AdminKpi';
import { QuickActions } from './QuickActions';
import { ApprovalsList } from './ApprovalsList';
import { RecentAdminActivity } from './RecentAdminActivity';
import { Progress } from '@/components/ui/progress';
import { Users, UserCog, ClipboardList, HelpCircle, LogOut, Moon, Sun, Bell, PercentCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ProfileDrawer() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;
  const isAdmin = user.role === 'tenant_admin';
  // Feature flag
  const impersonation = localStorage.getItem('admin.impersonation') === 'true';
  const lastLoginAt = localStorage.getItem('lastLoginAt') || new Date().toISOString();

  // Placeholder stats (map to data layer if available)
  const stats = {
    totalStudents: Number(localStorage.getItem('admin.totalStudents') || 0),
    activeCounselors: Number(localStorage.getItem('admin.activeCounselors') || 0),
    pendingApprovals: Number(localStorage.getItem('admin.pendingApprovals') || 0),
    slaMetPct: Number(localStorage.getItem('admin.slaMetPct') || 0),
  };

  const kpiDelta = 0; // placeholder delta vs prev week

  const approvals = [] as { id: string; type: string; subject: string; age: string }[];
  const activity = [] as { id: string; action: string; entity: string; at: string }[];

  return (
    <ScrollArea className="w-[360px] p-4">
      {/* Header Identity */}
      <div className="flex items-start gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold truncate" title={user.name}>{user.name}</p>
            <Badge variant="secondary">Tenant Admin</Badge>
          </div>
          <p className="text-xs text-muted-foreground truncate" title={user.email}>{user.email}</p>
          <div className="flex items-center gap-2 mt-1">
            {user.tenantId && <Badge variant="outline">{user.tenantId}</Badge>}
            <span className="text-xs text-muted-foreground">Last login {new Date(lastLoginAt).toLocaleString()}</span>
          </div>
          <div className="mt-2 flex gap-2">
            <Button size="sm" variant="outline" onClick={() => navigate('/settings/profile')}>Edit Profile</Button>
            {impersonation && (
              <Button size="sm" onClick={() => navigate('/impersonate')}>Impersonate user</Button>
            )}
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Admin KPIs */}
      <div className="grid grid-cols-2 gap-2" aria-label="Admin KPIs">
        <AdminKpi title="Total Students" value={stats.totalStudents} delta={kpiDelta} icon={Users} onClick={()=>navigate('/students')} />
        <AdminKpi title="Active Counselors" value={stats.activeCounselors} delta={kpiDelta} icon={UserCog} onClick={()=>navigate('/counselors')} />
        <AdminKpi title="Pending Approvals" value={stats.pendingApprovals} delta={kpiDelta} icon={ClipboardList} onClick={()=>navigate('/approvals')} />
        <AdminKpi title="SLA Met %" value={stats.slaMetPct} delta={kpiDelta} icon={PercentCircle} onClick={()=>navigate('/help-support')} />
      </div>

      <Separator className="my-4" />

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-3">
          <QuickActions permissions={user.permissions || []} />
        </CardContent>
      </Card>

      <Separator className="my-4" />

      {/* Approvals & Alerts */}
      <ApprovalsList items={approvals} />

      <Separator className="my-4" />

      {/* Recent Admin Activity */}
      <RecentAdminActivity items={activity} />

      {/* This Week Overview */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Actions completed</p>
            <p className="text-lg font-bold">{new Intl.NumberFormat().format(Number(localStorage.getItem('admin.actionsCompleted')||0))}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">SLA met %</p>
            <p className="text-lg font-bold">{Number(localStorage.getItem('admin.slaMetPct')||0)}%</p>
          </CardContent>
        </Card>
        {!!localStorage.getItem('admin.weeklyGoal') && (
          <div className="col-span-2">
            <p className="text-xs text-muted-foreground mb-1">Weekly goal</p>
            <Progress value={Number(localStorage.getItem('admin.weeklyProgress')||0)} />
          </div>
        )}
      </div>

      <Separator className="my-4" />

      {/* Footer Utilities */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" className="w-full justify-start" onClick={() => {
                const mode = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
                document.documentElement.classList.toggle('dark');
                console.log('profile.theme.toggle', { mode });
              }}>
                <Moon className="w-4 h-4 mr-2" /> Theme
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle light/dark</TooltipContent>
          </Tooltip>
          <Button variant="outline" className="w-full justify-start" onClick={()=>navigate('/settings/notifications')}>
            <Bell className="w-4 h-4 mr-2" /> Notifications
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="w-full justify-start" onClick={()=>window.open('https://docs', '_blank')}>
            <HelpCircle className="w-4 h-4 mr-2" /> Help / Docs
          </Button>
          <Button variant="destructive" className="w-full justify-start" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
}

