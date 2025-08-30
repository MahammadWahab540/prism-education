
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Brain, Youtube, MessageCircle, FileText, Lightbulb, CheckCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { TubelightNavbar } from '@/components/ui/tubelight-navbar';
import { useUnlockLogic } from '@/hooks/useUnlockLogic';
import { VideoSection } from '@/components/learning/VideoSection';
import { AITutorSection } from '@/components/learning/AITutorSection';
import { AISummarySection } from '@/components/learning/AISummarySection';
import { CaseStudySection } from '@/components/learning/CaseStudySection';
import { QuizSection } from '@/components/learning/QuizSection';

interface TabItem {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string; size?: string | number }>;
  component: React.ComponentType<any>;
}

const buttonVariants = {
  initial: {
    gap: 0,
    paddingLeft: ".5rem",
    paddingRight: ".5rem",
  },
  animate: (isSelected: boolean) => ({
    gap: isSelected ? ".5rem" : 0,
    paddingLeft: isSelected ? "1rem" : ".5rem",
    paddingRight: isSelected ? "1rem" : ".5rem",
  }),
};

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "auto", opacity: 1 },
  exit: { width: 0, opacity: 0 },
};

const notificationVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: -10 },
  exit: { opacity: 0, y: -20 },
};

const lineVariants = {
  initial: { scaleX: 0, x: "-50%" },
  animate: {
    scaleX: 1,
    x: "0%",
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: {
    scaleX: 0,
    x: "50%",
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const transition = { type: "spring", bounce: 0, duration: 0.4 };

const LearningPage = () => {
  const { skillId, stageId } = useParams();
  const navigate = useNavigate();
  const { updateVideoProgress, completeQuiz } = useUnlockLogic(skillId || '', 6);
  const [activeTab, setActiveTab] = useState("video");
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  const tabItems: TabItem[] = [
    { id: "video", title: "Lesson Video", icon: Youtube, component: VideoSection },
    { id: "tutor", title: "AI Tutor", icon: MessageCircle, component: AITutorSection },
    { id: "summary", title: "AI Summary", icon: FileText, component: AISummarySection },
    { id: "case-study", title: "AI Case Study", icon: Lightbulb, component: CaseStudySection },
    { id: "quiz", title: "Dynamic Quiz", icon: CheckCircle, component: QuizSection },
  ];

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

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setActiveNotification(tabId);
    setTimeout(() => setActiveNotification(null), 1500);
  };

  const ActiveComponent = tabItems.find(tab => tab.id === activeTab)?.component || VideoSection;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[920px] px-4 sm:px-5 pb-12">
        {/* Compact Header */}
        <div className="py-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBackToRoadmap}
            className="flex items-center gap-2 mb-3"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Roadmap
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground leading-tight truncate">
                Introduction to Quantum Computing
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Stage 1: Core Concepts
              </p>
            </div>
          </div>
        </div>

        {/* Sticky Tabs */}
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50 -mx-4 sm:-mx-5 px-4 sm:px-5 mb-5">
          <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
            {tabItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors relative min-w-fit flex-1 sm:flex-none justify-center ${
                    isActive 
                      ? 'text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4 sm:hidden" />
                  <span className="hidden sm:inline">{item.title}</span>
                  <span className="sm:hidden text-xs">{item.title.split(' ')[0]}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {activeTab === "video" && <VideoSection onProgressUpdate={handleVideoProgress} />}
          {activeTab === "tutor" && <AITutorSection />}
          {activeTab === "summary" && <AISummarySection />}
          {activeTab === "case-study" && <CaseStudySection />}
          {activeTab === "quiz" && <QuizSection onQuizComplete={handleQuizComplete} />}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default LearningPage;
