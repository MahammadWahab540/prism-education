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
      templateId, 
      userId,
      customRequirements,
      difficulty,
      timeframe 
    } = await req.json();

    console.log('Generating roadmap for:', { templateId, userId, difficulty, timeframe });

    if (!templateId || !userId) {
      throw new Error('templateId and userId are required');
    }

    // Get template details
    const { data: template, error: templateError } = await supabase
      .from('capstone_templates')
      .select(`
        *,
        skills (
          name,
          description,
          category,
          difficulty
        )
      `)
      .eq('id', templateId)
      .single();

    if (templateError || !template) {
      throw new Error('Template not found');
    }

    // Get user profile for personalization
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('name, role, total_watch_time_hours, engagement_score')
      .eq('id', userId)
      .single();

    // Get user's skill progress
    const { data: userProgress } = await supabase
      .from('skill_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('skill_id', template.skill_id)
      .single();

    const systemPrompt = `You are an expert project architect and educational designer. Generate a comprehensive, personalized capstone project roadmap.

Project Template:
Title: ${template.title}
Skill: ${template.skills?.name}
Difficulty: ${template.difficulty}
Overview: ${JSON.stringify(template.overview)}

User Context:
- Name: ${userProfile?.name || 'Student'}
- Experience level: ${userProfile?.total_watch_time_hours || 0} hours of learning
- Engagement score: ${userProfile?.engagement_score || 0}/100
- Current skill progress: ${userProgress?.overall_progress_percent || 0}%
- Preferred timeframe: ${timeframe || '2-4 weeks'}
- Custom requirements: ${customRequirements || 'None specified'}

Generate a detailed JSON roadmap with the following structure:
{
  "project": {
    "title": "Personalized project title",
    "summary": "Brief project summary tailored to user's level"
  },
  "stages": [
    {
      "id": "stage-1",
      "name": "Stage name",
      "order": 1,
      "estimatedDays": 3,
      "uiChecks": ["Specific deliverable 1", "Specific deliverable 2"],
      "validation": ["Technical validation criteria"],
      "expectedOutcome": "What the user will achieve"
    }
  ],
  "subProjects": [
    {
      "id": "sp-backend",
      "title": "Sub-project title",
      "description": "Detailed description",
      "dependencies": [],
      "tasks": [
        {
          "id": "task-1",
          "title": "Task title",
          "description": "Task description",
          "dependencies": [],
          "acceptanceCriteria": ["Criteria 1", "Criteria 2"],
          "subTasks": [
            {
              "id": "subtask-1",
              "title": "Subtask title",
              "description": "Subtask description",
              "acceptanceCriteria": ["Acceptance criteria"]
            }
          ],
          "stageId": "stage-1"
        }
      ]
    }
  ]
}

Make the roadmap challenging but achievable, with 4-6 stages and practical, hands-on tasks. Ensure all technical requirements align with the skill level and template objectives.`;

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
          { role: 'user', content: 'Please generate the personalized capstone roadmap based on the provided context.' }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'OpenAI API request failed');
    }

    const aiData = await response.json();
    let generatedRoadmap;
    
    try {
      generatedRoadmap = JSON.parse(aiData.choices[0].message.content);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      throw new Error('Failed to parse AI-generated roadmap');
    }

    // Validate the roadmap structure
    if (!generatedRoadmap.project || !generatedRoadmap.stages || !generatedRoadmap.subProjects) {
      throw new Error('Invalid roadmap structure generated');
    }

    // Create capstone instance
    const { data: instance, error: instanceError } = await supabase
      .from('capstone_instances')
      .insert({
        user_id: userId,
        template_id: templateId,
        skill_id: template.skill_id,
        status: 'Active',
        roadmap: generatedRoadmap,
        progress: {
          stages: {},
          tasks: {},
          overallProgress: 0
        }
      })
      .select()
      .single();

    if (instanceError) {
      throw instanceError;
    }

    console.log('Capstone instance created:', instance.id);

    // Log the roadmap generation
    await supabase
      .from('audit_logs')
      .insert({
        user_id: userId,
        action: 'capstone_roadmap_generated',
        resource_type: 'capstone_instance',
        resource_id: instance.id,
        new_values: { template_id: templateId, ai_generated: true },
      });

    return new Response(JSON.stringify({ 
      roadmap: generatedRoadmap,
      instanceId: instance.id,
      message: 'Capstone roadmap generated successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating capstone roadmap:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});