import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { GradientText } from '@/components/ui/gradient-text';
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
  Lightbulb,
  Snowflake,
  Timer
} from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { RightProfilePanel } from './RightProfilePanel';
import { useUpcomingDeadlines } from '@/hooks/useUpcomingDeadlines';

export function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  
  // Streak status logic
  const [currentStreak] = useState(5); // Mock data - can be updated from API
  const getStreakStatus = (streak: number) => {
    if (streak >= 7) return { status: 'fire', icon: Flame, color: 'text-orange-500', bgColor: 'bg-orange-500/10' };
    if (streak >= 3) return { status: 'warm', icon: Flame, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' };
    return { status: 'cold', icon: Snowflake, color: 'text-blue-400', bgColor: 'bg-blue-400/10' };
  };
  
  const streakStatus = getStreakStatus(currentStreak);

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
      title: 'Learning Streak',
      subtitle: 'Keep the momentum going!',
      mainValue: `${currentStreak}`,
      mainLabel: currentStreak === 1 ? 'day' : 'days',
      additionalInfo: 'This week: 5 days',
      xpInfo: '0 XP earned',
      icon: streakStatus.icon,
      iconColor: streakStatus.color,
      bgColor: streakStatus.bgColor,
      hasCTA: true,
      ctaText: 'View Details'
    },
    {
      id: 'motivation',
      title: 'Ready for a challenge?',
      subtitle: "You've mastered the basics. Time to tackle some advanced concepts!",
      mainValue: '',
      mainLabel: '',
      additionalInfo: '',
      xpInfo: '',
      icon: Target,
      iconColor: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      hasCTA: true,
      ctaText: 'Take Challenge'
    },
    {
      id: 'recommendations',
      title: 'Perfect timing for SQL Joins!',
      subtitle: "Based on your progress in filtering, you're ready for the next step",
      mainValue: '',
      mainLabel: '',
      additionalInfo: '15 min',
      xpInfo: 'Video + Practice',
      matchPercentage: '92% match',
      difficulty: 'Intermediate',
      icon: Play,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      hasCTA: true,
      ctaText: 'Start Now',
      secondaryCTA: 'Save for Later'
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

  const handleKpiCTAClick = (cardId: string, isSecondary = false) => {
    if (cardId === 'consistency') {
      setShowProfileDrawer(true);
      toast({
        title: 'Opening Learning Details',
        description: 'View your detailed progress information',
      });
    } else if (cardId === 'recommendations' && isSecondary) {
      toast({
        title: 'Saved for Later',
        description: 'Course added to your saved list',
      });
    } else {
      toast({
        title: cardId === 'motivation' ? 'Starting Challenge' : 'Starting Course',
        description: 'Launching your next learning experience',
      });
    }
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
            className="bg-card border border-border/50 p-6 hover:shadow-md transition-all duration-300 rounded-xl"
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-full ${card.bgColor} flex items-center justify-center flex-shrink-0`}>
                <card.icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
              
              <div className="flex-1 space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-base">{card.title}</h3>
                    {card.matchPercentage && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                        {card.matchPercentage}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{card.subtitle}</p>
                </div>
                
                {card.mainValue && (
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">{card.mainValue}</span>
                    <span className="text-sm text-muted-foreground">{card.mainLabel}</span>
                  </div>
                )}
                
                {(card.additionalInfo || card.xpInfo) && (
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {card.additionalInfo && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {card.additionalInfo}
                      </div>
                    )}
                    {card.xpInfo && (
                      <div className="flex items-center gap-1">
                        {card.id === 'consistency' ? <Trophy className="w-4 h-4" /> : <Timer className="w-4 h-4" />}
                        {card.xpInfo}
                      </div>
                    )}
                    {card.difficulty && (
                      <Badge variant="outline" className="text-xs">
                        {card.difficulty}
                      </Badge>
                    )}
                  </div>
                )}
                
                <div className="flex gap-2">
                  {card.hasCTA && (
                    <Button 
                      size="sm" 
                      onClick={() => handleKpiCTAClick(card.id)}
                      className={card.id === 'recommendations' ? "bg-blue-500 hover:bg-blue-600" : ""}
                    >
                      {card.ctaText}
                    </Button>
                  )}
                  {card.secondaryCTA && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleKpiCTAClick(card.id, true)}
                    >
                      {card.secondaryCTA}
                    </Button>
                  )}
                </div>
              </div>
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

      {/* Profile Details Drawer */}
      <Drawer open={showProfileDrawer} onOpenChange={setShowProfileDrawer}>
        <DrawerContent className="h-[85vh]">
          <DrawerHeader>
            <DrawerTitle>Learning Progress Details</DrawerTitle>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <RightProfilePanel />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
