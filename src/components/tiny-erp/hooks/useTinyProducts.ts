import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error("❌ Usuário não autenticado");
        throw new Error("Usuário não autenticado");
      }

      console.log("✅ Usuário autenticado:", user.id);

      // Buscar produtos da tabela tiny_products
      const { data, error } = await supabase
        .from('tiny_products')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error("❌ Erro ao buscar produtos:", error);
        throw error;
      }

      console.log("✅ Produtos encontrados:", data);

      return data.map(item => ({
        id: item.id,
        nome: item.nome,
        codigo: item.sku,
        preco: item.preco?.toFixed(2) || "0.00",
        unidade: item.unidade || "-",
        estoque: item.estoque?.toString() || "0"
      }));
    },
    retry: false,
    meta: {
      onError: (error: Error) => {
        console.error("❌ Erro na query:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar produtos",
          description: error.message || "Ocorreu um erro ao carregar os produtos",
        });
      }
    }
  });
};