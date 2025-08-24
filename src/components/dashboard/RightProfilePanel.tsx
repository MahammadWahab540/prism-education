
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Flame, 
  Trophy, 
  Target, 
  Crown, 
  BookOpen, 
  CheckCircle,
  Calendar,
  Clock,
  Star,
  TrendingUp
} from 'lucide-react';
import { ProfileCard } from './ProfileCard';
import { WeeklyStreakCalendar } from './WeeklyStreakCalendar';
import { CoursesProgressSnapshot } from './CoursesProgressSnapshot';
import { WeeklyWatchTimeChart } from './WeeklyWatchTimeChart';

// Mock data
const mockProfileData = {
  user: {
    name: 'Alex Morgan',
    role: 'UI/UX Designer & Developer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    points: 876
  },
  badges: {
    streakDays: 54,
    monthlyGoals: 8,
    leaderboardRank: 3
  },
  streaks: {
    currentWeek: [true, true, true, false, false, false, false], // Mon-Sun
    weeksCompleted: 4,
    totalWeeks: 4
  },
  courses: {
    inProgress: 3,
    completed: 17
  },
  weeklyWatchTime: [
    { day: 'Mon', hours: 2.5, isToday: false },
    { day: 'Tue', hours: 3.2, isToday: false },
    { day: 'Wed', hours: 1.8, isToday: true },
    { day: 'Thu', hours: 0, isToday: false },
    { day: 'Fri', hours: 0, isToday: false },
    { day: 'Sat', hours: 0, isToday: false },
    { day: 'Sun', hours: 0, isToday: false }
  ]
};

export function RightProfilePanel() {
  const [showStreakHistory, setShowStreakHistory] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <TooltipProvider>
      <motion.div
        className="w-80 space-y-6 p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Profile Card */}
        <motion.div variants={itemVariants}>
          <ProfileCard data={mockProfileData} />
        </motion.div>

        {/* Weekly Streak Calendar */}
        <motion.div variants={itemVariants}>
          <WeeklyStreakCalendar 
            data={mockProfileData.streaks}
            onCalendarClick={() => setShowStreakHistory(true)}
          />
        </motion.div>

        {/* Courses Progress Snapshot */}
        <motion.div variants={itemVariants}>
          <CoursesProgressSnapshot data={mockProfileData.courses} />
        </motion.div>

        {/* Weekly Watch Time Chart */}
        <motion.div variants={itemVariants}>
          <WeeklyWatchTimeChart data={mockProfileData.weeklyWatchTime} />
        </motion.div>
      </motion.div>
    </TooltipProvider>
  );
}
