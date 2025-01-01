import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
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

    // Construir URL com parâmetros de paginação
    const url = new URL('https://api.tiny.com.br/api/v3/pedidos');
    url.searchParams.append('limit', '50');
    url.searchParams.append('offset', '0');

    console.log("URL da requisição:", url.toString());

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    console.log("Status da resposta:", response.status);
    console.log("Headers da resposta:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      console.error("❌ Erro na resposta da API:", response.status, response.statusText);
      const errorText = await response.text();
      console.error("Corpo da resposta de erro:", errorText);
      
      if (response.status === 401 || response.status === 403) {
        throw new Error('Token de acesso expirado ou inválido. Por favor, reconecte sua conta do Tiny ERP.');
      }
      
      throw new Error(`Erro na API do Tiny: ${response.status} ${response.statusText}\n${errorText}`);
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

    if (!data?.itens) {
      console.error("❌ Resposta sem pedidos:", data);
      throw new Error('Resposta da API não contém pedidos');
    }

    const pedidos = data.itens.map((pedido: any) => ({
      id: pedido.id.toString(),
      numero: pedido.numeroPedido.toString(),
      data_pedido: pedido.dataCriacao,
      data_prevista: pedido.dataPrevista,
      cliente: {
        nome: pedido.cliente?.nome || '-',
        codigo: pedido.cliente?.codigo || '-',
        cpf_cnpj: pedido.cliente?.cpfCnpj || '-',
        email: pedido.cliente?.email || '-',
        telefone: pedido.cliente?.telefone || '-'
      },
      situacao: pedido.situacao.toString(),
      valor_total: pedido.valor || "0.00",
      vendedor: pedido.vendedor ? {
        id: pedido.vendedor.id,
        nome: pedido.vendedor.nome
      } : null,
      transportador: pedido.transportador ? {
        nome: pedido.transportador.nome,
        rastreamento: pedido.transportador.codigoRastreamento,
        url_rastreamento: pedido.transportador.urlRastreamento
      } : null
    }));

    console.log("✅ Pedidos processados com sucesso");
    console.log("Quantidade de pedidos:", pedidos.length);
    
    return new Response(
      JSON.stringify({
        status: "OK",
        pedidos,
        paginacao: data.paginacao
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