import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const TinyErpCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const error = searchParams.get("error");
      const error_description = searchParams.get("error_description");

      console.log("Iniciando callback do Tiny ERP");
      console.log("Código recebido:", code);
      
      if (error || !code) {
        console.error("Erro na autenticação:", error, error_description);
        toast({
          variant: "destructive",
          title: "Erro na autenticação",
          description: error_description || "Ocorreu um erro durante a autenticação.",
        });
        navigate("/integration/tiny-erp");
        return;
      }

      try {
        console.log("Iniciando troca do código de autorização pelos tokens");
        
        // Primeiro, precisamos obter o user_id e as credenciais
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("Usuário não autenticado");
        }
        console.log("Usuário autenticado:", user.id);

        // Buscar a integração do Tiny ERP
        const { data: integration, error: integrationError } = await supabase
          .from("integrations")
          .select("id")
          .eq("name", "tiny_erp")
          .single();

        if (integrationError) {
          console.error("Erro ao buscar integração:", integrationError);
          throw new Error("Erro ao buscar integração");
        }

        if (!integration) {
          throw new Error("Integração não encontrada");
        }
        console.log("Integração encontrada:", integration.id);

        // Buscar as credenciais do usuário
        const { data: userIntegration, error: userIntegrationError } = await supabase
          .from("user_integrations")
          .select("settings")
          .eq("user_id", user.id)
          .eq("integration_id", integration.id)
          .single();

        if (userIntegrationError) {
          console.error("Erro ao buscar credenciais:", userIntegrationError);
          throw new Error("Erro ao buscar credenciais");
        }

        if (!userIntegration) {
          throw new Error("Credenciais não encontradas");
        }
        console.log("Credenciais encontradas");

        // Cast settings para o tipo correto
        const settings = userIntegration.settings as unknown as { 
          client_id: string;
          client_secret: string;
          redirect_uri: string;
        };

        console.log("Fazendo requisição para obter tokens");
        // Fazer a requisição para trocar o código pelos tokens
        const tokenResponse = await fetch("https://api.tiny.com.br/oauth2/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            code: code,
            client_id: settings.client_id,
            client_secret: settings.client_secret,
            redirect_uri: settings.redirect_uri,
          }),
        });

        if (!tokenResponse.ok) {
          const errorData = await tokenResponse.json();
          console.error("Erro na resposta da API:", errorData);
          throw new Error(`Erro ao obter tokens: ${errorData.error_description || errorData.message}`);
        }

        const tokens = await tokenResponse.json();
        console.log("Tokens obtidos com sucesso");

        // Calcular as datas de expiração
        const now = new Date();
        const tokenExpiresAt = new Date(now.getTime() + tokens.expires_in * 1000);
        const refreshTokenExpiresAt = tokens.refresh_token_expires_in 
          ? new Date(now.getTime() + tokens.refresh_token_expires_in * 1000)
          : null;

        console.log("Salvando tokens no banco de dados");
        // Atualizar os tokens no banco
        const { error: updateError } = await supabase
          .from("user_integrations")
          .update({
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            token_expires_at: tokenExpiresAt.toISOString(),
            refresh_token_expires_at: refreshTokenExpiresAt?.toISOString(),
            status: true,
          })
          .eq("user_id", user.id)
          .eq("integration_id", integration.id);

        if (updateError) {
          console.error("Erro ao salvar tokens:", updateError);
          throw updateError;
        }

        console.log("Tokens salvos com sucesso no banco de dados");
        
        toast({
          title: "Autenticação bem-sucedida",
          description: "Sua conta do Tiny ERP foi conectada com sucesso!",
        });
      } catch (error) {
        console.error("Erro ao processar callback:", error);
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

export default TinyErpCallback;