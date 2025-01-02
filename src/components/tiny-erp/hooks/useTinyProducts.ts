import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TinyProduct } from "@/integrations/supabase/types/tiny-products";

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

      // Buscar produtos com relacionamentos
      const { data, error } = await supabase
        .from('tiny_products')
        .select(`
          *,
          anexos:tiny_product_attachments(*),
          fornecedores:tiny_product_suppliers(*),
          variacoes:tiny_product_variations(*)
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error("❌ Erro ao buscar produtos:", error);
        throw error;
      }

      console.log("✅ Produtos encontrados:", data);

      return data as TinyProduct[];
    },
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