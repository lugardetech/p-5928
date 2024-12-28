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

      // Primeiro busca a integração
      const { data: integration, error: integrationError } = await supabase
        .from("integrations")
        .select("id")
        .eq("name", "mercado_livre")
        .maybeSingle();

      if (integrationError) {
        console.error("❌ Erro ao buscar integração:", integrationError);
        throw integrationError;
      }

      if (!integration) {
        console.log("❌ Integração não encontrada");
        return {
          isConfigured: false,
          isAuthenticated: false,
          settings: null,
        };
      }

      // Depois busca a integração do usuário
      const { data: userIntegration, error: userIntegrationError } = await supabase
        .from("user_integrations")
        .select("*")
        .eq("user_id", user.id)
        .eq("integration_id", integration.id)
        .maybeSingle();

      if (userIntegrationError && userIntegrationError.code !== "PGRST116") {
        console.error("❌ Erro ao buscar integração do usuário:", userIntegrationError);
        throw userIntegrationError;
      }

      console.log("✅ Status da integração obtido:", userIntegration);

      // Se não houver integração do usuário, retorna não configurado
      if (!userIntegration) {
        return {
          isConfigured: false,
          isAuthenticated: false,
          settings: null,
        };
      }

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