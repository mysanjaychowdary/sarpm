import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Verify the user making the request is authenticated (e.g., an admin)
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized: No Authorization header' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Create a Supabase client with the service role key
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    const { name, email, password, role, is_active } = await req.json();

    if (!name || !email || !password || !role) {
      return new Response(JSON.stringify({ error: 'Missing required fields: name, email, password, role' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create the user in Supabase Auth
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // Assuming email confirmation is off
      user_metadata: {
        name,
        role,
      },
    });

    if (userError) {
      console.error('Error creating user:', userError.message);
      return new Response(JSON.stringify({ error: 'Failed to create user: ' + userError.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Insert into public.team_members table
    const { data: teamMemberData, error: teamMemberError } = await supabaseAdmin
      .from('team_members')
      .insert({
        id: userData.user?.id,
        name,
        email,
        role,
        is_active,
      })
      .select();

    if (teamMemberError) {
      console.error('Error inserting team member:', teamMemberError.message);
      // Optionally, you might want to delete the user created in auth.users if this fails
      await supabaseAdmin.auth.admin.deleteUser(userData.user!.id);
      return new Response(JSON.stringify({ error: 'Failed to add team member: ' + teamMemberError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: 'Team member created successfully', teamMember: teamMemberData[0] }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Unexpected error:', error.message);
    return new Response(JSON.stringify({ error: 'Internal Server Error: ' + error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});