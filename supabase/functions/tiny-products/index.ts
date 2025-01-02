import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log("=== Iniciando Edge Function tiny-products ===")
    
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

    // Fazer requisição para a API do Tiny
    console.log("🔄 Fazendo requisição para API do Tiny...");
    const response = await fetch('https://api.tiny.com.br/public-api/v3/produtos', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${integration.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`❌ Erro na API do Tiny: ${response.status} - ${response.statusText}`);
      const errorText = await response.text();
      console.error("Resposta da API:", errorText);
      
      if (response.status === 401) {
        throw new Error('Token de acesso expirado ou inválido. Por favor, reconecte sua conta do Tiny ERP.');
      }
      
      throw new Error(`Erro na API do Tiny: ${response.statusText}`);
    }

    const tinyData = await response.json();
    console.log("✅ Dados recebidos da API do Tiny");

    // Validar a resposta
    if (!tinyData || !tinyData.itens) {
      console.error("❌ Resposta inválida da API do Tiny");
      throw new Error('Resposta inválida da API do Tiny');
    }

    // Salvar produtos no banco
    console.log("🔄 Salvando produtos no banco...");
    for (const item of tinyData.itens) {
      const productData = {
        user_id: userId,
        tiny_id: parseInt(item.id),
        sku: item.sku,
        nome: item.descricao,
        preco: item.precos?.preco || 0,
        preco_promocional: item.precos?.preco_promocional || null,
        unidade: item.unidade,
        tipo: item.tipo,
        situacao: item.situacao,
        formato: item.formato,
        descricao: item.descricao_complementar,
        estoque: parseFloat(item.saldo || 0),
        estoque_minimo: parseFloat(item.estoque_minimo || 0),
        estoque_maximo: parseFloat(item.estoque_maximo || 0),
        peso_bruto: parseFloat(item.peso_bruto || 0),
        peso_liquido: parseFloat(item.peso_liquido || 0),
        metadata: item
      };

      const { error: upsertError } = await supabase
        .from('tiny_products')
        .upsert(
          productData,
          { 
            onConflict: 'user_id,tiny_id',
            ignoreDuplicates: false 
          }
        );

      if (upsertError) {
        console.error("❌ Erro ao salvar produto:", upsertError);
        throw upsertError;
      }
    }

    console.log("✅ Produtos salvos com sucesso");

    // Buscar produtos atualizados
    const { data: products, error: fetchError } = await supabase
      .from('tiny_products')
      .select('*')
      .eq('user_id', userId);

    if (fetchError) {
      console.error("❌ Erro ao buscar produtos:", fetchError);
      throw fetchError;
    }

    return new Response(
      JSON.stringify({ itens: products }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
        status: 200,
      },
    );

  } catch (error) {
    console.error("❌ Erro na Edge Function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
        status: 400,
      },
    );
  }
});