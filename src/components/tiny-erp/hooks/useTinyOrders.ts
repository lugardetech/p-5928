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
      try {
        console.log("=== Iniciando busca de pedidos ===");
        
        // Buscar usuário atual
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error("❌ Erro ao buscar usuário:", userError);
          throw new Error("Erro ao buscar usuário");
        }
        
        if (!user) {
          console.error("❌ Usuário não autenticado");
          throw new Error("Usuário não autenticado");
        }

        console.log("✅ Usuário autenticado:", user.id);

        // Chamar Edge Function
        console.log("🔄 Chamando Edge Function tiny-orders...");
        const { data, error: functionError } = await supabase.functions.invoke('tiny-orders', {
          body: { user_id: user.id }
        });

        if (functionError) {
          console.error("❌ Erro na Edge Function:", functionError);
          
          // Se o erro for de token inválido/expirado, tentar renovar
          if (functionError.message.includes("Token de acesso inválido") || 
              functionError.message.includes("Token expirado")) {
            console.log("🔄 Tentando renovar token...");
            
            const { data: refreshData, error: refreshError } = await supabase.functions.invoke('tiny-token-refresh', {
              body: { user_id: user.id }
            });

            if (refreshError) {
              console.error("❌ Erro ao renovar token:", refreshError);
              throw new Error("Erro ao renovar token. Por favor, reconecte sua conta do Tiny ERP.");
            }

            // Tentar novamente com o novo token
            console.log("🔄 Tentando novamente com o novo token...");
            const { data: retryData, error: retryError } = await supabase.functions.invoke('tiny-orders', {
              body: { user_id: user.id }
            });

            if (retryError) {
              console.error("❌ Erro na segunda tentativa:", retryError);
              throw retryError;
            }

            return retryData.pedidos;
          }
          
          throw functionError;
        }

        console.log("✅ Pedidos recebidos:", data);
        
        if (!data?.pedidos) {
          throw new Error("Nenhum pedido encontrado");
        }

        return data.pedidos;
      } catch (error: any) {
        console.error("❌ Erro na query:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar pedidos",
          description: error.message || "Ocorreu um erro ao carregar os pedidos",
        });
        throw error;
      }
    },
    retry: false
  });
};