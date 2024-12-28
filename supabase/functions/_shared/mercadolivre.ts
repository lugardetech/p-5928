import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { IntegrationError } from './errors.ts';
import { MercadoLivreTokens, TokenExchangeRequest } from './types.ts';

export async function validateAndGetIntegration(supabaseClient: any, request: TokenExchangeRequest) {
  const { data: integration, error: integrationError } = await supabaseClient
    .from('integrations')
    .select('*')
    .eq('id', request.integrationId)
    .maybeSingle();

  if (integrationError) {
    console.error('❌ Erro ao buscar integração:', integrationError);
    throw new IntegrationError('Erro ao buscar integração');
  }

  if (!integration) {
    throw new IntegrationError('Integração não encontrada');
  }

  console.log('✅ Integração encontrada:', integration);
  return integration;
}

export async function getUserIntegration(supabaseClient: any, request: TokenExchangeRequest) {
  const { data: userIntegration, error: fetchError } = await supabaseClient
    .from('user_integrations')
    .select('*')
    .eq('user_id', request.userId)
    .eq('integration_id', request.integrationId)
    .maybeSingle();

  if (fetchError) {
    console.error('❌ Erro ao buscar integração do usuário:', fetchError);
    throw new IntegrationError('Erro ao buscar integração do usuário');
  }

  if (!userIntegration) {
    throw new IntegrationError('Integração do usuário não encontrada');
  }

  console.log('✅ Integração do usuário encontrada:', userIntegration);
  return userIntegration;
}

export async function exchangeToken(settings: Record<string, unknown>, code: string): Promise<MercadoLivreTokens> {
  const client_id = settings.client_id as string;
  const client_secret = settings.client_secret as string;
  const redirect_uri = settings.redirect_uri as string;

  if (!client_id || !client_secret || !redirect_uri) {
    throw new IntegrationError('Credenciais incompletas');
  }

  try {
    new URL(redirect_uri);
  } catch (err) {
    throw new IntegrationError('O redirect_uri deve ser uma URL válida');
  }

  const response = await fetch('https://api.mercadolivre.com.br/oauth/token', {
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
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new IntegrationError(errorData.message || 'Erro ao trocar tokens');
  }

  const tokens = await response.json();
  
  if (!tokens.access_token || !tokens.refresh_token || !tokens.expires_in || !tokens.token_type) {
    throw new IntegrationError('Resposta da API do Mercado Livre está incompleta');
  }

  return tokens;
}

export async function saveTokens(supabaseClient: any, userIntegrationId: string, tokens: MercadoLivreTokens) {
  const now = new Date();
  const tokenExpiresAt = new Date(now.getTime() + tokens.expires_in * 1000);
  const refreshTokenExpiresAt = new Date(now.getTime() + 15552000 * 1000); // 6 meses

  const { error: updateError } = await supabaseClient
    .from('user_integrations')
    .update({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_expires_at: tokenExpiresAt.toISOString(),
      refresh_token_expires_at: refreshTokenExpiresAt.toISOString(),
    })
    .eq('id', userIntegrationId);

  if (updateError) {
    throw new IntegrationError('Erro ao salvar tokens no banco de dados');
  }

  console.log('✅ Tokens salvos com sucesso');
}