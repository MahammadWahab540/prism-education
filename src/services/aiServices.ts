import { supabase } from '@/integrations/supabase/client';

export interface AITutorRequest {
  message: string;
  context?: string;
  userId: string;
  skillId?: string;
  currentContent?: string;
}

export interface AITutorResponse {
  response: string;
  timestamp: string;
}

export interface ContentRecommendation {
  title: string;
  description: string;
  type: 'video' | 'quiz' | 'article' | 'capstone' | 'practice';
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
  skillId?: string;
  reason: string;
}

export interface ProgressAnalysis {
  summary: string;
  strengths: string[];
  challenges: string[];
  learningPatterns: {
    preferredContentType: string;
    bestLearningTime: string;
    engagementLevel: string;
    consistencyScore: number;
  };
  recommendations: Array<{
    category: string;
    action: string;
    reason: string;
    timeframe: string;
  }>;
  riskFactors: string[];
  goalAlignment: {
    score: number;
    analysis: string;
  };
  predictedOutcomes: {
    completionProbability: number;
    suggestedInterventions: string[];
  };
}

export class AIServices {
  /**
   * Get AI tutor response for student questions
   */
  static async getTutorResponse(request: AITutorRequest): Promise<AITutorResponse> {
    const { data, error } = await supabase.functions.invoke('ai-tutor', {
      body: request
    });

    if (error) {
      throw new Error(error.message || 'Failed to get AI tutor response');
    }

    return data;
  }

  /**
   * Generate personalized content recommendations
   */
  static async getContentRecommendations(userId: string, limit = 5): Promise<ContentRecommendation[]> {
    const { data, error } = await supabase.functions.invoke('content-recommendations', {
      body: { userId, limit }
    });

    if (error) {
      throw new Error(error.message || 'Failed to get content recommendations');
    }

    return data.recommendations;
  }

  /**
   * Generate AI-powered capstone roadmap
   */
  static async generateCapstoneRoadmap(params: {
    templateId: string;
    userId: string;
    customRequirements?: string;
    difficulty?: string;
    timeframe?: string;
  }) {
    const { data, error } = await supabase.functions.invoke('generate-capstone-roadmap', {
      body: params
    });

    if (error) {
      throw new Error(error.message || 'Failed to generate capstone roadmap');
    }

    return data;
  }

  /**
   * Analyze student progress with AI insights
   */
  static async analyzeStudentProgress(params: {
    userId: string;
    analysisType?: 'comprehensive' | 'focused';
    timeRange?: '7d' | '30d' | '90d';
  }): Promise<ProgressAnalysis> {
    const { data, error } = await supabase.functions.invoke('analyze-student-progress', {
      body: params
    });

    if (error) {
      throw new Error(error.message || 'Failed to analyze student progress');
    }

    return data.analysis;
  }

  /**
   * Send notifications using the notification manager
   */
  static async sendNotification(params: {
    type?: 'info' | 'success' | 'warning' | 'error' | 'assignment' | 'grade' | 'announcement';
    userId?: string;
    tenantId?: string;
    title: string;
    message: string;
    actionUrl?: string;
    metadata?: Record<string, any>;
    sendTo?: 'user' | 'tenant' | 'all';
  }) {
    const { data, error } = await supabase.functions.invoke('notification-manager', {
      body: params
    });

    if (error) {
      throw new Error(error.message || 'Failed to send notification');
    }

    return data;
  }
}