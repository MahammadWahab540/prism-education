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
    const { userId, analysisType = 'comprehensive', timeRange = '30d' } = await req.json();

    console.log('Analyzing student progress:', { userId, analysisType, timeRange });

    if (!userId) {
      throw new Error('userId is required');
    }

    // Get comprehensive user data
    const { data: userProfile, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !userProfile) {
      throw new Error('User not found');
    }

    // Calculate date range for analysis
    const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    // Get learning sessions data
    const { data: learningSessions } = await supabase
      .from('learning_sessions')
      .select(`
        *,
        content_items (
          title,
          content_type,
          skill_id,
          duration_minutes
        )
      `)
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    // Get skill progress data
    const { data: skillProgress } = await supabase
      .from('skill_progress')
      .select(`
        *,
        skills (
          name,
          category,
          difficulty
        )
      `)
      .eq('user_id', userId);

    // Get capstone instances
    const { data: capstoneInstances } = await supabase
      .from('capstone_instances')
      .select(`
        *,
        capstone_submissions (
          submission_type,
          submitted_at,
          grade
        )
      `)
      .eq('user_id', userId);

    // Get learning path information
    const { data: learningPaths } = await supabase
      .from('learning_paths')
      .select(`
        *,
        career_goals (
          name,
          difficulty,
          duration_min_months,
          duration_max_months
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'active');

    // Build comprehensive data for AI analysis
    const analysisData = {
      profile: {
        name: userProfile.name,
        role: userProfile.role,
        totalWatchTime: userProfile.total_watch_time_hours,
        streakDays: userProfile.streak_days,
        engagementScore: userProfile.engagement_score
      },
      recentActivity: learningSessions?.map(session => ({
        contentType: session.content_items?.content_type,
        skillId: session.content_items?.skill_id,
        watchTimeSeconds: session.watch_time_seconds,
        progressPercentage: session.progress_percentage,
        completed: session.completed,
        sessionDate: session.created_at
      })) || [],
      skillProgress: skillProgress?.map(sp => ({
        skillName: sp.skills?.name,
        category: sp.skills?.category,
        difficulty: sp.skills?.difficulty,
        progressPercent: sp.overall_progress_percent,
        quizAverage: sp.average_quiz_score,
        capstoneRequested: sp.capstone_project_requested
      })) || [],
      capstoneProjects: capstoneInstances?.map(ci => ({
        status: ci.status,
        submissionCount: ci.capstone_submissions?.length || 0,
        averageGrade: ci.capstone_submissions?.length ? 
          ci.capstone_submissions.reduce((acc: number, sub: any) => acc + (sub.grade || 0), 0) / ci.capstone_submissions.length : 0
      })) || [],
      careerGoals: learningPaths?.map(lp => ({
        goalName: lp.career_goals?.name,
        difficulty: lp.career_goals?.difficulty,
        selectedSkills: lp.selected_skills?.length || 0
      })) || []
    };

    const systemPrompt = `You are an expert learning analytics specialist. Analyze this student's comprehensive learning data and provide actionable insights.

Student Data:
${JSON.stringify(analysisData, null, 2)}

Analysis Type: ${analysisType}
Time Range: ${timeRange}

Provide a detailed analysis with:
1. **Strengths**: What the student excels at
2. **Challenges**: Areas needing improvement
3. **Learning Patterns**: Insights about their study habits
4. **Recommendations**: Specific, actionable next steps
5. **Risk Factors**: Any concerning patterns (low engagement, inconsistent progress)
6. **Goal Alignment**: How well their current progress aligns with career goals

Return a JSON response with this structure:
{
  "summary": "One paragraph overview of student's status",
  "strengths": ["Strength 1", "Strength 2"],
  "challenges": ["Challenge 1", "Challenge 2"],
  "learningPatterns": {
    "preferredContentType": "video|quiz|article",
    "bestLearningTime": "morning|afternoon|evening",
    "engagementLevel": "high|medium|low",
    "consistencyScore": 85
  },
  "recommendations": [
    {
      "category": "immediate",
      "action": "Specific action to take",
      "reason": "Why this is important",
      "timeframe": "1 week"
    }
  ],
  "riskFactors": ["Risk 1", "Risk 2"],
  "goalAlignment": {
    "score": 75,
    "analysis": "How well aligned they are with their goals"
  },
  "predictedOutcomes": {
    "completionProbability": 85,
    "suggestedInterventions": ["Intervention 1"]
  }
}`;

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
          { role: 'user', content: 'Please analyze this student\'s learning data and provide comprehensive insights.' }
        ],
        temperature: 0.2,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'OpenAI API request failed');
    }

    const aiData = await response.json();
    let analysis;
    
    try {
      analysis = JSON.parse(aiData.choices[0].message.content);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      throw new Error('Failed to parse AI analysis');
    }

    // Log the analysis generation
    await supabase
      .from('audit_logs')
      .insert({
        user_id: userId,
        action: 'progress_analysis_generated',
        resource_type: 'student_analytics',
        new_values: { 
          analysis_type: analysisType,
          time_range: timeRange,
          ai_generated: true
        },
      });

    return new Response(JSON.stringify({ 
      analysis,
      generatedAt: new Date().toISOString(),
      dataPoints: {
        sessionsAnalyzed: learningSessions?.length || 0,
        skillsTracked: skillProgress?.length || 0,
        capstoneProjects: capstoneInstances?.length || 0
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error analyzing student progress:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});