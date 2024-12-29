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

    if (!userId) {
      throw new Error("User ID não fornecido");
    }

    // Buscar integração do usuário
    const { data: userIntegration, error: integrationError } = await supabase
      .from('user_integrations')
      .select('*')
      .eq('user_id', userId)
      .eq('integration_id', 'ae8f644a-bf1a-42ef-a3aa-6b3887971ef9')
      .single();

    if (integrationError) {
      console.error("❌ Erro ao buscar integração:", integrationError);
      throw new Error("Erro ao buscar integração");
    }

    if (!userIntegration?.access_token) {
      console.error("❌ Token de acesso não encontrado");
      throw new Error("Token de acesso não encontrado");
    }

    console.log("✅ Integração encontrada");

    // Buscar reclamações na API do Mercado Livre
    const response = await fetch('https://api.mercadolibre.com/post-purchase/v1/claims/search?status=opened', {
      headers: {
        'Authorization': `Bearer ${userIntegration.access_token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Erro na API do Mercado Livre:", errorText);
      throw new Error(`Erro na API do Mercado Livre: ${response.statusText}`);
    }

    const claims = await response.json();
    console.log("✅ Reclamações obtidas com sucesso:", claims);

    // Salvar/atualizar reclamações no banco
    for (const claim of claims.data) {
      const { error: upsertError } = await supabase
        .from('mercadolivre_claims')
        .upsert({
          user_id: userId,
          claim_id: claim.id,
          resource_id: claim.resource_id,
          status: claim.status,
          type: claim.type,
          stage: claim.stage,
          parent_id: claim.parent_id,
          resource: claim.resource,
          reason_id: claim.reason_id,
          fulfilled: claim.fulfilled,
          quantity_type: claim.quantity_type,
          players: claim.players,
          resolution: claim.resolution,
          site_id: claim.site_id,
          date_created: claim.date_created,
          last_updated: claim.last_updated
        }, {
          onConflict: 'user_id,claim_id'
        });

      if (upsertError) {
        console.error("❌ Erro ao salvar reclamação:", upsertError);
      }
    }

    // Buscar reclamações atualizadas do banco
    const { data: dbClaims, error: dbError } = await supabase
      .from('mercadolivre_claims')
      .select('*')
      .eq('user_id', userId)
      .order('date_created', { ascending: false });

    if (dbError) {
      console.error("❌ Erro ao buscar reclamações do banco:", dbError);
      throw dbError;
    }

    return new Response(JSON.stringify({ data: dbClaims }), {
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