import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MercadoLivreSettings } from "@/types/mercadolivre";

export function useIntegrationStatus() {
  return useQuery({
    queryKey: ["mercadolivre-integration-status"],
    queryFn: async () => {
      try {
        console.log("=== Verificando status da integração com Mercado Livre ===");

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.error("❌ Usuário não autenticado");
          throw new Error("Usuário não autenticado");
        }

        // Primeiro busca a integração
        const { data: integrations, error: integrationError } = await supabase
          .from("integrations")
          .select("id")
          .eq("name", "mercado_livre");

        if (integrationError) {
          console.error("❌ Erro ao buscar integração:", integrationError);
          throw integrationError;
        }

        if (!integrations || integrations.length === 0) {
          console.log("❌ Integração não encontrada");
          return {
            isConfigured: false,
            isAuthenticated: false,
            settings: null,
          };
        }

        const integration = integrations[0];

        // Depois busca a integração do usuário
        const { data: userIntegrations, error: userIntegrationError } = await supabase
          .from("user_integrations")
          .select("*")
          .eq("user_id", user.id)
          .eq("integration_id", integration.id);

        if (userIntegrationError) {
          console.error("❌ Erro ao buscar integração do usuário:", userIntegrationError);
          throw userIntegrationError;
        }

        if (!userIntegrations || userIntegrations.length === 0) {
          console.log("❌ Nenhuma integração do usuário encontrada");
          return {
            isConfigured: false,
            isAuthenticated: false,
            settings: null,
          };
        }

        const userIntegration = userIntegrations[0];
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
      } catch (error) {
        console.error("❌ Erro ao verificar status da integração:", error);
        throw error;
      }
    },
  });
}