import { supabase } from '@/integrations/supabase/client';
import { AIServices } from './aiServices';

/**
 * Comprehensive API service layer for the LMS platform
 * Centralizes all database operations with proper error handling
 */
export class SupabaseAPI {
  
  // =============================================
  // USER PROFILE OPERATIONS
  // =============================================
  
  static async getCurrentUserProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  }

  static async updateUserProfile(updates: {
    name?: string;
    avatar_url?: string;
    phone?: string;
    location?: string;
    preferred_role?: string;
    salary_expectation?: number;
    available_from?: string;
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // =============================================
  // LEARNING PROGRESS OPERATIONS
  // =============================================
  
  static async trackLearningSession(params: {
    contentItemId: string;
    watchTimeSeconds?: number;
    progressPercentage?: number;
    completed?: boolean;
    metadata?: any;
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('learning_sessions')
      .insert({
        user_id: user.id,
        content_item_id: params.contentItemId,
        watch_time_seconds: params.watchTimeSeconds || 0,
        progress_percentage: params.progressPercentage || 0,
        completed: params.completed || false,
        metadata: params.metadata || {},
        session_end: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    // Update user's total watch time
    if (params.watchTimeSeconds) {
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('total_watch_time_hours')
        .eq('id', user.id)
        .single();
        
      const currentHours = currentProfile?.total_watch_time_hours || 0;
      const additionalHours = params.watchTimeSeconds / 3600;
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          total_watch_time_hours: currentHours + additionalHours
        })
        .eq('id', user.id);
        
      if (updateError) {
        console.error('Error updating watch time:', updateError);
      }
    }

    return data;
  }

  static async updateSkillProgress(skillId: string, updates: {
    overallProgressPercent?: number;
    averageQuizScore?: number;
    capstoneProjectRequested?: boolean;
    completedAt?: string;
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('skill_progress')
      .upsert({
        user_id: user.id,
        skill_id: skillId,
        overall_progress_percent: updates.overallProgressPercent,
        average_quiz_score: updates.averageQuizScore,
        capstone_project_requested: updates.capstoneProjectRequested,
        completed_at: updates.completedAt,
      }, {
        onConflict: 'user_id,skill_id'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // =============================================
  // TENANT OPERATIONS
  // =============================================
  
  static async getTenants() {
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data;
  }

  static async createTenant(tenantData: {
    name: string;
    domain: string;
    logoUrl?: string;
    settings?: any;
  }) {
    const { data, error } = await supabase
      .from('tenants')
      .insert({
        name: tenantData.name,
        domain: tenantData.domain,
        logo_url: tenantData.logoUrl,
        settings: tenantData.settings || {},
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // =============================================
  // ANALYTICS OPERATIONS
  // =============================================
  
  static async getTenantAnalytics(tenantId: string, timeRange = '30d') {
    const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    // Get student count and activity
    const { data: students } = await supabase
      .from('profiles')
      .select('id, total_watch_time_hours, streak_days, engagement_score')
      .eq('tenant_id', tenantId)
      .eq('role', 'student')
      .eq('is_active', true);

    // Get recent learning sessions
    const { data: recentSessions } = await supabase
      .from('learning_sessions')
      .select(`
        *,
        profiles!inner (
          tenant_id
        )
      `)
      .eq('profiles.tenant_id', tenantId)
      .gte('created_at', startDate.toISOString());

    // Get capstone completion data
    const { data: capstoneData } = await supabase
      .from('capstone_instances')
      .select(`
        status,
        capstone_submissions (
          grade
        ),
        profiles!inner (
          tenant_id
        )
      `)
      .eq('profiles.tenant_id', tenantId);

    return {
      totalStudents: students?.length || 0,
      avgWatchTime: students?.reduce((acc, s) => acc + (s.total_watch_time_hours || 0), 0) / (students?.length || 1),
      avgEngagementScore: students?.reduce((acc, s) => acc + (s.engagement_score || 0), 0) / (students?.length || 1),
      totalSessions: recentSessions?.length || 0,
      activeCapstones: capstoneData?.filter(c => c.status === 'Active').length || 0,
      completedCapstones: capstoneData?.filter(c => c.status === 'Completed').length || 0,
      avgCapstoneGrade: capstoneData?.reduce((acc, c) => {
        const grades = c.capstone_submissions?.map(s => s.grade).filter(g => g !== null) || [];
        return acc + (grades.length ? grades.reduce((a, g) => a + g, 0) / grades.length : 0);
      }, 0) / (capstoneData?.length || 1),
      timeRange,
      generatedAt: new Date().toISOString()
    };
  }

  static async getStudentAnalytics(userId: string) {
    return await AIServices.analyzeStudentProgress({
      userId,
      analysisType: 'comprehensive',
      timeRange: '30d'
    });
  }

  // =============================================
  // NOTIFICATION OPERATIONS  
  // =============================================
  
  static async sendBulkNotification(params: {
    tenantId?: string;
    title: string;
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error' | 'assignment' | 'grade' | 'announcement';
    actionUrl?: string;
    sendTo: 'tenant' | 'all';
  }) {
    return await AIServices.sendNotification(params);
  }

  // =============================================
  // CONTENT OPERATIONS
  // =============================================
  
  static async getContentForSkill(skillId: string) {
    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .eq('skill_id', skillId)
      .eq('status', 'Published')
      .eq('is_active', true)
      .order('created_at');

    if (error) throw error;
    return data;
  }

  static async createContentItem(contentData: {
    title: string;
    description?: string;
    contentType: string;
    contentUrl?: string;
    thumbnailUrl?: string;
    durationMinutes?: number;
    skillId: string;
    metadata?: any;
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('content_items')
      .insert({
        title: contentData.title,
        description: contentData.description,
        content_type: contentData.contentType,
        content_url: contentData.contentUrl,
        thumbnail_url: contentData.thumbnailUrl,
        duration_minutes: contentData.durationMinutes,
        skill_id: contentData.skillId,
        metadata: contentData.metadata || {},
        created_by: user.id,
        status: 'Draft', // Start as draft for review
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}