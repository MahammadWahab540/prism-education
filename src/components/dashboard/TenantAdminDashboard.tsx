import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AnimatedKpiCard } from '@/components/ui/animated-kpi-card';
import { 
  BookOpen, 
  Users, 
  Trophy, 
  TrendingUp,
  Plus,
  Play,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export function TenantAdminDashboard() {
  const stats = [
    { 
      label: 'Active Courses', 
      value: '12', 
      icon: BookOpen, 
      change: '+2 this month',
      animationType: 'progress' as const
    },
    { 
      label: 'Enrolled Students', 
      value: '486', 
      icon: Users, 
      change: '+24 this week',
      animationType: 'wave' as const
    },
    { 
      label: 'Completed Courses', 
      value: '89', 
      icon: Trophy, 
      change: '+15 this month',
      animationType: 'geometric' as const
    },
    { 
      label: 'Avg. Completion Rate', 
      value: '78%', 
      icon: TrendingUp, 
      change: '+5% vs last month',
      animationType: 'pulse' as const
    }
  ];

  const courses = [
    { 
      title: 'Advanced React Development', 
      students: 45, 
      completion: 82, 
      status: 'active',
      instructor: 'Sarah Chen'
    },
    { 
      title: 'UI/UX Design Fundamentals', 
      students: 67, 
      completion: 74, 
      status: 'active',
      instructor: 'Mike Johnson'
    },
    { 
      title: 'Python for Data Science', 
      students: 34, 
      completion: 91, 
      status: 'draft',
      instructor: 'Dr. Lisa Park'
    },
    { 
      title: 'Digital Marketing Strategy', 
      students: 52, 
      completion: 68, 
      status: 'active',
      instructor: 'Alex Rivera'
    }
  ];

  const recentActivity = [
    { action: 'New student enrolled', course: 'React Development', time: '2 minutes ago' },
    { action: 'Assignment submitted', course: 'UI/UX Fundamentals', time: '15 minutes ago' },
    { action: 'Course completed', course: 'Python Data Science', time: '1 hour ago' },
    { action: 'Quiz passed', course: 'Digital Marketing', time: '2 hours ago' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient-luxury">TechCorp University</h1>
          <p className="text-muted-foreground mt-2">Manage your courses and student progress</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <Users className="w-4 h-4 mr-2" />
            Manage Students
          </Button>
          <Button className="bg-gradient-to-r from-primary to-accent-luxury shadow-medium">
            <Plus className="w-4 h-4 mr-2" />
            New Course
          </Button>
        </div>
      </div>

      {/* Animated Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <AnimatedKpiCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            animationType={stat.animationType}
          />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Course Management */}
        <Card className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Course Management</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course.title} className="p-4 rounded-lg bg-white/30 backdrop-blur-sm hover:bg-white/40 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium">{course.title}</h4>
                    <p className="text-sm text-muted-foreground">by {course.instructor}</p>
                  </div>
                  <Badge variant={course.status === 'active' ? 'default' : 'secondary'}>
                    {course.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {course.students}
                    </span>
                    <span className="flex items-center">
                      <Trophy className="w-4 h-4 mr-1" />
                      {course.completion}%
                    </span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-accent-success h-2 rounded-full" 
                      style={{width: `${course.completion}%`}}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Recent Activity</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/20 transition-all">
                <div className="w-8 h-8 bg-gradient-to-br from-primary/30 to-accent-luxury/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  {activity.action.includes('enrolled') && <Users className="w-4 h-4 text-primary" />}
                  {activity.action.includes('submitted') && <Clock className="w-4 h-4 text-primary" />}
                  {activity.action.includes('completed') && <CheckCircle className="w-4 h-4 text-primary" />}
                  {activity.action.includes('passed') && <Trophy className="w-4 h-4 text-primary" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.course}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
