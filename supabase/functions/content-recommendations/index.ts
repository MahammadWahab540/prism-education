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
    const { userId, limit = 5 } = await req.json();

    console.log('Generating content recommendations for user:', userId);

    if (!userId) {
      throw new Error('userId is required');
    }

    // Get user profile and learning data
    const { data: userProfile, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !userProfile) {
      throw new Error('User not found');
    }

    // Get user's active learning paths and skill progress
    const { data: learningPaths } = await supabase
      .from('learning_paths')
      .select(`
        *,
        career_goals (
          name,
          difficulty,
          career_goal_skills (
            skill_id
          )
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'active');

    const { data: skillProgress } = await supabase
      .from('skill_progress')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    // Get recent learning sessions
    const { data: recentSessions } = await supabase
      .from('learning_sessions')
      .select(`
        *,
        content_items (
          title,
          content_type,
          skill_id
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    // Build context for AI recommendations
    const userContext = {
      name: userProfile.name,
      engagementScore: userProfile.engagement_score,
      streakDays: userProfile.streak_days,
      totalWatchTime: userProfile.total_watch_time_hours,
      activeGoals: learningPaths?.map(lp => lp.career_goals?.name) || [],
      skillProgress: skillProgress?.map(sp => ({
        skillId: sp.skill_id,
        progress: sp.overall_progress_percent,
        quizScore: sp.average_quiz_score
      })) || [],
      recentActivity: recentSessions?.map(rs => ({
        contentType: rs.content_items?.content_type,
        skillId: rs.content_items?.skill_id,
        watchTime: rs.watch_time_seconds,
        completed: rs.completed
      })) || []
    };

    const systemPrompt = `You are an AI learning advisor that recommends personalized content for students.

User Profile:
- Name: ${userContext.name}
- Engagement Score: ${userContext.engagementScore}/100
- Learning Streak: ${userContext.streakDays} days
- Total Watch Time: ${userContext.totalWatchTime} hours
- Active Career Goals: ${userContext.activeGoals.join(', ')}

Current Skill Progress:
${userContext.skillProgress.map(sp => `- Skill ${sp.skillId}: ${sp.progress}% progress, ${sp.quizScore}% quiz average`).join('\n')}

Recent Learning Activity:
${userContext.recentActivity.map(ra => `- ${ra.contentType} for skill ${ra.skillId}, ${ra.watchTime}s watched, completed: ${ra.completed}`).join('\n')}

Based on this data, recommend ${limit} specific learning actions/content that would be most beneficial for this user's growth. Consider:
1. Skills where they're struggling (low progress/quiz scores)
2. Natural progression from their current level
3. Content types they engage with most
4. Skills needed for their career goals
5. Areas where they haven't been active recently

Return a JSON array with this structure:
[
  {
    "title": "Specific recommendation title",
    "description": "Why this is recommended",
    "type": "video|quiz|article|capstone|practice",
    "priority": "high|medium|low",
    "estimatedTime": "30 minutes",
    "skillId": "skill-id-if-applicable",
    "reason": "Explanation of why this is recommended"
  }
]`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Please generate personalized learning recommendations for this user.' }
        ],
        temperature: 0.5,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'OpenAI API request failed');
    }

    const aiData = await response.json();
    let recommendations;
    
    try {
      recommendations = JSON.parse(aiData.choices[0].message.content);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      throw new Error('Failed to parse AI recommendations');
    }

    // Log the recommendation generation
    await supabase
      .from('audit_logs')
      .insert({
        user_id: userId,
        action: 'content_recommendations_generated',
        resource_type: 'ai_recommendations',
        new_values: { 
          recommendations: recommendations.length,
          context: 'ai_generated'
        },
      });

    return new Response(JSON.stringify({ 
      recommendations,
      generatedAt: new Date().toISOString(),
      context: 'ai_personalized'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating content recommendations:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});