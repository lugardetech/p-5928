import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("=== Iniciando busca de produtos ===")
    
    const { user_id } = await req.json()
    
    if (!user_id) {
      console.error("❌ ID do usuário não fornecido")
      throw new Error('ID do usuário não fornecido')
    }

    // Buscar access token das secrets
    const accessToken = Deno.env.get(`TINY_ACCESS_TOKEN_${user_id}`);
    if (!accessToken) {
      throw new Error('Token de acesso não encontrado');
    }

    console.log("✅ Token de acesso encontrado")
    console.log("🔄 Fazendo requisição para API do Tiny...")

    const response = await fetch('https://api.tiny.com.br/api/v3/produtos', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`❌ Erro na API do Tiny: ${response.status} - ${response.statusText}`)
      const errorText = await response.text()
      console.error("Resposta da API:", errorText)
      
      if (response.status === 401 || response.status === 403) {
        // Tentar renovar o token
        const refreshResponse = await fetch(
          `${Deno.env.get('SUPABASE_URL')}/functions/v1/tiny-token-refresh`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
            },
            body: JSON.stringify({ user_id })
          }
        );

        if (!refreshResponse.ok) {
          throw new Error("Erro ao renovar token. Por favor, reconecte sua conta do Tiny ERP.")
        }

        // Tentar novamente com o novo token
        const newToken = Deno.env.get(`TINY_ACCESS_TOKEN_${user_id}`);
        if (!newToken) {
          throw new Error('Novo token não encontrado após renovação');
        }

        const retryResponse = await fetch('https://api.tiny.com.br/api/v3/produtos', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${newToken}`,
            'Accept': 'application/json',
          },
        });

        if (!retryResponse.ok) {
          throw new Error(`Erro na API do Tiny: ${retryResponse.statusText}`)
        }

        const retryData = await retryResponse.json()
        return new Response(
          JSON.stringify({ produtos: retryData.itens }),
          { 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json'
            },
            status: 200,
          },
        )
      }
      
      throw new Error(`Erro na API do Tiny: ${response.statusText}`)
    }

    const data = await response.json()
    console.log("✅ Dados recebidos da API do Tiny")

    return new Response(
      JSON.stringify({ produtos: data.itens }),
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