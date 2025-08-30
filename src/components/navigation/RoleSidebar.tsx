
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  BarChart3,
  Settings,
  BookOpen,
  GraduationCap,
  Calendar,
  MessageSquare,
  FileText,
  Award,
  TrendingUp,
  UserCog,
  LogOut,
  ChevronsUpDown,
  Plus,
  School,
  ClipboardList,
  PieChart,
  UserCircle,
  Target,
} from 'lucide-react';

const sidebarVariants = {
  open: { width: '15rem' },
  closed: { width: '3.05rem' },
};

const contentVariants = {
  open: { display: 'block', opacity: 1 },
  closed: { display: 'block', opacity: 1 },
};

const variants = {
  open: {
    x: 0,
    opacity: 1,
    transition: { x: { stiffness: 1000, velocity: -100 } },
  },
  closed: {
    x: -20,
    opacity: 0,
    transition: { x: { stiffness: 100 } },
  },
};

const transitionProps = {
  type: 'tween' as const,
  ease: [0.4, 0, 0.2, 1] as const,
  duration: 0.2,
  staggerChildren: 0.1,
};

const staggerVariants = {
  open: {
    transition: { staggerChildren: 0.03, delayChildren: 0.02 },
  },
};

// Navigation items for each role
const getNavigationItems = (role: string) => {
  switch (role) {
    case 'platform_owner':
      return [
        { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
        { title: 'Course Management', url: '/course-management', icon: BookOpen },
        { title: 'Tenants', url: '/tenants', icon: Building2 },
        { title: 'Students', url: '/students', icon: GraduationCap },
        { title: 'Analytics', url: '/analytics', icon: BarChart3 },
        { title: 'System Users', url: '/system-users', icon: Users },
        { title: 'Reports', url: '/system-reports', icon: FileText },
        { title: 'Help & Support', url: '/help-support', icon: MessageSquare },
        { title: 'Billing', url: '/billing', icon: TrendingUp },
      ];
    case 'tenant_admin':
      return [
        { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
        { title: 'Students', url: '/students', icon: GraduationCap },
        { title: 'Analytics', url: '/tenant-analytics', icon: PieChart },
        { title: 'Reports', url: '/tenant-reports', icon: FileText },
        { title: 'Help & Support', url: '/help-support', icon: MessageSquare },
      ];
    case 'student':
      return [
        { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
        { title: 'My Skills', url: '/my-skills', icon: BookOpen },
        { title: 'Learning Path', url: '/learning-path', icon: Target },
        { title: 'Help & Support', url: '/help-support', icon: MessageSquare },
      ];
    default:
      return [];
  }
};

const getRoleDisplayName = (role: string) => {
  switch (role) {
    case 'platform_owner': return 'Platform Owner';
    case 'tenant_admin': return 'Tenant Admin';
    case 'student': return 'Student';
    default: return role;
  }
};

const getOrganizationName = (role: string, user: any) => {
  switch (role) {
    case 'platform_owner': return 'EduPlatform';
    case 'tenant_admin': return 'My Institution';
    case 'student': return 'My School';
    default: return 'Organization';
  }
};

export function RoleSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { user, logout } = useAuth();
  const location = useLocation();
  
  if (!user) return null;

  const navigationItems = getNavigationItems(user.role);
  const organizationName = getOrganizationName(user.role, user);

  return (
    <motion.div
      className={cn(
        'sidebar fixed left-0 z-40 h-full shrink-0 border-r bg-gradient-glass backdrop-blur-md',
      )}
      initial={isCollapsed ? 'closed' : 'open'}
      animate={isCollapsed ? 'closed' : 'open'}
      variants={sidebarVariants}
      transition={transitionProps}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <motion.div
        className="relative z-40 flex text-muted-foreground h-full shrink-0 flex-col bg-gradient-glass transition-all"
        variants={contentVariants}
      >
        <motion.ul variants={staggerVariants} className="flex h-full flex-col">
          <div className="flex grow flex-col items-center">
            {/* Organization Header */}
            <div className="flex h-[54px] w-full shrink-0 border-b p-2">
              <div className="mt-[1.5px] flex w-full">
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger className="w-full" asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex w-fit items-center gap-2 px-2"
                    >
                      <Avatar className="rounded size-4">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {organizationName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <motion.li
                        variants={variants}
                        className="flex w-fit items-center gap-2"
                      >
                        {!isCollapsed && (
                          <>
                            <p className="text-sm font-medium">{organizationName}</p>
                            <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />
                          </>
                        )}
                      </motion.li>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="bg-card-glass backdrop-blur-md">
                    {user.role === 'platform_owner' && (
                      <>
                        <DropdownMenuItem asChild className="flex items-center gap-2">
                          <Link to="/system-settings">
                            <Settings className="h-4 w-4" /> System Settings
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="flex items-center gap-2">
                          <Link to="/create-tenant">
                            <Plus className="h-4 w-4" /> Create Tenant
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    {user.role === 'tenant_admin' && (
                      <>
                        <DropdownMenuItem asChild className="flex items-center gap-2">
                          <Link to="/tenant-settings">
                            <Settings className="h-4 w-4" /> Institution Settings
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="flex items-center gap-2">
                          <Link to="/manage-users">
                            <UserCog className="h-4 w-4" /> Manage Users
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    {user.role === 'student' && (
                      <DropdownMenuItem asChild className="flex items-center gap-2">
                        <Link to="/profile">
                          <UserCircle className="h-4 w-4" /> My Profile
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Navigation Content */}
            <div className="flex h-full w-full flex-col">
              <div className="flex grow flex-col gap-4">
                <ScrollArea className="h-16 grow p-2">
                  <div className={cn('flex w-full flex-col gap-1')}>
                    {navigationItems.map((item) => {
                      const isActive = location.pathname === item.url;
                      const Icon = item.icon;
                      
                      return (
                        <Link
                          key={item.title}
                          to={item.url}
                          className={cn(
                            'flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary',
                            isActive && 'bg-muted text-primary font-medium',
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          <motion.li variants={variants}>
                            {!isCollapsed && (
                              <p className="ml-2 text-sm font-medium">{item.title}</p>
                            )}
                          </motion.li>
                        </Link>
                      );
                    })}
                    
                    <Separator className="w-full my-2" />
                    
                  </div>
                </ScrollArea>
              </div>

              {/* Bottom Section */}
              <div className="flex flex-col p-2">
                <Link
                  to="/settings"
                  className="mt-auto flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary"
                >
                  <Settings className="h-4 w-4 shrink-0" />
                  <motion.li variants={variants}>
                    {!isCollapsed && (
                      <p className="ml-2 text-sm font-medium">Settings</p>
                    )}
                  </motion.li>
                </Link>

                {/* User Account Menu */}
                <div>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger className="w-full">
                      <div className="flex h-8 w-full flex-row items-center gap-2 rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary">
                        <Avatar className="size-4">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {user.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <motion.li
                          variants={variants}
                          className="flex w-full items-center gap-2"
                        >
                          {!isCollapsed && (
                            <>
                              <p className="text-sm font-medium truncate">{user.name}</p>
                              <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
                            </>
                          )}
                        </motion.li>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent sideOffset={5} className="bg-card-glass backdrop-blur-md">
                      <div className="flex flex-row items-center gap-2 p-2">
                        <Avatar className="size-6">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {user.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col text-left">
                          <span className="text-sm font-medium">{user.name}</span>
                          <span className="line-clamp-1 text-xs text-muted-foreground">
                            {user.email}
                          </span>
                          <Badge variant="outline" className="text-xs mt-1 w-fit">
                            {getRoleDisplayName(user.role)}
                          </Badge>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="flex items-center gap-2">
                        <Link to="/profile">
                          <UserCircle className="h-4 w-4" /> Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2 text-accent-error hover:text-accent-error"
                        onClick={logout}
                      >
                        <LogOut className="h-4 w-4" /> Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </motion.ul>
      </motion.div>
    </motion.div>
  );
}
