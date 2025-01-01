import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("=== Iniciando busca de produtos ===")
    
    const { access_token, user_id } = await req.json()
    
    if (!access_token) {
      console.error("❌ Token de acesso não fornecido")
      throw new Error('Token de acesso não fornecido')
    }

    if (!user_id) {
      console.error("❌ ID do usuário não fornecido")
      throw new Error('ID do usuário não fornecido')
    }

    console.log("✅ Token de acesso recebido")
    console.log("🔄 Fazendo requisição para API do Tiny...")

    let currentToken = access_token;
    let response = await fetch('https://api.tiny.com.br/api/v3/produtos', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${currentToken}`,
        'Accept': 'application/json',
      },
    });

    // Se o token estiver expirado, tenta renovar
    if (response.status === 401 || response.status === 403) {
      console.log("🔄 Token expirado, tentando renovar...")
      
      const refreshResponse = await fetch(`${req.url.replace('/tiny-products', '/tiny-token-refresh')}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        },
        body: JSON.stringify({ user_id })
      });

      if (!refreshResponse.ok) {
        throw new Error('Erro ao renovar token. Por favor, reconecte sua conta do Tiny ERP.');
      }

      const refreshData = await refreshResponse.json();
      currentToken = refreshData.access_token;

      // Tenta novamente com o novo token
      console.log("🔄 Tentando novamente com o novo token...")
      response = await fetch('https://api.tiny.com.br/api/v3/produtos', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Accept': 'application/json'
        }
      });
    }

    if (!response.ok) {
      console.error(`❌ Erro na API do Tiny: ${response.status} - ${response.statusText}`)
      const errorText = await response.text()
      console.error("Resposta da API:", errorText)
      throw new Error(`Erro na API do Tiny: ${response.statusText}`)
    }

    const data = await response.json()
    console.log("✅ Dados recebidos da API do Tiny")

    return new Response(
      JSON.stringify({ 
        produtos: data.itens,
        access_token: currentToken // Retorna o novo token se foi renovado
      }),
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