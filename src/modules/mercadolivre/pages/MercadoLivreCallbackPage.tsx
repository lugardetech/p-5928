import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function MercadoLivreCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      console.log("=== Código de autorização recebido ===", code);

      if (!code) {
        console.error("❌ Código de autorização não encontrado");
        toast({
          variant: "destructive",
          title: "Erro na autenticação",
          description: "Código de autorização não encontrado.",
        });
        navigate("/integration/mercado-livre");
        return;
      }

      try {
        console.log("=== Iniciando troca de tokens ===");
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error("Usuário não autenticado");
        }

        // Buscar a integração do Mercado Livre
        const { data: integration, error: integrationError } = await supabase
          .from("integrations")
          .select("*")
          .eq("name", "mercado_livre")
          .maybeSingle();

        if (integrationError) {
          console.error("❌ Erro ao buscar integração:", integrationError);
          throw integrationError;
        }

        if (!integration) {
          console.error("❌ Integração não encontrada");
          throw new Error("Integração não encontrada");
        }

        console.log("✅ Integração encontrada:", integration);

        const { data, error } = await supabase.functions.invoke("mercadolivre-token-exchange", {
          body: { 
            code, 
            userId: user.id, 
            integrationId: integration.id 
          }
        });

        if (error) {
          console.error("❌ Erro ao trocar tokens:", error);
          throw error;
        }

        console.log("✅ Tokens obtidos com sucesso:", data);

        toast({
          title: "Autenticação realizada com sucesso!",
          description: "Sua conta do Mercado Livre foi conectada.",
        });
      } catch (error) {
        console.error("❌ Erro ao trocar tokens:", error);
        toast({
          variant: "destructive",
          title: "Erro na autenticação",
          description: "Ocorreu um erro ao conectar sua conta do Mercado Livre. Por favor, tente novamente.",
        });
      }

      navigate("/integration/mercado-livre");
    };

    handleCallback();
  }, [searchParams, navigate, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Autenticando...</h1>
        <p className="text-secondary-foreground">Aguarde enquanto conectamos sua conta do Mercado Livre.</p>
      </div>
    </div>
  );
}