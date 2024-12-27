import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log("Edge Function: Starting tiny-products request")
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error("Edge Function: No authorization header provided")
      throw new Error('No authorization header')
    }

    console.log("Edge Function: Making request to Tiny API")
    const response = await fetch('https://api.tiny.com.br/public-api/v3/produtos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader, // Already in "Bearer {token}" format from the frontend
      },
    })

    if (!response.ok) {
      console.error(`Edge Function: Tiny API error: ${response.status} - ${response.statusText}`)
      throw new Error(`Tiny API error: ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Edge Function: Successfully retrieved products from Tiny API")

    return new Response(
      JSON.stringify(data),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error("Edge Function Error:", error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})