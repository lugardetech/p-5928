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
    const { data: integration, error: integrationError } = await supabase
      .from('integrations')
      .select('*')
      .eq('user_id', userId)
      .eq('name', 'mercado_livre')
      .single();

    if (integrationError) {
      console.error("❌ Erro ao buscar integração:", integrationError);
      throw new Error("Erro ao buscar integração");
    }

    if (!integration?.access_token) {
      console.error("❌ Token de acesso não encontrado");
      throw new Error("Token de acesso não encontrado");
    }

    console.log("✅ Integração encontrada");

    // Buscar reclamações abertas na API do Mercado Livre
    const response = await fetch('https://api.mercadolibre.com/post-purchase/v1/claims/search?status=opened', {
      headers: {
        'Authorization': `Bearer ${integration.access_token}`,
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
          claim_id: claim.id.toString(),
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
      .eq('status', 'opened')
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