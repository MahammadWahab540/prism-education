
"use client";

import React, { useState, useEffect } from 'react';
import { Flame, Calendar, Target, Trophy, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNotifications } from '@/hooks/useNotifications';
import { cn } from '@/lib/utils';

interface WeeklyStreakProps {
  currentStreak?: number;
  longestStreak?: number;
  weeklyGoal?: number;
  completedDays?: number;
  streakData?: Array<{ day: string; completed: boolean; date: string }>;
}

export function WeeklyStreak({
  currentStreak = 5,
  longestStreak = 12,
  weeklyGoal = 7,
  completedDays = 5,
  streakData = [
    { day: 'Mon', completed: true, date: '2024-01-15' },
    { day: 'Tue', completed: true, date: '2024-01-16' },
    { day: 'Wed', completed: true, date: '2024-01-17' },
    { day: 'Thu', completed: true, date: '2024-01-18' },
    { day: 'Fri', completed: true, date: '2024-01-19' },
    { day: 'Sat', completed: false, date: '2024-01-20' },
    { day: 'Sun', completed: false, date: '2024-01-21' },
  ]
}: WeeklyStreakProps) {
  const [animatedStreak, setAnimatedStreak] = useState(0);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const { showStreakNotification } = useNotifications();

  const progressPercentage = (completedDays / weeklyGoal) * 100;

  useEffect(() => {
    const streakTimer = setTimeout(() => {
      setAnimatedStreak(currentStreak);
      
      // Show streak notification for milestones
      if (currentStreak > 0 && currentStreak % 7 === 0) {
        showStreakNotification(currentStreak);
      }
    }, 500);

    const progressTimer = setTimeout(() => {
      setAnimatedProgress(progressPercentage);
    }, 800);

    return () => {
      clearTimeout(streakTimer);
      clearTimeout(progressTimer);
    };
  }, [currentStreak, progressPercentage, showStreakNotification]);

  return (
    <div className="w-full max-w-md mx-auto p-6 glass-card rounded-2xl shadow-elevated">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Flame className="w-8 h-8 text-orange-500" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Weekly Streak</h2>
            <p className="text-sm text-muted-foreground">Keep the momentum going!</p>
          </div>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          This Week
        </Badge>
      </div>

      {/* Main Streak Counter */}
      <div className="text-center mb-6">
        <div className="relative inline-block">
          <div className="text-6xl font-extrabold text-primary mb-2 transition-all duration-1000 ease-out">
            {animatedStreak}
          </div>
          <div className="absolute -top-2 -right-2">
            <Zap className="w-6 h-6 text-yellow-500 animate-bounce" />
          </div>
        </div>
        <p className="text-lg text-muted-foreground">Day Streak</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span className="text-sm text-muted-foreground">
            Best: {longestStreak} days
          </span>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Weekly Goal</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {completedDays}/{weeklyGoal} days
          </span>
        </div>
        <Progress 
          value={animatedProgress} 
          className="h-3"
        />
        <p className="text-xs text-muted-foreground mt-2 text-center">
          {Math.round(progressPercentage)}% complete
        </p>
      </div>

      {/* Daily Breakdown */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          This Week's Progress
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {streakData.map((day, index) => (
            <div
              key={day.day}
              className={cn(
                "flex flex-col items-center p-2 rounded-lg transition-all duration-300 hover:scale-105",
                day.completed
                  ? "bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30"
                  : "bg-white/20 border border-white/20"
              )}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <span className="text-xs font-medium mb-1">
                {day.day}
              </span>
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300",
                  day.completed
                    ? "bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg"
                    : "bg-gray-200 text-gray-400"
                )}
              >
                {day.completed ? (
                  <Flame className="w-3 h-3" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-current opacity-50" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Motivational Message */}
      <div className="mt-6 p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg border border-orange-500/20">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-medium">
            {completedDays >= weeklyGoal 
              ? "🎉 Goal Achieved!" 
              : `${weeklyGoal - completedDays} more days to reach your goal!`}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          {completedDays >= weeklyGoal
            ? "Amazing work! You've completed your weekly goal. Keep the streak alive!"
            : "You're doing great! Stay consistent to build a stronger habit."}
        </p>
      </div>
    </div>
  );
}
