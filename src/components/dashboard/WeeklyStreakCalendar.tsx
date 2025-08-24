
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CheckCircle, Circle } from 'lucide-react';

interface WeeklyStreakCalendarProps {
  data: {
    currentWeek: boolean[];
    weeksCompleted: number;
    totalWeeks: number;
  };
  onCalendarClick: () => void;
}

export function WeeklyStreakCalendar({ data, onCalendarClick }: WeeklyStreakCalendarProps) {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const containerVariants = {
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  const dayVariants = {
    completed: {
      scale: [1, 1.2, 1],
      transition: { duration: 0.3 }
    },
    pending: {
      opacity: [0.5, 1, 0.5],
      transition: { 
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      whileHover="hover"
      className="cursor-pointer"
      onClick={onCalendarClick}
    >
      <Card className="glass-card hover:shadow-elevated transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-indigo-500" />
            <span>Weekly Streak</span>
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {data.weeksCompleted}/{data.totalWeeks} weeks completed
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              const isCompleted = data.currentWeek[index];
              const isToday = index === 2; // Wednesday for demo
              
              return (
                <div key={index} className="text-center">
                  <div className="text-xs text-muted-foreground mb-2">{day}</div>
                  <motion.div
                    variants={dayVariants}
                    animate={isCompleted ? "completed" : "pending"}
                    className={`
                      w-8 h-8 rounded-full border-2 flex items-center justify-center mx-auto
                      ${isCompleted 
                        ? 'bg-gradient-to-br from-orange-400 to-orange-500 border-orange-500 text-white' 
                        : 'border-gray-300 bg-gray-50'
                      }
                      ${isToday ? 'ring-2 ring-indigo-400 ring-opacity-50' : ''}
                    `}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-400" />
                    )}
                  </motion.div>
                  
                  {/* Day name tooltip on hover */}
                  <div className="text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {dayNames[index]}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Streak Stats */}
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-muted-foreground">Current Streak</span>
            <span className="font-semibold text-orange-600">
              {data.currentWeek.filter(Boolean).length} days
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
