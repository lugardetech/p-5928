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

    console.log("🔄 Fazendo requisição para API do Tiny...");
    const response = await fetch('https://api.tiny.com.br/api2/pedidos.pesquisa.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: access_token,
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

    // Criar cliente Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Salvar pedidos no banco
    console.log("🔄 Salvando pedidos no banco de dados...");
    const orders = data.retorno.pedidos || [];
    
    for (const order of orders) {
      const pedido = order.pedido;
      
      const { error: upsertError } = await supabase
        .from('tiny_orders')
        .upsert({
          tiny_id: parseInt(pedido.id),
          numero_pedido: parseInt(pedido.numero),
          situacao: parseInt(pedido.situacao),
          data_criacao: pedido.data_pedido,
          data_prevista: pedido.data_prevista,
          valor: parseFloat(pedido.valor_total || 0),
          cliente: pedido.cliente || null,
          vendedor: pedido.vendedor || null,
          transportador: pedido.transportador || null,
          ecommerce: pedido.ecommerce || null
        }, {
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