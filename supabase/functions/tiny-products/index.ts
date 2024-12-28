import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log("Edge Function: Starting tiny-products request")
    
    // Obter o token do corpo da requisição
    const { access_token } = await req.json()
    
    if (!access_token) {
      console.error("Edge Function: No access token provided")
      throw new Error('Token de acesso não fornecido')
    }

    console.log("Edge Function: Making request to Tiny API")
    const response = await fetch('https://api.tiny.com.br/public-api/v3/produtos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`,
      },
    })

    if (!response.ok) {
      console.error(`Edge Function: Tiny API error: ${response.status} - ${response.statusText}`)
      throw new Error(`Erro na API do Tiny: ${response.statusText}`)
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