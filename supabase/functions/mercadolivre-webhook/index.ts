import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('=== Iniciando proxy para webhook do Mercado Livre ===')
    const body = await req.json()
    console.log('Dados recebidos:', body)

    const webhookResponse = await fetch(
      'https://primary-production-b163.up.railway.app/webhook-test/mercado-livre-token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    )

    const responseText = await webhookResponse.text()
    console.log('Resposta do webhook:', responseText)

    if (!webhookResponse.ok) {
      throw new Error(`Erro no webhook: ${responseText}`)
    }

    return new Response(responseText, {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: webhookResponse.status,
    })
  } catch (error) {
    console.error('Erro ao processar webhook:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})