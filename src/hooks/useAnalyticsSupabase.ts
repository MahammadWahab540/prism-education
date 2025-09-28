import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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

const generateMockAnalytics = (timeRange: string, tenantId?: string): AnalyticsData => {
  // Generate data based on time range
  const months = timeRange === '7d' ? 1 : timeRange === '30d' ? 6 : timeRange === '90d' ? 12 : 24;
  
  const learningProgressData = Array.from({ length: months }, (_, i) => ({
    month: new Date(2024, i, 1).toLocaleDateString('en', { month: 'short' }),
    completions: Math.floor(Math.random() * 200) + 100,
    enrollments: Math.floor(Math.random() * 400) + 200,
    watchTime: Math.floor(Math.random() * 3000) + 1500,
  }));

  const studentPerformanceData = Array.from({ length: 50 }, (_, i) => {
    const progress = Math.floor(Math.random() * 100);
    const segment: 'excellent' | 'good' | 'at_risk' = progress >= 80 ? 'excellent' : progress >= 60 ? 'good' : 'at_risk';
    
    return {
      name: `Student ${i + 1}`,
      email: `student${i + 1}@email.com`,
      phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      location: ['New York, NY', 'San Francisco, CA', 'Austin, TX', 'Seattle, WA'][Math.floor(Math.random() * 4)],
      coursesEnrolled: Math.floor(Math.random() * 8) + 2,
      coursesCompleted: Math.floor(Math.random() * 5) + 1,
      overallProgress: progress,
      averageScore: Math.floor(Math.random() * 30) + 70,
      totalWatchTime: Math.floor(Math.random() * 2000) + 500,
      lastActive: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      segment,
      skills: [
        { name: 'JavaScript', progress: Math.floor(Math.random() * 100), status: 'in_progress' as const },
        { name: 'React', progress: Math.floor(Math.random() * 100), status: 'completed' as const },
        { name: 'Node.js', progress: Math.floor(Math.random() * 50), status: 'not_started' as const },
      ],
    };
  });

  const skillCompletionData = [
    { skill: 'JavaScript', completed: 245, inProgress: 156, notStarted: 89 },
    { skill: 'React', completed: 198, inProgress: 123, notStarted: 134 },
    { skill: 'Python', completed: 167, inProgress: 189, notStarted: 98 },
    { skill: 'Data Science', completed: 134, inProgress: 167, notStarted: 145 },
    { skill: 'Machine Learning', completed: 98, inProgress: 145, notStarted: 189 },
  ];

  const engagementTrends = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    activeUsers: Math.floor(Math.random() * 200) + 100,
    sessionsStarted: Math.floor(Math.random() * 300) + 150,
    avgSessionDuration: Math.floor(Math.random() * 45) + 15,
  }));

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
    queryFn: () => {
      // Simulate API delay
      return new Promise<AnalyticsData>((resolve) => {
        setTimeout(() => {
          resolve(generateMockAnalytics(timeRange, tenantId));
        }, 1000);
      });
    },
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