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
    console.log('=== Iniciando processamento do webhook do Mercado Livre ===')
    const body = await req.json()
    console.log('Dados recebidos:', body)

    // Validar se os dados necessários estão presentes
    if (!body?.settings?.client_id || !body?.settings?.client_secret) {
      throw new Error('Dados de integração incompletos')
    }

    // Enviar dados para o webhook de autenticação
    const webhookResponse = await fetch(
      'https://primary-production-b163.up.railway.app/webhook/mercado-livre',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: body.settings.client_id,
          client_secret: body.settings.client_secret,
          redirect_uri: body.settings.redirect_uri
        }),
      }
    )

    if (!webhookResponse.ok) {
      const errorText = await webhookResponse.text()
      console.error('Resposta de erro do webhook:', errorText)
      throw new Error(`Erro na resposta do webhook: ${errorText}`)
    }

    const responseText = await webhookResponse.text()
    console.log('Resposta do webhook:', responseText)

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