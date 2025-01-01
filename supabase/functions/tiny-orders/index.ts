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
    
    const { access_token, user_id } = await req.json();
    
    if (!access_token) {
      console.error("❌ Token de acesso não fornecido");
      throw new Error('Token de acesso não fornecido');
    }

    if (!user_id) {
      console.error("❌ ID do usuário não fornecido");
      throw new Error('ID do usuário não fornecido');
    }

    console.log("🔄 Buscando todos os pedidos da API V3 do Tiny...");
    
    let totalOrders = 0;
    let page = 1;
    let hasMore = true;
    const supabase = createClient(supabaseUrl, supabaseKey);

    while (hasMore) {
      console.log(`Buscando página ${page}...`);
      const response = await fetch(`https://api.tiny.com.br/public-api/v3/pedidos?page=${page}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error(`❌ Erro na API do Tiny: ${response.status} - ${response.statusText}`);
        const errorText = await response.text();
        console.error("Resposta da API:", errorText);
        throw new Error(`Erro na API do Tiny: ${response.statusText}`);
      }

      const data = await response.json();
      const pageOrders = data?.itens || [];
      console.log(`✅ Recebidos ${pageOrders.length} pedidos da página ${page}`);

      if (!pageOrders.length) {
        hasMore = false;
        console.log("Não há mais pedidos para buscar.");
      } else {
        // Salvar pedidos da página atual
        console.log(`🔄 Salvando ${pageOrders.length} pedidos da página ${page}...`);
        
        for (const order of pageOrders) {
          if (!order.id || !order.numeroPedido) {
            console.error("❌ Dados obrigatórios faltando no pedido:", order);
            continue;
          }

          const orderData = {
            user_id: user_id,
            tiny_id: parseInt(order.id),
            numero_pedido: parseInt(order.numeroPedido),
            situacao: parseInt(order.situacao) || 0,
            data_criacao: order.dataCriacao ? new Date(order.dataCriacao) : null,
            data_prevista: order.dataPrevista ? new Date(order.dataPrevista) : null,
            valor: parseFloat(order.valor || '0'),
            cliente: order.cliente || null,
            vendedor: order.vendedor || null,
            transportador: order.transportador || null,
            ecommerce: order.ecommerce || null
          };

          const { error: upsertError } = await supabase
            .from('tiny_orders')
            .upsert(orderData, {
              onConflict: 'tiny_id'
            });

          if (upsertError) {
            console.error(`❌ Erro ao salvar pedido ${order.numeroPedido}:`, upsertError);
            continue;
          }
        }

        console.log(`✅ Salvos ${pageOrders.length} pedidos da página ${page}`);
        totalOrders += pageOrders.length;
        page++;

        // Aguarda um pequeno intervalo para evitar sobrecarga na API
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`✅ Sincronização concluída! Total de pedidos processados: ${totalOrders}`);

    return new Response(
      JSON.stringify({ success: true, total: totalOrders }),
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