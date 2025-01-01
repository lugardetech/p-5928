import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log("=== Iniciando busca de pedidos ===")
    
    // Obter o token do corpo da requisição
    const { access_token } = await req.json()
    
    if (!access_token) {
      console.error("❌ Token de acesso não fornecido")
      throw new Error('Token de acesso não fornecido')
    }

    console.log("✅ Token de acesso recebido")
    console.log("🔄 Buscando pedidos no Tiny ERP...")
    console.log("Token de acesso (primeiros 10 caracteres):", access_token.substring(0, 10) + "...")

    // Construir URL com parâmetros de paginação
    const url = new URL('https://api.tiny.com.br/api/v3/pedidos');
    url.searchParams.append('limit', '50');
    url.searchParams.append('offset', '0');

    console.log("URL da requisição:", url.toString());

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Accept': 'application/json'
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
    console.log("Resposta da API (primeiros 200 caracteres):", responseText.substring(0, 200) + "...");

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      console.error("❌ Erro ao fazer parse da resposta:", error);
      throw new Error('Resposta inválida da API do Tiny');
    }

    if (!data || !data.itens) {
      console.error("❌ Estrutura de resposta inválida:", data);
      throw new Error('Estrutura de resposta inválida da API do Tiny');
    }

    console.log("✅ Dados recebidos da API do Tiny");
    console.log(`📦 Total de pedidos: ${data.itens.length}`);

    // Mapear os pedidos para o formato esperado pelo frontend
    const pedidos = data.itens.map(pedido => ({
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
      valor: pedido.valor,
      situacao: pedido.situacao,
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

    return new Response(
      JSON.stringify({ pedidos }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
        status: 200,
      },
    )

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
    )
  }
})