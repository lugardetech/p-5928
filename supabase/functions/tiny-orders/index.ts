import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("=== Iniciando busca de pedidos ===");
    
    const { access_token } = await req.json();

    if (!access_token) {
      console.error("❌ Token de acesso não fornecido");
      throw new Error('Token de acesso não fornecido');
    }

    console.log("🔄 Buscando pedidos no Tiny ERP...");
    console.log("Token de acesso (primeiros 10 caracteres):", access_token.substring(0, 10) + "...");

    // De acordo com a documentação, a URL base é api.tiny.com.br/api2
    const response = await fetch('https://api.tiny.com.br/api2/pedidos.pesquisa.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        pesquisa: {
          situacao: 'Todos',
          formato: 'JSON'
        }
      })
    });

    if (!response.ok) {
      console.error("❌ Erro na resposta da API:", response.status, response.statusText);
      
      if (response.status === 401) {
        throw new Error('Token de acesso expirado ou inválido. Por favor, reconecte sua conta do Tiny ERP.');
      }
      
      throw new Error(`Erro na API do Tiny: ${response.status} ${response.statusText}`);
    }

    const responseText = await response.text();
    console.log("📝 Resposta da API:", responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("❌ Erro ao fazer parse da resposta:", e);
      console.error("Resposta recebida:", responseText);
      throw new Error('Erro ao processar resposta da API do Tiny');
    }

    if (!data?.retorno?.pedidos) {
      console.error("❌ Resposta sem pedidos:", data);
      throw new Error('Resposta da API não contém pedidos');
    }

    const pedidos = data.retorno.pedidos.map((pedido: any) => ({
      id: pedido.pedido.id,
      numero: pedido.pedido.numero,
      data_pedido: pedido.pedido.data_pedido,
      cliente: {
        nome: pedido.pedido.cliente?.nome || '-',
        codigo: pedido.pedido.cliente?.codigo || '-'
      },
      situacao: pedido.pedido.situacao || '-',
      valor_total: pedido.pedido.valor_total || "0.00"
    }));

    console.log("✅ Pedidos processados com sucesso");
    console.log("Quantidade de pedidos:", pedidos.length);
    
    return new Response(
      JSON.stringify({
        status: "OK",
        pedidos
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