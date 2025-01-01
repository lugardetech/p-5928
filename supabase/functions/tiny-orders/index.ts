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
    
    const { access_token } = await req.json();
    
    if (!access_token) {
      console.error("❌ Token de acesso não fornecido");
      throw new Error('Token de acesso não fornecido');
    }

    console.log("🔄 Fazendo requisição para API V3 do Tiny...");
    const response = await fetch('https://api.tiny.com.br/public-api/v3/pedidos', {
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
    console.log("✅ Dados recebidos da API do Tiny:", data);

    // Validar a resposta
    if (!data?.itens) {
      console.error("❌ Resposta inválida da API do Tiny:", data);
      throw new Error('Resposta inválida da API do Tiny');
    }

    // Criar cliente Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Salvar pedidos no banco
    console.log("🔄 Salvando pedidos no banco de dados...");
    const orders = data.itens || [];
    
    for (const order of orders) {
      console.log("Processando pedido:", order);
      
      // Validar dados obrigatórios
      if (!order.id || !order.numero) {
        console.error("❌ Dados obrigatórios faltando no pedido:", order);
        continue; // Pula para o próximo pedido
      }

      const orderData = {
        user_id: req.headers.get('x-user-id'),
        tiny_id: parseInt(order.id),
        numero_pedido: parseInt(order.numero) || 0, // Garante um valor numérico
        situacao: parseInt(order.situacao) || 0,
        data_criacao: order.data_pedido || null,
        data_prevista: order.data_prevista || null,
        valor: parseFloat(order.valor_total || '0'),
        cliente: order.cliente || null,
        vendedor: order.vendedor || null,
        transportador: order.transportador || null,
        ecommerce: order.ecommerce || null
      };

      console.log("Dados preparados para inserção:", orderData);

      const { error: upsertError } = await supabase
        .from('tiny_orders')
        .upsert(orderData, {
          onConflict: 'tiny_id'
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