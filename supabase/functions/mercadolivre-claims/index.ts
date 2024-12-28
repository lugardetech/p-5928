import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { userId } = await req.json();

    console.log("=== Buscando reclamações do Mercado Livre ===");
    console.log("User ID:", userId);

    // Buscar integração do usuário
    const { data: userIntegration, error: integrationError } = await supabase
      .from('user_integrations')
      .select('*')
      .eq('user_id', userId)
      .eq('integration_id', 'ae8f644a-bf1a-42ef-a3aa-6b3887971ef9')
      .single();

    if (integrationError || !userIntegration) {
      console.error("❌ Erro ao buscar integração:", integrationError);
      throw new Error("Integração não encontrada");
    }

    console.log("✅ Integração encontrada");

    // Buscar reclamações na API do Mercado Livre
    const response = await fetch('https://api.mercadolibre.com/claims/search', {
      headers: {
        'Authorization': `Bearer ${userIntegration.access_token}`,
      },
    });

    if (!response.ok) {
      console.error("❌ Erro na API do Mercado Livre:", response.statusText);
      throw new Error(`Erro na API do Mercado Livre: ${response.statusText}`);
    }

    const claims = await response.json();
    console.log("✅ Reclamações obtidas com sucesso");

    return new Response(JSON.stringify(claims), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("❌ Erro ao processar requisição:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});