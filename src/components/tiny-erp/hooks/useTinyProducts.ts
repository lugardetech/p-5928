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
      try {
        console.log("=== Iniciando busca de produtos ===");
        
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
        console.log("🔄 Chamando Edge Function tiny-products...");
        const { data, error: functionError } = await supabase.functions.invoke('tiny-products', {
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
            const { data: retryData, error: retryError } = await supabase.functions.invoke('tiny-products', {
              body: { user_id: user.id }
            });

            if (retryError) {
              console.error("❌ Erro na segunda tentativa:", retryError);
              throw retryError;
            }

            return retryData.produtos.map(item => ({
              id: item.id,
              nome: item.descricao,
              codigo: item.sku,
              preco: item.precos?.preco?.toFixed(2) || "0.00",
              unidade: item.unidade || "-",
              estoque: "Consultar"
            }));
          }
          
          throw functionError;
        }

        console.log("✅ Produtos recebidos:", data);
        
        if (!data?.produtos) {
          throw new Error("Nenhum produto encontrado");
        }

        return data.produtos.map(item => ({
          id: item.id,
          nome: item.descricao,
          codigo: item.sku,
          preco: item.precos?.preco?.toFixed(2) || "0.00",
          unidade: item.unidade || "-",
          estoque: "Consultar"
        }));
      } catch (error: any) {
        console.error("❌ Erro na query:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar produtos",
          description: error.message || "Ocorreu um erro ao carregar os produtos",
        });
        throw error;
      }
    },
    retry: false
  });
};