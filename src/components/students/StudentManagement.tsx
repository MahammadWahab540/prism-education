import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TubelightNavbar } from '@/components/ui/tubelight-navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
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
  Filter,
  Search,
  Award,
  Clock,
  Target,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Upload,
  FileText,
  Briefcase,
  Building2,
  Shield
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';

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
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [graduationYearFilter, setGraduationYearFilter] = useState('all');
  const [careerChoiceFilter, setCareerChoiceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState('students');
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    graduationYear: new Date().getFullYear(),
    batch: ''
  });

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
      const headers = lines[0].split(',');
      
      const newStudents = lines.slice(1).filter(line => line.trim()).map((line, index) => {
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
        };
      });
      
      setStudents([...students, ...newStudents]);
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

  const formatWatchTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
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

  const totalStudents = tenantFilteredStudents.length;
  const activeStudents = tenantFilteredStudents.filter(s => s.status === 'active').length;
  const avgProgress = totalStudents > 0 ? Math.round(tenantFilteredStudents.reduce((sum, s) => sum + s.overallProgress, 0) / totalStudents) : 0;
  const totalCompletions = tenantFilteredStudents.reduce((sum, s) => sum + s.completedSkills, 0);

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
          {!isPlatformOwner && (
            <>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
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
          {isPlatformOwner && (
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
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
                <Select value={selectedTenant} onValueChange={setSelectedTenant}>
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
              {isPlatformOwner && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>Read-only access</span>
                </div>
              )}
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
                <p className="text-2xl font-bold">{totalStudents}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +5 this month
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
                <p className="text-2xl font-bold">{activeStudents}</p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <Target className="w-3 h-3 mr-1" />
                  {Math.round((activeStudents / totalStudents) * 100)}% active
                </p>
              </div>
              <GraduationCap className="w-8 h-8 text-blue-500 opacity-60" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Progress</p>
                <p className="text-2xl font-bold">{avgProgress}%</p>
                <p className="text-xs text-purple-600 flex items-center mt-1">
                  <BookOpen className="w-3 h-3 mr-1" />
                  Across all courses
                </p>
              </div>
              <Target className="w-8 h-8 text-purple-500 opacity-60" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completions</p>
                <p className="text-2xl font-bold">{totalCompletions}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <Award className="w-3 h-3 mr-1" />
                  Total completed
                </p>
              </div>
              <Award className="w-8 h-8 text-green-500 opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <TubelightNavbar 
        items={[
          {
            name: "Students",
            icon: Users,
            onClick: () => setActiveTab('students')
          },
          {
            name: "Progress",
            icon: Target,
            onClick: () => setActiveTab('progress')
          },
          {
            name: "Analytics",
            icon: TrendingUp,
            onClick: () => setActiveTab('analytics')
          }
        ]}
        activeItem={activeTab}
        className="relative top-0 mb-8"
      />

      <Tabs defaultValue={activeTab} value={activeTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="students">All Students</TabsTrigger>
          <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
        </TabsList>

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
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={graduationYearFilter} onValueChange={setGraduationYearFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Graduation Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {graduationYears.map(year => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={careerChoiceFilter} onValueChange={setCareerChoiceFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Career Choice" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Careers</SelectItem>
                    {careerChoices.map(career => (
                      <SelectItem key={career} value={career}>{career}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
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
                    <TableHead className="w-12">
                      <Checkbox />
                    </TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Batch/Year</TableHead>
                    <TableHead>Career Choice</TableHead>
                    <TableHead>Current Skill</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-muted-foreground">{student.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{student.batch}</div>
                          <div className="text-muted-foreground">{student.graduationYear}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          <Briefcase className="w-3 h-3 mr-1" />
                          {student.careerChoice || 'Not selected'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {student.currentSkill || 'No active skill'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{student.completedSkills}/{student.enrolledSkills}</span>
                            <span>{student.overallProgress}%</span>
                          </div>
                          <Progress value={student.overallProgress} className="h-2" />
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
                          <div>{student.averageScore}% avg</div>
                          <div className="text-muted-foreground">{formatWatchTime(student.totalWatchTime)}</div>
                        </div>
                      </TableCell>
                      <TableCell>
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
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove Student
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students
                    .sort((a, b) => b.overallProgress - a.overallProgress)
                    .slice(0, 5)
                    .map((student, index) => (
                      <div key={student.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
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
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Students Needing Attention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students
                    .filter(s => s.overallProgress < 30 || s.status === 'inactive')
                    .slice(0, 5)
                    .map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="w-5 h-5 text-yellow-500" />
                           <div>
                             <p className="font-medium">{student.name}</p>
                             <p className="text-sm text-muted-foreground">{student.careerChoice || student.batch}</p>
                           </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="text-yellow-600">
                            {student.overallProgress}%
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {student.status === 'inactive' ? 'Inactive' : 'Low progress'}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
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
                     const percentage = Math.round((count / totalStudents) * 100);
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
                    {Math.round(students.reduce((sum, s) => sum + s.totalWatchTime, 0) / students.length)}m
                  </p>
                  <p className="text-sm text-muted-foreground">Avg Watch Time</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round(students.reduce((sum, s) => sum + s.quizzesCompleted, 0) / students.length)}
                  </p>
                  <p className="text-sm text-muted-foreground">Avg Quizzes Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.round(students.reduce((sum, s) => sum + s.averageScore, 0) / students.length)}%
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