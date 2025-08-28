import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  User,
  Shield,
  Bell,
  CreditCard,
  Users,
  Key,
  Settings as SettingsIcon,
  Building2,
  Palette,
  Link,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';

const ProfileTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Profile Information
        </CardTitle>
        <CardDescription>
          Manage your personal information and account details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-6">
          <Avatar className="w-20 h-20">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent-luxury text-white text-xl">
              {user?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <Button variant="outline" size="sm">
              Change Photo
            </Button>
            <p className="text-sm text-muted-foreground">
              JPG, PNG or GIF. Max size 2MB.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              defaultValue={user?.name}
              disabled={!isEditing}
              className={isEditing ? '' : 'bg-muted/50'}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              defaultValue={user?.email}
              disabled={!isEditing}
              className={isEditing ? '' : 'bg-muted/50'}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {user?.role === 'platform_owner' ? 'Platform Owner' :
                 user?.role === 'tenant_admin' ? 'Tenant Admin' : 'Student'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const SecurityTab = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const handleChangePassword = () => {
    toast({
      title: "Password Changed",
      description: "Your password has been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Password & Security
          </CardTitle>
          <CardDescription>
            Manage your password and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter current password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Enter new password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm new password"
            />
          </div>
          <Button onClick={handleChangePassword}>
            Update Password
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable 2FA</p>
              <p className="text-sm text-muted-foreground">
                Secure your account with two-factor authentication
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const NotificationsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notification Preferences
        </CardTitle>
        <CardDescription>
          Choose how you want to receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive updates via email
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-muted-foreground">
                Get notified in your browser
              </p>
            </div>
            <Switch />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Course Updates</p>
              <p className="text-sm text-muted-foreground">
                Notifications about course changes
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const BillingTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Billing & Subscription
        </CardTitle>
        <CardDescription>
          Manage your billing information and subscription
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-primary/10 to-accent-luxury/10 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Professional Plan</h3>
                <p className="text-sm text-muted-foreground">$99/month</p>
              </div>
              <Badge>Active</Badge>
            </div>
          </div>
          <Button variant="outline">Manage Subscription</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const OrgRolesTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Organization & Roles
        </CardTitle>
        <CardDescription>
          Manage organization settings and user roles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold">EduPlatform Organization</h3>
            <p className="text-sm text-muted-foreground">
              Platform-wide organization settings
            </p>
          </div>
          <Button variant="outline">Manage Organization</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const ApiKeysTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5" />
          API Keys
        </CardTitle>
        <CardDescription>
          Manage API keys for integrations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button>Generate New API Key</Button>
          <div className="text-sm text-muted-foreground">
            No API keys configured yet.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const TenantSettingsTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Institution Settings
          </CardTitle>
          <CardDescription>
            Configure your institution's branding and settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="institution-name">Institution Name</Label>
            <Input id="institution-name" placeholder="My Institution" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="institution-domain">Domain</Label>
            <Input id="institution-domain" placeholder="myinstitution.edu" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Branding
          </CardTitle>
          <CardDescription>
            Customize your institution's visual identity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Primary Color</Label>
            <div className="flex gap-2">
              <div className="w-10 h-10 bg-primary rounded border"></div>
              <Input placeholder="#3B82F6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const IntegrationsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="w-5 h-5" />
          Integrations
        </CardTitle>
        <CardDescription>
          Connect with external services and tools
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            No integrations configured yet.
          </div>
          <Button variant="outline">Add Integration</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const PreferencesTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SettingsIcon className="w-5 h-5" />
          Learning Preferences
        </CardTitle>
        <CardDescription>
          Customize your learning experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Auto-play Videos</p>
              <p className="text-sm text-muted-foreground">
                Automatically play next video in sequence
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Progress Reminders</p>
              <p className="text-sm text-muted-foreground">
                Get reminded to continue your learning
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Settings() {
  const { user } = useAuth();
  
  if (!user) {
    return null;
  }

  const getTabsForRole = (role: string) => {
    const commonTabs = [
      { value: 'profile', label: 'Profile', icon: User, component: ProfileTab },
      { value: 'security', label: 'Security', icon: Shield, component: SecurityTab },
      { value: 'notifications', label: 'Notifications', icon: Bell, component: NotificationsTab },
    ];

    switch (role) {
      case 'platform_owner':
        return [
          ...commonTabs,
          { value: 'billing', label: 'Billing', icon: CreditCard, component: BillingTab },
          { value: 'org-roles', label: 'Org & Roles', icon: Users, component: OrgRolesTab },
          { value: 'api-keys', label: 'API Keys', icon: Key, component: ApiKeysTab },
        ];
      case 'tenant_admin':
        return [
          ...commonTabs,
          { value: 'tenant-settings', label: 'Tenant Settings', icon: Building2, component: TenantSettingsTab },
          { value: 'integrations', label: 'Integrations', icon: Link, component: IntegrationsTab },
        ];
      case 'student':
        return [
          ...commonTabs,
          { value: 'preferences', label: 'Preferences', icon: SettingsIcon, component: PreferencesTab },
        ];
      default:
        return commonTabs;
    }
  };

  const tabs = getTabsForRole(user.role);
  const [activeTab, setActiveTab] = useState(tabs[0]?.value || 'profile');

  // Handle URL query params for tab selection
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam && tabs.find(tab => tab.value === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabs]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', value);
    window.history.pushState({}, '', url.toString());
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex items-center gap-2 text-sm"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {tabs.map((tab) => {
            const Component = tab.component;
            return (
              <TabsContent key={tab.value} value={tab.value}>
                <Component />
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}