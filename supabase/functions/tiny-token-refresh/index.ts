import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("=== Iniciando renovação de token Tiny ERP ===")

    const { refresh_token, client_id, client_secret } = await req.json()

    if (!refresh_token || !client_id || !client_secret) {
      throw new Error('Parâmetros obrigatórios não fornecidos')
    }

    console.log("🔄 Fazendo requisição para renovar token...")
    const response = await fetch(
      "https://accounts.tiny.com.br/realms/tiny/protocol/openid-connect/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          client_id,
          client_secret,
          refresh_token,
        }),
      }
    )

    if (!response.ok) {
      console.error(`❌ Erro ao renovar token: ${response.status} - ${response.statusText}`)
      const errorText = await response.text()
      console.error("Resposta da API:", errorText)
      throw new Error(`Erro ao renovar token: ${response.statusText}`)
    }

    const tokens = await response.json()
    console.log("✅ Tokens renovados com sucesso")

    // Calcular timestamps de expiração
    const now = new Date()
    const tokenExpiresAt = new Date(now.getTime() + tokens.expires_in * 1000)
    const refreshTokenExpiresAt = tokens.refresh_token_expires_in 
      ? new Date(now.getTime() + tokens.refresh_token_expires_in * 1000)
      : null

    return new Response(
      JSON.stringify({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expires_at: tokenExpiresAt.toISOString(),
        refresh_token_expires_at: refreshTokenExpiresAt?.toISOString(),
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
        status: 200,
      },
    )

  } catch (error) {
    console.error("❌ Erro na Edge Function:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
        status: 400,
      },
    )
  }
})