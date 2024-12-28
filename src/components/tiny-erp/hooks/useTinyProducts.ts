import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface Product {
  id: string;
  nome: string;
  codigo: string;
  preco: string;
  unidade: string;
  estoque: string;
}

export const useTinyProducts = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["tiny-products"],
    queryFn: async () => {
      console.log("=== Iniciando busca de produtos ===");
      
      // Buscar integração
      const { data: integration, error: integrationError } = await supabase
        .from("integrations")
        .select("id")
        .eq("name", "tiny_erp")
        .maybeSingle();

      if (integrationError) {
        console.error("❌ Erro ao buscar integração:", integrationError);
        throw new Error("Integração Tiny ERP não encontrada");
      }

      if (!integration?.id) {
        console.error("❌ Integração não encontrada");
        throw new Error("Integração Tiny ERP não encontrada");
      }

      console.log("✅ Integração encontrada:", integration);

      // Buscar token de acesso e configurações
      const { data: userIntegration, error: userIntegrationError } = await supabase
        .from("user_integrations")
        .select("access_token, refresh_token, token_expires_at, settings")
        .eq("integration_id", integration.id)
        .maybeSingle();

      if (userIntegrationError) {
        console.error("❌ Erro ao buscar integração do usuário:", userIntegrationError);
        throw userIntegrationError;
      }

      if (!userIntegration?.access_token) {
        console.error("❌ Token de acesso não encontrado");
        throw new Error("Token de acesso não encontrado");
      }

      // Verificar se o token expirou
      let accessToken = userIntegration.access_token;
      if (userIntegration.token_expires_at) {
        const expiresAt = new Date(userIntegration.token_expires_at);
        if (expiresAt < new Date()) {
          console.log("🔄 Token expirado, tentando renovar...");
          
          try {
            const { data: refreshData, error: refreshError } = await supabase.functions.invoke('tiny-token-refresh', {
              body: { 
                refresh_token: userIntegration.refresh_token,
                client_id: userIntegration.settings.client_id,
                client_secret: userIntegration.settings.client_secret
              }
            });

            if (refreshError) throw refreshError;

            // Atualizar tokens no banco
            const { error: updateError } = await supabase
              .from('user_integrations')
              .update({
                access_token: refreshData.access_token,
                refresh_token: refreshData.refresh_token,
                token_expires_at: refreshData.token_expires_at,
                refresh_token_expires_at: refreshData.refresh_token_expires_at
              })
              .eq('integration_id', integration.id);

            if (updateError) throw updateError;

            console.log("✅ Token renovado com sucesso");
            accessToken = refreshData.access_token;
          } catch (error) {
            console.error("❌ Erro ao renovar token:", error);
            throw new Error("Erro ao renovar token de acesso. Por favor, reconecte sua conta.");
          }
        }
      }

      console.log("✅ Token de acesso válido encontrado");

      // Chamar Edge Function
      console.log("🔄 Chamando Edge Function tiny-products...");
      const { data, error: functionError } = await supabase.functions.invoke('tiny-products', {
        body: { access_token: accessToken }
      });

      if (functionError) {
        console.error("❌ Erro na Edge Function:", functionError);
        throw new Error(functionError.message);
      }

      console.log("✅ Produtos recebidos:", data);
      
      if (!data?.itens) {
        throw new Error("Nenhum produto encontrado");
      }

      return data.itens.map(item => ({
        id: item.id,
        nome: item.descricao,
        codigo: item.sku,
        preco: item.precos?.preco?.toFixed(2) || "0.00",
        unidade: item.unidade || "-",
        estoque: "Consultar"
      }));
    },
    retry: false,
    meta: {
      onError: (error: Error) => {
        console.error("Query error:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar produtos",
          description: error.message || "Ocorreu um erro ao carregar os produtos",
        });
      }
    }
  });
};