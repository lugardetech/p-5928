import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TinyOrder {
  id: number;
  situacao: number;
  numeroPedido: number;
  dataCriacao: string;
  dataPrevista: string;
  cliente: any;
  valor: string;
  vendedor: any;
  transportador: any;
  ecommerce: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { access_token } = await req.json();

    if (!access_token) {
      throw new Error("Token de acesso não fornecido");
    }

    console.log("🔄 Buscando pedidos no Tiny...");
    
    const tinyResponse = await fetch("https://api.tiny.com.br/api2/pedidos.pesquisa.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

    if (!tinyResponse.ok) {
      throw new Error(`Erro ao buscar pedidos: ${tinyResponse.statusText}`);
    }

    const data = await tinyResponse.json();
    console.log("✅ Pedidos recebidos:", data);

    if (data.retorno.status === "Erro") {
      throw new Error(`Erro da API Tiny: ${data.retorno.registros}`);
    }

    // Criar cliente Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Obter user_id do token de autorização
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error('Token de autorização não fornecido');
    }

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Usuário não autenticado');
    }

    console.log("🔄 Salvando pedidos no banco de dados...");

    // Salvar cada pedido no banco
    const orders = data.retorno.pedidos || [];
    for (const order of orders) {
      const pedido = order.pedido;
      const { error: upsertError } = await supabaseClient
        .from('tiny_orders')
        .upsert({
          user_id: user.id,
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

    return new Response(JSON.stringify({ 
      success: true,
      pedidos: orders.map((o: any) => o.pedido)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("❌ Erro:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});