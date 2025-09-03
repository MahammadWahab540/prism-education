import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TubelightNavbar } from '@/components/ui/tubelight-navbar';
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
  Shield,
  BookOpen,
  Play,
  Pause,
  Eye,
  Brain,
  Trophy,
  MousePointer,
  MessageSquare,
  Search
} from 'lucide-react';
import { useProfilePanel } from '@/contexts/ProfilePanelContext';

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
  const { openPanel } = useProfilePanel();
  const [timeRange, setTimeRange] = useState('12m');
  const [reportType, setReportType] = useState('student-overview');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStudent, setSelectedStudent] = useState('all');

  // Comprehensive Student Portal Events Tracking
  const studentPortalEvents = {
    // Learning & Content Events
    learningEvents: [
      'course_enrollment', 'course_start', 'course_completion', 'course_drop',
      'lesson_start', 'lesson_completion', 'lesson_pause', 'lesson_resume',
      'chapter_start', 'chapter_completion', 'module_unlock',
      'video_play', 'video_pause', 'video_seek', 'video_speed_change', 'video_completion',
      'document_open', 'document_download', 'resource_access',
      'quiz_start', 'quiz_submission', 'quiz_completion', 'quiz_retake',
      'assignment_start', 'assignment_submission', 'assignment_completion',
      'project_creation', 'project_submission', 'project_completion',
      'skill_assessment_start', 'skill_assessment_completion',
      'certification_earned', 'certificate_download', 'badge_earned',
      'milestone_reached', 'progress_checkpoint', 'streak_achievement'
    ],
    
    // Engagement & Interaction Events  
    engagementEvents: [
      'login', 'logout', 'session_start', 'session_end', 'session_timeout',
      'page_view', 'time_on_page', 'scroll_depth', 'click_tracking',
      'search_query', 'search_result_click', 'filter_usage',
      'navigation_click', 'menu_usage', 'bookmark_add', 'bookmark_remove',
      'note_creation', 'note_edit', 'note_delete', 'highlight_text',
      'content_rating', 'content_review', 'feedback_submission',
      'feature_usage', 'tool_interaction', 'shortcut_usage'
    ],

    // Social & Community Events
    socialEvents: [
      'forum_post_create', 'forum_post_reply', 'forum_post_like', 'forum_post_share',
      'discussion_join', 'discussion_create', 'discussion_moderate',
      'peer_connection', 'mentor_request', 'mentorship_session',
      'group_join', 'group_create', 'group_activity', 'group_leave',
      'peer_review_give', 'peer_review_receive', 'collaboration_invite',
      'message_send', 'message_receive', 'announcement_read',
      'event_registration', 'webinar_attendance', 'workshop_participation'
    ],

    // Assessment & Performance Events
    assessmentEvents: [
      'test_start', 'test_submission', 'test_completion', 'test_timeout',
      'question_answer', 'question_skip', 'question_flag', 'question_review',
      'score_achievement', 'grade_received', 'performance_milestone',
      'skill_demonstration', 'competency_validation', 'portfolio_update',
      'self_assessment', 'peer_assessment', 'instructor_feedback',
      'remediation_required', 'advanced_track_unlock', 'placement_test'
    ],

    // Support & Help Events
    supportEvents: [
      'help_request', 'support_ticket_create', 'support_ticket_update',
      'faq_access', 'tutorial_access', 'guide_download',
      'chat_support_start', 'chat_support_end', 'call_support_request',
      'bug_report', 'feature_request', 'technical_issue_report',
      'accessibility_feature_use', 'language_change', 'preference_update'
    ],

    // Profile & Administrative Events
    profileEvents: [
      'profile_create', 'profile_update', 'profile_complete',
      'avatar_upload', 'bio_update', 'contact_info_update',
      'privacy_setting_change', 'notification_preference_update',
      'learning_path_selection', 'goal_setting', 'goal_update',
      'calendar_sync', 'reminder_set', 'deadline_extension_request',
      'subscription_change', 'payment_update', 'billing_info_update'
    ],

    // Technical & System Events
    technicalEvents: [
      'device_info_capture', 'browser_info_capture', 'screen_resolution_capture',
      'connection_speed_test', 'load_time_measurement', 'error_occurrence',
      'crash_report', 'performance_metric', 'bandwidth_usage',
      'offline_mode_usage', 'sync_completion', 'cache_update',
      'api_call_tracking', 'database_query_log', 'security_event'
    ]
  };
  // Student-focused report data with comprehensive event tracking
  const studentOverviewData = {
    totalStudents: 1247,
    studentGrowth: 12.3,
    activeStudents: 1089,
    activeGrowth: 8.5,
    avgCompletionRate: 73.2,
    completionGrowth: 4.2,
    avgEngagement: 78.5,
    engagementGrowth: 5.3
  };

  const studentProgressData = [
    { month: 'Jan', enrollments: 124, completions: 89, dropouts: 12, active: 945 },
    { month: 'Feb', enrollments: 156, completions: 102, dropouts: 8, active: 1023 },
    { month: 'Mar', enrollments: 189, completions: 118, dropouts: 15, active: 1089 },
    { month: 'Apr', enrollments: 221, completions: 134, dropouts: 11, active: 1156 },
    { month: 'May', enrollments: 258, completions: 178, dropouts: 9, active: 1247 },
    { month: 'Jun', enrollments: 284, completions: 198, dropouts: 13, active: 1298 }
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

  // Student-level report data based on portal events
  const studentReportData = [
    {
      id: 'STU001',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      tenant: 'TechCorp Global',
      enrollmentDate: '2024-01-15',
      lastActivity: '2024-01-27 14:32',
      totalSessions: 47,
      watchTime: 245,
      coursesStarted: 8,
      coursesCompleted: 6,
      completionRate: 75,
      avgSessionDuration: 52,
      streakDays: 15,
      quizzesTaken: 24,
      quizAvgScore: 87,
      forumPosts: 12,
      helpRequests: 3,
      events: {
        logins: 67,
        videoViews: 156,
        chapterCompletions: 34,
        certificateDownloads: 4,
        profileUpdates: 2,
        searchQueries: 89
      },
      performance: 'excellent',
      engagement: 'high'
    },
    {
      id: 'STU002',
      name: 'Michael Chen',
      email: 'michael.c@email.com',
      tenant: 'EduLearn Solutions',
      enrollmentDate: '2023-11-20',
      lastActivity: '2024-01-27 16:45',
      totalSessions: 78,
      watchTime: 356,
      coursesStarted: 12,
      coursesCompleted: 10,
      completionRate: 83,
      avgSessionDuration: 48,
      streakDays: 22,
      quizzesTaken: 42,
      quizAvgScore: 92,
      forumPosts: 28,
      helpRequests: 1,
      events: {
        logins: 112,
        videoViews: 234,
        chapterCompletions: 58,
        certificateDownloads: 7,
        profileUpdates: 4,
        searchQueries: 145
      },
      performance: 'excellent',
      engagement: 'high'
    },
    {
      id: 'STU003',
      name: 'Emily Rodriguez',
      email: 'emily.r@email.com',
      tenant: 'Innovation Hub',
      enrollmentDate: '2024-02-01',
      lastActivity: '2024-01-26 11:20',
      totalSessions: 32,
      watchTime: 189,
      coursesStarted: 6,
      coursesCompleted: 4,
      completionRate: 67,
      avgSessionDuration: 35,
      streakDays: 8,
      quizzesTaken: 18,
      quizAvgScore: 78,
      forumPosts: 6,
      helpRequests: 5,
      events: {
        logins: 45,
        videoViews: 98,
        chapterCompletions: 22,
        certificateDownloads: 2,
        profileUpdates: 1,
        searchQueries: 67
      },
      performance: 'good',
      engagement: 'medium'
    },
    {
      id: 'STU004',
      name: 'David Kim',
      email: 'david.k@email.com',
      tenant: 'StartupAccelerator',
      enrollmentDate: '2023-12-10',
      lastActivity: '2024-01-27 09:15',
      totalSessions: 56,
      watchTime: 278,
      coursesStarted: 9,
      coursesCompleted: 7,
      completionRate: 78,
      avgSessionDuration: 42,
      streakDays: 12,
      quizzesTaken: 31,
      quizAvgScore: 85,
      forumPosts: 15,
      helpRequests: 2,
      events: {
        logins: 78,
        videoViews: 167,
        chapterCompletions: 41,
        certificateDownloads: 5,
        profileUpdates: 3,
        searchQueries: 98
      },
      performance: 'good',
      engagement: 'high'
    },
    {
      id: 'STU005',
      name: 'Lisa Thompson',
      email: 'lisa.t@email.com',
      tenant: 'Innovation Hub',
      enrollmentDate: '2024-01-20',
      lastActivity: '2024-01-25 13:45',
      totalSessions: 18,
      watchTime: 124,
      coursesStarted: 5,
      coursesCompleted: 2,
      completionRate: 40,
      avgSessionDuration: 28,
      streakDays: 3,
      quizzesTaken: 12,
      quizAvgScore: 65,
      forumPosts: 2,
      helpRequests: 8,
      events: {
        logins: 23,
        videoViews: 45,
        chapterCompletions: 8,
        certificateDownloads: 1,
        profileUpdates: 1,
        searchQueries: 34
      },
      performance: 'needs-attention',
      engagement: 'low'
    },
    {
      id: 'STU006',
      name: 'James Wilson',
      email: 'james.w@email.com',
      tenant: 'TechCorp Global',
      enrollmentDate: '2024-01-05',
      lastActivity: '2024-01-22 10:30',
      totalSessions: 12,
      watchTime: 67,
      coursesStarted: 7,
      coursesCompleted: 1,
      completionRate: 14,
      avgSessionDuration: 18,
      streakDays: 0,
      quizzesTaken: 5,
      quizAvgScore: 52,
      forumPosts: 0,
      helpRequests: 12,
      events: {
        logins: 15,
        videoViews: 28,
        chapterCompletions: 3,
        certificateDownloads: 0,
        profileUpdates: 0,
        searchQueries: 19
      },
      performance: 'at-risk',
      engagement: 'very-low'
    }
  ];

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'needs-attention': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'at-risk': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getEngagementColor = (engagement: string) => {
    switch (engagement) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-orange-600';
      case 'very-low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

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
          <h1 className="text-3xl font-bold text-gradient-luxury">Student Analytics & Reports</h1>
          <p className="text-muted-foreground mt-2">Comprehensive student learning analytics, performance tracking, and detailed portal event reports</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedStudent} onValueChange={setSelectedStudent}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select student" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Students</SelectItem>
              {studentReportData.slice(0, 10).map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student-overview">Student Overview</SelectItem>
              <SelectItem value="learning-analytics">Learning Analytics</SelectItem>
              <SelectItem value="engagement-tracking">Engagement Tracking</SelectItem>
              <SelectItem value="performance-reports">Performance Reports</SelectItem>
              <SelectItem value="event-logs">Event Logs</SelectItem>
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

      {/* Student-Focused KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatedKpiCard
          label="Total Students"
          value={studentOverviewData.totalStudents.toString()}
          change={`+${studentOverviewData.studentGrowth}% growth`}
          trend="up"
          icon={Users}
          animationType="progress"
          onOpenProfile={() => openPanel('overview')}
        />
        <AnimatedKpiCard
          label="Active Learners"
          value={studentOverviewData.activeStudents.toString()}
          change={`+${studentOverviewData.activeGrowth}% active`}
          trend="up"
          icon={BookOpen}
          animationType="wave"
          onOpenProfile={() => openPanel('overview')}
        />
        <AnimatedKpiCard
          label="Avg Completion"
          value={`${studentOverviewData.avgCompletionRate}%`}
          change={`+${studentOverviewData.completionGrowth}% improvement`}
          trend="up"
          icon={Trophy}
          animationType="geometric"
          onOpenProfile={() => openPanel('overview')}
        />
        <AnimatedKpiCard
          label="Engagement Score"
          value={`${studentOverviewData.avgEngagement}%`}
          change={`+${studentOverviewData.engagementGrowth}% from last period`}
          trend="up"
          icon={Activity}
          animationType="pulse"
          onOpenProfile={() => openPanel('overview')}
        />
      </div>

      {/* Navigation */}
      <TubelightNavbar 
        items={[
          {
            name: "Student Overview",
            icon: Users,
            onClick: () => setActiveTab('overview')
          },
          {
            name: "Learning Analytics",
            icon: BookOpen,
            onClick: () => setActiveTab('learning')
          },
          {
            name: "Engagement Tracking",
            icon: Activity,
            onClick: () => setActiveTab('engagement')
          },
          {
            name: "Portal Events",
            icon: Brain,
            onClick: () => setActiveTab('events')
          },
          {
            name: "Individual Reports",
            icon: FileText,
            onClick: () => setActiveTab('reports')
          }
        ]}
        activeItem={activeTab}
        className="relative top-0 mb-8"
      />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Student Overview</TabsTrigger>
          <TabsTrigger value="learning">Learning Analytics</TabsTrigger>
          <TabsTrigger value="engagement">Engagement Tracking</TabsTrigger>
          <TabsTrigger value="events">Portal Events</TabsTrigger>
          <TabsTrigger value="reports">Individual Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Student Progress Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={studentProgressData}>
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
                        dataKey="active" 
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary))" 
                        fillOpacity={0.2}
                        strokeWidth={3}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="completions" 
                        stroke="hsl(var(--secondary))" 
                        fill="hsl(var(--secondary))" 
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
                  <PieChartIcon className="w-5 h-5 text-secondary" />
                  Performance Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { performance: 'Excellent', count: 2, color: '#10b981' },
                          { performance: 'Good', count: 2, color: '#3b82f6' },
                          { performance: 'Needs Attention', count: 1, color: '#f59e0b' },
                          { performance: 'At Risk', count: 1, color: '#ef4444' }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="hsl(var(--primary))"
                        dataKey="count"
                        label={({ performance, percent }) => `${performance} ${(percent * 100).toFixed(0)}%`}
                      >
                        {[
                          { performance: 'Excellent', count: 2 },
                          { performance: 'Good', count: 2 },
                          { performance: 'Needs Attention', count: 1 },
                          { performance: 'At Risk', count: 1 }
                        ].map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={['#10b981', '#3b82f6', '#f59e0b', '#ef4444'][index]} 
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

        <TabsContent value="learning" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Learning Analytics Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-background/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">89.2%</div>
                  <div className="text-sm text-muted-foreground">Course Start Rate</div>
                </div>
                <div className="text-center p-4 bg-background/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">73.5%</div>
                  <div className="text-sm text-muted-foreground">Completion Rate</div>
                </div>
                <div className="text-center p-4 bg-background/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">42min</div>
                  <div className="text-sm text-muted-foreground">Avg Session Time</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Student Engagement Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={studentProgressData}>
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
                      dataKey="active" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="enrollments" 
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

        <TabsContent value="events" className="space-y-6">
          {/* Portal Events Comprehensive List */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                Student Portal Events Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(studentPortalEvents).map(([category, events]) => (
                  <div key={category} className="space-y-3">
                    <h3 className="font-semibold text-lg capitalize flex items-center gap-2">
                      {category === 'learningEvents' && <BookOpen className="w-5 h-5 text-primary" />}
                      {category === 'engagementEvents' && <Activity className="w-5 h-5 text-secondary" />}
                      {category === 'socialEvents' && <MessageSquare className="w-5 h-5 text-accent" />}
                      {category === 'assessmentEvents' && <Trophy className="w-5 h-5 text-green-600" />}
                      {category === 'supportEvents' && <AlertTriangle className="w-5 h-5 text-yellow-600" />}
                      {category === 'profileEvents' && <Users className="w-5 h-5 text-purple-600" />}
                      {category === 'technicalEvents' && <Shield className="w-5 h-5 text-red-600" />}
                      {category.replace('Events', '').replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {events.map((event, index) => (
                        <div key={index} className="text-xs p-2 bg-background/30 rounded border border-border/50">
                          {event.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          {/* Student Report Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{studentReportData.length}</div>
                <div className="text-sm text-muted-foreground">Active Students</div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {studentReportData.filter(s => s.performance === 'excellent').length}
                </div>
                <div className="text-sm text-muted-foreground">Excellent Performance</div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {studentReportData.filter(s => s.performance === 'needs-attention').length}
                </div>
                <div className="text-sm text-muted-foreground">Need Attention</div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">
                  {studentReportData.filter(s => s.performance === 'at-risk').length}
                </div>
                <div className="text-sm text-muted-foreground">At Risk</div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Student Report List */}
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Individual Student Reports
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter by Performance
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export All Reports
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentReportData.map((student) => (
                  <div key={student.id} className="p-6 bg-background/50 rounded-lg border border-border/50 hover:border-primary/30 transition-all duration-200">
                    {/* Student Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                          <Users className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{student.name}</h3>
                            <Badge variant="outline" className="text-xs">ID: {student.id}</Badge>
                            <Badge className={`${getPerformanceColor(student.performance)} text-xs`}>
                              {student.performance === 'needs-attention' ? 'Needs Attention' : 
                               student.performance === 'at-risk' ? 'At Risk' : student.performance}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{student.email}</span>
                            <span>Tenant: {student.tenant}</span>
                            <span>Enrolled: {student.enrollmentDate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${getEngagementColor(student.engagement)}`}>
                          {student.engagement.charAt(0).toUpperCase() + student.engagement.slice(1)} Engagement
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Last active: {student.lastActivity}
                        </div>
                      </div>
                    </div>

                    {/* Comprehensive Portal Event Summary */}
                    <div className="mb-4">
                      <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        Portal Event Summary Report
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="font-medium text-blue-800 mb-2">Learning Activities</div>
                          <div className="space-y-1 text-xs">
                            <div>Course Enrollments: {student.coursesStarted}</div>
                            <div>Video Interactions: {student.events.videoViews}</div>
                            <div>Chapter Completions: {student.events.chapterCompletions}</div>
                            <div>Certificates Earned: {student.events.certificateDownloads}</div>
                          </div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <div className="font-medium text-green-800 mb-2">Engagement Metrics</div>
                          <div className="space-y-1 text-xs">
                            <div>Total Sessions: {student.totalSessions}</div>
                            <div>Login Events: {student.events.logins}</div>
                            <div>Search Queries: {student.events.searchQueries}</div>
                            <div>Forum Participation: {student.forumPosts}</div>
                          </div>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <div className="font-medium text-purple-800 mb-2">Assessment Performance</div>
                          <div className="space-y-1 text-xs">
                            <div>Quizzes Taken: {student.quizzesTaken}</div>
                            <div>Average Score: {student.quizAvgScore}%</div>
                            <div>Help Requests: {student.helpRequests}</div>
                            <div>Learning Streak: {student.streakDays} days</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Key Performance Indicators */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
                      <div className="text-center p-3 bg-background/30 rounded-lg">
                        <div className="text-lg font-bold text-primary">{student.totalSessions}</div>
                        <div className="text-xs text-muted-foreground">Total Sessions</div>
                      </div>
                      <div className="text-center p-3 bg-background/30 rounded-lg">
                        <div className="text-lg font-bold text-secondary">{student.watchTime}h</div>
                        <div className="text-xs text-muted-foreground">Watch Time</div>
                      </div>
                      <div className="text-center p-3 bg-background/30 rounded-lg">
                        <div className="text-lg font-bold text-accent">{student.completionRate}%</div>
                        <div className="text-xs text-muted-foreground">Completion</div>
                      </div>
                      <div className="text-center p-3 bg-background/30 rounded-lg">
                        <div className="text-lg font-bold text-green-600">{student.quizAvgScore}%</div>
                        <div className="text-xs text-muted-foreground">Quiz Average</div>
                      </div>
                      <div className="text-center p-3 bg-background/30 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">{student.streakDays}</div>
                        <div className="text-xs text-muted-foreground">Day Streak</div>
                      </div>
                      <div className="text-center p-3 bg-background/30 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">{student.avgSessionDuration}m</div>
                        <div className="text-xs text-muted-foreground">Avg Session</div>
                      </div>
                    </div>

                    {/* Detailed Event Tracking */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Captured Portal Events
                      </h4>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-sm">
                        <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                          <MousePointer className="w-4 h-4 text-blue-600" />
                          <div>
                            <div className="font-medium">{student.events.logins}</div>
                            <div className="text-xs text-muted-foreground">Login Events</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                          <Play className="w-4 h-4 text-green-600" />
                          <div>
                            <div className="font-medium">{student.events.videoViews}</div>
                            <div className="text-xs text-muted-foreground">Video Interactions</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-purple-600" />
                          <div>
                            <div className="font-medium">{student.events.chapterCompletions}</div>
                            <div className="text-xs text-muted-foreground">Content Completions</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                          <Award className="w-4 h-4 text-yellow-600" />
                          <div>
                            <div className="font-medium">{student.events.certificateDownloads}</div>
                            <div className="text-xs text-muted-foreground">Certificates</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                          <Search className="w-4 h-4 text-orange-600" />
                          <div>
                            <div className="font-medium">{student.events.searchQueries}</div>
                            <div className="text-xs text-muted-foreground">Search Events</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-indigo-50 rounded-lg">
                          <MessageSquare className="w-4 h-4 text-indigo-600" />
                          <div>
                            <div className="font-medium">{student.forumPosts}</div>
                            <div className="text-xs text-muted-foreground">Forum Posts</div>
                          </div>
                        </div>
                      </div>

                      {/* Progress Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-border/50">
                        <div>
                          <h5 className="font-medium text-sm mb-2">Learning Progress Report</h5>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Courses Started</span>
                              <span className="font-medium">{student.coursesStarted}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Courses Completed</span>
                              <span className="font-medium">{student.coursesCompleted}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Overall Completion Rate</span>
                              <span className="font-medium">{student.completionRate}%</span>
                            </div>
                            <Progress value={student.completionRate} className="h-2" />
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-sm mb-2">Support & Engagement Analysis</h5>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Assessment Attempts</span>
                              <span className="font-medium">{student.quizzesTaken}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Community Participation</span>
                              <span className="font-medium">{student.forumPosts} posts</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Support Interactions</span>
                              <span className={`font-medium ${student.helpRequests > 5 ? 'text-yellow-600' : 'text-green-600'}`}>
                                {student.helpRequests} requests
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Profile Updates</span>
                              <span className="font-medium">{student.events.profileUpdates}</span>
                            </div>
                          </div>
                        </div>
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
