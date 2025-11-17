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

  // Verify the user making the request is authenticated
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    console.error('Unauthorized: No Authorization header provided.');
    return new Response(JSON.stringify({ error: 'Unauthorized: No Authorization header' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Create a Supabase client with the service role key to access sms_api_credentials
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    const { phoneNumber, message } = await req.json();

    if (!phoneNumber || !message) {
      console.error('Missing required fields in request body:', { phoneNumber, message });
      return new Response(JSON.stringify({ error: 'Missing required fields: phoneNumber, message' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch SMS API credentials from the database
    const { data: credentials, error: credentialsError } = await supabaseAdmin
      .from('sms_api_credentials')
      .select('instance_id, access_token')
      .limit(1); // Assuming one set of credentials for simplicity

    if (credentialsError) {
      console.error('Error fetching SMS API credentials:', credentialsError.message);
      return new Response(JSON.stringify({ error: 'Failed to fetch SMS API credentials: ' + credentialsError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!credentials || credentials.length === 0) {
      console.error('SMS API credentials not found in database.');
      return new Response(JSON.stringify({ error: 'SMS API credentials not found. Please configure them in settings.' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { instance_id, access_token } = credentials[0];

    // Construct the SMS API URL
    const encodedMessage = encodeURIComponent(message);
    const smsApiUrl = `https://whatsupsms.in/api/send?number=${phoneNumber}&type=text&message=${encodedMessage}&instance_id=${instance_id}&access_token=${access_token}`;

    console.log('Attempting to send SMS to:', phoneNumber);
    console.log('SMS API URL:', smsApiUrl); // Log the full URL for debugging

    // Send the SMS
    const smsResponse = await fetch(smsApiUrl);

    if (!smsResponse.ok) {
      const errorText = await smsResponse.text(); // Get raw text for more info
      console.error(`SMS API returned non-OK status: ${smsResponse.status} ${smsResponse.statusText}`);
      console.error('SMS API raw error response:', errorText);
      return new Response(JSON.stringify({ error: 'Failed to send SMS: ' + errorText }), {
        status: smsResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const smsData = await smsResponse.json();
    console.log('SMS API successful response:', smsData);

    return new Response(JSON.stringify({ message: 'SMS sent successfully', smsResponse: smsData }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Unexpected error in send-sms function:', error.message);
    return new Response(JSON.stringify({ error: 'Internal Server Error: ' + error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});