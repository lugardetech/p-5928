import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { corsHeaders } from '../_shared/cors.ts';

interface TokenExchangeRequest {
  code: string;
  userId: string;
  integrationId: string;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
}

async function getIntegrationSettings(supabaseAdmin: any, userId: string, integrationId: string) {
  console.log("Buscando configurações da integração...");
  const { data: integration, error: fetchError } = await supabaseAdmin
    .from('integrations')
    .select('settings')
    .eq('user_id', userId)
    .eq('id', integrationId)
    .single();

  if (fetchError) {
    console.error("Erro ao buscar configurações:", fetchError);
    throw new Error('Erro ao buscar configurações da integração');
  }

  if (!integration?.settings) {
    throw new Error('Configurações da integração não encontradas');
  }

  return integration.settings;
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

async function updateIntegrationTokens(supabaseAdmin: any, userId: string, integrationId: string, tokens: TokenResponse) {
  console.log("Atualizando tokens no banco...");
  const now = new Date();
  const tokenExpiresAt = new Date(now.getTime() + tokens.expires_in * 1000);
  const refreshTokenExpiresAt = new Date(now.getTime() + tokens.refresh_expires_in * 1000);

  const { error: updateError } = await supabaseAdmin
    .from('integrations')
    .update({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_expires_at: tokenExpiresAt.toISOString(),
      refresh_token_expires_at: refreshTokenExpiresAt.toISOString(),
    })
    .eq('user_id', userId)
    .eq('id', integrationId);

  if (updateError) {
    console.error("Erro ao salvar tokens:", updateError);
    throw new Error('Erro ao salvar tokens');
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, userId, integrationId } = await req.json() as TokenExchangeRequest;

    // Validação dos parâmetros obrigatórios
    if (!code || !userId || !integrationId) {
      console.error("Parâmetros obrigatórios ausentes", { code, userId, integrationId });
      return new Response(
        JSON.stringify({
          error: 'Parâmetros obrigatórios ausentes',
          details: 'code, userId e integrationId são obrigatórios'
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Criar cliente Supabase
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Buscar configurações e trocar tokens
    const settings = await getIntegrationSettings(supabaseAdmin, userId, integrationId);
    const tokens = await exchangeToken(settings, code);
    await updateIntegrationTokens(supabaseAdmin, userId, integrationId, tokens);

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