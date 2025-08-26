
import React from 'react';
import { Lock, Play, CheckCircle, Clock, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface StageCardProps {
  stage: {
    id: string;
    title: string;
    description: string;
    duration: string;
    topics: number;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  };
  isUnlocked: boolean;
  isCompleted: boolean;
  videoProgress: number;
  quizCompleted: boolean;
  onStartStage: () => void;
}

export function StageCard({
  stage,
  isUnlocked,
  isCompleted,
  videoProgress,
  quizCompleted,
  onStartStage,
}: StageCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'Advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStageProgress = () => {
    if (isCompleted) return 100;
    if (!isUnlocked) return 0;
    
    const videoWeight = 0.7; // 70% for video
    const quizWeight = 0.3;  // 30% for quiz
    
    return Math.round(
      (Math.min(videoProgress, 30) / 30 * videoWeight + (quizCompleted ? quizWeight : 0)) * 100
    );
  };

  return (
    <div className={cn(
      "relative group transition-all duration-300 hover:scale-[1.02]",
      isUnlocked ? "opacity-100" : "opacity-60"
    )}>
      <div className={cn(
        "bg-card border rounded-2xl p-6 transition-all duration-300",
        isUnlocked && !isCompleted && "border-primary/50 shadow-lg hover:shadow-xl",
        isCompleted && "border-green-500/50 bg-green-50/50",
        !isUnlocked && "border-border/30"
      )}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className={cn(
                "text-lg font-bold transition-colors",
                isCompleted ? "text-green-700" : isUnlocked ? "text-foreground" : "text-muted-foreground"
              )}>
                {stage.title}
              </h3>
              {isCompleted && <CheckCircle className="h-5 w-5 text-green-600" />}
              {!isUnlocked && (
                <Tooltip>
                  <TooltipTrigger>
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Complete previous stage to unlock</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            
            <span className={cn(
              "inline-block px-2 py-1 rounded-full text-xs font-medium",
              getDifficultyColor(stage.difficulty)
            )}>
              {stage.difficulty}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {stage.description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{stage.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>{stage.topics} topics</span>
          </div>
        </div>

        {/* Progress Bar (for unlocked stages) */}
        {isUnlocked && (
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span>{getStageProgress()}%</span>
            </div>
            <Progress value={getStageProgress()} className="h-2" />
            
            {!isCompleted && videoProgress > 0 && (
              <div className="flex gap-2 mt-2 text-xs">
                <span className={cn(
                  "px-2 py-1 rounded-full",
                  videoProgress >= 30 ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                )}>
                  Video: {Math.round((videoProgress / 30) * 100)}%
                </span>
                <span className={cn(
                  "px-2 py-1 rounded-full",
                  quizCompleted ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                )}>
                  Quiz: {quizCompleted ? "✓" : "Pending"}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={onStartStage}
          disabled={!isUnlocked}
          className={cn(
            "w-full transition-all duration-200",
            isCompleted && "bg-green-600 hover:bg-green-700",
            !isUnlocked && "opacity-50 cursor-not-allowed"
          )}
          variant={isCompleted ? "default" : "default"}
        >
          <div className="flex items-center gap-2">
            {isCompleted ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            {isCompleted ? "Review Stage" : isUnlocked ? "Start Learning" : "Locked"}
          </div>
        </Button>
      </div>
    </div>
  );
}
