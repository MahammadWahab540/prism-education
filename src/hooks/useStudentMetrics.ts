import { useEffect, useMemo, useState } from 'react';

export type StudentLike = {
  id: string;
  status: 'active' | 'inactive' | 'suspended' | string;
  overallProgress: number; // 0-100
  completedSkills: number;
  enrolledSkills: number;
  careerChoice?: string;
  batch?: string;
  name: string;
};

export type StudentMetrics = {
  totalStudents: number;
  activeStudents: number;
  avgProgress: number;
  totalCompletions: number;
  topPerformers: StudentLike[];
  attention: StudentLike[];
};

export function useStudentMetrics(students: StudentLike[], deps: any[] = []) {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetch latency so skeletons can appear; restart on deps change
  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const metrics: StudentMetrics = useMemo(() => {
    const totalStudents = students.length;
    const activeStudents = students.filter((s) => s.status === 'active').length;
    const avgProgress = totalStudents > 0 ? Math.round(students.reduce((sum, s) => sum + (s.overallProgress || 0), 0) / totalStudents) : 0;
    const totalCompletions = students.reduce((sum, s) => sum + (s.completedSkills || 0), 0);

    const topPerformers = [...students]
      .sort((a, b) => (b.overallProgress || 0) - (a.overallProgress || 0))
      .slice(0, 5);

    const attention = students
      .filter((s) => (s.overallProgress || 0) < 30 || s.status === 'inactive')
      .slice(0, 5);

    return { totalStudents, activeStudents, avgProgress, totalCompletions, topPerformers, attention };
  }, [students]);

  return { metrics, isLoading } as const;
}

