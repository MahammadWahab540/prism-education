
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ProfileCard } from './ProfileCard';
import { WeeklyStreak } from './WeeklyStreak';
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
    currentStreak: 5,
    longestStreak: 54,
    weeklyGoal: 7,
    completedDays: 5,
    streakData: [
      { day: 'Mon', completed: true, date: '2024-01-15' },
      { day: 'Tue', completed: true, date: '2024-01-16' },
      { day: 'Wed', completed: true, date: '2024-01-17' },
      { day: 'Thu', completed: true, date: '2024-01-18' },
      { day: 'Fri', completed: true, date: '2024-01-19' },
      { day: 'Sat', completed: false, date: '2024-01-20' },
      { day: 'Sun', completed: false, date: '2024-01-21' }
    ]
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

        {/* Weekly Streak */}
        <motion.div variants={itemVariants}>
          <WeeklyStreak 
            currentStreak={mockProfileData.streaks.currentStreak}
            longestStreak={mockProfileData.streaks.longestStreak}
            weeklyGoal={mockProfileData.streaks.weeklyGoal}
            completedDays={mockProfileData.streaks.completedDays}
            streakData={mockProfileData.streaks.streakData}
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
