import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownNavigation } from '@/components/ui/dropdown-navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AnimatedKpiCard } from '@/components/ui/animated-kpi-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
  Star,
  Search,
  Eye,
  Filter,
  Download,
  User,
  LogIn,
  LogOut,
  MousePointer,
  Video,
  FileText,
  MessageSquare,
  Shield
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user } = useAuth();
  const isPlatformOwner = user?.role === 'platform_owner';
  
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedTenant, setSelectedTenant] = useState<string>(
    isPlatformOwner ? '' : user?.tenantId || 'tenant-1'
  );
  const [tenantSearchTerm, setTenantSearchTerm] = useState('');
  const [isStudentActivityOpen, setIsStudentActivityOpen] = useState(false);
  const [activitySearchTerm, setActivitySearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('engagement');
  const [activityFilter, setActivityFilter] = useState('all');

  // Mock tenants data for platform owner
  const [tenants] = useState([
    { id: 'tenant-1', name: 'University of Technology', domain: 'tech.edu', studentCount: 5 },
    { id: 'tenant-2', name: 'Business School International', domain: 'bschool.edu', studentCount: 8 },
    { id: 'tenant-3', name: 'Medical University', domain: 'meduni.edu', studentCount: 12 },
  ]);

  // Mock student activity data
  const [studentActivityData] = useState([
    {
      id: '1',
      studentName: 'Alice Johnson',
      email: 'alice.johnson@university.edu',
      activity: 'Completed Quiz',
      skillName: 'Machine Learning Basics',
      score: 85,
      timestamp: new Date('2024-08-28T10:30:00'),
      duration: '15m',
      tenantId: 'tenant-1',
      type: 'quiz'
    },
    {
      id: '2',
      studentName: 'Bob Smith',
      email: 'bob.smith@university.edu',
      activity: 'Watched Video',
      skillName: 'Data Analysis',
      score: null,
      timestamp: new Date('2024-08-28T09:45:00'),
      duration: '25m',
      tenantId: 'tenant-1',
      type: 'video'
    },
    {
      id: '3',
      studentName: 'Carol Williams',
      email: 'carol.williams@university.edu',
      activity: 'AI Tutor Interaction',
      skillName: 'Leadership Skills',
      score: null,
      timestamp: new Date('2024-08-28T14:20:00'),
      duration: '8m',
      tenantId: 'tenant-2',
      type: 'ai_interaction'
    },
    {
      id: '4',
      studentName: 'David Brown',
      email: 'david.brown@university.edu',
      activity: 'Started Course',
      skillName: 'Python Programming',
      score: null,
      timestamp: new Date('2024-08-28T11:15:00'),
      duration: '2m',
      tenantId: 'tenant-2',
      type: 'enrollment'
    },
    {
      id: '5',
      studentName: 'Emma Davis',
      email: 'emma.davis@university.edu',
      activity: 'Completed Skill',
      skillName: 'Financial Analytics',
      score: 92,
      timestamp: new Date('2024-08-28T16:30:00'),
      duration: '45m',
      tenantId: 'tenant-3',
      type: 'completion'
    },
    {
      id: '6',
      studentName: 'Alice Johnson',
      email: 'alice.johnson@university.edu',
      activity: 'Login',
      skillName: null,
      score: null,
      timestamp: new Date('2024-08-28T08:00:00'),
      duration: null,
      tenantId: 'tenant-1',
      type: 'login'
    }
  ]);

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

  const selectedTenantData = tenants.find(t => t.id === selectedTenant);
  const filteredTenants = tenants.filter(tenant => 
    tenant.name.toLowerCase().includes(tenantSearchTerm.toLowerCase())
  );

  // Filter student activity by tenant and search
  const tenantFilteredActivity = isPlatformOwner 
    ? studentActivityData.filter(activity => selectedTenant ? activity.tenantId === selectedTenant : false)
    : studentActivityData.filter(activity => activity.tenantId === user?.tenantId);

  const filteredStudentActivity = tenantFilteredActivity.filter(activity => {
    const matchesSearch = activity.studentName.toLowerCase().includes(activitySearchTerm.toLowerCase()) ||
                         activity.email.toLowerCase().includes(activitySearchTerm.toLowerCase()) ||
                         activity.skillName?.toLowerCase().includes(activitySearchTerm.toLowerCase());
    const matchesFilter = activityFilter === 'all' || activity.type === activityFilter;
    return matchesSearch && matchesFilter;
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login': return <LogIn className="w-4 h-4 text-green-600" />;
      case 'logout': return <LogOut className="w-4 h-4 text-gray-600" />;
      case 'video': return <Video className="w-4 h-4 text-blue-600" />;
      case 'quiz': return <FileText className="w-4 h-4 text-purple-600" />;
      case 'ai_interaction': return <MessageSquare className="w-4 h-4 text-orange-600" />;
      case 'enrollment': return <BookOpen className="w-4 h-4 text-indigo-600" />;
      case 'completion': return <Award className="w-4 h-4 text-gold-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'login': return 'bg-green-100 text-green-800 border-green-200';
      case 'logout': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'video': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'quiz': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'ai_interaction': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'enrollment': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'completion': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient-luxury">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-2">Monitor platform performance and user engagement</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Student Activity Button */}
          <Dialog open={isStudentActivityOpen} onOpenChange={setIsStudentActivityOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-accent-luxury shadow-medium">
                <Eye className="w-4 h-4 mr-2" />
                View Student Activity
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Student Activity Log
                  {selectedTenantData && isPlatformOwner && (
                    <span className="text-base font-normal text-muted-foreground ml-2">
                      — {selectedTenantData.name}
                    </span>
                  )}
                </DialogTitle>
              </DialogHeader>
              
              {/* Tenant Selection for Platform Owner */}
              {isPlatformOwner && (
                <Card className="glass-card mb-4">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-primary" />
                        <span className="font-medium">Select Tenant:</span>
                      </div>
                      <div className="flex-1 max-w-sm">
                        <Select value={selectedTenant} onValueChange={setSelectedTenant}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a tenant" />
                          </SelectTrigger>
                          <SelectContent>
                            <div className="p-2">
                              <Input
                                placeholder="Search tenants..."
                                value={tenantSearchTerm}
                                onChange={(e) => setTenantSearchTerm(e.target.value)}
                                className="mb-2"
                              />
                            </div>
                            {filteredTenants.map(tenant => (
                              <SelectItem key={tenant.id} value={tenant.id}>
                                <div className="flex items-center justify-between w-full">
                                  <span>{tenant.name}</span>
                                  <Badge variant="secondary" className="ml-2">
                                    {tenant.studentCount} students
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Shield className="w-4 h-4" />
                        <span>Read-only access</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Empty state for platform owner without tenant selection */}
              {isPlatformOwner && !selectedTenant && (
                <div className="p-12 text-center">
                  <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Select a Tenant</h3>
                  <p className="text-muted-foreground">
                    Choose a tenant from the dropdown above to view their student activity data.
                  </p>
                </div>
              )}

              {/* Activity Content */}
              {(!isPlatformOwner || selectedTenant) && (
                <>
                  {/* Filters */}
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          placeholder="Search activities..."
                          value={activitySearchTerm}
                          onChange={(e) => setActivitySearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={activityFilter} onValueChange={setActivityFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Activity Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Activities</SelectItem>
                        <SelectItem value="login">Login</SelectItem>
                        <SelectItem value="video">Video Watching</SelectItem>
                        <SelectItem value="quiz">Quiz Completion</SelectItem>
                        <SelectItem value="ai_interaction">AI Interactions</SelectItem>
                        <SelectItem value="enrollment">Enrollments</SelectItem>
                        <SelectItem value="completion">Completions</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>

                  {/* Activity Table */}
                  <div className="overflow-auto max-h-[60vh]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Activity</TableHead>
                          <TableHead>Skill/Course</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Timestamp</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStudentActivity.map((activity) => (
                          <TableRow key={activity.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{activity.studentName}</p>
                                <p className="text-sm text-muted-foreground">{activity.email}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getActivityIcon(activity.type)}
                                <Badge variant="secondary" className={getActivityColor(activity.type)}>
                                  {activity.activity}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              {activity.skillName || '-'}
                            </TableCell>
                            <TableCell>
                              {activity.score ? (
                                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                                  {activity.score}%
                                </Badge>
                              ) : '-'}
                            </TableCell>
                            <TableCell>
                              {activity.duration || '-'}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <p>{activity.timestamp.toLocaleDateString()}</p>
                                <p className="text-muted-foreground">{activity.timestamp.toLocaleTimeString()}</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {filteredStudentActivity.length === 0 && (
                      <div className="text-center py-8">
                        <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No student activity found</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
          
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
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="tenants">Tenants</TabsTrigger>
          <TabsTrigger value="activity">Activity Feed</TabsTrigger>
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
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant="secondary" 
                            className="bg-primary/10 text-primary border-primary/20"
                          >
                            {tenant.value} total users
                          </Badge>
                          {isPlatformOwner && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => window.location.href = `/students?tenant=${encodeURIComponent(tenant.name)}`}
                              className="bg-gradient-to-r from-primary/10 to-accent-luxury/10 hover:from-primary/20 hover:to-accent-luxury/20"
                            >
                              <Users className="w-4 h-4 mr-2" />
                              View Students
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Recent Student Activity
                {selectedTenantData && isPlatformOwner && (
                  <span className="text-base font-normal text-muted-foreground ml-2">
                    — {selectedTenantData.name}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Tenant Selection for Platform Owner */}
              {isPlatformOwner && (
                <div className="mb-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-primary" />
                      <span className="font-medium">Select Tenant:</span>
                    </div>
                    <div className="flex-1 max-w-sm">
                      <Select value={selectedTenant} onValueChange={setSelectedTenant}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a tenant" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredTenants.map(tenant => (
                            <SelectItem key={tenant.id} value={tenant.id}>
                              {tenant.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Activity Feed */}
              {(!isPlatformOwner || selectedTenant) ? (
                <div className="space-y-4">
                  {tenantFilteredActivity.slice(0, 10).map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-4 bg-background/50 rounded-lg border border-border/50">
                      <div className="flex-shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{activity.studentName}</span>
                          <Badge variant="secondary" className={getActivityColor(activity.type)}>
                            {activity.activity}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {activity.skillName && <span>{activity.skillName} • </span>}
                          {activity.score && <span>Score: {activity.score}% • </span>}
                          {activity.duration && <span>Duration: {activity.duration} • </span>}
                          <span>{activity.timestamp.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="text-center mt-6">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsStudentActivityOpen(true)}
                      className="bg-gradient-to-r from-primary/10 to-accent-luxury/10 hover:from-primary/20 hover:to-accent-luxury/20"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View All Student Activity
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Select a Tenant</h3>
                  <p className="text-muted-foreground">
                    Choose a tenant to view their student activity feed.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}