import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function TinyErpCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const code = searchParams.get("code");

  useEffect(() => {
    async function exchangeToken() {
      try {
        if (!code) {
          throw new Error("Código de autorização não encontrado");
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("Usuário não autenticado");
        }

        const { error } = await supabase.functions.invoke("tiny-token-exchange", {
          body: { code, userId: user.id }
        });

        if (error) throw error;

        toast({
          title: "Sucesso!",
          description: "Integração com Tiny ERP realizada com sucesso",
        });

        navigate("/integration/tiny-erp");
      } catch (error) {
        console.error("Erro ao trocar token:", error);
        toast({
          variant: "destructive",
          title: "Erro na integração",
          description: error.message || "Ocorreu um erro ao realizar a integração"
        });
        navigate("/integration/tiny-erp");
      }
    }

    exchangeToken();
  }, [code, navigate, toast]);

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}