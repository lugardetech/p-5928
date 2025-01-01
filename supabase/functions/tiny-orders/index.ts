import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { access_token } = await req.json();

    if (!access_token) {
      throw new Error('Token de acesso não fornecido');
    }

    console.log("🔄 Buscando pedidos no Tiny ERP...");

    const response = await fetch('https://api.tiny.com.br/public-api/v3/pedidos', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Accept': 'application/json',
      }
    });

    const responseText = await response.text();
    console.log("📝 Resposta da API:", responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("❌ Erro ao fazer parse da resposta:", e);
      throw new Error('Erro ao processar resposta da API do Tiny');
    }

    if (!response.ok) {
      console.error("❌ Erro retornado pela API:", data);
      throw new Error(data.message || 'Erro ao buscar pedidos');
    }

    console.log("✅ Pedidos recebidos da API do Tiny");

    return new Response(
      JSON.stringify({
        status: "OK",
        pedidos: data.itens || []
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