import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsData {
  learningProgressData: Array<{
    month: string;
    completions: number;
    enrollments: number;
    watchTime: number;
  }>;
  studentPerformanceData: Array<{
    name: string;
    email: string;
    phone: string;
    location: string;
    coursesEnrolled: number;
    coursesCompleted: number;
    overallProgress: number;
    averageScore: number;
    totalWatchTime: number;
    lastActive: string;
    segment: 'excellent' | 'good' | 'at_risk';
    skills: Array<{
      name: string;
      progress: number;
      status: 'completed' | 'in_progress' | 'not_started';
    }>;
  }>;
  skillCompletionData: Array<{
    skill: string;
    completed: number;
    inProgress: number;
    notStarted: number;
  }>;
  engagementTrends: Array<{
    date: string;
    activeUsers: number;
    sessionsStarted: number;
    avgSessionDuration: number;
  }>;
}

const fetchAnalyticsData = async (timeRange: string, tenantId?: string): Promise<AnalyticsData> => {
  // Fetch profiles
  const { data: students, error: studentsError } = await supabase
    .from('profiles')
    .select('*')
    .eq('is_active', true);

  if (studentsError) throw studentsError;

  // Fetch skill progress for all students
  const { data: allSkillProgress } = await supabase
    .from('skill_progress')
    .select('*');

  // Fetch learning sessions for engagement trends
  const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysBack);

  const { data: sessions } = await supabase
    .from('learning_sessions')
    .select('*')
    .gte('created_at', startDate.toISOString());

  // Fetch skills
  const { data: skills } = await supabase
    .from('skills')
    .select('*')
    .eq('is_active', true);

  // Process learning progress data
  const monthsCount = timeRange === '7d' ? 1 : timeRange === '30d' ? 6 : timeRange === '90d' ? 12 : 24;
  const learningProgressData = Array.from({ length: monthsCount }, (_, i) => {
    const monthDate = new Date();
    monthDate.setMonth(monthDate.getMonth() - (monthsCount - 1 - i));
    const monthName = monthDate.toLocaleDateString('en', { month: 'short' });

    const monthSessions = sessions?.filter(s => {
      const sessionDate = new Date(s.created_at);
      return sessionDate.getMonth() === monthDate.getMonth() &&
             sessionDate.getFullYear() === monthDate.getFullYear();
    }) || [];

    return {
      month: monthName,
      completions: monthSessions.filter((s: any) => s.completed).length,
      enrollments: monthSessions.length,
      watchTime: monthSessions.reduce((sum: number, s: any) => sum + (s.watch_time_seconds || 0), 0) / 60,
    };
  });

  // Process student performance data
  const studentPerformanceData = (students || []).map((student: any) => {
    const studentProgress = allSkillProgress?.filter((sp: any) => sp.user_id === student.id) || [];
    const totalProgress = studentProgress.reduce((sum: number, sp: any) => sum + (sp.overall_progress_percent || 0), 0);
    const avgProgress = studentProgress.length > 0 ? totalProgress / studentProgress.length : 0;
    const avgScore = studentProgress.reduce((sum: number, sp: any) => sum + (sp.average_quiz_score || 0), 0) / (studentProgress.length || 1);
    
    const segment: 'excellent' | 'good' | 'at_risk' = 
      avgProgress >= 80 ? 'excellent' : avgProgress >= 60 ? 'good' : 'at_risk';

    return {
      name: student.name,
      email: student.email,
      phone: student.phone || '',
      location: student.location || '',
      coursesEnrolled: studentProgress.length,
      coursesCompleted: studentProgress.filter((sp: any) => sp.completed_at).length,
      overallProgress: Math.round(avgProgress),
      averageScore: Math.round(avgScore),
      totalWatchTime: student.total_watch_time_hours || 0,
      lastActive: student.updated_at,
      segment,
      skills: studentProgress.map((sp: any) => ({
        name: 'Skill',
        progress: sp.overall_progress_percent || 0,
        status: sp.completed_at ? 'completed' as const : 'in_progress' as const,
      })),
    };
  });

  // Process skill completion data
  const skillCompletionData = (skills || []).map((skill: any) => {
    const skillProgresses = allSkillProgress?.filter((sp: any) => sp.skill_id === skill.id) || [];
    const completed = skillProgresses.filter((sp: any) => sp.completed_at).length;
    const inProgress = skillProgresses.filter((sp: any) => !sp.completed_at && sp.overall_progress_percent > 0).length;
    const notStarted = Math.max(0, (students?.length || 0) - completed - inProgress);

    return {
      skill: skill.name,
      completed,
      inProgress,
      notStarted,
    };
  });

  // Process engagement trends
  const engagementTrends = Array.from({ length: Math.min(30, daysBack) }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (Math.min(30, daysBack) - 1 - i));
    const dateStr = date.toISOString().split('T')[0];

    const daySessions = sessions?.filter((s: any) => s.created_at.startsWith(dateStr)) || [];
    const uniqueUsers = new Set(daySessions.map((s: any) => s.user_id)).size;
    const avgDuration = daySessions.length > 0
      ? daySessions.reduce((sum: number, s: any) => sum + (s.watch_time_seconds || 0), 0) / daySessions.length / 60
      : 0;

    return {
      date: dateStr,
      activeUsers: uniqueUsers,
      sessionsStarted: daySessions.length,
      avgSessionDuration: Math.round(avgDuration),
    };
  });

  return {
    learningProgressData,
    studentPerformanceData,
    skillCompletionData,
    engagementTrends,
  };
};

export function useAnalyticsSupabase(timeRange: string = '30d', tenantId?: string) {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: analyticsData, isLoading, error } = useQuery({
    queryKey: ['analytics', timeRange, tenantId],
    queryFn: () => fetchAnalyticsData(timeRange, tenantId),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (error) {
    toast({ title: 'Error', description: 'Failed to load analytics data', variant: 'destructive' });
  }

  return {
    analyticsData: analyticsData || {
      learningProgressData: [],
      studentPerformanceData: [],
      skillCompletionData: [],
      engagementTrends: [],
    },
    isLoading,
    error,
  };
}