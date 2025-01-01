import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log("=== Iniciando Edge Function tiny-products ===")
    
    // Obter o token do corpo da requisição
    const { access_token } = await req.json()
    
    if (!access_token) {
      console.error("❌ Token de acesso não fornecido")
      throw new Error('Token de acesso não fornecido')
    }

    console.log("✅ Token de acesso recebido")

    // Fazer requisição para a API do Tiny
    console.log("🔄 Fazendo requisição para API do Tiny...")
    const response = await fetch('https://api.tiny.com.br/public-api/v3/pedidos', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      console.error(`❌ Erro na API do Tiny: ${response.status} - ${response.statusText}`)
      const errorText = await response.text()
      console.error("Resposta da API:", errorText)
      throw new Error(`Erro na API do Tiny: ${response.statusText}`)
    }

    const data = await response.json()
    console.log("✅ Dados recebidos da API do Tiny")

    // Validar a resposta
    if (!data || !data.itens) {
      console.error("❌ Resposta inválida da API do Tiny")
      throw new Error('Resposta inválida da API do Tiny')
    }

    return new Response(
      JSON.stringify(data),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
        status: 200,
      },
    )

  } catch (error) {
    console.error("❌ Erro na Edge Function:", error)
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
