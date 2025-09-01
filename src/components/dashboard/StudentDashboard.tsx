import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { GradientText } from '@/components/ui/gradient-text';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BookOpen, 
  Play, 
  Clock, 
  Trophy, 
  Target,
  ChevronRight,
  Calendar,
  Award,
  TrendingUp,
  Flame,
  Zap,
  Lightbulb
} from 'lucide-react';
import { RightProfilePanel } from './RightProfilePanel';
import { useUpcomingDeadlines } from '@/hooks/useUpcomingDeadlines';

export function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Dynamic welcome messages
  const welcomeMessages = [
    'Welcome back',
    "Let's start learning",
    'Keep up the momentum',
    'Ready to continue',
    'Time to learn',
    'Great to see you',
    "Let's grow together"
  ];

  // Set random welcome message on component mount
  useEffect(() => {
    const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    setWelcomeMessage(randomMessage);
  }, []); // Cache refresh trigger

  // Extract first name from user
  const firstName = user?.name?.split(' ')[0] || 'Student';

  // Three specialized KPI cards
  const kpiCards = [
    {
      id: 'consistency',
      title: 'Consistency Habit',
      value: "You're on a 5-day streak!",
      icon: Flame,
      bgGradient: 'from-orange-500/20 to-red-500/20',
      iconBg: 'from-orange-500/30 to-red-500/30',
      iconColor: 'text-orange-500',
      hasCTA: true,
      ctaText: 'View Full Report'
    },
    {
      id: 'motivation',
      title: 'Motivation & Engagement',
      value: '876 Points • Rank #3',
      icon: Zap,
      bgGradient: 'from-blue-500/20 to-purple-500/20',
      iconBg: 'from-blue-500/30 to-purple-500/30',
      iconColor: 'text-blue-500',
      hasCTA: false,
      ctaText: ''
    },
    {
      id: 'recommendations',
      title: 'Personalized Recommendations',
      value: '3 new courses recommended for you',
      icon: Lightbulb,
      bgGradient: 'from-green-500/20 to-emerald-500/20',
      iconBg: 'from-green-500/30 to-emerald-500/30',
      iconColor: 'text-green-500',
      hasCTA: true,
      ctaText: 'Explore Now'
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
    { title: 'First Course Complete', date: '2 days ago', icon: Trophy },
    { title: '7-Day Learning Streak', date: '1 week ago', icon: Target },
    { title: 'Quick Learner', date: '2 weeks ago', icon: TrendingUp }
  ];

  const { deadlines, hasDeadlines } = useUpcomingDeadlines();

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

  const handleKpiCTAClick = (cardId: string) => {
    setShowProfileModal(true);
    toast({
      title: cardId === 'consistency' ? 'Opening Consistency Report' : 'Exploring Recommendations',
      description: 'View your detailed progress information',
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            <GradientText>{welcomeMessage}</GradientText>, {firstName}! 👋
          </h1>
          <p className="text-muted-foreground mt-2">Continue your learning journey</p>
        </div>
        <Button 
          onClick={handleResumeLearning}
          className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-medium"
        >
          <Play className="w-4 h-4 mr-2" />
          Resume Learning
        </Button>
      </div>

      {/* Specialized KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpiCards.map((card) => (
          <Card 
            key={card.id}
            className={`glass-card p-6 hover:shadow-elevated transition-all duration-300 bg-gradient-to-br ${card.bgGradient} border-0`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.iconBg} flex items-center justify-center`}>
                <card.icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-lg">{card.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{card.value}</p>
              </div>
              
              {card.hasCTA && (
                <Button 
                  size="sm" 
                  onClick={() => handleKpiCTAClick(card.id)}
                  className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  {card.ctaText}
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

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
                    className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
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
              <Award className="w-5 h-5 mr-2 text-primary" />
              Recent Achievements
            </h3>
            <div className="space-y-3">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-white/30 backdrop-blur-sm">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/40 rounded-lg flex items-center justify-center">
                    <achievement.icon className="w-4 h-4 text-primary" />
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
                {deadlines.map((deadline) => (
                  <div key={deadline.id} className={`p-3 rounded-lg ${deadline.urgent ? 'bg-accent-warning/10 border border-accent-warning/20' : 'bg-white/30'} backdrop-blur-sm`}>
                    <p className="text-sm font-medium">{deadline.title}</p>
                    <p className="text-xs text-muted-foreground">{deadline.skillName} • {deadline.estimatedHours}h estimated</p>
                    <p className={`text-xs mt-1 ${deadline.urgent ? 'text-accent-warning font-medium' : 'text-muted-foreground'}`}>
                      Due {deadline.dueDate}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Profile Details Modal */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          <DialogTitle className="sr-only">Profile Details</DialogTitle>
          <RightProfilePanel />
        </DialogContent>
      </Dialog>
    </div>
  );
}
