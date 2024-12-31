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

        // Buscar integração do usuário
        const { data: integration, error: integrationError } = await supabase
          .from("integrations")
          .select("*")
          .eq("user_id", user.id)
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

        console.log("✅ Status da integração obtido:", integration);

        // Fazendo o type casting de forma mais segura
        const settings = integration?.settings as Record<string, unknown>;
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
          isAuthenticated: !!integration?.access_token,
          settings: mercadoLivreSettings,
        };
      } catch (error) {
        console.error("❌ Erro ao verificar status da integração:", error);
        throw error;
      }
    },
  });
}