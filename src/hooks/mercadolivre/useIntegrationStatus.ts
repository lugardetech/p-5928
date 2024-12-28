import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MercadoLivreSettings } from "@/types/mercadolivre";

export function useIntegrationStatus() {
  return useQuery({
    queryKey: ["mercadolivre-integration-status"],
    queryFn: async () => {
      console.log("=== Verificando status da integração com Mercado Livre ===");

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      const { data: integration } = await supabase
        .from("integrations")
        .select("id")
        .eq("name", "mercado_livre")
        .single();

      if (!integration) {
        throw new Error("Integração não encontrada");
      }

      const { data: userIntegration, error } = await supabase
        .from("user_integrations")
        .select("*")
        .eq("user_id", user.id)
        .eq("integration_id", integration.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("❌ Erro ao buscar integração:", error);
        throw error;
      }

      console.log("✅ Status da integração obtido:", userIntegration);

      // Fazendo o type casting de forma mais segura
      const settings = userIntegration?.settings as Record<string, unknown>;
      const mercadoLivreSettings: MercadoLivreSettings | null = settings ? {
        client_id: String(settings.client_id || ''),
        client_secret: String(settings.client_secret || ''),
        redirect_uri: String(settings.redirect_uri || '')
      } : null;

      // Verifica se todas as credenciais necessárias existem e não estão vazias
      const hasValidCredentials = mercadoLivreSettings?.client_id && 
                                mercadoLivreSettings?.client_secret && 
                                mercadoLivreSettings?.redirect_uri;

      return {
        isConfigured: Boolean(hasValidCredentials),
        isAuthenticated: !!userIntegration?.access_token,
        settings: mercadoLivreSettings,
      };
    },
  });
}