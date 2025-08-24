import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
import { RightProfilePanel } from './RightProfilePanel';

export function StudentDashboard() {
  const stats = [
    { label: 'Courses in Progress', value: '4', icon: BookOpen },
    { label: 'Hours Learned', value: '47', icon: Clock },
    { label: 'Certificates Earned', value: '3', icon: Trophy },
    { label: 'Current Streak', value: '12 days', icon: Target }
  ];

  const courses = [
    { 
      title: 'Advanced React Development',
      instructor: 'Sarah Chen',
      progress: 68,
      nextLesson: 'State Management with Redux',
      timeLeft: '2h 15m',
      category: 'Development'
    },
    { 
      title: 'UI/UX Design Fundamentals',
      instructor: 'Mike Johnson', 
      progress: 45,
      nextLesson: 'Color Theory and Psychology',
      timeLeft: '1h 30m',
      category: 'Design'
    },
    { 
      title: 'Digital Marketing Strategy',
      instructor: 'Alex Rivera',
      progress: 82,
      nextLesson: 'Social Media Analytics',
      timeLeft: '45m',
      category: 'Marketing'
    }
  ];

  const achievements = [
    { title: 'First Course Complete', date: '2 days ago', icon: Trophy },
    { title: '7-Day Learning Streak', date: '1 week ago', icon: Target },
    { title: 'Quick Learner', date: '2 weeks ago', icon: TrendingUp }
  ];

  const upcomingDeadlines = [
    { title: 'React Project Submission', course: 'React Development', dueDate: 'Tomorrow', urgent: true },
    { title: 'Design Portfolio Review', course: 'UI/UX Fundamentals', dueDate: 'In 3 days', urgent: false },
    { title: 'Marketing Campaign Analysis', course: 'Digital Marketing', dueDate: 'Next week', urgent: false }
  ];

  return (
    <div className="flex gap-8">
      {/* Main Content */}
      <div className="flex-1 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient-luxury">Welcome back, John! 👋</h1>
            <p className="text-muted-foreground mt-2">Continue your learning journey</p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-accent-luxury shadow-medium">
            <Play className="w-4 h-4 mr-2" />
            Resume Learning
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="glass-card p-6 hover:shadow-elevated transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent-luxury/20 rounded-xl flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary" />
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
              <Card key={course.title} className="glass-card p-6 hover:shadow-elevated transition-all duration-300 cursor-pointer group">
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
                    <Button size="sm" className="bg-primary/10 text-primary hover:bg-primary hover:text-white">
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
            <Card className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-accent-warning" />
                Upcoming Deadlines
              </h3>
              <div className="space-y-3">
                {upcomingDeadlines.map((deadline, index) => (
                  <div key={index} className={`p-3 rounded-lg ${deadline.urgent ? 'bg-accent-warning/10 border border-accent-warning/20' : 'bg-white/20'} backdrop-blur-sm`}>
                    <p className="text-sm font-medium">{deadline.title}</p>
                    <p className="text-xs text-muted-foreground">{deadline.course}</p>
                    <p className={`text-xs mt-1 ${deadline.urgent ? 'text-accent-warning font-medium' : 'text-muted-foreground'}`}>
                      Due {deadline.dueDate}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Right Profile Panel */}
      <RightProfilePanel />
    </div>
  );
}
