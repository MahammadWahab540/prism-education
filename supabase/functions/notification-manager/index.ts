import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { 
      type,
      userId,
      tenantId,
      title,
      message,
      actionUrl,
      metadata = {},
      sendTo = 'user' // 'user', 'tenant', 'all'
    } = await req.json();

    console.log('Processing notification:', { type, sendTo, title });

    let targetUsers: string[] = [];

    // Determine target users based on sendTo parameter
    switch (sendTo) {
      case 'user':
        if (!userId) throw new Error('userId required for user notifications');
        targetUsers = [userId];
        break;
        
      case 'tenant':
        if (!tenantId) throw new Error('tenantId required for tenant notifications');
        const { data: tenantUsers } = await supabase
          .from('profiles')
          .select('id')
          .eq('tenant_id', tenantId)
          .eq('is_active', true);
        targetUsers = tenantUsers?.map(u => u.id) || [];
        break;
        
      case 'all':
        const { data: allUsers } = await supabase
          .from('profiles')
          .select('id')
          .eq('is_active', true);
        targetUsers = allUsers?.map(u => u.id) || [];
        break;
        
      default:
        throw new Error('Invalid sendTo parameter');
    }

    if (targetUsers.length === 0) {
      throw new Error('No target users found');
    }

    // Create notifications for all target users
    const notifications = targetUsers.map(targetUserId => ({
      user_id: targetUserId,
      title,
      message,
      type: type || 'info',
      action_url: actionUrl,
      metadata,
    }));

    const { data: createdNotifications, error: insertError } = await supabase
      .from('notifications')
      .insert(notifications)
      .select('*');

    if (insertError) {
      throw insertError;
    }

    console.log(`Created ${createdNotifications.length} notifications`);

    // Handle different notification types with specific logic
    switch (type) {
      case 'assignment':
        // Could trigger assignment-related workflows
        break;
        
      case 'grade':
        // Update user engagement score based on grade
        if (userId && metadata.grade) {
          await updateEngagementScore(userId, metadata.grade);
        }
        break;
        
      case 'streak':
        // Award streak achievement
        if (userId && metadata.streakDays) {
          await awardStreakAchievement(userId, metadata.streakDays);
        }
        break;
    }

    // Log the notification creation
    await supabase
      .from('audit_logs')
      .insert({
        user_id: userId,
        tenant_id: tenantId,
        action: 'bulk_notification_created',
        resource_type: 'notifications',
        new_values: { 
          type,
          recipientCount: targetUsers.length,
          sendTo
        },
      });

    return new Response(JSON.stringify({ 
      success: true,
      notificationsCreated: createdNotifications.length,
      recipients: targetUsers.length,
      message: 'Notifications sent successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in notification manager:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Helper function to update engagement score based on grade
async function updateEngagementScore(userId: string, grade: number) {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('engagement_score')
      .eq('id', userId)
      .single();

    if (profile) {
      // Simple algorithm: boost engagement based on grade performance
      const currentScore = profile.engagement_score || 0;
      const gradeBoost = grade >= 90 ? 5 : grade >= 80 ? 3 : grade >= 70 ? 1 : 0;
      const newScore = Math.min(100, currentScore + gradeBoost);

      await supabase
        .from('profiles')
        .update({ engagement_score: newScore })
        .eq('id', userId);

      console.log(`Updated engagement score for ${userId}: ${currentScore} -> ${newScore}`);
    }
  } catch (error) {
    console.error('Error updating engagement score:', error);
  }
}

// Helper function to award streak achievements
async function awardStreakAchievement(userId: string, streakDays: number) {
  try {
    // Award streak milestones
    const milestones = [7, 14, 30, 60, 100];
    const achievedMilestones = milestones.filter(m => streakDays >= m);
    
    if (achievedMilestones.length > 0) {
      const latestMilestone = Math.max(...achievedMilestones);
      
      // Create achievement notification
      await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title: '🏆 Streak Achievement Unlocked!',
          message: `Congratulations! You've achieved a ${latestMilestone}-day learning streak!`,
          type: 'success',
          metadata: { 
            achievement: 'streak_milestone',
            streakDays: latestMilestone,
            category: 'engagement'
          }
        });

      console.log(`Awarded streak achievement for ${userId}: ${latestMilestone} days`);
    }
  } catch (error) {
    console.error('Error awarding streak achievement:', error);
  }
}