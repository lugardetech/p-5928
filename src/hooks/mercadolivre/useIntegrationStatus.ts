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

      const settings = userIntegration?.settings as MercadoLivreSettings | null;

      return {
        isConfigured: settings?.client_id && settings?.client_secret,
        isAuthenticated: !!userIntegration?.access_token,
        settings,
      };
    },
  });
}