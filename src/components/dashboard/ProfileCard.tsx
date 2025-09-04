
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Flame, Trophy, Target, Crown, Star } from 'lucide-react';

interface ProfileCardProps {
  data: {
    user: {
      name: string;
      role: string;
      avatar: string;
      points: number;
    };
    badges: {
      streakDays: number;
      monthlyGoals: number;
      leaderboardRank: number;
    };
  };
}

export function ProfileCard({ data }: ProfileCardProps) {
  const badgeVariants = {
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  return (
    <Card className="glass-card overflow-hidden">
      <CardContent className="p-6">
        {/* Header with Avatar and Info */}
        <div className="flex items-center space-x-4 mb-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Avatar className="w-16 h-16 border-2 border-gradient-to-br from-orange-400 to-indigo-500">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face" alt={data.user.name} />
              <AvatarFallback className="bg-gradient-to-br from-orange-400 to-indigo-500 text-white font-semibold">
                {data.user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </motion.div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">{data.user.name}</h3>
            <p className="text-sm text-muted-foreground">{data.user.role}</p>
            
            {/* Points Display */}
            <motion.div 
              className="flex items-center space-x-1 mt-2"
              whileHover={{ scale: 1.02 }}
            >
              <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
              <span className="text-lg font-bold bg-gradient-to-r from-orange-400 to-indigo-500 bg-clip-text text-transparent">
                {data.user.points} Points
              </span>
            </motion.div>
          </div>
        </div>

        {/* Badges */}
        <div className="grid grid-cols-3 gap-3">
          {/* Streak Badge */}
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                variants={badgeVariants}
                whileHover="hover"
                whileTap="tap"
                className="cursor-pointer"
              >
                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-md transition-all duration-200">
                  <CardContent className="p-3 text-center">
                    <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                    <div className="text-lg font-bold text-orange-700">{data.badges.streakDays}</div>
                    <div className="text-xs text-orange-600">Days</div>
                  </CardContent>
                </Card>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{data.badges.streakDays} Days Streak 🔥</p>
            </TooltipContent>
          </Tooltip>

          {/* Monthly Goals Badge */}
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                variants={badgeVariants}
                whileHover="hover"
                whileTap="tap"
                className="cursor-pointer"
              >
                <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 hover:shadow-md transition-all duration-200">
                  <CardContent className="p-3 text-center">
                    <Target className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
                    <div className="text-lg font-bold text-indigo-700">{data.badges.monthlyGoals}</div>
                    <div className="text-xs text-indigo-600">Goals</div>
                  </CardContent>
                </Card>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{data.badges.monthlyGoals} Goals This Month 🎯</p>
            </TooltipContent>
          </Tooltip>

          {/* Leaderboard Rank Badge */}
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                variants={badgeVariants}
                whileHover="hover"
                whileTap="tap"
                className="cursor-pointer"
              >
                <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-md transition-all duration-200">
                  <CardContent className="p-3 text-center">
                    <Crown className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
                    <div className="text-lg font-bold text-yellow-700">#{data.badges.leaderboardRank}</div>
                    <div className="text-xs text-yellow-600">Rank</div>
                  </CardContent>
                </Card>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p>#{data.badges.leaderboardRank} on Leaderboard 👑</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardContent>
    </Card>
  );
}
