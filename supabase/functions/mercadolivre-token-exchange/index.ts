import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

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

    const { code, userId, integrationId } = await req.json()

    if (!code || !userId || !integrationId) {
      return new Response(JSON.stringify({ error: 'Campos obrigatórios faltando' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      })
    }

    console.log(`=== Iniciando troca de tokens ===`)
    console.log(`=== Código de autorização: ${code} ===`)
    console.log(`=== ID do usuário: ${userId} ===`)
    console.log(`=== ID da integração: ${integrationId} ===`)

    // Primeiro, verificar se a integração existe
    const { data: integration, error: integrationError } = await supabaseClient
      .from('integrations')
      .select('*')
      .eq('id', integrationId)
      .maybeSingle()

    if (integrationError) {
      console.error('❌ Erro ao buscar integração:', integrationError)
      throw integrationError
    }

    if (!integration) {
      console.error('❌ Integração não encontrada no banco de dados')
      throw new Error('Integração não encontrada no banco de dados')
    }

    console.log('✅ Integração encontrada:', integration)

    // Buscar credenciais da integração do usuário
    const { data: userIntegration, error: fetchError } = await supabaseClient
      .from('user_integrations')
      .select('*')
      .eq('user_id', userId)
      .eq('integration_id', integrationId)
      .maybeSingle()

    if (fetchError) {
      console.error('❌ Erro ao buscar integração do usuário:', fetchError)
      throw fetchError
    }

    if (!userIntegration) {
      console.error('❌ Integração do usuário não encontrada')
      throw new Error('Integração do usuário não encontrada')
    }

    console.log('✅ Integração do usuário encontrada:', userIntegration)

    const settings = userIntegration.settings as Record<string, unknown>
    const client_id = settings.client_id as string
    const client_secret = settings.client_secret as string
    const redirect_uri = settings.redirect_uri as string

    if (!client_id || !client_secret || !redirect_uri) {
      console.error('❌ Credenciais incompletas:', { client_id, client_secret, redirect_uri })
      throw new Error('Credenciais incompletas')
    }

    try {
      new URL(redirect_uri)
    } catch (err) {
      console.error('❌ redirect_uri inválido:', redirect_uri)
      throw new Error('O redirect_uri deve ser uma URL válida')
    }

    console.log('✅ Iniciando troca de tokens com o Mercado Livre')

    // Trocar código por tokens usando a API do Mercado Livre
    const tokenResponse = await fetch('https://api.mercadolivre.com.br/oauth/token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id,
        client_secret,
        code,
        redirect_uri
      })
    })

    if (!tokenResponse.ok) {
      let errorData
      try {
        errorData = await tokenResponse.json()
      } catch (err) {
        console.error('❌ Erro ao parsear resposta do Mercado Livre:', err)
        throw new Error('Erro ao processar a resposta do Mercado Livre')
      }

      console.error('❌ Erro na resposta do Mercado Livre:', errorData)
      
      let errorMessage = 'Erro ao trocar tokens'
      
      switch(errorData.error) {
        case 'invalid_client':
          errorMessage = 'Credenciais do aplicativo (client_id/client_secret) inválidas'
          break
        case 'invalid_grant':
          errorMessage = 'Código de autorização inválido ou expirado'
          break
        case 'invalid_request':
          errorMessage = 'Requisição inválida - verifique os parâmetros enviados'
          break
        default:
          errorMessage = `Erro: ${errorData.error_description || errorData.message || JSON.stringify(errorData)}`
      }
      
      throw new Error(errorMessage)
    }

    const tokens = await tokenResponse.json()

    if (!tokens.access_token || !tokens.refresh_token || !tokens.expires_in || !tokens.token_type) {
      console.error('❌ Resposta do Mercado Livre incompleta:', tokens)
      throw new Error('Resposta da API do Mercado Livre está incompleta')
    }

    console.log('✅ Tokens obtidos com sucesso:', {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_in: tokens.expires_in,
      token_type: tokens.token_type
    })

    // Calcular data de expiração dos tokens
    const now = new Date()
    const tokenExpiresAt = new Date(now.getTime() + tokens.expires_in * 1000)
    const refreshTokenExpiresAt = new Date(now.getTime() + 15552000 * 1000) // 6 meses

    // Salvar tokens no banco
    const { data: updatedIntegration, error: updateError } = await supabaseClient
      .from('user_integrations')
      .update({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expires_at: tokenExpiresAt.toISOString(),
        refresh_token_expires_at: refreshTokenExpiresAt.toISOString(),
      })
      .eq('id', userIntegration.id)
      .select()
      .single()

    if (updateError || !updatedIntegration) {
      console.error('❌ Erro ao salvar tokens:', updateError)
      throw updateError || new Error('Erro ao salvar tokens no banco de dados')
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