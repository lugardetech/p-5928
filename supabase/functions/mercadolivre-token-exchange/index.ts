import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { IntegrationError } from '../_shared/errors.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, userId, integrationId } = await req.json();
    console.log("=== Iniciando troca de código por tokens ===");
    console.log("Código recebido:", code);

    // Criar cliente Supabase
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Buscar usuário autenticado
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Não autorizado');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      console.error("❌ Erro ao buscar usuário:", userError);
      throw new Error('Usuário não encontrado');
    }
    console.log("✅ Usuário encontrado:", user.id);

    // Buscar integração e credenciais
    const { data: integration, error: fetchError } = await supabaseAdmin
      .from('integrations')
      .select('settings')
      .eq('user_id', userId)
      .eq('id', integrationId)
      .single();

    if (fetchError) {
      console.error("❌ Erro ao buscar credenciais:", fetchError);
      throw new Error('Credenciais não encontradas');
    }
    console.log("✅ Credenciais encontradas");

    const settings = integration.settings as { 
      client_id: string
      client_secret: string
      redirect_uri: string
    };

    // Trocar código por tokens usando a URL correta do Mercado Libre
    console.log("🔄 Iniciando troca do código por tokens...");
    const tokenEndpoint = "https://api.mercadolibre.com/oauth/token";
    const tokenResponse = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        client_id: settings.client_id,
        client_secret: settings.client_secret,
        redirect_uri: settings.redirect_uri,
      }),
    });

    const responseText = await tokenResponse.text();
    console.log("Resposta da API do Mercado Libre:", responseText);

    if (!tokenResponse.ok) {
      console.error("❌ Erro na resposta da API. Status:", tokenResponse.status);
      console.error("Resposta:", responseText);
      throw new Error(`Erro ao obter tokens: ${responseText}`);
    }

    let tokens;
    try {
      tokens = JSON.parse(responseText);
    } catch (error) {
      console.error("❌ Erro ao parsear resposta como JSON:", error);
      throw new Error("Resposta inválida do servidor de autenticação");
    }

    console.log("✅ Tokens obtidos com sucesso");
    console.log("Tokens recebidos:", {
      access_token: tokens.access_token ? "presente" : "ausente",
      refresh_token: tokens.refresh_token ? "presente" : "ausente",
      expires_in: tokens.expires_in,
      refresh_token_expires_in: tokens.refresh_token_expires_in,
    });

    // Salvar tokens
    const now = new Date();
    const tokenExpiresAt = new Date(now.getTime() + tokens.expires_in * 1000);
    const refreshTokenExpiresAt = tokens.refresh_token_expires_in 
      ? new Date(now.getTime() + tokens.refresh_token_expires_in * 1000)
      : null;

    console.log("💾 Salvando tokens no banco de dados...");
    const { error: updateError } = await supabaseAdmin
      .from('integrations')
      .update({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expires_at: tokenExpiresAt.toISOString(),
        refresh_token_expires_at: refreshTokenExpiresAt?.toISOString(),
      })
      .eq('user_id', userId)
      .eq('id', integrationId);

    if (updateError) {
      console.error("❌ Erro ao salvar tokens:", updateError);
      throw updateError;
    }

    console.log("✅ Tokens salvos com sucesso");
    console.log("=== Processo de troca concluído com sucesso ===");

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("❌ Erro no processo de troca:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});