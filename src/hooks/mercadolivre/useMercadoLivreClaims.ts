import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MercadoLivreClaim } from "@/types/mercadolivre/claims";
import { useToast } from "@/components/ui/use-toast";

export function useMercadoLivreClaims() {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["mercadolivre-claims"],
    queryFn: async () => {
      try {
        console.log("=== Buscando reclamações do Mercado Livre ===");
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.error("❌ Usuário não autenticado");
          throw new Error("Usuário não autenticado");
        }

        const { data, error } = await supabase.functions.invoke("mercadolivre-claims", {
          body: { userId: user.id }
        });

        if (error) {
          console.error("❌ Erro ao buscar reclamações:", error);
          toast({
            variant: "destructive",
            title: "Erro ao buscar reclamações",
            description: error.message || "Ocorreu um erro ao buscar as reclamações"
          });
          throw error;
        }

        if (!data || !Array.isArray(data)) {
          console.error("❌ Formato de dados inválido:", data);
          throw new Error("Formato de dados inválido");
        }

        console.log("✅ Reclamações obtidas com sucesso:", data);
        return data as MercadoLivreClaim[];
      } catch (error) {
        console.error("❌ Erro ao buscar reclamações:", error);
        toast({
          variant: "destructive",
          title: "Erro ao buscar reclamações",
          description: error.message || "Ocorreu um erro ao buscar as reclamações"
        });
        throw error;
      }
    },
    retry: 1,
  });
}