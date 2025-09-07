import React, { useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AnimatedKpiCard } from '@/components/ui/animated-kpi-card';
import { KpiCard } from '@/components/analytics/KpiCard';
import { FilterChips } from '@/components/analytics/FilterChips';
import { ExportModal } from '@/components/analytics/ExportModal';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import StudentProfileModal from '@/components/tenant-analytics/StudentProfileModal';
import type { StudentProfileData, StudentCertification, StudentSkillRoadmap } from '@/types/student';
import { Progress } from '@/components/ui/progress';
import { ProgressCircle } from '@/components/ui/progress-circle';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
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
  Legend,
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
import { Flame } from 'lucide-react';
import { useProfilePanel } from '@/contexts/ProfilePanelContext';

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
  const { openPanel } = useProfilePanel();
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedTenant, setSelectedTenant] = useState('all');
  const [tempTimeRange, setTempTimeRange] = useState('30d');
  const [tempSelectedTenant, setTempSelectedTenant] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileStudentData, setProfileStudentData] = useState<StudentProfileData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'learning' | 'engagement' | 'events' | 'reports'>('overview');
  const [showStudentDialog, setShowStudentDialog] = useState(false);
  const [segmentFilter, setSegmentFilter] = useState<'excellent' | 'good' | 'at_risk' | null>(null);
  const [customStart, setCustomStart] = useState<string>('');
  const [customEnd, setCustomEnd] = useState<string>('');
  const [customError, setCustomError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const applyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [exportOpen, setExportOpen] = useState(false);

  // Persist user preference for time range
  React.useEffect(() => {
    const savedRange = localStorage.getItem('tenant-analytics-time-range');
    const savedStudent = localStorage.getItem('tenant-analytics-student');
    if (savedRange) {
      setTimeRange(savedRange);
      setTempTimeRange(savedRange);
    }
    if (savedStudent) {
      setSelectedTenant(savedStudent);
      setTempSelectedTenant(savedStudent);
    }
  }, []);

  // Validate custom date range when selected
  React.useEffect(() => {
    if (tempTimeRange !== 'custom') { setCustomError(''); return; }
    if (!customStart || !customEnd) { setCustomError(''); return; }
    const start = new Date(customStart);
    const end = new Date(customEnd);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) { setCustomError(''); return; }
    if (start > end) {
      setCustomError('Start date must be before end date.');
      return;
    }
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    if (months > 24) {
      setCustomError('Maximum range is 24 months.');
      return;
    }
    setCustomError('');
  }, [tempTimeRange, customStart, customEnd]);

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

  const parseSalary = (val: string | number | undefined): number | undefined => {
    if (typeof val === 'number') return val;
    if (!val) return undefined;
    const n = Number(String(val).replace(/[^0-9.-]/g, ''));
    return Number.isFinite(n) ? n : undefined;
  };

  const buildStudentProfileData = (row: any): StudentProfileData => {
    const now = new Date();
    const certs: StudentCertification[] = Array.isArray(row.certifications)
      ? (row.certifications as string[]).map((name: string, i: number) => ({
          name,
          issuingBody: 'External',
          dateAwarded: new Date(now.getFullYear(), now.getMonth() - (i + 1), 10).toISOString(),
        }))
      : [];

    const baseProgress = typeof row.completionRate === 'number' ? row.completionRate : 0;
    const skills: string[] = Array.isArray(row.skills) ? row.skills : [];
    const skillRoadmaps: StudentSkillRoadmap[] = skills.map((skill: string, i: number) => {
      const progress = Math.max(1, Math.min(100, Math.round(baseProgress + ((i * 7) % 15) - 7)));
      const avgScore = Math.max(1, Math.min(100, Math.round((row.engagement || 70) + ((i * 5) % 10) - 5)));
      const capstone = String(row.level || '').toLowerCase() === 'expert' || (row.placementReadiness || 0) >= 90;
      return {
        skillName: skill,
        overallProgressPercent: progress,
        averageQuizScore: avgScore,
        capstoneProjectRequested: capstone,
      };
    });

    return {
      id: row.email || row.name,
      name: row.name,
      email: row.email,
      phone: row.phone,
      location: row.location,
      avatarUrl: undefined,
      preferredRole: row.jobPreference,
      salaryExpectation: parseSalary(row.salaryExpectation),
      availableFrom: row.availableFrom,
      certifications: certs,
      totalWatchTimeHours: row.totalWatchTime,
      streakDays: row.streakDays,
      engagementScore: row.engagement,
      skillRoadmaps,
    };
  };

  const handleStudentClick = (student: any) => {
    setSelectedStudent(student);
    const profile = buildStudentProfileData(student);
    setProfileStudentData(profile);
    setProfileOpen(true);
  };

  const getPlacementReadinessColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getLevelClass = (level: string) => {
    switch (level.toLowerCase()) {
      case 'expert':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'advanced':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleExport = (format: 'csv' | 'pdf' | 'xlsx') => {
    // Guard large datasets
    const rows = filteredBySegment.length;
    if (rows > 100000) {
      if (!window.confirm('Large export (>100k rows). Start a background export job?')) {
        return;
      }
      // In a real app, POST to server to start export job here
      window.alert('Background export job started. You will be notified when it is ready.');
      return;
    }

    const today = new Date();
    const yyyymmdd = `${today.getFullYear()}${String(today.getMonth()+1).padStart(2,'0')}${String(today.getDate()).padStart(2,'0')}`;
    const audience = selectedTenant === 'all' ? 'all' : selectedTenant.replace(/\s+/g,'_').toLowerCase();
    const filename = `student-analytics_${activeTab}_${yyyymmdd}_${audience}.${format}`;

    if (format === 'csv') {
      const header = ['Name','Email','Level','Health','Courses Completed','Courses Enrolled','Completion %','Engagement %','Watch Time (h)','Streak (days)'];
      const body = filteredBySegment.map(s => [
        s.name,
        s.email,
        s.level,
        s.health,
        s.coursesCompleted,
        s.coursesEnrolled,
        s.completionRate,
        s.engagement,
        s.totalWatchTime,
        s.streakDays,
      ].join(','));
      const csv = [header.join(','), ...body].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // Placeholder for PDF/XLSX — would call server in real app
      window.alert(`Exporting ${format.toUpperCase()} is handled server-side in production.`);
    }
  };

  const filteredByAudience = selectedTenant === 'all'
    ? studentPerformanceData
    : studentPerformanceData.filter(s => s.name === selectedTenant);

  const filteredBySegment = segmentFilter
    ? (segmentFilter === 'at_risk'
        ? filteredByAudience.filter(s => s.health === 'warning' || s.health === 'critical')
        : filteredByAudience.filter(s => s.health === segmentFilter))
    : filteredByAudience;

  const filtersActive = (selectedTenant !== 'all') || (timeRange !== '30d') || (segmentFilter !== null);

  const rangeLabel = useMemo(() => {
    switch (timeRange) {
      case '7d': return '7 days';
      case '30d': return '30 days';
      case '90d': return '3 months';
      case '12m': return '12 months';
      case 'custom': return 'custom range';
      default: return 'selected period';
    }
  }, [timeRange]);

  const nf = useMemo(() => new Intl.NumberFormat(undefined), []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient-luxury">Student Analytics</h1>
          <p className="text-muted-foreground mt-2">Monitor student performance, learning progress, and engagement metrics</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <Card className="glass-card sticky top-0 z-20" aria-label="Analytics filters toolbar">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <Select value={tempSelectedTenant} onValueChange={setTempSelectedTenant}>
              <SelectTrigger className="w-[200px] rounded-full">
                <SelectValue placeholder="All Students" />
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
            {/* View selector reflects active tab */}
            <Select value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
              <SelectTrigger className="w-[220px] rounded-full">
                <SelectValue placeholder="View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Student Overview</SelectItem>
                <SelectItem value="learning">Learning Analytics</SelectItem>
                <SelectItem value="engagement">Engagement Tracking</SelectItem>
                <SelectItem value="events">Portal Events</SelectItem>
                <SelectItem value="reports">Individual Reports</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tempTimeRange} onValueChange={setTempTimeRange}>
              <SelectTrigger className="w-[180px] rounded-full">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 3 months</SelectItem>
                <SelectItem value="12m">Last 12 months</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            {tempTimeRange === 'custom' && (
              <div className="flex items-center gap-2">
                <input aria-label="Start date" className="border rounded-md px-2 py-1 text-sm" type="date" value={customStart} onChange={(e)=>setCustomStart(e.target.value)} />
                <span className="text-sm">to</span>
                <input aria-label="End date" className="border rounded-md px-2 py-1 text-sm" type="date" value={customEnd} onChange={(e)=>setCustomEnd(e.target.value)} />
                {customError && <span role="alert" className="text-xs text-red-600 ml-2">{customError}</span>}
              </div>
            )}
            <div className="ml-auto flex gap-2">
              {filtersActive && (
                <Badge variant="outline" className="rounded-full">Filters active</Badge>
              )}
              <Button
                variant="outline"
                disabled={tempTimeRange === 'custom' && (!!customError || !customStart || !customEnd)}
                onClick={() => {
                  if (applyTimer.current) clearTimeout(applyTimer.current);
                  setIsLoading(true);
                  applyTimer.current = setTimeout(() => {
                    setSelectedTenant(tempSelectedTenant);
                    setTimeRange(tempTimeRange);
                    localStorage.setItem('tenant-analytics-time-range', tempTimeRange);
                    localStorage.setItem('tenant-analytics-student', tempSelectedTenant);
                    setIsLoading(false);
                  }, 300);
                }}
              >
                Apply Filters
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setTempSelectedTenant('all');
                  setTempTimeRange('30d');
                  setSelectedTenant('all');
                  setTimeRange('30d');
                  localStorage.setItem('tenant-analytics-time-range', '30d');
                  localStorage.setItem('tenant-analytics-student', 'all');
                  setSegmentFilter(null);
                  setCustomStart(''); setCustomEnd(''); setCustomError('');
                }}
              >
                Clear Filters
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setExportOpen(true)}>Export Report…</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applied filter chips */}
      <FilterChips
        audience={selectedTenant !== 'all' ? selectedTenant : undefined}
        rangeLabel={rangeLabel}
        segment={segmentFilter ? (segmentFilter === 'at_risk' ? 'At Risk' : segmentFilter) : null}
        onRemove={(key) => {
          if (key === 'audience') { setSelectedTenant('all'); setTempSelectedTenant('all'); }
          if (key === 'range') { setTimeRange('30d'); setTempTimeRange('30d'); setCustomStart(''); setCustomEnd(''); setCustomError(''); }
          if (key === 'segment') { setSegmentFilter(null); }
        }}
        onClearAll={()=>{ setSelectedTenant('all'); setTempSelectedTenant('all'); setTimeRange('30d'); setTempTimeRange('30d'); setSegmentFilter(null); setCustomStart(''); setCustomEnd(''); setCustomError(''); }}
      />

      <ExportModal
        open={exportOpen}
        onOpenChange={setExportOpen}
        scopeText={`Export: ${activeTab.replace(/\b\w/g, c => c.toUpperCase())} • ${selectedTenant === 'all' ? 'All students' : selectedTenant} • Last ${rangeLabel}`}
        onConfirm={(fmt) => { setExportOpen(false); handleExport(fmt); }}
      />

      {/* Metrics Groups */}
      {(() => {
        const ds = filteredByAudience;
        const totalStudents = ds.length;
        const activeLearners = ds.filter(s => (s.streakDays || 0) > 0 || (s.engagement || 0) > 0).length;
        const avgCompletion = totalStudents > 0 ? Math.round(ds.reduce((sum, s) => sum + (s.completionRate || 0), 0) / totalStudents) : 0;
        const avgEngagement = totalStudents > 0 ? Math.round(ds.reduce((sum, s) => sum + (s.engagement || 0), 0) / totalStudents) : 0;
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Population Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <KpiCard
                  data-testid="kpi-total-students"
                  icon={Users}
                  title="Total students"
                  value={nf.format(totalStudents)}
                  delta={{ value: 0, direction: 'up' }}
                  sparkline={[3,4,3,5,6,7,8]}
                  info="All unique student accounts in tenant"
                  onClick={() => setActiveTab('overview')}
                />
                <KpiCard
                  data-testid="kpi-active-learners"
                  icon={Activity}
                  title="Active learners"
                  value={nf.format(activeLearners)}
                  delta={{ value: 0, direction: 'up' }}
                  sparkline={[2,3,3,4,4,5,5]}
                  info="Students with at least N learning actions in period"
                  onClick={() => setActiveTab('engagement')}
                />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Performance Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                <Card className="glass-card md:col-span-2">
                  <CardContent className="p-6 flex items-center gap-6">
                    <ProgressCircle value={avgEngagement} size="lg" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Engagement Score</p>
                      <p className="text-3xl font-bold">{isFinite(avgEngagement) ? `${avgEngagement}%` : '—'}</p>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="text-xs text-muted-foreground mt-1 cursor-help">What counts as engagement?</p>
                        </TooltipTrigger>
                        <TooltipContent>Composite of time-on-task, logins, and actions, scaled 0–100.</TooltipContent>
                      </Tooltip>
                    </div>
                  </CardContent>
                </Card>
                <Card className="glass-card">
                  <CardContent className="p-6 h-full">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Average Course Completion</p>
                        <p className="text-2xl font-bold">{isFinite(avgCompletion) ? `${avgCompletion}%` : '—'}</p>
                        <p className="text-xs text-green-700 mt-1">▲ 4.2% vs previous {rangeLabel}</p>
                      </div>
                      <Award className="w-8 h-8 text-primary opacity-70" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Navigation */}

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Student Overview</TabsTrigger>
          <TabsTrigger value="learning">Learning Analytics</TabsTrigger>
          <TabsTrigger value="engagement">Engagement Tracking</TabsTrigger>
          <TabsTrigger value="events">Portal Events</TabsTrigger>
          <TabsTrigger value="reports">Individual Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Charts above list */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Distribution (donut) */}
            <Card className="glass-card" aria-label="Performance Distribution">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Performance Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Excellent', key: 'excellent', value: filteredByAudience.filter(s => s.health==='excellent').length },
                          { name: 'Good', key: 'good', value: filteredByAudience.filter(s => s.health==='good').length },
                          { name: 'At Risk', key: 'at_risk', value: filteredByAudience.filter(s => s.health==='warning' || s.health==='critical').length },
                        ]}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        label
                        labelLine
                        onClick={(data) => setSegmentFilter((data as any).payload.key)}
                      >
                        <Cell fill="#16a34a" aria-label="Excellent" />
                        <Cell fill="#64748B" aria-label="Good" />
                        <Cell fill="#DC2626" aria-label="At Risk" />
                      </Pie>
                      <Legend verticalAlign="middle" align="right" layout="vertical" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                  {segmentFilter && (
                    <div className="mt-3 text-sm">
                      <Badge variant="secondary" className="mr-2">Filtered: {segmentFilter === 'at_risk' ? 'At Risk' : segmentFilter.charAt(0).toUpperCase()+segmentFilter.slice(1)}</Badge>
                      <Button variant="ghost" size="sm" onClick={() => setSegmentFilter(null)}>Clear</Button>
                    </div>
                  )}
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Student Progress Trends (line) */}
            <Card className="glass-card" aria-label="Student Progress Trends">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Student Progress Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={learningProgressData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="completions" stroke="#16a34a" strokeWidth={3} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Student Performance Overview
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4" aria-live="polite">
                {isLoading && (
                  <>
                    <div className="animate-pulse h-16 rounded-md bg-muted" />
                    <div className="animate-pulse h-16 rounded-md bg-muted" />
                    <div className="animate-pulse h-16 rounded-md bg-muted" />
                  </>
                )}
                {!isLoading && filteredBySegment.length === 0 && (
                  <div className="p-6 text-sm text-muted-foreground">No students match this segment.</div>
                )}
                {!isLoading && filteredBySegment.map((student, index) => (
                  <div 
                    key={student.name} 
                    className="group p-4 bg-background/50 rounded-lg border border-border/50 hover:border-primary/50 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                      {/* Left: Student Info */}
                      <div className="lg:col-span-4 flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                          <Users className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {student.name}
                            </p>
                            <Badge variant="outline" className={`text-xs ${getLevelClass(student.level)}`}>
                              {student.level}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {student.email}
                          </div>
                        </div>
                      </div>

                      {/* Middle: Learning Summary */}
                      <div className="lg:col-span-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Award className="w-4 h-4" />
                            <span>Courses</span>
                          </div>
                          <span className="font-medium">{student.coursesCompleted}/{student.coursesEnrolled}</span>
                        </div>
                        <Progress value={student.completionRate} className="h-2" />
                        <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Flame className="w-3 h-3" />
                            <span>{student.streakDays} day streak</span>
                          </div>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-help">Completion vs. Engagement</span>
                            </TooltipTrigger>
                            <TooltipContent>Completion reflects finished courses; engagement reflects activity and watch time.</TooltipContent>
                          </Tooltip>
                        </div>
                      </div>

                      {/* Right: Engagement Summary + Action */}
                      <div className="lg:col-span-4 flex items-center justify-end gap-4">
                        <div className="min-w-[180px]">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Activity className="w-4 h-4" />
                              <span>Engagement</span>
                            </div>
                            <span className="font-semibold">{student.engagement}%</span>
                          </div>
                          <Progress value={student.engagement} className="h-2" />
                          <div className="text-xs text-muted-foreground mt-1 text-right">{student.totalWatchTime}h watched</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getHealthColor(student.health)} flex items-center gap-1`}>
                            {getHealthIcon(student.health)}
                            {student.health.charAt(0).toUpperCase() + student.health.slice(1)}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            data-lov-id="src\\components\\tenant-analytics\\TenantAnalyticsDashboard.tsx:780:26"
                            onClick={() => handleStudentClick(student)}
                          >
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learning" className="space-y-6">
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

        <TabsContent value="events" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Portal Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <span>Login from new device</span>
                  <span className="text-muted-foreground">2h ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <span>Course completed: React Fundamentals</span>
                  <span className="text-muted-foreground">1d ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <span>Support ticket opened</span>
                  <span className="text-muted-foreground">3d ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Individual Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">Generate a report for the selected audience and time range. Use the toolbar filters above. A “Filters active” chip appears when applied.</p>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="rounded-full">Export Report</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem>Export CSV</DropdownMenuItem>
                    <DropdownMenuItem>Export PDF</DropdownMenuItem>
                    <DropdownMenuItem>Export Excel</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {filtersActive && <Badge variant="secondary" className="rounded-full">Applied Filters</Badge>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Profile Modal */}
      <StudentProfileModal
        open={profileOpen}
        onOpenChange={setProfileOpen}
        studentData={profileStudentData}
      />

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

