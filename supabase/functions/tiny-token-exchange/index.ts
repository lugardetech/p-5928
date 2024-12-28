import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { corsHeaders } from '../_shared/cors.ts';

console.log("Iniciando Edge Function tiny-token-exchange");

serve(async (req) => {
  // Tratamento de CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Recebendo requisição para troca de tokens");
    const { code, userId, integrationId } = await req.json();

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

    // Buscar configurações da integração
    console.log("Buscando configurações da integração");
    const { data: userIntegration, error: fetchError } = await supabaseAdmin
      .from('user_integrations')
      .select('settings')
      .eq('user_id', userId)
      .eq('integration_id', integrationId)
      .maybeSingle();

    if (fetchError || !userIntegration?.settings) {
      console.error("Erro ao buscar configurações da integração:", fetchError);
      return new Response(
        JSON.stringify({
          error: 'Erro ao buscar configurações',
          details: fetchError?.message
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const settings = userIntegration.settings as {
      client_id: string;
      client_secret: string;
      redirect_uri: string;
    };

    // Validar configurações
    if (!settings.client_id || !settings.client_secret || !settings.redirect_uri) {
      console.error("Configurações da integração incompletas");
      return new Response(
        JSON.stringify({
          error: 'Configurações incompletas',
          details: 'client_id, client_secret e redirect_uri são obrigatórios'
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Preparar requisição para o Tiny
    console.log("Preparando requisição para o Tiny");
    const tokenEndpoint = "https://accounts.tiny.com.br/realms/tiny/protocol/openid-connect/token";
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: settings.client_id,
      client_secret: settings.client_secret,
      redirect_uri: settings.redirect_uri,
      code: code
    });

    // Fazer requisição para o Tiny
    console.log("Enviando requisição para o Tiny");
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString()
    });

    const responseText = await response.text();
    console.log("Resposta do Tiny:", response.status, responseText);

    if (!response.ok) {
      console.error("Erro na resposta do Tiny:", response.status, responseText);
      return new Response(
        JSON.stringify({
          error: 'Erro na autenticação com o Tiny',
          details: responseText
        }),
        { 
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    let tokens;
    try {
      tokens = JSON.parse(responseText);
    } catch (error) {
      console.error("Erro ao parsear resposta do Tiny:", error);
      return new Response(
        JSON.stringify({
          error: 'Resposta inválida do Tiny',
          details: error.message
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Validar tokens recebidos
    if (!tokens.access_token || !tokens.refresh_token) {
      console.error("Tokens inválidos recebidos do Tiny");
      return new Response(
        JSON.stringify({
          error: 'Tokens inválidos',
          details: 'access_token e refresh_token são obrigatórios'
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Calcular datas de expiração
    const now = new Date();
    const tokenExpiresAt = new Date(now.getTime() + (tokens.expires_in || 14400) * 1000); // 4 horas padrão
    const refreshTokenExpiresAt = new Date(now.getTime() + (tokens.refresh_expires_in || 86400) * 1000); // 24 horas padrão

    // Atualizar tokens no banco
    console.log("Atualizando tokens no banco");
    const { error: updateError } = await supabaseAdmin
      .from('user_integrations')
      .update({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expires_at: tokenExpiresAt.toISOString(),
        refresh_token_expires_at: refreshTokenExpiresAt.toISOString(),
        status: true,
      })
      .eq('user_id', userId)
      .eq('integration_id', integrationId);

    if (updateError) {
      console.error("Erro ao salvar tokens:", updateError);
      return new Response(
        JSON.stringify({
          error: 'Erro ao salvar tokens',
          details: updateError.message
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log("Processo de autenticação concluído com sucesso");
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