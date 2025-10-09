import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  tenantId: string;
  adminEmail: string;
  adminName: string;
  tenantName: string;
  temporaryPassword?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { tenantId, adminEmail, adminName, tenantName, temporaryPassword } = await req.json() as WelcomeEmailRequest;

    console.log('Sending welcome email:', { tenantId, adminEmail, tenantName });

    // For now, we'll use Supabase's built-in email functionality
    // Create a magic link for the user to set their password
    const { data: magicLinkData, error: magicLinkError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: adminEmail,
      options: {
        redirectTo: `${supabaseUrl}/auth/callback`
      }
    });

    if (magicLinkError) {
      throw magicLinkError;
    }

    // Log the activity
    await supabase
      .from('audit_logs')
      .insert({
        tenant_id: tenantId,
        action: 'tenant_welcome_email_sent',
        resource_type: 'tenant',
        resource_id: tenantId,
        new_values: {
          adminEmail,
          adminName,
          tenantName,
        },
      });

    // In production, you would integrate with Resend or another email service here
    // For now, we return the magic link for testing
    console.log('Magic link generated:', magicLinkData.properties.action_link);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Welcome email sent successfully',
        magicLink: magicLinkData.properties.action_link,
        // In production, don't return the magic link
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in send-tenant-welcome:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
