import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TubelightNavbar } from '@/components/ui/tubelight-navbar';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ProgressCircle } from '@/components/ui/progress-circle';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Plus, 
  UserPlus, 
  GraduationCap, 
  BookOpen, 
  TrendingUp,
  MoreHorizontal,
  Edit,
  Trash2,
  Mail,
  Download,
  Search,
  Award,
  Clock,
  Target,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Upload,
  Building2,
  Shield,
  Loader2
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useStudentMetrics } from '@/hooks/useStudentMetrics';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { exportStudentsToCsv } from '@/services/export';

interface Student {
  id: string;
  name: string;
  email: string;
  graduationYear: number;
  batch: string;
  careerChoice?: string;
  enrolledSkills: number;
  completedSkills: number;
  overallProgress: number;
  lastActive: Date;
  enrollmentDate: Date;
  status: 'active' | 'inactive' | 'suspended';
  currentSkill?: string;
  totalWatchTime: number;
  quizzesCompleted: number;
  averageScore: number;
  tenantId: string;
}

interface Tenant {
  id: string;
  name: string;
  domain: string;
  studentCount: number;
}

export function StudentManagement() {
  const { user } = useAuth();
  const isPlatformOwner = user?.role === 'platform_owner';
  
  // Mock tenants data for platform owner
  const [tenants] = useState<Tenant[]>([
    { id: 'tenant-1', name: 'University of Technology', domain: 'tech.edu', studentCount: 5 },
    { id: 'tenant-2', name: 'Business School International', domain: 'bschool.edu', studentCount: 8 },
    { id: 'tenant-3', name: 'Medical University', domain: 'meduni.edu', studentCount: 12 },
  ]);
  
  const [selectedTenant, setSelectedTenant] = useState<string>(
    isPlatformOwner ? '' : user?.tenantId || 'tenant-1'
  );
  const [tenantSearchTerm, setTenantSearchTerm] = useState('');
  
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice.johnson@university.edu',
      graduationYear: 2025,
      batch: 'CS-2025-A',
      careerChoice: 'Software Engineer',
      enrolledSkills: 5,
      completedSkills: 3,
      overallProgress: 78,
      lastActive: new Date('2024-08-26'),
      enrollmentDate: new Date('2024-01-15'),
      status: 'active',
      currentSkill: 'Machine Learning Basics',
      totalWatchTime: 1250,
      quizzesCompleted: 12,
      averageScore: 85,
      tenantId: 'tenant-1'
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob.smith@university.edu',
      graduationYear: 2026,
      batch: 'BBA-2026-B',
      careerChoice: 'Product Manager',
      enrolledSkills: 3,
      completedSkills: 1,
      overallProgress: 45,
      lastActive: new Date('2024-08-25'),
      enrollmentDate: new Date('2024-02-01'),
      status: 'active',
      currentSkill: 'Data Analysis',
      totalWatchTime: 680,
      quizzesCompleted: 6,
      averageScore: 72,
      tenantId: 'tenant-1'
    },
    {
      id: '3',
      name: 'Carol Williams',
      email: 'carol.williams@university.edu',
      graduationYear: 2025,
      batch: 'MBA-2025-A',
      careerChoice: 'Data Scientist',
      enrolledSkills: 4,
      completedSkills: 4,
      overallProgress: 100,
      lastActive: new Date('2024-08-24'),
      enrollmentDate: new Date('2024-01-10'),
      status: 'active',
      currentSkill: 'Leadership Skills',
      totalWatchTime: 2100,
      quizzesCompleted: 18,
      averageScore: 92,
      tenantId: 'tenant-2'
    },
    {
      id: '4',
      name: 'David Brown',
      email: 'david.brown@university.edu',
      graduationYear: 2026,
      batch: 'CS-2026-B',
      careerChoice: 'DevOps Engineer',
      enrolledSkills: 2,
      completedSkills: 0,
      overallProgress: 15,
      lastActive: new Date('2024-08-15'),
      enrollmentDate: new Date('2024-08-01'),
      status: 'inactive',
      currentSkill: 'Python Programming',
      totalWatchTime: 120,
      quizzesCompleted: 1,
      averageScore: 65,
      tenantId: 'tenant-2'
    },
    {
      id: '5',
      name: 'Emma Davis',
      email: 'emma.davis@university.edu',
      graduationYear: 2024,
      batch: 'Finance-2024-A',
      careerChoice: 'Financial Analyst',
      enrolledSkills: 6,
      completedSkills: 2,
      overallProgress: 62,
      lastActive: new Date('2024-08-26'),
      enrollmentDate: new Date('2024-01-20'),
      status: 'active',
      currentSkill: 'Financial Analytics',
      totalWatchTime: 940,
      quizzesCompleted: 9,
      averageScore: 88,
      tenantId: 'tenant-3'
    }
  ]);

  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isUploadCsvOpen, setIsUploadCsvOpen] = useState(false);
  const [isRemoveConfirmOpen, setIsRemoveConfirmOpen] = useState(false);
  const [studentToRemove, setStudentToRemove] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [graduationYearFilter, setGraduationYearFilter] = useState('all');
  const [careerChoiceFilter, setCareerChoiceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  // Temp filter state for Apply/Clear interactions
  const [tempSearchTerm, setTempSearchTerm] = useState('');
  const [tempGraduationYear, setTempGraduationYear] = useState('all');
  const [tempCareerChoice, setTempCareerChoice] = useState('all');
  const [tempStatus, setTempStatus] = useState('all');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'students' | 'progress' | 'analytics'>('students');
  // Sorting & pagination
  const [sortKey, setSortKey] = useState<'progress' | 'lastActive' | 'name'>('progress');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    graduationYear: new Date().getFullYear(),
    batch: ''
  });
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);
      const rows = filteredStudents.map((s) => ({
        Name: s.name,
        Email: s.email,
        GraduationYear: s.graduationYear,
        Batch: s.batch,
        CareerChoice: s.careerChoice || '',
        EnrolledSkills: s.enrolledSkills,
        CompletedSkills: s.completedSkills,
        ProgressPercent: s.overallProgress,
        Status: s.status,
        LastActive: s.lastActive.toISOString(),
        AvgScore: s.averageScore,
        TotalWatchTimeMinutes: s.totalWatchTime,
        CurrentSkill: s.currentSkill || '',
      }));
      const tenantLabel = isPlatformOwner ? (tenants.find(t => t.id === selectedTenant)?.name || 'Tenant') : 'MyTenant';
      const date = new Date().toISOString().slice(0,10);
      const filename = `students_export_${tenantLabel.replace(/\s+/g,'_')}_${date}.csv`;
      await exportStudentsToCsv(rows as any, filename);
    } catch (e) {
      toast({ title: 'Export failed. Please try again.' });
    } finally {
      setExporting(false);
    }
  };

  const handleAddStudent = () => {
    const student: Student = {
      id: Date.now().toString(),
      ...newStudent,
      enrolledSkills: 0,
      completedSkills: 0,
      overallProgress: 0,
      lastActive: new Date(),
      enrollmentDate: new Date(),
      status: 'active',
      totalWatchTime: 0,
      quizzesCompleted: 0,
      averageScore: 0,
      tenantId: selectedTenant
    };
    setStudents([...students, student]);
    setIsAddStudentOpen(false);
    setNewStudent({
      name: '',
      email: '',
      graduationYear: new Date().getFullYear(),
      batch: ''
    });
  };

  const handleCsvUpload = () => {
    if (!csvFile) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const csv = event.target?.result as string;
      const lines = csv.split('\n');
      const newStudents = lines
        .slice(1)
        .filter(line => line.trim())
        .map((line, index) => {
          const values = line.split(',');
          return {
            id: (Date.now() + index).toString(),
            name: values[0]?.trim() || '',
            email: values[1]?.trim() || '',
            graduationYear: parseInt(values[2]?.trim()) || new Date().getFullYear(),
            batch: values[3]?.trim() || '',
            careerChoice: values[4]?.trim() || '',
            enrolledSkills: 0,
            completedSkills: 0,
            overallProgress: 0,
            lastActive: new Date(),
            enrollmentDate: new Date(),
            status: 'active' as const,
            totalWatchTime: 0,
            quizzesCompleted: 0,
            averageScore: 0,
            tenantId: selectedTenant
          } as Student;
        });
      
      setStudents(prev => [...prev, ...newStudents]);
      setIsUploadCsvOpen(false);
      setCsvFile(null);
    };
    reader.readAsText(csvFile);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'suspended':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'inactive':
        return <AlertTriangle className="w-4 h-4" />;
      case 'suspended':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // Engagement level based on progress and recency
  const getEngagementLevel = (s: Student) => {
    const daysSinceActive = Math.floor((Date.now() - s.lastActive.getTime()) / (1000 * 60 * 60 * 24));
    if (s.overallProgress >= 70 || daysSinceActive <= 7) return 'High';
    if (s.overallProgress >= 40 || daysSinceActive <= 30) return 'Medium';
    return 'Low';
  };

  const getEngagementClass = (level: string) => {
    switch (level) {
      case 'High':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  // Filter students by tenant first (for platform owners)
  const tenantFilteredStudents = isPlatformOwner 
    ? students.filter(student => selectedTenant ? student.tenantId === selectedTenant : false)
    : students.filter(student => student.tenantId === user?.tenantId);

  const filteredStudents = tenantFilteredStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.careerChoice?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGraduationYear = graduationYearFilter === 'all' || student.graduationYear.toString() === graduationYearFilter;
    const matchesCareerChoice = careerChoiceFilter === 'all' || student.careerChoice === careerChoiceFilter;
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesGraduationYear && matchesCareerChoice && matchesStatus;
  });

  // Metrics hook (preserved) + fallback defaults
  const { metrics, isLoading } = useStudentMetrics(tenantFilteredStudents as any, [selectedTenant, students.length]);
  const {
    totalStudents = tenantFilteredStudents.length,
    activeStudents = tenantFilteredStudents.filter(s => s.status === 'active').length,
    avgProgress = totalStudents > 0 ? Math.round(tenantFilteredStudents.reduce((sum, s) => sum + s.overallProgress, 0) / totalStudents) : 0,
    totalCompletions = tenantFilteredStudents.reduce((sum, s) => sum + s.completedSkills, 0),
    topPerformers = [] as Student[],
    attention = [] as Student[],
  } = metrics || {};

  // Sorting
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let comp = 0;
    switch (sortKey) {
      case 'progress':
        comp = a.overallProgress - b.overallProgress;
        break;
      case 'lastActive':
        comp = a.lastActive.getTime() - b.lastActive.getTime();
        break;
      case 'name':
        comp = a.name.localeCompare(b.name);
        break;
    }
    return sortDir === 'asc' ? comp : -comp;
  });

  // Pagination
  const pageCount = Math.max(1, Math.ceil(sortedStudents.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const pagedStudents = sortedStudents.slice(startIndex, startIndex + pageSize);

  const graduationYears = [...new Set(tenantFilteredStudents.map(s => s.graduationYear))].sort((a, b) => b - a);
  const careerChoices = [...new Set(tenantFilteredStudents.map(s => s.careerChoice).filter(Boolean))] as string[];
  
  const selectedTenantData = tenants.find(t => t.id === selectedTenant);
  const filteredTenants = tenants.filter(tenant => 
    tenant.name.toLowerCase().includes(tenantSearchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient-luxury">
            {isPlatformOwner ? 'Students & Performance' : 'Student Management'}
            {selectedTenantData && isPlatformOwner && (
              <span className="text-xl font-normal text-muted-foreground ml-2">
                — {selectedTenantData.name}
              </span>
            )}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isPlatformOwner ? 'Monitor student performance across tenants' : 'Manage learners and track their progress'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleExport} disabled={exporting}>
            {exporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Exporting…
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </>
            )}
          </Button>
          {!isPlatformOwner && (
            <>
              <Dialog open={isUploadCsvOpen} onOpenChange={setIsUploadCsvOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload CSV
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Student CSV</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      CSV format: Name, Email, Graduation Year, Batch, Career Choice
                    </p>
                    <Input
                      type="file"
                      accept=".csv"
                      onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                    />
                    <Button onClick={handleCsvUpload} disabled={!csvFile} className="w-full">
                      Upload Students
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-accent-luxury shadow-medium">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Student
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Student</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Student Name"
                      value={newStudent.name}
                      onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    />
                    <Input
                      placeholder="Email Address"
                      type="email"
                      value={newStudent.email}
                      onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    />
                    <Input
                      placeholder="Graduation Year"
                      type="number"
                      value={newStudent.graduationYear}
                      onChange={(e) => setNewStudent({ ...newStudent, graduationYear: parseInt(e.target.value) || new Date().getFullYear() })}
                    />
                    <Input
                      placeholder="Batch (e.g., CS-2025-A)"
                      value={newStudent.batch}
                      onChange={(e) => setNewStudent({ ...newStudent, batch: e.target.value })}
                    />
                    <Button onClick={handleAddStudent} className="w-full">
                      Add Student
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>

      {/* Platform Owner Tenant Switcher */}
      {isPlatformOwner && (
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                <span className="font-medium">Select Tenant:</span>
              </div>
              <div className="flex-1 max-w-sm">
                <Select value={selectedTenant} onValueChange={(val) => { setSelectedTenant(val); setCurrentPage(1); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a tenant to view students" />
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
              <Badge variant="secondary" className="flex items-center gap-1">
                <Shield className="w-4 h-4" aria-hidden="true" />
                Read-only
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty state for platform owner without tenant selection */}
      {isPlatformOwner && !selectedTenant && (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Select a Tenant</h3>
            <p className="text-muted-foreground">
              Choose a tenant from the dropdown above to view their student performance data.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Show stats and content only when tenant is selected (for platform owner) or always (for tenant admin) */}
      {(!isPlatformOwner || selectedTenant) && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                    {isLoading ? (
                      <Skeleton className="h-7 w-20 mt-1" />
                    ) : (
                      <p className="text-3xl font-bold">{totalStudents}</p>
                    )}
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" aria-hidden="true" />
                      +5 this month
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-primary opacity-60" aria-hidden="true" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Learners</p>
                    {isLoading ? (
                      <Skeleton className="h-7 w-16 mt-1" />
                    ) : (
                      <p className="text-3xl font-bold">{activeStudents}</p>
                    )}
                    <p className="text-xs text-blue-600 flex items-center mt-1">
                      <Target className="w-3 h-3 mr-1" aria-hidden="true" />
                      {totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0}% active
                    </p>
                  </div>
                  <GraduationCap className="w-8 h-8 text-blue-500 opacity-60" aria-hidden="true" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Progress</p>
                    {isLoading ? (
                      <Skeleton className="h-7 w-14 mt-1" />
                    ) : (
                      <p className="text-3xl font-bold">{avgProgress}%</p>
                    )}
                    <p className="text-xs text-purple-600 flex items-center mt-1">
                      <BookOpen className="w-3 h-3 mr-1" aria-hidden="true" />
                      Across all courses
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-purple-500 opacity-60" aria-hidden="true" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Completions</p>
                    {isLoading ? (
                      <Skeleton className="h-7 w-16 mt-1" />
                    ) : (
                      <p className="text-3xl font-bold">{totalCompletions}</p>
                    )}
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <Award className="w-3 h-3 mr-1" aria-hidden="true" />
                      Total completed
                    </p>
                  </div>
                  <Award className="w-8 h-8 text-green-500 opacity-60" aria-hidden="true" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation */}
          <TubelightNavbar 
            items={[
              { name: "Students", icon: Users, onClick: () => setActiveTab('students') },
              { name: "Progress", icon: Target, onClick: () => setActiveTab('progress') },
              { name: "Analytics", icon: TrendingUp, onClick: () => setActiveTab('analytics') }
            ]}
            activeItem={activeTab === 'students' ? 'Students' : activeTab === 'progress' ? 'Progress' : 'Analytics'}
            className="relative top-0 mb-8"
          />

          <Tabs value={activeTab} onValueChange={v => setActiveTab(v as any)} className="space-y-6">
            <TabsContent value="students" className="space-y-6">
              {/* Filters */}
              <Card className="glass-card">
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex-1 min-w-[200px]">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          placeholder="Search students..."
                          value={tempSearchTerm}
                          onChange={(e) => setTempSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={tempGraduationYear} onValueChange={setTempGraduationYear}>
                      <SelectTrigger className="w-[180px] rounded-full">
                        <SelectValue placeholder="Graduation Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Years</SelectItem>
                        {graduationYears.map(year => (
                          <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={tempCareerChoice} onValueChange={setTempCareerChoice}>
                      <SelectTrigger className="w-[180px] rounded-full">
                        <SelectValue placeholder="Career" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Careers</SelectItem>
                        {careerChoices.map(career => (
                          <SelectItem key={career} value={career}>{career}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={tempStatus} onValueChange={setTempStatus}>
                      <SelectTrigger className="w-[150px] rounded-full">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Sort controls */}
                    <Select value={sortKey} onValueChange={(v) => setSortKey(v as any)}>
                      <SelectTrigger className="w-[160px] rounded-full">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="progress">Progress %</SelectItem>
                        <SelectItem value="lastActive">Last Active</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={sortDir} onValueChange={(v) => setSortDir(v as any)}>
                      <SelectTrigger className="w-[140px] rounded-full">
                        <SelectValue placeholder="Order" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="desc">Desc</SelectItem>
                        <SelectItem value="asc">Asc</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="ml-auto flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchTerm(tempSearchTerm);
                          setGraduationYearFilter(tempGraduationYear);
                          setCareerChoiceFilter(tempCareerChoice);
                          setStatusFilter(tempStatus);
                          setCurrentPage(1);
                        }}
                      >
                        Apply Filters
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setTempSearchTerm('');
                          setTempGraduationYear('all');
                          setTempCareerChoice('all');
                          setTempStatus('all');
                          setSearchTerm('');
                          setGraduationYearFilter('all');
                          setCareerChoiceFilter('all');
                          setStatusFilter('all');
                          setCurrentPage(1);
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Students Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Batch/Year</TableHead>
                        <TableHead>Active Skill</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pagedStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <div>
                              <div className="font-semibold">{student.name}</div>
                              <div className="text-sm text-muted-foreground">{student.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="text-muted-foreground">{student.batch}</div>
                              <div className="text-muted-foreground">{student.graduationYear}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="font-medium">
                                  {student.currentSkill || 'No active skill'}
                                </div>
                                <Badge className={getEngagementClass(getEngagementLevel(student))}>
                                  {getEngagementLevel(student)}
                                </Badge>
                              </div>
                              <div>
                                <div className="flex items-center justify-between text-sm">
                                  <span className="font-semibold">{student.overallProgress}%</span>
                                </div>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div>
                                      <Progress value={student.overallProgress} className="h-2" />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {student.completedSkills} of {student.enrolledSkills} skills completed
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(student.status)}>
                              {getStatusIcon(student.status)}
                              <span className="ml-1 capitalize">{student.status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {student.lastActive.toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="flex items-center gap-2">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Edit className="w-4 h-4 mr-2" />
                                      View Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <BookOpen className="w-4 h-4 mr-2" />
                                      Assign Skill
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Mail className="w-4 h-4 mr-2" />
                                      Send Message
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                                <Button
                                  variant="ghost"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  size="sm"
                                  onClick={() => { setStudentToRemove(student); setIsRemoveConfirmOpen(true); }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                      Page {currentPage} of {pageCount}
                    </div>
                    <div className="flex items-center gap-3">
                      <Select value={pageSize.toString()} onValueChange={(v) => { setPageSize(parseInt(v)); setCurrentPage(1); }}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Rows" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10 / page</SelectItem>
                          <SelectItem value="20">20 / page</SelectItem>
                          <SelectItem value="50">50 / page</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage <= 1}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      >
                        Prev
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage >= pageCount}
                        onClick={() => setCurrentPage(p => Math.min(pageCount, p + 1))}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Remove Student Confirm */}
              <Dialog open={isRemoveConfirmOpen} onOpenChange={setIsRemoveConfirmOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Remove Student</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Are you sure you want to remove {studentToRemove?.name}? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsRemoveConfirmOpen(false)}>Cancel</Button>
                      <Button
                        className="bg-red-600 text-white hover:bg-red-700"
                        onClick={() => {
                          if (studentToRemove) {
                            setStudents(prev => prev.filter(s => s.id !== studentToRemove.id));
                          }
                          setIsRemoveConfirmOpen(false);
                          setStudentToRemove(null);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Top Performers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                          <Skeleton key={i} className="h-12 w-full" />
                        ))}
                      </div>
                    ) : topPerformers.length === 0 ? (
                      <div className="text-sm text-muted-foreground">No top performers yet.</div>
                    ) : (
                      <div className="space-y-4">
                        {topPerformers.map((student: Student, index: number) => (
                          <div key={student.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium text-primary">
                                {index + 1}
                              </div>
                              <div>
                                <p className="font-medium">{student.name}</p>
                                <p className="text-sm text-muted-foreground">{student.careerChoice || student.batch}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant="secondary">{student.overallProgress}%</Badge>
                              <p className="text-xs text-muted-foreground mt-1">
                                {student.completedSkills} completed
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="glass-card border-amber-200/50 bg-amber-50/40 dark:bg-amber-950/10">
                  <CardHeader>
                    <CardTitle>Students Needing Attention</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                          <Skeleton key={i} className="h-12 w-full" />
                        ))}
                      </div>
                    ) : attention.length === 0 ? (
                      <div className="text-sm text-muted-foreground">No students need attention.</div>
                    ) : (
                      <div className="space-y-4">
                        {attention.map((student: Student) => {
                          const color = student.overallProgress < 20 ? 'text-red-600' : student.overallProgress < 50 ? 'text-amber-600' : 'text-green-600';
                          const statusLabel = student.status === 'inactive' ? 'Inactive' : (student.overallProgress < 30 ? 'Low Progress' : '');
                          return (
                            <div key={student.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <AlertTriangle className="w-5 h-5 text-amber-500" aria-hidden="true" />
                                <div>
                                  <p className="font-medium">{student.name}</p>
                                  <p className="text-sm text-muted-foreground">{student.careerChoice || student.batch}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge variant="outline" className={color}>
                                  {student.overallProgress}%
                                </Badge>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {statusLabel}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Career Choice Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {careerChoices.map((career) => {
                        const count = students.filter(s => s.careerChoice === career).length;
                        const percentage = totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0;
                        return (
                          <div key={career} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{career}</span>
                              <span>{count} ({percentage}%)</span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Engagement Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">
                        {students.length > 0 ? Math.round(students.reduce((sum, s) => sum + s.totalWatchTime, 0) / students.length) : 0}m
                      </p>
                      <p className="text-sm text-muted-foreground">Avg Watch Time</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {students.length > 0 ? Math.round(students.reduce((sum, s) => sum + s.quizzesCompleted, 0) / students.length) : 0}
                      </p>
                      <p className="text-sm text-muted-foreground">Avg Quizzes Completed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {students.length > 0 ? Math.round(students.reduce((sum, s) => sum + s.averageScore, 0) / students.length) : 0}%
                      </p>
                      <p className="text-sm text-muted-foreground">Avg Score</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {students
                        .slice()
                        .sort((a, b) => b.lastActive.getTime() - a.lastActive.getTime())
                        .slice(0, 5)
                        .map((student) => (
                          <div key={student.id} className="flex items-center gap-3 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <div className="flex-1">
                              <p className="font-medium">{student.name}</p>
                              <p className="text-muted-foreground">
                                Active {Math.floor((Date.now() - student.lastActive.getTime()) / (1000 * 60 * 60 * 24))} days ago
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}