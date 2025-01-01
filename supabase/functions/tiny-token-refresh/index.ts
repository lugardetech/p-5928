import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("=== Iniciando renovação de token Tiny ERP ===")

    const { user_id } = await req.json()

    if (!user_id) {
      throw new Error('ID do usuário não fornecido')
    }

    // Buscar refresh token das secrets
    const refreshToken = Deno.env.get(`TINY_REFRESH_TOKEN_${user_id}`);
    if (!refreshToken) {
      throw new Error('Refresh token não encontrado');
    }

    // Buscar configurações da integração
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: integration, error: fetchError } = await supabaseAdmin
      .from('integrations')
      .select('*')
      .eq('user_id', user_id)
      .eq('name', 'tiny_erp')
      .single();

    if (fetchError || !integration?.settings) {
      throw new Error('Configurações da integração não encontradas');
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
          client_id: integration.settings.client_id,
          client_secret: integration.settings.client_secret,
          refresh_token: refreshToken,
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

    // Atualizar timestamps no banco
    const { error: updateError } = await supabaseAdmin
      .from('integrations')
      .update({
        token_expires_at: tokenExpiresAt.toISOString(),
        refresh_token_expires_at: refreshTokenExpiresAt?.toISOString(),
      })
      .eq('id', integration.id);

    if (updateError) {
      console.error("Erro ao atualizar timestamps:", updateError);
      throw new Error('Erro ao atualizar timestamps dos tokens');
    }

    // Salvar novos tokens nas secrets
    const secretsResponse = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/secrets`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: `TINY_ACCESS_TOKEN_${user_id}`,
          value: tokens.access_token
        })
      }
    );

    if (!secretsResponse.ok) {
      throw new Error('Erro ao salvar access token nas secrets');
    }

    const refreshSecretResponse = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/secrets`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: `TINY_REFRESH_TOKEN_${user_id}`,
          value: tokens.refresh_token
        })
      }
    );

    if (!refreshSecretResponse.ok) {
      throw new Error('Erro ao salvar refresh token nas secrets');
    }

    return new Response(
      JSON.stringify({
        access_token: tokens.access_token,
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