import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { GradientText } from '@/components/ui/gradient-text';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
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
  Timer,
  Heart,
  Sparkles
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
  const [currentNudgeIndex, setCurrentNudgeIndex] = useState(0);
  
  // Streak status logic
  const [currentStreak] = useState(5); // Mock data - can be updated from API
  const [totalXP] = useState(1250); // Mock XP data
  const [weeklyDays] = useState(5); // Days learned this week
  
  const getStreakStatus = (streak: number) => {
    if (streak >= 7) return { status: 'fire', icon: Flame, color: 'text-orange-500', bgColor: 'bg-orange-500/10' };
    if (streak >= 3) return { status: 'warm', icon: Flame, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' };
    return { status: 'cold', icon: Snowflake, color: 'text-blue-400', bgColor: 'bg-blue-400/10' };
  };
  
  const streakStatus = getStreakStatus(currentStreak);
  
  // Emotional nudge messages that rotate every 5 seconds
  const emotionalNudges = [
    {
      message: "Great progress today!",
      subtitle: "You're building amazing learning habits",
      icon: Heart,
      gradient: "from-pink-500 to-rose-500",
      bgGradient: "from-pink-500/20 to-rose-500/20",
      action: "Continue Learning"
    },
    {
      message: "Ready for a challenge?",
      subtitle: "Push your limits and unlock new skills",
      icon: Zap,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/20 to-cyan-500/20",
      action: "Take Challenge"
    },
    {
      message: "You're on fire!",
      subtitle: "Your consistency is paying off",
      icon: Target,
      gradient: "from-orange-500 to-yellow-500",
      bgGradient: "from-orange-500/20 to-yellow-500/20",
      action: "Keep Going"
    },
    {
      message: "Almost there!",
      subtitle: "Just one more lesson to complete your goal",
      icon: Sparkles,
      gradient: "from-purple-500 to-indigo-500",
      bgGradient: "from-purple-500/20 to-indigo-500/20",
      action: "Finish Strong"
    }
  ];

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
  
  // Rotate emotional nudges every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNudgeIndex((prev) => (prev + 1) % emotionalNudges.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [emotionalNudges.length]);

  // Extract first name from user
  const firstName = user?.name?.split(' ')[0] || 'Student';

  const currentNudge = emotionalNudges[currentNudgeIndex];

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

      {/* Intelligent KPI Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* StreakTracker Card */}
        <Card className="glass-card p-6 hover:shadow-elevated transition-all duration-300 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-0">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/30 to-red-500/30 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Flame className="w-6 h-6 text-orange-500" />
              </motion.div>
            </div>
            <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">
              🔥 StreakTracker
            </Badge>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Learning Streak</h3>
              <div className="flex items-baseline gap-2 mb-3">
                <GradientText className="text-4xl font-bold">{currentStreak}</GradientText>
                <span className="text-sm text-muted-foreground">{currentStreak === 1 ? 'day' : 'days'}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                This week: {weeklyDays} days
              </div>
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4" />
                {totalXP} XP earned
              </div>
            </div>
            
            <Button 
              size="sm" 
              onClick={() => handleKpiCTAClick('consistency')}
              className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
            >
              View Details
            </Button>
          </div>
        </Card>

        {/* EmotionalNudge Card */}
        <Card className={`glass-card p-6 hover:shadow-elevated transition-all duration-300 bg-gradient-to-br ${currentNudge.bgGradient} border-0`}>
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${currentNudge.gradient.replace('from-', 'from-').replace('to-', 'to-')}/30 flex items-center justify-center`}>
              <motion.div
                key={currentNudgeIndex}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
              >
                <currentNudge.icon className={`w-6 h-6 bg-gradient-to-r ${currentNudge.gradient} bg-clip-text text-transparent`} />
              </motion.div>
            </div>
            <Badge variant="secondary" className="bg-pink-100 text-pink-700 text-xs">
              💝 EmotionalNudge
            </Badge>
          </div>
          
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentNudgeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                <h3 className="font-semibold text-lg">{currentNudge.message}</h3>
                <p className="text-sm text-muted-foreground">{currentNudge.subtitle}</p>
              </motion.div>
            </AnimatePresence>
            
            <div className="flex justify-center gap-2 py-2">
              {emotionalNudges.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentNudgeIndex ? 'bg-primary scale-125' : 'bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
            
            <Button 
              size="sm" 
              onClick={() => handleKpiCTAClick('motivation')}
              className={`w-full bg-gradient-to-r ${currentNudge.gradient} text-white hover:opacity-90 transition-opacity`}
            >
              {currentNudge.action}
            </Button>
          </div>
        </Card>

        {/* SmartSuggestion Card */}
        <Card className="glass-card p-6 hover:shadow-elevated transition-all duration-300 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-0">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/30 to-indigo-500/30 flex items-center justify-center">
              <motion.div
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <TrendingUp className="w-6 h-6 text-blue-500" />
              </motion.div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                🎯 SmartSuggestion
              </Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                92% match
              </Badge>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Perfect timing for SQL Joins!</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Based on your progress in filtering, you're ready for the next step
              </p>
            </div>
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Timer className="w-4 h-4" />
                15 min
              </div>
              <div className="flex items-center gap-1">
                <Play className="w-4 h-4" />
                Video + Practice
              </div>
              <Badge variant="outline" className="text-xs">
                Intermediate
              </Badge>
            </div>
            
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={() => handleKpiCTAClick('recommendations')}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
              >
                Start Now
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleKpiCTAClick('recommendations', true)}
                className="flex-1"
              >
                Save for Later
              </Button>
            </div>
          </div>
        </Card>
        
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
