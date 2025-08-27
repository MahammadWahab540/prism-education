
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Youtube, MessageCircle, FileText, Lightbulb, CheckCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useUnlockLogic } from '@/hooks/useUnlockLogic';
import { VideoSection } from '@/components/learning/VideoSection';
import { AITutorSection } from '@/components/learning/AITutorSection';
import { AISummarySection } from '@/components/learning/AISummarySection';
import { CaseStudySection } from '@/components/learning/CaseStudySection';
import { QuizSection } from '@/components/learning/QuizSection';

const LearningPage = () => {
  const { skillId, stageId } = useParams();
  const navigate = useNavigate();
  const { updateVideoProgress, completeQuiz } = useUnlockLogic(skillId || '');
  const [activeTab, setActiveTab] = useState("video");

  const handleVideoProgress = (progress: number) => {
    updateVideoProgress(stageId || '', progress);
  };

  const handleQuizComplete = (passed: boolean) => {
    if (passed) {
      completeQuiz(stageId || '');
    }
  };

  const handleBackToRoadmap = () => {
    navigate(`/roadmap/${skillId}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBackToRoadmap}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Roadmap
          </Button>
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-4 py-8">
          <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent-luxury flex items-center justify-center">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Lesson: Introduction to Quantum Computing
          </h1>
          <p className="text-muted-foreground text-lg">
            Stage 1: Core Concepts
          </p>
        </div>

        {/* Main Tabbed Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Youtube className="h-4 w-4" />
              Lesson Video
            </TabsTrigger>
            <TabsTrigger value="tutor" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              AI Tutor
            </TabsTrigger>
            <TabsTrigger value="summary" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              AI Summary
            </TabsTrigger>
            <TabsTrigger value="case-study" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              AI Case Study
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Dynamic Quiz
            </TabsTrigger>
          </TabsList>

          <TabsContent value="video">
            <VideoSection onProgressUpdate={handleVideoProgress} />
          </TabsContent>

          <TabsContent value="tutor">
            <AITutorSection />
          </TabsContent>

          <TabsContent value="summary">
            <AISummarySection />
          </TabsContent>

          <TabsContent value="case-study">
            <CaseStudySection />
          </TabsContent>

          <TabsContent value="quiz">
            <QuizSection onQuizComplete={handleQuizComplete} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default LearningPage;
