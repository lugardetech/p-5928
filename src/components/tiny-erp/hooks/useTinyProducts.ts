import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Json } from "@/integrations/supabase/types";

export interface Product {
  id: string;
  nome: string;
  codigo: string;
  preco: string;
  unidade: string;
  estoque: string;
}

interface TinyErpSettings {
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  [key: string]: string;
}

function isTinyErpSettings(settings: Json | null): settings is TinyErpSettings {
  if (!settings || typeof settings !== 'object' || Array.isArray(settings)) {
    return false;
  }

  const s = settings as Record<string, unknown>;
  return (
    typeof s.client_id === 'string' &&
    typeof s.client_secret === 'string' &&
    typeof s.redirect_uri === 'string'
  );
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
        .select("*")
        .eq("name", "tiny_erp")
        .maybeSingle();

      if (integrationError) {
        console.error("❌ Erro ao buscar integração:", integrationError);
        throw new Error("Erro ao buscar integração com Tiny ERP");
      }

      if (!integration) {
        console.error("❌ Integração não encontrada");
        throw new Error("Integração com Tiny ERP não configurada");
      }

      console.log("✅ Integração encontrada:", integration);

      if (!integration.access_token) {
        console.error("❌ Token de acesso não encontrado");
        throw new Error("Token de acesso não encontrado. Por favor, reconecte sua conta.");
      }

      if (!isTinyErpSettings(integration.settings)) {
        console.error("❌ Configurações inválidas:", integration.settings);
        throw new Error("Configurações da integração inválidas");
      }

      // Verificar se o token expirou
      let accessToken = integration.access_token;
      if (integration.token_expires_at) {
        const expiresAt = new Date(integration.token_expires_at);
        if (expiresAt < new Date()) {
          console.log("🔄 Token expirado, tentando renovar...");
          
          try {
            const { data: refreshData, error: refreshError } = await supabase.functions.invoke('tiny-token-refresh', {
              body: { 
                refresh_token: integration.refresh_token,
                client_id: integration.settings.client_id,
                client_secret: integration.settings.client_secret
              }
            });

            if (refreshError) throw refreshError;

            // Atualizar tokens no banco
            const { error: updateError } = await supabase
              .from('integrations')
              .update({
                access_token: refreshData.access_token,
                refresh_token: refreshData.refresh_token,
                token_expires_at: refreshData.token_expires_at,
                refresh_token_expires_at: refreshData.refresh_token_expires_at
              })
              .eq('id', integration.id);

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