import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const TinyErpCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const error = searchParams.get("error");
      const error_description = searchParams.get("error_description");

      console.log("=== Iniciando callback do Tiny ERP ===");
      console.log("Parâmetros recebidos na URL:");
      console.log("- code:", code);
      console.log("- error:", error);
      console.log("- error_description:", error_description);
      
      if (error || !code) {
        console.error("❌ Erro na autenticação:", error, error_description);
        toast({
          variant: "destructive",
          title: "Erro na autenticação",
          description: error_description || "Ocorreu um erro durante a autenticação.",
        });
        navigate("/integration/tiny-erp");
        return;
      }

      try {
        console.log("🔄 Chamando Edge Function para troca de tokens...");
        const { data, error } = await supabase.functions.invoke('tiny-token-exchange', {
          body: { code }
        });

        if (error) {
          console.error("❌ Erro na Edge Function:", error);
          throw new Error(error.message);
        }

        console.log("✅ Tokens trocados e salvos com sucesso");
        toast({
          title: "Autenticação bem-sucedida",
          description: "Sua conta do Tiny ERP foi conectada com sucesso!",
        });
      } catch (error) {
        console.error("❌ Erro ao processar callback:", error);
        toast({
          variant: "destructive",
          title: "Erro ao processar autenticação",
          description: error instanceof Error ? error.message : "Ocorreu um erro ao processar a autenticação.",
        });
      }

      navigate("/integration/tiny-erp");
    };

    handleCallback();
  }, [searchParams, navigate, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Processando autenticação...</h1>
        <p>Aguarde enquanto processamos sua autenticação com o Tiny ERP.</p>
      </div>
    </div>
  );
};

export default TinyErpCallbackPage;