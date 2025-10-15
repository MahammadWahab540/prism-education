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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { 
      message, 
      context,
      userId,
      skillId,
      currentContent 
    } = await req.json();

    console.log('AI Tutor request:', { userId, skillId, message: message?.substring(0, 100) });

    if (!message || !userId) {
      throw new Error('Message and userId are required');
    }

    // Get user context from database
    const { data: userProfile, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !userProfile) {
      throw new Error('User not found');
    }

    // Get skill context if provided
    let skillContext = '';
    if (skillId) {
      const { data: skillData } = await supabase
        .from('skills')
        .select('name, description, category, difficulty')
        .eq('id', skillId)
        .single();
      
      if (skillData) {
        skillContext = `Current skill: ${skillData.name} (${skillData.difficulty})\nDescription: ${skillData.description}\n`;
      }

      // Get user's progress for this skill
      const { data: progressData } = await supabase
        .from('skill_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('skill_id', skillId)
        .single();
      
      if (progressData) {
        skillContext += `Current progress: ${progressData.overall_progress_percent}%\nAverage quiz score: ${progressData.average_quiz_score}%\n`;
      }
    }

    // Build AI tutor prompt
    const systemPrompt = `You are an expert AI tutor for the LMS platform. Your role is to provide personalized, encouraging, and educational responses to help students learn effectively.

User Context:
- Name: ${userProfile.name}
- Role: ${userProfile.role}
- Learning streak: ${userProfile.streak_days} days
- Total watch time: ${userProfile.total_watch_time_hours} hours
- Engagement score: ${userProfile.engagement_score}/100

${skillContext}

${currentContent ? `Current learning content: ${currentContent}` : ''}

Guidelines:
1. Be encouraging and supportive
2. Provide clear, actionable explanations
3. Break down complex topics into digestible parts
4. Suggest practical exercises or next steps
5. Reference the user's progress when relevant
6. Keep responses focused and concise
7. Use examples and analogies when helpful
8. If the question is outside your knowledge, admit it and suggest alternatives`;

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
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'OpenAI API request failed');
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Log the interaction for analytics
    const { error: logError } = await supabase
      .from('audit_logs')
      .insert({
        user_id: userId,
        action: 'ai_tutor_interaction',
        resource_type: 'ai_tutor',
        resource_id: skillId,
        new_values: { 
          message: message.substring(0, 500), 
          response: aiResponse.substring(0, 500),
          context: context 
        },
      });

    if (logError) {
      console.error('Error logging AI tutor interaction:', logError);
    }

    return new Response(JSON.stringify({ 
      response: aiResponse,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI tutor function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});