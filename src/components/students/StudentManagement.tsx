import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
  AlertTriangle
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';

interface Student {
  id: string;
  name: string;
  email: string;
  department: string;
  enrolledCourses: number;
  completedCourses: number;
  overallProgress: number;
  lastActive: Date;
  enrollmentDate: Date;
  status: 'active' | 'inactive' | 'suspended';
  currentSkill?: string;
  totalWatchTime: number;
  quizzesCompleted: number;
  averageScore: number;
}

export function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice.johnson@techcorp.com',
      department: 'Engineering',
      enrolledCourses: 5,
      completedCourses: 3,
      overallProgress: 78,
      lastActive: new Date('2024-08-26'),
      enrollmentDate: new Date('2024-01-15'),
      status: 'active',
      currentSkill: 'Machine Learning Basics',
      totalWatchTime: 1250,
      quizzesCompleted: 12,
      averageScore: 85
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob.smith@techcorp.com',
      department: 'Marketing',
      enrolledCourses: 3,
      completedCourses: 1,
      overallProgress: 45,
      lastActive: new Date('2024-08-25'),
      enrollmentDate: new Date('2024-02-01'),
      status: 'active',
      currentSkill: 'Data Analysis',
      totalWatchTime: 680,
      quizzesCompleted: 6,
      averageScore: 72
    },
    {
      id: '3',
      name: 'Carol Williams',
      email: 'carol.williams@techcorp.com',
      department: 'HR',
      enrolledCourses: 4,
      completedCourses: 4,
      overallProgress: 100,
      lastActive: new Date('2024-08-24'),
      enrollmentDate: new Date('2024-01-10'),
      status: 'active',
      currentSkill: 'Leadership Skills',
      totalWatchTime: 2100,
      quizzesCompleted: 18,
      averageScore: 92
    },
    {
      id: '4',
      name: 'David Brown',
      email: 'david.brown@techcorp.com',
      department: 'Engineering',
      enrolledCourses: 2,
      completedCourses: 0,
      overallProgress: 15,
      lastActive: new Date('2024-08-15'),
      enrollmentDate: new Date('2024-08-01'),
      status: 'inactive',
      currentSkill: 'Python Programming',
      totalWatchTime: 120,
      quizzesCompleted: 1,
      averageScore: 65
    },
    {
      id: '5',
      name: 'Emma Davis',
      email: 'emma.davis@techcorp.com',
      department: 'Finance',
      enrolledCourses: 6,
      completedCourses: 2,
      overallProgress: 62,
      lastActive: new Date('2024-08-26'),
      enrollmentDate: new Date('2024-01-20'),
      status: 'active',
      currentSkill: 'Financial Analytics',
      totalWatchTime: 940,
      quizzesCompleted: 9,
      averageScore: 88
    }
  ]);

  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    department: ''
  });

  const handleAddStudent = () => {
    const student: Student = {
      id: Date.now().toString(),
      ...newStudent,
      enrolledCourses: 0,
      completedCourses: 0,
      overallProgress: 0,
      lastActive: new Date(),
      enrollmentDate: new Date(),
      status: 'active',
      totalWatchTime: 0,
      quizzesCompleted: 0,
      averageScore: 0
    };
    setStudents([...students, student]);
    setIsAddStudentOpen(false);
    setNewStudent({
      name: '',
      email: '',
      department: ''
    });
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

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || student.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'active').length;
  const avgProgress = Math.round(students.reduce((sum, s) => sum + s.overallProgress, 0) / students.length);
  const totalCompletions = students.reduce((sum, s) => sum + s.completedCourses, 0);

  const departments = [...new Set(students.map(s => s.department))];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient-luxury">Student Management</h1>
          <p className="text-muted-foreground mt-2">Manage learners and track their progress</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
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
                <Select
                  value={newStudent.department}
                  onValueChange={(value) => setNewStudent({ ...newStudent, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="HR">Human Resources</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleAddStudent} className="w-full">
                  Add Student
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

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

      <Tabs defaultValue="students" className="space-y-6">
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
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
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
                    <TableHead>Department</TableHead>
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
                        <Badge variant="outline">{student.department}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {student.currentSkill || 'No active skill'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{student.completedCourses}/{student.enrolledCourses}</span>
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
                              Assign Course
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
                            <p className="text-sm text-muted-foreground">{student.department}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary">{student.overallProgress}%</Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {student.completedCourses} completed
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
                            <p className="text-sm text-muted-foreground">{student.department}</p>
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
                <CardTitle>Department Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {departments.map((dept) => {
                    const count = students.filter(s => s.department === dept).length;
                    const percentage = Math.round((count / totalStudents) * 100);
                    return (
                      <div key={dept} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{dept}</span>
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
    </div>
  );
}