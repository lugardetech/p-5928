import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Json } from "@/integrations/supabase/types";

export interface Order {
  id: string;
  numero: string;
  data_pedido: string;
  cliente: {
    nome: string;
    codigo: string;
  };
  situacao: string;
  valor_total: string;
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

export const useTinyOrders = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["tiny-orders"],
    queryFn: async () => {
      console.log("=== Iniciando busca de pedidos ===");
      
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
      console.log("🔄 Chamando Edge Function tiny-orders...");
      const { data, error: functionError } = await supabase.functions.invoke('tiny-orders', {
        body: { access_token: accessToken }
      });

      if (functionError) {
        console.error("❌ Erro na Edge Function:", functionError);
        throw new Error(functionError.message);
      }

      console.log("✅ Pedidos recebidos:", data);
      
      if (!data?.pedidos) {
        throw new Error("Nenhum pedido encontrado");
      }

      return data.pedidos.map((pedido: any) => ({
        id: pedido.id,
        numero: pedido.numero,
        data_pedido: pedido.data_pedido,
        cliente: {
          nome: pedido.cliente?.nome || '-',
          codigo: pedido.cliente?.codigo || '-'
        },
        situacao: pedido.situacao || '-',
        valor_total: pedido.valor_total?.toFixed(2) || "0.00"
      }));
    },
    retry: false,
    meta: {
      onError: (error: Error) => {
        console.error("Query error:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar pedidos",
          description: error.message || "Ocorreu um erro ao carregar os pedidos",
        });
      }
    }
  });
};