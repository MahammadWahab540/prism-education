import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Demo users configuration
    const demoUsers = [
      {
        email: 'student@demo.com',
        password: 'Demo123!',
        name: 'Demo Student',
        role: 'student' as const,
        tenantId: null,
      },
      {
        email: 'tenantadmin@demo.com',
        password: 'Demo123!',
        name: 'Demo Tenant Admin',
        role: 'tenant_admin' as const,
        tenantId: null, // Will be set to first available tenant
      }
    ];

    const results = [];

    // Get first tenant for tenant admin
    const { data: tenants } = await supabaseAdmin
      .from('tenants')
      .select('id')
      .eq('is_active', true)
      .limit(1)
      .single();

    const tenantId = tenants?.id;

    for (const user of demoUsers) {
      // Check if user already exists
      const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
      const userExists = existingUser?.users?.some(u => u.email === user.email);

      let userId: string;

      if (userExists) {
        const existing = existingUser?.users?.find(u => u.email === user.email);
        userId = existing!.id;
        console.log(`User ${user.email} already exists with ID: ${userId}`);
      } else {
        // Create user
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
          user_metadata: {
            name: user.name,
          }
        });

        if (authError) {
          console.error(`Error creating user ${user.email}:`, authError);
          continue;
        }

        userId = authData.user.id;
        console.log(`Created user ${user.email} with ID: ${userId}`);
      }

      // Update or create profile
      const profileData = {
        id: userId,
        email: user.email,
        name: user.name,
        tenant_id: user.role === 'tenant_admin' ? tenantId : null,
        is_active: true,
      };

      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .upsert(profileData, { onConflict: 'id' });

      if (profileError) {
        console.error(`Error creating profile for ${user.email}:`, profileError);
      }

      // Assign role
      const { error: roleError } = await supabaseAdmin
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: user.role,
          tenant_id: user.role === 'tenant_admin' ? tenantId : null,
        }, { onConflict: 'user_id,role,tenant_id' });

      if (roleError) {
        console.error(`Error assigning role to ${user.email}:`, roleError);
      }

      results.push({
        email: user.email,
        password: user.password,
        role: user.role,
        success: true,
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Demo users created successfully',
        credentials: results,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error creating demo users:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
