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
      
      // Buscar usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error("❌ Usuário não autenticado");
        throw new Error("Usuário não autenticado");
      }

      console.log("✅ Usuário autenticado:", user.id);

      // Buscar integração
      const { data: integration, error: integrationError } = await supabase
        .from("integrations")
        .select("*")
        .eq("name", "tiny_erp")
        .eq("user_id", user.id)
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

      // Chamar Edge Function
      console.log("🔄 Chamando Edge Function tiny-orders...");
      const { data, error: functionError } = await supabase.functions.invoke('tiny-orders', {
        body: { 
          access_token: integration.access_token,
          user_id: user.id
        }
      });

      if (functionError) {
        console.error("❌ Erro na Edge Function:", functionError);
        throw new Error(functionError.message);
      }

      // Se recebeu um novo token, atualizar no banco
      if (data.access_token && data.access_token !== integration.access_token) {
        console.log("🔄 Atualizando token no banco de dados...");
        const { error: updateError } = await supabase
          .from('integrations')
          .update({ access_token: data.access_token })
          .eq('id', integration.id);

        if (updateError) {
          console.error("❌ Erro ao atualizar token:", updateError);
        }
      }

      console.log("✅ Pedidos recebidos:", data);
      
      if (!data?.pedidos) {
        throw new Error("Nenhum pedido encontrado");
      }

      return data.pedidos;
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