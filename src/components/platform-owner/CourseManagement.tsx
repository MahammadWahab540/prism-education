import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Book, 
  Users, 
  Clock, 
  Brain, 
  FileText, 
  HelpCircle,
  Edit,
  Trash2,
  Sparkles,
  Play,
  Settings
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  enrolledStudents: number;
  stages: Stage[];
  status: 'draft' | 'published' | 'archived';
}

interface Stage {
  id: string;
  title: string;
  description: string;
  duration: string;
  videoUrl?: string;
  aiTutorGenerated: boolean;
  caseStudyGenerated: boolean;
  quizGenerated: boolean;
}

export function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      title: 'Quantum Computing Fundamentals',
      description: 'A comprehensive introduction to quantum computing concepts and applications.',
      category: 'Technology',
      difficulty: 'Beginner',
      estimatedHours: 20,
      enrolledStudents: 143,
      status: 'published',
      stages: [
        {
          id: 'stage-1',
          title: 'Introduction to Quantum Physics',
          description: 'Basic concepts of quantum mechanics',
          duration: '45 min',
          videoUrl: 'https://example.com/video1',
          aiTutorGenerated: true,
          caseStudyGenerated: true,
          quizGenerated: true
        },
        {
          id: 'stage-2',
          title: 'Qubits and Quantum States',
          description: 'Understanding quantum bits and superposition',
          duration: '60 min',
          aiTutorGenerated: false,
          caseStudyGenerated: false,
          quizGenerated: false
        }
      ]
    },
    {
      id: '2',
      title: 'Machine Learning Basics',
      description: 'Learn the fundamentals of machine learning and AI.',
      category: 'Technology',
      difficulty: 'Intermediate',
      estimatedHours: 30,
      enrolledStudents: 287,
      status: 'published',
      stages: []
    }
  ]);

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);
  const [isCreateStageOpen, setIsCreateStageOpen] = useState(false);
  const [newCourse, setNewCourse] = useState<{
    title: string;
    description: string;
    category: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    estimatedHours: number;
  }>({
    title: '',
    description: '',
    category: '',
    difficulty: 'Beginner',
    estimatedHours: 0
  });
  const [newStage, setNewStage] = useState({
    title: '',
    description: '',
    duration: '',
    videoUrl: ''
  });

  const handleCreateCourse = () => {
    const course: Course = {
      id: Date.now().toString(),
      ...newCourse,
      enrolledStudents: 0,
      stages: [],
      status: 'draft'
    };
    setCourses([...courses, course]);
    setIsCreateCourseOpen(false);
    setNewCourse({
      title: '',
      description: '',
      category: '',
      difficulty: 'Beginner',
      estimatedHours: 0
    });
  };

  const handleCreateStage = () => {
    if (!selectedCourse) return;
    
    const stage: Stage = {
      id: `stage-${Date.now()}`,
      ...newStage,
      aiTutorGenerated: false,
      caseStudyGenerated: false,
      quizGenerated: false
    };

    const updatedCourses = courses.map(course => 
      course.id === selectedCourse.id 
        ? { ...course, stages: [...course.stages, stage] }
        : course
    );
    
    setCourses(updatedCourses);
    setSelectedCourse({ ...selectedCourse, stages: [...selectedCourse.stages, stage] });
    setIsCreateStageOpen(false);
    setNewStage({
      title: '',
      description: '',
      duration: '',
      videoUrl: ''
    });
  };

  const generateAIContent = (courseId: string, stageId: string, contentType: 'tutor' | 'caseStudy' | 'quiz') => {
    const updatedCourses = courses.map(course => 
      course.id === courseId 
        ? {
            ...course,
            stages: course.stages.map(stage => 
              stage.id === stageId 
                ? {
                    ...stage,
                    [`${contentType === 'tutor' ? 'aiTutor' : contentType}Generated`]: true
                  }
                : stage
            )
          }
        : course
    );
    
    setCourses(updatedCourses);
    if (selectedCourse?.id === courseId) {
      setSelectedCourse(updatedCourses.find(c => c.id === courseId)!);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient-luxury">Course Management</h1>
          <p className="text-muted-foreground mt-2">Create and manage learning experiences</p>
        </div>
        <Dialog open={isCreateCourseOpen} onOpenChange={setIsCreateCourseOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-accent-luxury shadow-medium">
              <Plus className="w-4 h-4 mr-2" />
              Create Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Course</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Course Title"
                value={newCourse.title}
                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
              />
              <Textarea
                placeholder="Course Description"
                value={newCourse.description}
                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Category"
                  value={newCourse.category}
                  onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                />
                <Select
                  value={newCourse.difficulty}
                  onValueChange={(value) => 
                    setNewCourse({ ...newCourse, difficulty: value as 'Beginner' | 'Intermediate' | 'Advanced' })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input
                type="number"
                placeholder="Estimated Hours"
                value={newCourse.estimatedHours || ''}
                onChange={(e) => setNewCourse({ ...newCourse, estimatedHours: parseInt(e.target.value) || 0 })}
              />
              <Button onClick={handleCreateCourse} className="w-full">
                Create Course
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList>
          <TabsTrigger value="courses">All Courses</TabsTrigger>
          <TabsTrigger value="stages">Course Builder</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="glass-card p-6 hover:shadow-lg transition-all">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold line-clamp-2">{course.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{course.category}</p>
                    </div>
                    <Badge variant={course.status === 'published' ? 'default' : 'secondary'}>
                      {course.status}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-3">{course.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.estimatedHours}h
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {course.enrolledStudents}
                    </div>
                    <Badge variant="outline">
                      {course.difficulty}
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSelectedCourse(course)}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stages" className="space-y-6">
          {selectedCourse ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedCourse.title}</h2>
                  <p className="text-muted-foreground">{selectedCourse.stages.length} stages</p>
                </div>
                <Dialog open={isCreateStageOpen} onOpenChange={setIsCreateStageOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Stage
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Stage</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="Stage Title"
                        value={newStage.title}
                        onChange={(e) => setNewStage({ ...newStage, title: e.target.value })}
                      />
                      <Textarea
                        placeholder="Stage Description"
                        value={newStage.description}
                        onChange={(e) => setNewStage({ ...newStage, description: e.target.value })}
                      />
                      <Input
                        placeholder="Duration (e.g., 45 min)"
                        value={newStage.duration}
                        onChange={(e) => setNewStage({ ...newStage, duration: e.target.value })}
                      />
                      <Input
                        placeholder="Video URL (optional)"
                        value={newStage.videoUrl}
                        onChange={(e) => setNewStage({ ...newStage, videoUrl: e.target.value })}
                      />
                      <Button onClick={handleCreateStage} className="w-full">
                        Add Stage
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {selectedCourse.stages.map((stage, index) => (
                  <Card key={stage.id} className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <h3 className="text-lg font-semibold">{stage.title}</h3>
                            <Badge variant="outline">{stage.duration}</Badge>
                          </div>
                          <p className="text-muted-foreground ml-11">{stage.description}</p>
                          {stage.videoUrl && (
                            <div className="flex items-center gap-2 ml-11 mt-2 text-sm text-muted-foreground">
                              <Play className="w-4 h-4" />
                              Video URL: {stage.videoUrl}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="ml-11 space-y-3">
                        <h4 className="font-medium text-sm text-muted-foreground">AI-Generated Content</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Brain className="w-4 h-4" />
                              <span className="text-sm">AI Tutor</span>
                            </div>
                            {stage.aiTutorGenerated ? (
                              <Badge variant="default">Generated</Badge>
                            ) : (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => generateAIContent(selectedCourse.id, stage.id, 'tutor')}
                              >
                                <Sparkles className="w-3 h-3 mr-1" />
                                Generate
                              </Button>
                            )}
                          </div>

                          <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              <span className="text-sm">Case Study</span>
                            </div>
                            {stage.caseStudyGenerated ? (
                              <Badge variant="default">Generated</Badge>
                            ) : (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => generateAIContent(selectedCourse.id, stage.id, 'caseStudy')}
                              >
                                <Sparkles className="w-3 h-3 mr-1" />
                                Generate
                              </Button>
                            )}
                          </div>

                          <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <HelpCircle className="w-4 h-4" />
                              <span className="text-sm">Quiz</span>
                            </div>
                            {stage.quizGenerated ? (
                              <Badge variant="default">Generated</Badge>
                            ) : (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => generateAIContent(selectedCourse.id, stage.id, 'quiz')}
                              >
                                <Sparkles className="w-3 h-3 mr-1" />
                                Generate
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                {selectedCourse.stages.length === 0 && (
                  <Card className="p-12 text-center">
                    <Book className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No stages yet</h3>
                    <p className="text-muted-foreground mb-4">Start building your course by adding the first stage.</p>
                    <Button onClick={() => setIsCreateStageOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Stage
                    </Button>
                  </Card>
                )}
              </div>
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Book className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Select a course to edit</h3>
              <p className="text-muted-foreground">Choose a course from the "All Courses" tab to start building stages.</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}