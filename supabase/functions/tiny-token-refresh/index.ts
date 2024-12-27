import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("=== Iniciando renovação de tokens do Tiny ERP ===")

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Buscar todas as integrações ativas que precisam de renovação
    const now = new Date()
    const { data: userIntegrations, error: fetchError } = await supabaseAdmin
      .from('user_integrations')
      .select('id, user_id, settings, refresh_token, token_expires_at')
      .eq('status', true)
      .lt('token_expires_at', now.toISOString())
      .not('refresh_token', 'is', null)

    if (fetchError) {
      console.error("❌ Erro ao buscar integrações:", fetchError)
      throw fetchError
    }

    console.log(`🔄 Encontradas ${userIntegrations?.length || 0} integrações para renovar`)

    const results = await Promise.all((userIntegrations || []).map(async (integration) => {
      try {
        console.log(`\n🔄 Renovando tokens para integração ${integration.id}`)
        
        const settings = integration.settings as {
          client_id: string
          client_secret: string
          redirect_uri: string
        }

        // Fazer a requisição para renovar o token
        const tokenResponse = await fetch(
          "https://accounts.tiny.com.br/realms/tiny/protocol/openid-connect/token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              grant_type: "refresh_token",
              client_id: settings.client_id,
              client_secret: settings.client_secret,
              refresh_token: integration.refresh_token || '',
            }),
          }
        )

        const responseText = await tokenResponse.text()
        console.log(`Resposta da API do Tiny para ${integration.id}:`, responseText)

        if (!tokenResponse.ok) {
          throw new Error(`Erro ao renovar tokens: ${responseText}`)
        }

        const tokens = JSON.parse(responseText)
        
        // Calcular novos timestamps de expiração
        const newTokenExpiresAt = new Date(now.getTime() + tokens.expires_in * 1000)
        const newRefreshTokenExpiresAt = tokens.refresh_token_expires_in 
          ? new Date(now.getTime() + tokens.refresh_token_expires_in * 1000)
          : null

        // Atualizar tokens no banco
        const { error: updateError } = await supabaseAdmin
          .from('user_integrations')
          .update({
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            token_expires_at: newTokenExpiresAt.toISOString(),
            refresh_token_expires_at: newRefreshTokenExpiresAt?.toISOString(),
          })
          .eq('id', integration.id)

        if (updateError) {
          throw updateError
        }

        console.log(`✅ Tokens renovados com sucesso para integração ${integration.id}`)
        return { success: true, integration_id: integration.id }
      } catch (error) {
        console.error(`❌ Erro ao renovar tokens para integração ${integration.id}:`, error)
        return { success: false, integration_id: integration.id, error }
      }
    }))

    console.log("\n=== Resumo da renovação de tokens ===")
    console.log("Total processado:", results.length)
    console.log("Sucessos:", results.filter(r => r.success).length)
    console.log("Falhas:", results.filter(r => !r.success).length)

    return new Response(
      JSON.stringify({ 
        success: true,
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error("❌ Erro geral na renovação de tokens:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})