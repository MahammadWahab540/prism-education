
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, TrendingUp } from 'lucide-react';

interface WeeklyWatchTimeChartProps {
  data: Array<{
    day: string;
    hours: number;
    isToday: boolean;
  }>;
}

export function WeeklyWatchTimeChart({ data }: WeeklyWatchTimeChartProps) {
  const maxHours = Math.max(...data.map(d => d.hours));
  const totalHours = data.reduce((sum, d) => sum + d.hours, 0);

  const barVariants = {
    initial: { scaleY: 0, opacity: 0 },
    animate: { scaleY: 1, opacity: 1 },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-indigo-500" />
            <span>Weekly Watch Time</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <TrendingUp className="w-4 h-4" />
            <span>{totalHours.toFixed(1)}h total</span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-end justify-between h-32 space-x-2">
          {data.map((item, index) => {
            const height = maxHours > 0 ? (item.hours / maxHours) * 100 : 0;
            
            return (
              <div key={item.day} className="flex flex-col items-center flex-1">
                {/* Bar */}
                <div className="w-full flex items-end h-24 mb-2">
                  <motion.div
                    variants={barVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                    transition={{
                      delay: index * 0.1,
                      duration: 0.5,
                      type: "spring" as const,
                      stiffness: 100
                    }}
                    className={`
                      w-full rounded-t-md origin-bottom cursor-pointer relative group
                      ${item.isToday 
                        ? 'bg-gradient-to-t from-orange-400 to-orange-500' 
                        : item.hours > 0
                          ? 'bg-gradient-to-t from-indigo-400 to-indigo-500'
                          : 'bg-gray-200'
                      }
                      ${item.hours > 0 ? 'min-h-[8px]' : 'h-1'}
                    `}
                    style={{ height: `${height}%` }}
                  >
                    {/* Tooltip on hover */}
                    {item.hours > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileHover={{ opacity: 1, y: -5 }}
                        className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {item.hours}h
                      </motion.div>
                    )}
                  </motion.div>
                </div>
                
                {/* Day Label */}
                <div className={`
                  text-xs text-center
                  ${item.isToday 
                    ? 'font-semibold text-orange-600' 
                    : 'text-muted-foreground'
                  }
                `}>
                  {item.day}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Summary Stats */}
        <div className="mt-4 pt-3 border-t border-border/50">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Avg. per day</span>
            <span className="font-medium">
              {data.length > 0 ? (totalHours / data.length).toFixed(1) : 0}h
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
