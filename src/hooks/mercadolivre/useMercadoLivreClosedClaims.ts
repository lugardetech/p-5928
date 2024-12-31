import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MercadoLivreClaim, Player } from "@/types/mercadolivre/claims";
import { useToast } from "@/hooks/use-toast";

export function useMercadoLivreClosedClaims() {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["mercadolivre-claims-closed"],
    queryFn: async () => {
      try {
        console.log("=== Buscando reclamações fechadas do Mercado Livre ===");
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.error("❌ Usuário não autenticado");
          throw new Error("Usuário não autenticado");
        }

        const { data: response, error } = await supabase
          .from('mercadolivre_claims')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'closed')
          .order('date_created', { ascending: false });

        if (error) {
          console.error("❌ Erro ao buscar reclamações fechadas:", error);
          toast({
            variant: "destructive",
            title: "Erro ao buscar reclamações fechadas",
            description: error.message || "Ocorreu um erro ao buscar as reclamações fechadas"
          });
          throw error;
        }

        console.log("✅ Reclamações fechadas obtidas com sucesso:", response);

        // Garantir que os players são convertidos corretamente do JSON
        const claims = (response || []).map(claim => {
          const parsedPlayers = Array.isArray(claim.players) 
            ? claim.players.map((player: any): Player => ({
                role: player.role || '',
                type: player.type || '',
                user_id: Number(player.user_id) || 0,
                available_actions: Array.isArray(player.available_actions) ? player.available_actions : []
              }))
            : [];

          return {
            ...claim,
            players: parsedPlayers
          } as MercadoLivreClaim;
        });

        return claims;
      } catch (error) {
        console.error("❌ Erro ao buscar reclamações fechadas:", error);
        toast({
          variant: "destructive",
          title: "Erro ao buscar reclamações fechadas",
          description: error.message || "Ocorreu um erro ao buscar as reclamações fechadas"
        });
        throw error;
      }
    },
    retry: 1,
  });
}