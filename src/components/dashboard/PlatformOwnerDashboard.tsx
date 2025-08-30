import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AnimatedKpiCard } from '@/components/ui/animated-kpi-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CourseManagement } from '@/components/platform-owner/CourseManagement';
import { 
  Users, 
  Building2, 
  TrendingUp, 
  DollarSign, 
  Settings,
  Plus,
  ChevronRight,
  Activity,
  Globe,
  BookOpen,
  BarChart3
} from 'lucide-react';

export function PlatformOwnerDashboard() {
  const stats = [
    { 
      label: 'Total Tenants', 
      value: '24', 
      icon: Building2, 
      change: '+12%', 
      trend: 'up' as const,
      animationType: 'progress' as const
    },
    { 
      label: 'Active Students', 
      value: '3,247', 
      icon: Users, 
      change: '+18%', 
      trend: 'up' as const,
      animationType: 'wave' as const
    },
    { 
      label: 'Monthly Revenue', 
      value: '$84,320', 
      icon: DollarSign, 
      change: '+24%', 
      trend: 'up' as const,
      animationType: 'geometric' as const
    },
    { 
      label: 'Course Completions', 
      value: '1,892', 
      icon: TrendingUp, 
      change: '+8%', 
      trend: 'up' as const,
      animationType: 'pulse' as const
    }
  ];

  const tenants = [
    { name: 'TechCorp University', students: 486, status: 'active', growth: '+15%' },
    { name: 'Design Academy', students: 342, status: 'active', growth: '+22%' },
    { name: 'Business School Pro', students: 678, status: 'active', growth: '+8%' },
    { name: 'Creative Arts Hub', students: 234, status: 'trial', growth: '+45%' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient-luxury">Platform Management</h1>
          <p className="text-muted-foreground mt-2">Manage your entire learning ecosystem</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button className="bg-gradient-to-r from-primary to-accent-luxury shadow-medium">
            <Plus className="w-4 h-4 mr-2" />
            New Tenant
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-fit">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="courses" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Course Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">

      {/* Animated Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <AnimatedKpiCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
            icon={stat.icon}
            animationType={stat.animationType}
          />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Active Tenants */}
        <Card className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Active Tenants</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-4">
            {tenants.map((tenant) => (
              <div key={tenant.name} className="flex items-center justify-between p-4 rounded-lg bg-white/30 backdrop-blur-sm hover:bg-white/40 transition-all cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/30 to-accent-luxury/30 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{tenant.name}</h4>
                    <p className="text-sm text-muted-foreground">{tenant.students} students</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant={tenant.status === 'active' ? 'default' : 'secondary'}>
                    {tenant.status}
                  </Badge>
                  <span className="text-sm text-accent-success">{tenant.growth}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* System Health */}
        <Card className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">System Health</h3>
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-accent-success" />
              <span className="text-sm text-accent-success">All Systems Operational</span>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Server Performance</span>
                <span className="text-accent-success">98.7%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-accent-success h-2 rounded-full" style={{width: '98.7%'}}></div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Database Health</span>
                <span className="text-accent-success">99.2%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-accent-success h-2 rounded-full" style={{width: '99.2%'}}></div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>CDN Response</span>
                <span className="text-accent-success">97.4%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-accent-success h-2 rounded-full" style={{width: '97.4%'}}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
        </TabsContent>

        <TabsContent value="courses">
          <CourseManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
