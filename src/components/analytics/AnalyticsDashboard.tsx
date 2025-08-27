import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  PlayCircle
} from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('7d');

  // Mock data for charts
  const userEngagementData = [
    { name: 'Mon', activeUsers: 245, newUsers: 12, completions: 18 },
    { name: 'Tue', activeUsers: 312, newUsers: 15, completions: 24 },
    { name: 'Wed', activeUsers: 287, newUsers: 8, completions: 31 },
    { name: 'Thu', activeUsers: 398, newUsers: 22, completions: 28 },
    { name: 'Fri', activeUsers: 456, newUsers: 18, completions: 35 },
    { name: 'Sat', activeUsers: 189, newUsers: 5, completions: 15 },
    { name: 'Sun', activeUsers: 234, newUsers: 9, completions: 22 }
  ];

  const skillCompletionData = [
    { name: 'Quantum Computing', completed: 85, inProgress: 45, total: 130 },
    { name: 'Machine Learning', completed: 142, inProgress: 68, total: 210 },
    { name: 'Data Science', completed: 98, inProgress: 32, total: 130 },
    { name: 'Blockchain', completed: 64, inProgress: 28, total: 92 },
    { name: 'Cybersecurity', completed: 76, inProgress: 41, total: 117 }
  ];

  const tenantActivityData = [
    { name: 'TechCorp Inc.', value: 45, color: '#0088FE' },
    { name: 'EduLearn Academy', value: 128, color: '#00C49F' },
    { name: 'StartupHub', value: 23, color: '#FFBB28' },
    { name: 'InnovateFlow', value: 67, color: '#FF8042' },
    { name: 'Others', value: 89, color: '#8884D8' }
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
    { skill: 'Machine Learning Basics', enrollments: 245, avgCompletion: 78 },
    { skill: 'Python Programming', enrollments: 198, avgCompletion: 85 },
    { skill: 'Data Analysis', enrollments: 167, avgCompletion: 72 },
    { skill: 'Web Development', enrollments: 142, avgCompletion: 81 },
    { skill: 'Cloud Computing', enrollments: 134, avgCompletion: 69 }
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
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">2,547</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12.5% from last week
                </p>
              </div>
              <Users className="w-8 h-8 text-primary opacity-60" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Learners</p>
                <p className="text-2xl font-bold">1,832</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8.2% from last week
                </p>
              </div>
              <Activity className="w-8 h-8 text-green-500 opacity-60" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completions</p>
                <p className="text-2xl font-bold">456</p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <Award className="w-3 h-3 mr-1" />
                  +15.3% from last week
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-500 opacity-60" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Watch Time</p>
                <p className="text-2xl font-bold">42m</p>
                <p className="text-xs text-purple-600 flex items-center mt-1">
                  <Clock className="w-3 h-3 mr-1" />
                  +5.7% from last week
                </p>
              </div>
              <PlayCircle className="w-8 h-8 text-purple-500 opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="engagement" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="engagement">User Engagement</TabsTrigger>
          <TabsTrigger value="learning">Learning Progress</TabsTrigger>
          <TabsTrigger value="skills">Skills & Courses</TabsTrigger>
          <TabsTrigger value="tenants">Tenant Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Daily Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={userEngagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="activeUsers" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>New Users vs Completions</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userEngagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="newUsers" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="completions" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="learning" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Learning Activity Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={learningProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="videoWatchTime" 
                    stackId="1" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="quizzes" 
                    stackId="1" 
                    stroke="#82ca9d" 
                    fill="#82ca9d" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="aiInteractions" 
                    stackId="1" 
                    stroke="#ffc658" 
                    fill="#ffc658" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Skill Completion Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={skillCompletionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="completed" fill="#8884d8" />
                    <Bar dataKey="inProgress" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Top Performing Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topSkillsData.map((skill, index) => (
                    <div key={skill.skill} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{skill.skill}</p>
                          <p className="text-sm text-muted-foreground">{skill.enrollments} enrollments</p>
                        </div>
                      </div>
                      <Badge variant="secondary">{skill.avgCompletion}% completion</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tenants" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Tenant User Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={tenantActivityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {tenantActivityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Tenant Activity Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tenantActivityData.map((tenant, index) => (
                    <div key={tenant.name} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: tenant.color }}
                        />
                        <div>
                          <p className="font-medium">{tenant.name}</p>
                          <p className="text-sm text-muted-foreground">{tenant.value} active users</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <Badge variant="outline">Active</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}