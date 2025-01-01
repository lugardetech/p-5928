import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("=== Iniciando busca de pedidos ===");
    
    const { userId } = await req.json();
    
    if (!userId) {
      console.error("❌ User ID não fornecido");
      throw new Error('User ID não fornecido');
    }

    console.log("🔄 Buscando integração do usuário...");
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { data: integration, error: integrationError } = await supabase
      .from('integrations')
      .select('*')
      .eq('user_id', userId)
      .eq('name', 'tiny_erp')
      .single();

    if (integrationError) {
      console.error("❌ Erro ao buscar integração:", integrationError);
      throw new Error('Erro ao buscar integração');
    }

    if (!integration?.access_token) {
      console.error("❌ Token de acesso não encontrado");
      throw new Error('Token de acesso não encontrado');
    }

    console.log("✅ Integração encontrada");

    // Verificar se o token está expirado
    if (integration.token_expires_at) {
      const expiresAt = new Date(integration.token_expires_at);
      if (expiresAt < new Date()) {
        console.log("🔄 Token expirado, tentando renovar...");
        
        const { data: refreshData, error: refreshError } = await supabase.functions.invoke('tiny-token-refresh', {
          body: { 
            refresh_token: integration.refresh_token,
            client_id: integration.settings.client_id,
            client_secret: integration.settings.client_secret
          }
        });

        if (refreshError) {
          console.error("❌ Erro ao renovar token:", refreshError);
          throw new Error('Erro ao renovar token. Por favor, reconecte sua conta do Tiny ERP.');
        }

        // Atualizar tokens no banco
        const { error: updateError } = await supabase
          .from('integrations')
          .update({
            access_token: refreshData.access_token,
            refresh_token: refreshData.refresh_token,
            token_expires_at: refreshData.token_expires_at,
            refresh_token_expires_at: refreshData.refresh_token_expires_at
          })
          .eq('id', integration.id);

        if (updateError) {
          console.error("❌ Erro ao atualizar tokens:", updateError);
          throw updateError;
        }

        integration.access_token = refreshData.access_token;
      }
    }

    console.log("🔄 Buscando pedidos no Tiny ERP...");
    const response = await fetch('https://api.tiny.com.br/public-api/v3/pedidos', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${integration.access_token}`,
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      console.error("❌ Erro na resposta da API:", response.status, response.statusText);
      
      if (response.status === 401) {
        throw new Error('Token de acesso expirado ou inválido. Por favor, reconecte sua conta do Tiny ERP.');
      }
      
      throw new Error(`Erro na API do Tiny: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ Pedidos recebidos da API do Tiny");
    console.log("Quantidade de pedidos:", data.itens?.length || 0);
    
    return new Response(
      JSON.stringify({
        status: "OK",
        pedidos: data.itens || []
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error("❌ Erro:", error);
    return new Response(
      JSON.stringify({ 
        status: "Erro",
        error: error.message 
      }),
      { 
        status: error.message.includes('Token') ? 401 : 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
});