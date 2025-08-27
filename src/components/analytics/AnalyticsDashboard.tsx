import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AnimatedKpiCard } from '@/components/ui/animated-kpi-card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
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
  Users, 
  BookOpen, 
  TrendingUp, 
  Clock,
  Award,
  Target,
  Activity,
  Building2,
  Calendar,
  PlayCircle,
  GraduationCap,
  Brain,
  Zap,
  Star
} from 'lucide-react';

const chartConfig = {
  users: {
    label: "Users",
    color: "hsl(var(--primary))",
  },
  active: {
    label: "Active",
    color: "hsl(var(--secondary))",
  },
  completions: {
    label: "Completions",
    color: "hsl(var(--accent))",
  },
  progress: {
    label: "Progress",
    color: "hsl(var(--muted))",
  },
};

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('7d');

  // Mock data for charts
  const userEngagementData = [
    { name: 'Mon', activeUsers: 245, newUsers: 12, completions: 18, watchTime: 420 },
    { name: 'Tue', activeUsers: 312, newUsers: 15, completions: 24, watchTime: 380 },
    { name: 'Wed', activeUsers: 287, newUsers: 8, completions: 31, watchTime: 450 },
    { name: 'Thu', activeUsers: 398, newUsers: 22, completions: 28, watchTime: 520 },
    { name: 'Fri', activeUsers: 456, newUsers: 18, completions: 35, watchTime: 490 },
    { name: 'Sat', activeUsers: 189, newUsers: 5, completions: 15, watchTime: 310 },
    { name: 'Sun', activeUsers: 234, newUsers: 9, completions: 22, watchTime: 360 }
  ];

  const skillCompletionData = [
    { name: 'AI & Machine Learning', completed: 142, inProgress: 68, total: 210, completionRate: 68 },
    { name: 'Data Science', completed: 98, inProgress: 32, total: 130, completionRate: 75 },
    { name: 'Software Engineering', completed: 156, inProgress: 84, total: 240, completionRate: 65 },
    { name: 'Product Management', completed: 64, inProgress: 28, total: 92, completionRate: 70 },
    { name: 'Financial Analysis', completed: 76, inProgress: 41, total: 117, completionRate: 65 },
    { name: 'DevOps Engineering', completed: 45, inProgress: 35, total: 80, completionRate: 56 }
  ];

  const tenantActivityData = [
    { name: 'TechCorp Inc.', value: 145, students: 89, completionRate: 78, growth: 12 },
    { name: 'EduLearn Academy', value: 289, students: 156, completionRate: 82, growth: 8 },
    { name: 'StartupHub', value: 67, students: 45, completionRate: 65, growth: 25 },
    { name: 'InnovateFlow', value: 112, students: 78, completionRate: 71, growth: 15 },
    { name: 'Digital Solutions', value: 98, students: 62, completionRate: 69, growth: 18 },
    { name: 'Others', value: 156, students: 89, completionRate: 74, growth: 10 }
  ];

  const learningProgressData = [
    { month: 'Jan', videoWatchTime: 2400, quizzes: 1800, aiInteractions: 1200 },
    { month: 'Feb', videoWatchTime: 1398, quizzes: 2100, aiInteractions: 1600 },
    { month: 'Mar', videoWatchTime: 3200, quizzes: 1900, aiInteractions: 1400 },
    { month: 'Apr', videoWatchTime: 2780, quizzes: 2400, aiInteractions: 1800 },
    { month: 'May', videoWatchTime: 1890, quizzes: 2200, aiInteractions: 1900 },
    { month: 'Jun', videoWatchTime: 2390, quizzes: 2600, aiInteractions: 2100 }
  ];

  const topSkillsData = [
    { skill: 'Machine Learning Fundamentals', enrollments: 312, avgCompletion: 78, avgRating: 4.8, timeToComplete: 6.2 },
    { skill: 'Python for Data Science', enrollments: 289, avgCompletion: 85, avgRating: 4.9, timeToComplete: 4.8 },
    { skill: 'Financial Modeling', enrollments: 245, avgCompletion: 72, avgRating: 4.6, timeToComplete: 8.1 },
    { skill: 'Product Strategy', enrollments: 198, avgCompletion: 81, avgRating: 4.7, timeToComplete: 5.5 },
    { skill: 'React Development', enrollments: 167, avgCompletion: 69, avgRating: 4.5, timeToComplete: 7.2 }
  ];

  const careerChoiceData = [
    { choice: 'Software Engineer', count: 245, growth: 15 },
    { choice: 'Data Scientist', count: 189, growth: 22 },
    { choice: 'Product Manager', count: 156, growth: 8 },
    { choice: 'DevOps Engineer', count: 134, growth: 18 },
    { choice: 'Financial Analyst', count: 123, growth: 12 },
    { choice: 'Other', count: 89, growth: 5 }
  ];

  const studentProgressData = [
    { batch: '2024', enrolled: 456, active: 423, completed: 89, dropout: 12 },
    { batch: '2023', enrolled: 389, active: 298, completed: 156, dropout: 23 },
    { batch: '2022', enrolled: 324, active: 145, completed: 234, dropout: 34 },
    { batch: '2021', enrolled: 278, active: 89, completed: 201, dropout: 45 }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient-luxury">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-2">Monitor platform performance and user engagement</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatedKpiCard
          label="Total Students"
          value="2,547"
          change="+12.5% from last week"
          trend="up"
          icon={Users}
          animationType="progress"
        />
        <AnimatedKpiCard
          label="Active Learners"
          value="1,832"
          change="+8.2% from last week"
          trend="up"
          icon={Activity}
          animationType="wave"
        />
        <AnimatedKpiCard
          label="Skill Completions"
          value="456"
          change="+15.3% from last week"
          trend="up"
          icon={Award}
          animationType="geometric"
        />
        <AnimatedKpiCard
          label="Avg. Engagement"
          value="42m"
          change="+5.7% from last week"
          trend="up"
          icon={Clock}
          animationType="pulse"
        />
      </div>

      <Tabs defaultValue="engagement" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="tenants">Tenants</TabsTrigger>
        </TabsList>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Daily Active Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={userEngagementData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="name" 
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
                        dataKey="activeUsers" 
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
                  <TrendingUp className="w-5 h-5 text-secondary" />
                  Growth Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={userEngagementData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="name" 
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
                        dataKey="newUsers" 
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
          </div>
        </TabsContent>

        <TabsContent value="learning" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                Learning Activity Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={learningProgressData}>
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
                      dataKey="videoWatchTime" 
                      stackId="1" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))" 
                      fillOpacity={0.6}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="quizzes" 
                      stackId="1" 
                      stroke="hsl(var(--secondary))" 
                      fill="hsl(var(--secondary))" 
                      fillOpacity={0.6}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="aiInteractions" 
                      stackId="1" 
                      stroke="hsl(var(--accent))" 
                      fill="hsl(var(--accent))" 
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Skill Completion Rates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={skillCompletionData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" axisLine={false} tickLine={false} />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        width={120}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar 
                        dataKey="completed" 
                        fill="hsl(var(--primary))" 
                        radius={[0, 4, 4, 0]}
                      />
                      <Bar 
                        dataKey="inProgress" 
                        fill="hsl(var(--secondary))" 
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-accent" />
                  Top Performing Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topSkillsData.map((skill, index) => (
                    <div key={skill.skill} className="group p-4 bg-background/50 rounded-lg border border-border/50 hover:border-primary/50 transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center text-sm font-bold text-primary">
                              #{index + 1}
                            </div>
                            {index === 0 && <Star className="w-4 h-4 text-yellow-500 absolute -top-1 -right-1" fill="currentColor" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{skill.skill}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span>{skill.enrollments} students</span>
                              <span>⭐ {skill.avgRating}</span>
                              <span>⏱️ {skill.timeToComplete}h avg</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                          {skill.avgCompletion}% completion
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  Career Choice Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={careerChoiceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="hsl(var(--primary))"
                        dataKey="count"
                        label={({ choice, percent }) => `${choice} ${(percent * 100).toFixed(0)}%`}
                      >
                        {careerChoiceData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={`hsl(var(--primary) / ${0.8 - (index * 0.1)})`} 
                          />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-secondary" />
                  Student Progress by Batch
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={studentProgressData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="batch" 
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
                      <Bar dataKey="enrolled" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="active" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="completed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tenants" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Tenant Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tenantActivityData.map((tenant, index) => (
                  <div key={tenant.name} className="group p-4 bg-background/50 rounded-lg border border-border/50 hover:border-primary/50 transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{tenant.name}</p>
                          <p className="text-sm text-muted-foreground">{tenant.students} active students</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{tenant.completionRate}% completion</p>
                          <p className="text-xs text-muted-foreground">
                            <span className={tenant.growth > 10 ? 'text-green-600' : 'text-yellow-600'}>
                              +{tenant.growth}% growth
                            </span>
                          </p>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className="bg-primary/10 text-primary border-primary/20"
                        >
                          {tenant.value} total users
                        </Badge>
                      </div>
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