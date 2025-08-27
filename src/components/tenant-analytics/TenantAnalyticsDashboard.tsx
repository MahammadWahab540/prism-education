import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AnimatedKpiCard } from '@/components/ui/animated-kpi-card';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  DollarSign,
  Target,
  Activity,
  Calendar,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Download,
  Filter
} from 'lucide-react';

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
  users: {
    label: "Users",
    color: "hsl(var(--secondary))",
  },
  engagement: {
    label: "Engagement",
    color: "hsl(var(--accent))",
  },
  completion: {
    label: "Completion",
    color: "hsl(var(--muted))",
  },
};

export function TenantAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedTenant, setSelectedTenant] = useState('all');

  // Mock data for tenant analytics
  const revenueData = [
    { month: 'Jan', revenue: 12400, subscriptions: 24, churn: 2 },
    { month: 'Feb', revenue: 15600, subscriptions: 31, churn: 1 },
    { month: 'Mar', revenue: 18900, subscriptions: 38, churn: 3 },
    { month: 'Apr', revenue: 22100, subscriptions: 44, churn: 2 },
    { month: 'May', revenue: 25800, subscriptions: 52, churn: 4 },
    { month: 'Jun', revenue: 28400, subscriptions: 57, churn: 2 }
  ];

  const tenantPerformanceData = [
    { 
      name: 'TechCorp Inc.', 
      users: 245, 
      activeUsers: 189, 
      completionRate: 78, 
      engagement: 85, 
      revenue: 4800,
      growth: 15,
      health: 'excellent',
      tier: 'Enterprise'
    },
    { 
      name: 'EduLearn Academy', 
      users: 456, 
      activeUsers: 398, 
      completionRate: 82, 
      engagement: 91, 
      revenue: 8200,
      growth: 22,
      health: 'excellent',
      tier: 'Enterprise'
    },
    { 
      name: 'StartupHub', 
      users: 89, 
      activeUsers: 67, 
      completionRate: 65, 
      engagement: 72, 
      revenue: 1800,
      growth: 8,
      health: 'good',
      tier: 'Professional'
    },
    { 
      name: 'InnovateFlow', 
      users: 167, 
      activeUsers: 134, 
      completionRate: 71, 
      engagement: 78, 
      revenue: 3200,
      growth: 12,
      health: 'good',
      tier: 'Professional'
    },
    { 
      name: 'Digital Solutions', 
      users: 123, 
      activeUsers: 89, 
      completionRate: 58, 
      engagement: 64, 
      revenue: 2400,
      growth: -3,
      health: 'warning',
      tier: 'Basic'
    },
    { 
      name: 'Future Tech', 
      users: 78, 
      activeUsers: 45, 
      completionRate: 42, 
      engagement: 51, 
      revenue: 1200,
      growth: -8,
      health: 'critical',
      tier: 'Basic'
    }
  ];

  const engagementTrendsData = [
    { week: 'W1', sessions: 1240, watchTime: 3200, completions: 89 },
    { week: 'W2', sessions: 1450, watchTime: 3800, completions: 102 },
    { week: 'W3', sessions: 1320, watchTime: 3400, completions: 95 },
    { week: 'W4', sessions: 1680, watchTime: 4200, completions: 118 }
  ];

  const tierDistributionData = [
    { tier: 'Enterprise', count: 12, revenue: 156000 },
    { tier: 'Professional', count: 28, revenue: 84000 },
    { tier: 'Basic', count: 45, revenue: 27000 }
  ];

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'excellent': return <CheckCircle className="w-4 h-4" />;
      case 'good': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient-luxury">Tenant Analytics</h1>
          <p className="text-muted-foreground mt-2">Monitor tenant performance, revenue, and engagement metrics</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedTenant} onValueChange={setSelectedTenant}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select tenant" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tenants</SelectItem>
              {tenantPerformanceData.map((tenant) => (
                <SelectItem key={tenant.name} value={tenant.name}>
                  {tenant.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatedKpiCard
          label="Total Revenue"
          value="$267K"
          change="+18.5% from last month"
          trend="up"
          icon={DollarSign}
          animationType="progress"
        />
        <AnimatedKpiCard
          label="Active Tenants"
          value="85"
          change="+12% from last month"
          trend="up"
          icon={Building2}
          animationType="wave"
        />
        <AnimatedKpiCard
          label="Avg Engagement"
          value="76%"
          change="+4.2% from last month"
          trend="up"
          icon={Activity}
          animationType="geometric"
        />
        <AnimatedKpiCard
          label="Churn Rate"
          value="2.1%"
          change="-0.8% from last month"
          trend="down"
          icon={Target}
          animationType="pulse"
        />
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="health">Health Score</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Tenant Performance Overview
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tenantPerformanceData.map((tenant, index) => (
                  <div key={tenant.name} className="group p-4 bg-background/50 rounded-lg border border-border/50 hover:border-primary/50 transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {tenant.name}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {tenant.tier}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span>{tenant.users} total users</span>
                            <span>{tenant.activeUsers} active</span>
                            <span className={tenant.growth > 0 ? 'text-green-600' : 'text-red-600'}>
                              {tenant.growth > 0 ? '+' : ''}{tenant.growth}% growth
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">${tenant.revenue.toLocaleString()}/mo</p>
                          <p className="text-xs text-muted-foreground">{tenant.completionRate}% completion</p>
                        </div>
                        <Badge className={`${getHealthColor(tenant.health)} flex items-center gap-1`}>
                          {getHealthIcon(tenant.health)}
                          {tenant.health}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Revenue Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary))" 
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-secondary" />
                  Subscription Tiers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={tierDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="hsl(var(--primary))"
                        dataKey="count"
                        label={({ tier, percent }) => `${tier} ${(percent * 100).toFixed(0)}%`}
                      >
                        {tierDistributionData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={`hsl(var(--primary) / ${0.8 - (index * 0.2)})`} 
                          />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Weekly Engagement Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={engagementTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="week" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="sessions" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="watchTime" 
                      stroke="hsl(var(--secondary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--secondary))', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="completions" 
                      stroke="hsl(var(--accent))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">12</div>
                <div className="text-sm text-muted-foreground">Excellent Health</div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">28</div>
                <div className="text-sm text-muted-foreground">Good Health</div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">3</div>
                <div className="text-sm text-muted-foreground">Warning</div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">2</div>
                <div className="text-sm text-muted-foreground">Critical</div>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Tenant Health Scores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tenantPerformanceData
                  .sort((a, b) => {
                    const healthOrder = { excellent: 4, good: 3, warning: 2, critical: 1 };
                    return healthOrder[b.health as keyof typeof healthOrder] - healthOrder[a.health as keyof typeof healthOrder];
                  })
                  .map((tenant) => (
                    <div key={tenant.name} className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/50">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getHealthColor(tenant.health)}`}>
                          {getHealthIcon(tenant.health)}
                        </div>
                        <div>
                          <p className="font-semibold">{tenant.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {tenant.engagement}% engagement • {tenant.completionRate}% completion
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{tenant.activeUsers}/{tenant.users} active</p>
                          <p className="text-xs text-muted-foreground">
                            {tenant.growth > 0 ? '+' : ''}{tenant.growth}% growth
                          </p>
                        </div>
                        <Badge className={getHealthColor(tenant.health)}>
                          {tenant.health}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}