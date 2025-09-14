import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AnimatedKpiCard } from '@/components/ui/animated-kpi-card';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Users, 
  Trophy, 
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useProfilePanel } from '@/contexts/ProfilePanelContext';
import { useNavigate } from 'react-router-dom';

export function TenantAdminDashboard() {
  const { openPanel } = useProfilePanel();
  const navigate = useNavigate();
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

  // Mock distribution of active skills students are pursuing
  const activeSkills = [
    { name: 'Data Analysis', percentage: 42, students: 204 },
    { name: 'Machine Learning', percentage: 26, students: 126 },
    { name: 'UI/UX Design', percentage: 18, students: 88 },
    { name: 'Web Development', percentage: 14, students: 68 },
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
          <Button variant="outline" size="sm" onClick={() => navigate('/students')}>
            <Users className="w-4 h-4 mr-2" />
            Manage Students
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
            onOpenProfile={() => openPanel('overview')}
          />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Active Skills */}
        <Card className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Active Skills</h3>
            <Button variant="outline" size="sm" onClick={() => navigate('/students')}>View Students</Button>
          </div>
          <div className="space-y-4">
            {activeSkills.map((skill) => (
              <div key={skill.name} className="p-4 rounded-lg bg-white/40 backdrop-blur-sm hover:bg-white/50 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <h4 className="font-medium">{skill.name}</h4>
                  </div>
                  <Badge variant="secondary">{skill.students} students</Badge>
                </div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">{skill.percentage}% pursuing</span>
                  <span className="font-medium">{skill.percentage}%</span>
                </div>
                <Progress value={skill.percentage} className="h-2" />
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
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/30 transition-all">
                <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/40 rounded-lg flex items-center justify-center flex-shrink-0">
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
