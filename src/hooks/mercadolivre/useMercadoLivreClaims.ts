import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ClaimResponse, MercadoLivreClaim } from "@/types/mercadolivre/claims";
import { useToast } from "@/hooks/use-toast";

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

        const { data: response, error } = await supabase.functions.invoke<ClaimResponse>("mercadolivre-claims", {
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

        console.log("✅ Reclamações obtidas com sucesso:", response);
        
        if (!response) {
          console.log("⚠️ Nenhuma reclamação encontrada");
          return [];
        }

        // Garantir que os players são convertidos corretamente do JSON
        const claims = response.data.map(claim => ({
          ...claim,
          players: Array.isArray(claim.players) ? claim.players : []
        }));

        return claims;
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