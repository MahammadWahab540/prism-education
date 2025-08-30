
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Brain, Youtube, MessageCircle, FileText, Lightbulb, CheckCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
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

        {/* Animated Tab Navigation */}
        <div className="flex justify-center">
          <div className={cn(
            "flex items-center gap-1 p-2 relative",
            "bg-background",
            "border rounded-xl",
            "transition-all duration-200",
            "shadow-sm"
          )}>
            <AnimatePresence>
              {activeNotification && (
                <motion.div
                  variants={notificationVariants as any}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-50"
                >
                  <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs">
                    {tabItems.find(item => item.id === activeNotification)?.title} opened!
                  </div>
                  <motion.div
                    variants={lineVariants as any}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="absolute -bottom-1 left-1/2 w-full h-[2px] bg-primary origin-left"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-1">
              {tabItems.map((tab) => (
                <motion.button
                  key={tab.id}
                  variants={buttonVariants as any}
                  initial={false}
                  animate="animate"
                  custom={activeTab === tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  transition={transition as any}
                  className={cn(
                    "relative flex items-center rounded-lg px-3 py-2",
                    "text-sm font-medium transition-colors duration-300",
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <tab.icon
                    size={16}
                    className={cn(
                      activeTab === tab.id && "text-primary-foreground"
                    )}
                  />
                  <AnimatePresence initial={false}>
                    {activeTab === tab.id && (
                      <motion.span
                        variants={spanVariants as any}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={transition as any}
                        className="overflow-hidden whitespace-nowrap"
                      >
                        {tab.title}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
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
