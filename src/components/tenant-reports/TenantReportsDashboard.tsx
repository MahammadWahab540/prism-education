import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AnimatedKpiCard } from '@/components/ui/animated-kpi-card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
  Filter,
  FileText,
  BarChart3,
  PieChart as PieChartIcon,
  Layers,
  Globe,
  Shield
} from 'lucide-react';

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
  tenants: {
    label: "Tenants",
    color: "hsl(var(--secondary))",
  },
  engagement: {
    label: "Engagement",
    color: "hsl(var(--accent))",
  },
  retention: {
    label: "Retention",
    color: "hsl(var(--muted))",
  },
};

export function TenantReportsDashboard() {
  const [timeRange, setTimeRange] = useState('12m');
  const [reportType, setReportType] = useState('executive');

  // Mock data for tenant reports
  const executiveSummaryData = {
    totalRevenue: '$1.2M',
    revenueGrowth: 24.5,
    totalTenants: 127,
    tenantGrowth: 18.2,
    avgEngagement: 78.5,
    engagementGrowth: 5.3,
    churnRate: 3.2,
    churnChange: -1.2
  };

  const monthlyRevenueData = [
    { month: 'Jan', revenue: 85000, tenants: 89, avgContract: 955 },
    { month: 'Feb', revenue: 92000, tenants: 95, avgContract: 968 },
    { month: 'Mar', revenue: 98000, tenants: 102, avgContract: 961 },
    { month: 'Apr', revenue: 105000, tenants: 108, avgContract: 972 },
    { month: 'May', revenue: 112000, tenants: 115, avgContract: 974 },
    { month: 'Jun', revenue: 118000, tenants: 121, avgContract: 975 },
    { month: 'Jul', revenue: 125000, tenants: 127, avgContract: 984 },
    { month: 'Aug', revenue: 132000, tenants: 134, avgContract: 985 },
    { month: 'Sep', revenue: 139000, tenants: 141, avgContract: 986 },
    { month: 'Oct', revenue: 145000, tenants: 147, avgContract: 986 },
    { month: 'Nov', revenue: 152000, tenants: 154, avgContract: 987 },
    { month: 'Dec', revenue: 158000, tenants: 160, avgContract: 988 }
  ];

  const tenantTierDistribution = [
    { tier: 'Enterprise', count: 15, revenue: 750000, avgUsers: 245 },
    { tier: 'Professional', count: 42, revenue: 378000, avgUsers: 89 },
    { tier: 'Standard', count: 70, revenue: 210000, avgUsers: 32 }
  ];

  const retentionData = [
    { month: 'Jan', retention: 94.2, newTenants: 8, churn: 2 },
    { month: 'Feb', retention: 95.1, newTenants: 12, churn: 1 },
    { month: 'Mar', retention: 93.8, newTenants: 15, churn: 3 },
    { month: 'Apr', retention: 96.2, newTenants: 18, churn: 2 },
    { month: 'May', retention: 95.7, newTenants: 14, churn: 2 },
    { month: 'Jun', retention: 97.1, newTenants: 16, churn: 1 }
  ];

  const topPerformingTenants = [
    {
      name: 'TechCorp Global',
      tier: 'Enterprise',
      revenue: 12400,
      users: 456,
      engagement: 92,
      satisfaction: 4.8,
      contractExpiry: '2025-08-15',
      status: 'excellent'
    },
    {
      name: 'EduLearn Solutions',
      tier: 'Enterprise', 
      revenue: 11800,
      users: 389,
      engagement: 89,
      satisfaction: 4.7,
      contractExpiry: '2025-11-22',
      status: 'excellent'
    },
    {
      name: 'Innovation Hub',
      tier: 'Professional',
      revenue: 5600,
      users: 178,
      engagement: 85,
      satisfaction: 4.5,
      contractExpiry: '2025-03-10',
      status: 'good'
    },
    {
      name: 'StartupAccelerator',
      tier: 'Professional',
      revenue: 4200,
      users: 134,
      engagement: 82,
      satisfaction: 4.4,
      contractExpiry: '2024-12-05',
      status: 'renewal-risk'
    }
  ];

  const regionalPerformance = [
    { region: 'North America', tenants: 68, revenue: 720000, growth: 22 },
    { region: 'Europe', tenants: 35, revenue: 385000, growth: 18 },
    { region: 'Asia Pacific', tenants: 18, revenue: 195000, growth: 34 },
    { region: 'Latin America', tenants: 6, revenue: 58000, growth: 45 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'renewal-risk': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="w-4 h-4" />;
      case 'good': return <CheckCircle className="w-4 h-4" />;
      case 'renewal-risk': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient-luxury">Tenant Business Reports</h1>
          <p className="text-muted-foreground mt-2">Comprehensive business intelligence and tenant performance analytics</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="executive">Executive Summary</SelectItem>
              <SelectItem value="financial">Financial Report</SelectItem>
              <SelectItem value="operational">Operational Metrics</SelectItem>
              <SelectItem value="regional">Regional Analysis</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">Last 3 months</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
              <SelectItem value="24m">Last 24 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Executive Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatedKpiCard
          label="Total Revenue"
          value={executiveSummaryData.totalRevenue}
          change={`+${executiveSummaryData.revenueGrowth}% YoY`}
          trend="up"
          icon={DollarSign}
          animationType="progress"
        />
        <AnimatedKpiCard
          label="Active Tenants"
          value={executiveSummaryData.totalTenants.toString()}
          change={`+${executiveSummaryData.tenantGrowth}% growth`}
          trend="up"
          icon={Building2}
          animationType="wave"
        />
        <AnimatedKpiCard
          label="Avg Engagement"
          value={`${executiveSummaryData.avgEngagement}%`}
          change={`+${executiveSummaryData.engagementGrowth}% from last period`}
          trend="up"
          icon={Activity}
          animationType="geometric"
        />
        <AnimatedKpiCard
          label="Churn Rate"
          value={`${executiveSummaryData.churnRate}%`}
          change={`${executiveSummaryData.churnChange}% improvement`}
          trend="down"
          icon={Target}
          animationType="pulse"
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="tenants">Tenants</TabsTrigger>
          <TabsTrigger value="retention">Retention</TabsTrigger>
          <TabsTrigger value="regional">Regional</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Monthly Revenue Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyRevenueData}>
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
                        strokeWidth={3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-secondary" />
                  Tier Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={tenantTierDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="hsl(var(--primary))"
                        dataKey="count"
                        label={({ tier, percent }) => `${tier} ${(percent * 100).toFixed(0)}%`}
                      >
                        {tenantTierDistribution.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={`hsl(var(--primary) / ${0.8 - (index * 0.15)})`} 
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

          {/* Top Performing Tenants */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Top Performing Tenants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformingTenants.map((tenant, index) => (
                  <div key={tenant.name} className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{tenant.name}</p>
                          <Badge variant="outline" className="text-xs">
                            {tenant.tier}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span>{tenant.users} users</span>
                          <span>{tenant.engagement}% engagement</span>
                          <span>★ {tenant.satisfaction}/5.0</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">${tenant.revenue.toLocaleString()}/mo</p>
                        <p className="text-xs text-muted-foreground">Expires: {tenant.contractExpiry}</p>
                      </div>
                      <Badge className={`${getStatusColor(tenant.status)} flex items-center gap-1`}>
                        {getStatusIcon(tenant.status)}
                        {tenant.status === 'renewal-risk' ? 'At Risk' : tenant.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {tenantTierDistribution.map((tier) => (
              <Card key={tier.tier} className="glass-card">
                <CardContent className="p-6">
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-semibold">{tier.tier}</h3>
                    <div className="text-2xl font-bold text-primary">
                      ${(tier.revenue / 1000).toFixed(0)}K
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {tier.count} tenants • Avg {tier.avgUsers} users
                    </div>
                    <Progress 
                      value={(tier.revenue / Math.max(...tenantTierDistribution.map(t => t.revenue))) * 100} 
                      className="mt-4"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Revenue Growth by Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyRevenueData}>
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
                    <Bar 
                      dataKey="revenue" 
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tenants" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Tenant Growth Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyRevenueData}>
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
                    <Line 
                      type="monotone" 
                      dataKey="tenants" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="avgContract" 
                      stroke="hsl(var(--secondary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--secondary))', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retention" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Retention & Churn Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={retentionData}>
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
                      dataKey="retention" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))" 
                      fillOpacity={0.2}
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regional" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {regionalPerformance.map((region) => (
              <Card key={region.region} className="glass-card">
                <CardContent className="p-4">
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <Globe className="w-4 h-4 text-primary" />
                      <h3 className="font-semibold text-sm">{region.region}</h3>
                    </div>
                    <div className="text-xl font-bold text-primary">{region.tenants}</div>
                    <div className="text-xs text-muted-foreground">Active Tenants</div>
                    <div className="text-lg font-semibold">${(region.revenue / 1000).toFixed(0)}K</div>
                    <div className={`text-xs font-medium ${region.growth > 20 ? 'text-green-600' : 'text-blue-600'}`}>
                      +{region.growth}% growth
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                Regional Revenue Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionalPerformance} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" axisLine={false} tickLine={false} />
                    <YAxis 
                      type="category" 
                      dataKey="region"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      width={100}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar 
                      dataKey="revenue" 
                      fill="hsl(var(--primary))"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}