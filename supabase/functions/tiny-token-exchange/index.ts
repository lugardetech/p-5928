import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { corsHeaders } from '../_shared/cors.ts';

interface TokenExchangeRequest {
  code: string;
  userId: string;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
}

async function getIntegrationSettings(supabaseAdmin: any, userId: string) {
  console.log("Buscando configurações da integração...");
  const { data: integration, error: fetchError } = await supabaseAdmin
    .from('integrations')
    .select('*')
    .eq('user_id', userId)
    .eq('name', 'tiny_erp')
    .single();

  if (fetchError) {
    console.error("Erro ao buscar configurações:", fetchError);
    throw new Error('Erro ao buscar configurações da integração');
  }

  if (!integration?.settings) {
    throw new Error('Configurações da integração não encontradas');
  }

  return integration;
}

async function exchangeToken(settings: any, code: string): Promise<TokenResponse> {
  console.log("Trocando código por tokens...");
  const tokenEndpoint = "https://accounts.tiny.com.br/realms/tiny/protocol/openid-connect/token";
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: settings.client_id,
    client_secret: settings.client_secret,
    redirect_uri: settings.redirect_uri,
    code: code
  });

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString()
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Erro na resposta do Tiny:", response.status, errorText);
    throw new Error(`Erro na autenticação com o Tiny: ${errorText}`);
  }

  return await response.json();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, userId } = await req.json() as TokenExchangeRequest;

    if (!code || !userId) {
      console.error("Parâmetros obrigatórios ausentes", { code, userId });
      return new Response(
        JSON.stringify({
          error: 'Parâmetros obrigatórios ausentes',
          details: 'code e userId são obrigatórios'
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const integration = await getIntegrationSettings(supabaseAdmin, userId);
    const tokens = await exchangeToken(integration.settings, code);

    // Calcular timestamps de expiração
    const now = new Date();
    const tokenExpiresAt = new Date(now.getTime() + tokens.expires_in * 1000);
    const refreshTokenExpiresAt = new Date(now.getTime() + tokens.refresh_expires_in * 1000);

    // Atualizar tokens no banco
    const { error: updateError } = await supabaseAdmin
      .from('integrations')
      .update({
        token_expires_at: tokenExpiresAt.toISOString(),
        refresh_token_expires_at: refreshTokenExpiresAt.toISOString()
      })
      .eq('id', integration.id);

    if (updateError) {
      console.error("Erro ao atualizar timestamps:", updateError);
      throw new Error('Erro ao atualizar timestamps dos tokens');
    }

    // Salvar tokens nas secrets
    const secretsResponse = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/secrets`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: `TINY_ACCESS_TOKEN_${userId}`,
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
          name: `TINY_REFRESH_TOKEN_${userId}`,
          value: tokens.refresh_token
        })
      }
    );

    if (!refreshSecretResponse.ok) {
      throw new Error('Erro ao salvar refresh token nas secrets');
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Erro não tratado:", error);
    return new Response(
      JSON.stringify({
        error: 'Erro interno',
        details: error.message
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});