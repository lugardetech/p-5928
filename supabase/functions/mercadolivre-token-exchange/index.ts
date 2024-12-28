import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { validateAndGetIntegration, getUserIntegration, exchangeToken, saveTokens } from '../_shared/mercadolivre.ts'
import { IntegrationError } from '../_shared/errors.ts'
import { TokenExchangeRequest } from '../_shared/types.ts'

console.log("Hello from Mercado Livre Token Exchange!")

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método não permitido' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405
    })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const request = await req.json() as TokenExchangeRequest

    if (!request.code || !request.userId || !request.integrationId) {
      return new Response(JSON.stringify({ error: 'Campos obrigatórios faltando' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      })
    }

    console.log('=== Iniciando troca de tokens ===', {
      code: request.code,
      userId: request.userId,
      integrationId: request.integrationId
    })

    await validateAndGetIntegration(supabaseClient, request)
    const userIntegration = await getUserIntegration(supabaseClient, request)
    const tokens = await exchangeToken(userIntegration.settings, request.code)
    await saveTokens(supabaseClient, userIntegration.id, tokens)

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (err) {
    console.error('❌ Erro:', err)
    const status = err instanceof IntegrationError ? 400 : 500
    const message = err instanceof IntegrationError ? err.message : 'Erro interno do servidor'
    
    return new Response(
      JSON.stringify({ error: message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status
      }
    )
  }
})