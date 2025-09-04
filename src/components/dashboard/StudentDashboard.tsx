import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { GradientText } from '@/components/ui/gradient-text';
import { AnimatedKpiCard } from '@/components/ui/animated-kpi-card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { 
  BookOpen, 
  Play,
  Clock, 
  Trophy, 
  Target,
  ChevronRight,
  Calendar,
  Award,
  TrendingUp
} from 'lucide-react';
import { useProfilePanel } from '@/contexts/ProfilePanelContext';
import { useUpcomingDeadlines } from '@/hooks/useUpcomingDeadlines';

export function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { openPanel } = useProfilePanel();
  const [showWelcome, setShowWelcome] = useState(false);
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  useEffect(() => {
    if (user) {
      const key = `welcome_shown_${user.id}`;
      const hasSeen = localStorage.getItem(key);
      if (!hasSeen) {
        setShowWelcome(true);
      }
    }
  }, [user]);

  const stats = [
    { 
      label: 'Skills in Progress', 
      value: '4', 
      icon: BookOpen,
      animationType: 'progress' as const
    },
    { 
      label: 'Hours Learned', 
      value: '47', 
      icon: Clock,
      animationType: 'wave' as const
    },
    { 
      label: 'Current Streak', 
      value: '12 days', 
      icon: Target,
      animationType: 'pulse' as const
    }
  ];

  const courses = [
    { 
      id: 'react-dev',
      title: 'Advanced React Development',
      instructor: 'Sarah Chen',
      progress: 68,
      nextLesson: 'State Management with Redux',
      timeLeft: '2h 15m',
      category: 'Development',
      skillId: 'react',
      stageId: 'advanced'
    },
    { 
      id: 'uiux-design',
      title: 'UI/UX Design Fundamentals',
      instructor: 'Mike Johnson', 
      progress: 45,
      nextLesson: 'Color Theory and Psychology',
      timeLeft: '1h 30m',
      category: 'Design',
      skillId: 'design',
      stageId: 'fundamentals'
    },
    { 
      id: 'digital-marketing',
      title: 'Digital Marketing Strategy',
      instructor: 'Alex Rivera',
      progress: 82,
      nextLesson: 'Social Media Analytics',
      timeLeft: '45m',
      category: 'Marketing',
      skillId: 'marketing',
      stageId: 'strategy'
    }
  ];

  const achievements = [
    { title: 'First Skill Complete', date: '2 days ago', icon: Trophy },
    { title: '7-Day Learning Streak', date: '1 week ago', icon: Target },
    { title: 'Quick Learner', date: '2 weeks ago', icon: TrendingUp }
  ];

  const { deadlines, hasDeadlines } = useUpcomingDeadlines();

  // Normalize upcomingDeadlines for rendering
  const upcomingDeadlines = deadlines ?? [];

  const handleResumeLearning = () => {
    const lastCourse = courses.find(course => course.progress > 0);
    if (lastCourse) {
      navigate(`/learn/${lastCourse.skillId}/${lastCourse.stageId}`);
    } else {
      navigate('/my-skills');
    }
    toast({
      title: "Resuming Learning",
      description: "Continuing your learning journey...",
    });
  };

  const handleCourseClick = (course: typeof courses[0]) => {
    navigate(`/learn/${course.skillId}/${course.stageId}`);
    toast({
      title: `Opening ${course.title}`,
      description: `Starting: ${course.nextLesson}`,
    });
  };

  const handlePlayLesson = (course: typeof courses[0], e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/learn/${course.skillId}/${course.stageId}`);
    toast({
      title: "Starting Lesson",
      description: course.nextLesson,
    });
  };

  return (
    <>
      <Dialog
        open={showWelcome}
        onOpenChange={(open) => {
          setShowWelcome(open);
          if (!open && user) {
            localStorage.setItem(`welcome_shown_${user.id}`, 'true');
          }
        }}
      >
        <DialogContent className="max-w-md text-center">
          <DialogHeader>
            <DialogTitle>Welcome</DialogTitle>
            <DialogDescription>
              Welcome, we are with you to grow.
            </DialogDescription>
          </DialogHeader>
          <Button className="mt-4 w-full" onClick={() => setShowWelcome(false)}>
            Get Started
          </Button>
        </DialogContent>
      </Dialog>

      <div className="flex gap-8">
        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                <GradientText>Welcome back</GradientText>, {firstName}! 👋
              </h1>
              <p className="text-muted-foreground mt-2">Continue your learning journey</p>
            </div>
            <Button
              onClick={handleResumeLearning}
              className="bg-gradient-to-r from-primary to-accent-luxury shadow-medium"
            >
              <Play className="w-4 h-4 mr-2" />
              Resume Learning
            </Button>
          </div>

          {/* Animated Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">{
            stats.map((stat) => (
              <AnimatedKpiCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                icon={stat.icon}
                animationType={stat.animationType}
                onOpenProfile={() => openPanel(stat.label === 'Hours Learned' ? 'learningHistory' : 'overview')}
              />
            ))
          }</div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Continue Learning */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-xl font-semibold">Continue Learning</h3>
              {courses.map((course) => (
                <Card
                  key={course.title}
                  onClick={() => handleCourseClick(course)}
                  className="glass-card p-6 hover:shadow-elevated transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="secondary" className="text-xs">{course.category}</Badge>
                      </div>
                      <h4 className="font-semibold text-lg">{course.title}</h4>
                      <p className="text-sm text-muted-foreground">by {course.instructor}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />

                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <p className="text-sm font-medium">Next: {course.nextLesson}</p>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                          <Clock className="w-3 h-3 mr-1" />
                          {course.timeLeft}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={(e) => handlePlayLesson(course, e)}
                        className="bg-primary/10 text-primary hover:bg-primary hover:text-white"
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Achievements */}
              <Card className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-accent-luxury" />
                  Recent Achievements
                </h3>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-white/20 backdrop-blur-sm">
                      <div className="w-8 h-8 bg-gradient-to-br from-accent-luxury/30 to-primary/30 rounded-lg flex items-center justify-center">
                        <achievement.icon className="w-4 h-4 text-accent-luxury" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{achievement.title}</p>
                        <p className="text-xs text-muted-foreground">{achievement.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Upcoming Deadlines */}
              {hasDeadlines && (
                <Card className="glass-card p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-accent-warning" />
                    Upcoming Deadlines
                  </h3>
                  <div className="space-y-3">
                    {upcomingDeadlines.map((deadline, index) => (
                      <div key={index} className={`p-3 rounded-lg ${deadline.urgent ? 'bg-accent-warning/10 border border-accent-warning/20' : 'bg-white/20'} backdrop-blur-sm`}>
                        <p className="text-sm font-medium">{deadline.title}</p>
                        <p className="text-xs text-muted-foreground">{deadline.skillName}</p>
                        <p className={`text-xs mt-1 ${deadline.urgent ? 'text-accent-warning font-medium' : 'text-muted-foreground'}`}>
                          Due {deadline.dueDate ?? `${deadline.estimatedHours}h estimated`}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Profile panel now opens as overlay drawer */}
      </div>
    </>
  );
}
