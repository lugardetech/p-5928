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

      const { data: userIntegration, error: userIntegrationError } = await supabase
        .from("user_integrations")
        .select("access_token")
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

      console.log("✅ Token de acesso encontrado");

      console.log("🔄 Chamando Edge Function tiny-products...");
      const { data, error: functionError } = await supabase.functions.invoke('tiny-products', {
        body: { access_token: userIntegration.access_token }
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