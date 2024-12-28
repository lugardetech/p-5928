import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

console.log("Hello from Mercado Livre Token Exchange!")

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { code, userId, integrationId } = await req.json()

    console.log(`=== Recebido código de autorização: ${code} ===`)
    console.log(`=== Para usuário: ${userId} ===`)
    console.log(`=== Para integração: ${integrationId} ===`)

    // Buscar credenciais da integração
    const { data: userIntegration, error: fetchError } = await supabaseClient
      .from('user_integrations')
      .select('settings')
      .eq('user_id', userId)
      .eq('integration_id', integrationId)
      .maybeSingle()

    if (fetchError || !userIntegration) {
      throw new Error('Credenciais não encontradas')
    }

    const { client_id, client_secret, redirect_uri } = userIntegration.settings

    // Trocar código por tokens
    const tokenResponse = await fetch('https://api.mercadolibre.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id,
        client_secret,
        code,
        redirect_uri,
      }),
    })

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json()
      console.error('❌ Erro ao trocar tokens:', error)
      throw new Error(`Erro ao trocar tokens: ${JSON.stringify(error)}`)
    }

    const tokens = await tokenResponse.json()
    console.log('✅ Tokens obtidos com sucesso')

    // Calcular data de expiração dos tokens
    const now = new Date()
    const tokenExpiresAt = new Date(now.getTime() + tokens.expires_in * 1000)
    const refreshTokenExpiresAt = new Date(now.getTime() + tokens.refresh_token_expires_in * 1000)

    // Salvar tokens no banco
    const { error: updateError } = await supabaseClient
      .from('user_integrations')
      .update({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expires_at: tokenExpiresAt.toISOString(),
        refresh_token_expires_at: refreshTokenExpiresAt.toISOString(),
      })
      .eq('user_id', userId)
      .eq('integration_id', integrationId)

    if (updateError) {
      console.error('❌ Erro ao salvar tokens:', updateError)
      throw updateError
    }

    console.log('✅ Tokens salvos com sucesso')

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
        status: 200 
      },
    )

  } catch (err) {
    console.error('❌ Erro:', err)
    return new Response(
      JSON.stringify({ error: err.message }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        }, 
        status: 400 
      },
    )
  }
})