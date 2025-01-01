import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log("=== Iniciando Edge Function tiny-orders ===")
    
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
    const response = await fetch('https://api.tiny.com.br/api2/pedidos.pesquisa.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: integration.access_token,
        formato: "json",
        pesquisa: {
          situacao: "todos",
          formato_data_criacao: "yyyy-MM-dd"
        }
      }),
    });

    if (!response.ok) {
      console.error(`❌ Erro na API do Tiny: ${response.status} - ${response.statusText}`);
      const errorText = await response.text();
      console.error("Resposta da API:", errorText);
      throw new Error(`Erro na API do Tiny: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ Dados recebidos da API do Tiny");

    // Validar a resposta
    if (!data?.retorno?.pedidos) {
      console.error("❌ Resposta inválida da API do Tiny:", data);
      throw new Error('Resposta inválida da API do Tiny');
    }

    // Salvar pedidos no banco
    console.log("🔄 Salvando pedidos no banco de dados...");
    const orders = data.retorno.pedidos || [];
    for (const order of orders) {
      const pedido = order.pedido;
      const { error: upsertError } = await supabase
        .from('tiny_orders')
        .upsert({
          user_id: userId,
          tiny_id: pedido.id,
          numero_pedido: pedido.numeroPedido,
          situacao: pedido.situacao,
          data_criacao: pedido.dataCriacao,
          data_prevista: pedido.dataPrevista,
          valor: parseFloat(pedido.valor),
          cliente: pedido.cliente,
          vendedor: pedido.vendedor,
          transportador: pedido.transportador,
          ecommerce: pedido.ecommerce
        }, {
          onConflict: 'user_id,tiny_id'
        });

      if (upsertError) {
        console.error("❌ Erro ao salvar pedido:", upsertError);
        throw new Error(`Erro ao salvar pedido: ${upsertError.message}`);
      }
    }

    console.log("✅ Pedidos salvos com sucesso!");

    return new Response(
      JSON.stringify({ success: true, pedidos: orders }),
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