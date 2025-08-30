import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TubelightNavbar } from '@/components/ui/tubelight-navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AnimatedKpiCard } from '@/components/ui/animated-kpi-card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  BookOpen,
  Brain,
  Trophy,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Eye
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
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('performance');
  const [showStudentDialog, setShowStudentDialog] = useState(false);

  // Mock data for student analytics
  const learningProgressData = [
    { month: 'Jan', completions: 124, enrollments: 245, watchTime: 1850 },
    { month: 'Feb', completions: 156, enrollments: 312, watchTime: 2340 },
    { month: 'Mar', completions: 189, enrollments: 378, watchTime: 2890 },
    { month: 'Apr', completions: 221, enrollments: 442, watchTime: 3210 },
    { month: 'May', completions: 258, enrollments: 516, watchTime: 3850 },
    { month: 'Jun', completions: 284, enrollments: 568, watchTime: 4240 }
  ];

  const studentPerformanceData = [
    { 
      name: 'Sarah Johnson', 
      email: 'sarah.j@email.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      coursesEnrolled: 8, 
      coursesCompleted: 6, 
      completionRate: 75, 
      engagement: 92, 
      totalWatchTime: 245,
      streakDays: 15,
      health: 'excellent',
      level: 'Advanced',
      placementReadiness: 85,
      skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB'],
      strengths: ['Problem Solving', 'Team Leadership', 'Communication'],
      jobPreference: 'Full-stack Developer',
      salaryExpectation: '$85,000',
      availableFrom: '2024-03-15',
      portfolioProjects: 4,
      githubContributions: 127,
      certifications: ['AWS Cloud Practitioner', 'React Developer']
    },
    { 
      name: 'Michael Chen', 
      email: 'michael.c@email.com',
      phone: '+1 (555) 987-6543',
      location: 'San Francisco, CA',
      coursesEnrolled: 12, 
      coursesCompleted: 10, 
      completionRate: 83, 
      engagement: 88, 
      totalWatchTime: 356,
      streakDays: 22,
      health: 'excellent',
      level: 'Expert',
      placementReadiness: 95,
      skills: ['Python', 'Machine Learning', 'TensorFlow', 'Docker', 'Kubernetes'],
      strengths: ['Technical Excellence', 'Innovation', 'Mentoring'],
      jobPreference: 'ML Engineer',
      salaryExpectation: '$120,000',
      availableFrom: '2024-02-01',
      portfolioProjects: 6,
      githubContributions: 203,
      certifications: ['Google ML Engineer', 'Docker Certified']
    },
    { 
      name: 'Emily Rodriguez', 
      email: 'emily.r@email.com',
      phone: '+1 (555) 456-7890',
      location: 'Austin, TX',
      coursesEnrolled: 6, 
      coursesCompleted: 4, 
      completionRate: 67, 
      engagement: 78, 
      totalWatchTime: 189,
      streakDays: 8,
      health: 'good',
      level: 'Intermediate',
      placementReadiness: 72,
      skills: ['JavaScript', 'Vue.js', 'CSS', 'Figma', 'Git'],
      strengths: ['UI/UX Design', 'Creativity', 'Attention to Detail'],
      jobPreference: 'Frontend Developer',
      salaryExpectation: '$70,000',
      availableFrom: '2024-04-01',
      portfolioProjects: 3,
      githubContributions: 89,
      certifications: ['Google UX Design']
    },
    { 
      name: 'David Kim', 
      email: 'david.k@email.com',
      phone: '+1 (555) 321-0987',
      location: 'Seattle, WA',
      coursesEnrolled: 9, 
      coursesCompleted: 7, 
      completionRate: 78, 
      engagement: 85, 
      totalWatchTime: 278,
      streakDays: 12,
      health: 'excellent',
      level: 'Advanced',
      placementReadiness: 88,
      skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Redis', 'Microservices'],
      strengths: ['System Design', 'Database Optimization', 'Code Quality'],
      jobPreference: 'Backend Developer',
      salaryExpectation: '$95,000',
      availableFrom: '2024-03-01',
      portfolioProjects: 5,
      githubContributions: 156,
      certifications: ['Oracle Java Certified', 'Spring Professional']
    },
    { 
      name: 'Lisa Thompson', 
      email: 'lisa.t@email.com',
      phone: '+1 (555) 654-3210',
      location: 'Chicago, IL',
      coursesEnrolled: 5, 
      coursesCompleted: 2, 
      completionRate: 40, 
      engagement: 62, 
      totalWatchTime: 124,
      streakDays: 3,
      health: 'warning',
      level: 'Beginner',
      placementReadiness: 45,
      skills: ['HTML', 'CSS', 'JavaScript', 'Bootstrap'],
      strengths: ['Quick Learner', 'Persistence', 'Analytical Thinking'],
      jobPreference: 'Junior Developer',
      salaryExpectation: '$50,000',
      availableFrom: '2024-06-01',
      portfolioProjects: 1,
      githubContributions: 23,
      certifications: ['freeCodeCamp Responsive Web Design']
    },
    { 
      name: 'James Wilson', 
      email: 'james.w@email.com',
      phone: '+1 (555) 789-0123',
      location: 'Miami, FL',
      coursesEnrolled: 7, 
      coursesCompleted: 1, 
      completionRate: 14, 
      engagement: 35, 
      totalWatchTime: 67,
      streakDays: 0,
      health: 'critical',
      level: 'Beginner',
      placementReadiness: 25,
      skills: ['HTML', 'CSS'],
      strengths: ['Problem Solving', 'Patience'],
      jobPreference: 'Entry-level Developer',
      salaryExpectation: '$45,000',
      availableFrom: '2024-08-01',
      portfolioProjects: 0,
      githubContributions: 5,
      certifications: []
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

  const handleStudentClick = (student: any) => {
    setSelectedStudent(student);
    setShowStudentDialog(true);
  };

  const getPlacementReadinessColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient-luxury">Student Analytics</h1>
          <p className="text-muted-foreground mt-2">Monitor student performance, learning progress, and engagement metrics</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedTenant} onValueChange={setSelectedTenant}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select student" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Students</SelectItem>
              {studentPerformanceData.map((student) => (
                <SelectItem key={student.name} value={student.name}>
                  {student.name}
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
          label="Total Students"
          value="1,247"
          change="+12.3% from last month"
          trend="up"
          icon={Users}
          animationType="progress"
        />
        <AnimatedKpiCard
          label="Course Completions"
          value="892"
          change="+18% from last month"
          trend="up"
          icon={Award}
          animationType="wave"
        />
        <AnimatedKpiCard
          label="Avg Engagement"
          value="78%"
          change="+4.2% from last month"
          trend="up"
          icon={Activity}
          animationType="geometric"
        />
        <AnimatedKpiCard
          label="Active Learners"
          value="1,089"
          change="+8.5% from last month"
          trend="up"
          icon={TrendingUp}
          animationType="pulse"
        />
      </div>

      {/* Navigation */}
      <TubelightNavbar 
        items={[
          {
            name: "Students",
            icon: Users,
            onClick: () => setActiveTab('performance')
          },
          {
            name: "Learning Progress",
            icon: Award,
            onClick: () => setActiveTab('revenue')
          },
          {
            name: "Engagement",
            icon: Activity,
            onClick: () => setActiveTab('engagement')
          },
          {
            name: "Performance Score",
            icon: Star,
            onClick: () => setActiveTab('health')
          }
        ]}
        activeItem={activeTab}
        className="relative top-0 mb-8"
      />

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Students</TabsTrigger>
          <TabsTrigger value="revenue">Learning Progress</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="health">Performance Score</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Student Performance Overview
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentPerformanceData.map((student, index) => (
                  <div 
                    key={student.name} 
                    className="group p-4 bg-background/50 rounded-lg border border-border/50 hover:border-primary/50 transition-all duration-200 cursor-pointer hover:shadow-md"
                    onClick={() => handleStudentClick(student)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                          <Users className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {student.name}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {student.level}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span>{student.email}</span>
                            <span>{student.coursesCompleted}/{student.coursesEnrolled} courses</span>
                            <span>{student.streakDays} day streak</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{student.totalWatchTime}h watched</p>
                          <p className="text-xs text-muted-foreground">{student.completionRate}% completion</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getHealthColor(student.health)} flex items-center gap-1`}>
                            {getHealthIcon(student.health)}
                            {student.health}
                          </Badge>
                          <Eye className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
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
                  <Award className="w-5 h-5 text-primary" />
                  Learning Progress Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
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
                        dataKey="completions" 
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
                  Student Levels Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { level: 'Beginner', count: 2 },
                          { level: 'Intermediate', count: 1 },
                          { level: 'Advanced', count: 2 },
                          { level: 'Expert', count: 1 }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="hsl(var(--primary))"
                        dataKey="count"
                        label={({ level, percent }) => `${level} ${(percent * 100).toFixed(0)}%`}
                      >
                        {[{ level: 'Beginner', count: 2 },
                          { level: 'Intermediate', count: 1 },
                          { level: 'Advanced', count: 2 },
                          { level: 'Expert', count: 1 }].map((entry, index) => (
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
                <div className="text-2xl font-bold text-green-600">3</div>
                <div className="text-sm text-muted-foreground">Excellent Performance</div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">2</div>
                <div className="text-sm text-muted-foreground">Good Performance</div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">1</div>
                <div className="text-sm text-muted-foreground">Needs Attention</div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">1</div>
                <div className="text-sm text-muted-foreground">At Risk</div>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Student Performance Scores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentPerformanceData
                  .sort((a, b) => {
                    const healthOrder = { excellent: 4, good: 3, warning: 2, critical: 1 };
                    return healthOrder[b.health as keyof typeof healthOrder] - healthOrder[a.health as keyof typeof healthOrder];
                  })
                  .map((student) => (
                    <div key={student.name} className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/50">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getHealthColor(student.health)}`}>
                          {getHealthIcon(student.health)}
                        </div>
                        <div>
                          <p className="font-semibold">{student.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {student.engagement}% engagement • {student.completionRate}% completion
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{student.coursesCompleted}/{student.coursesEnrolled} courses</p>
                          <p className="text-xs text-muted-foreground">
                            {student.streakDays} day streak
                          </p>
                        </div>
                        <Badge className={getHealthColor(student.health)}>
                          {student.health}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Student Detail Dialog */}
      <Dialog open={showStudentDialog} onOpenChange={setShowStudentDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedStudent && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold">{selectedStudent.name}</span>
                      <Badge variant="outline">{selectedStudent.level}</Badge>
                      <Badge className={`${getHealthColor(selectedStudent.health)} flex items-center gap-1`}>
                        {getHealthIcon(selectedStudent.health)}
                        {selectedStudent.health}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Placement Analytics & Driver Reports</p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Contact & Basic Info */}
                <Card className="glass-card">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{selectedStudent.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{selectedStudent.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{selectedStudent.location}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Available from {selectedStudent.availableFrom}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Key Placement Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="glass-card">
                    <CardContent className="p-4 text-center">
                      <div className={`text-2xl font-bold ${getPlacementReadinessColor(selectedStudent.placementReadiness)}`}>
                        {selectedStudent.placementReadiness}%
                      </div>
                      <div className="text-sm text-muted-foreground">Placement Ready</div>
                      <Progress value={selectedStudent.placementReadiness} className="mt-2" />
                    </CardContent>
                  </Card>
                  <Card className="glass-card">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-primary">{selectedStudent.portfolioProjects}</div>
                      <div className="text-sm text-muted-foreground">Portfolio Projects</div>
                    </CardContent>
                  </Card>
                  <Card className="glass-card">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-secondary">{selectedStudent.githubContributions}</div>
                      <div className="text-sm text-muted-foreground">GitHub Contributions</div>
                    </CardContent>
                  </Card>
                  <Card className="glass-card">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-accent">{selectedStudent.certifications.length}</div>
                      <div className="text-sm text-muted-foreground">Certifications</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Skills & Career Preferences */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Brain className="w-5 h-5 text-primary" />
                        Technical Skills
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedStudent.skills.map((skill: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Trophy className="w-5 h-5 text-primary" />
                        Core Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedStudent.strengths.map((strength: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {strength}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Career Preferences & Learning Progress */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Briefcase className="w-5 h-5 text-primary" />
                        Career Preferences
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm font-medium">Preferred Role</p>
                        <p className="text-sm text-muted-foreground">{selectedStudent.jobPreference}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Salary Expectation</p>
                        <p className="text-sm text-muted-foreground">{selectedStudent.salaryExpectation}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Available From</p>
                        <p className="text-sm text-muted-foreground">{selectedStudent.availableFrom}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BookOpen className="w-5 h-5 text-primary" />
                        Learning Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Course Completion</span>
                          <span className="text-sm text-muted-foreground">{selectedStudent.completionRate}%</span>
                        </div>
                        <Progress value={selectedStudent.completionRate} />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Engagement Score</span>
                          <span className="text-sm text-muted-foreground">{selectedStudent.engagement}%</span>
                        </div>
                        <Progress value={selectedStudent.engagement} />
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium">{selectedStudent.totalWatchTime}h</p>
                          <p className="text-muted-foreground">Watch Time</p>
                        </div>
                        <div>
                          <p className="font-medium">{selectedStudent.streakDays} days</p>
                          <p className="text-muted-foreground">Current Streak</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Certifications */}
                {selectedStudent.certifications.length > 0 && (
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <GraduationCap className="w-5 h-5 text-primary" />
                        Certifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedStudent.certifications.map((cert: string, index: number) => (
                          <Badge key={index} className="text-xs bg-green-100 text-green-800 border-green-200">
                            <Award className="w-3 h-3 mr-1" />
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Placement Readiness Summary */}
                <Card className="glass-card border-primary/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Target className="w-5 h-5 text-primary" />
                      Placement Readiness Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Overall Readiness Score</span>
                        <div className="flex items-center gap-2">
                          <Progress value={selectedStudent.placementReadiness} className="w-32" />
                          <span className={`font-bold ${getPlacementReadinessColor(selectedStudent.placementReadiness)}`}>
                            {selectedStudent.placementReadiness}%
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="text-center p-3 bg-background/50 rounded-lg">
                          <p className="font-medium">Technical Skills</p>
                          <p className="text-muted-foreground">{selectedStudent.skills.length} technologies</p>
                        </div>
                        <div className="text-center p-3 bg-background/50 rounded-lg">
                          <p className="font-medium">Project Portfolio</p>
                          <p className="text-muted-foreground">{selectedStudent.portfolioProjects} projects</p>
                        </div>
                        <div className="text-center p-3 bg-background/50 rounded-lg">
                          <p className="font-medium">Learning Velocity</p>
                          <p className="text-muted-foreground">{selectedStudent.engagement}% engagement</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}