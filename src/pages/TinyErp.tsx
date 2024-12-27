import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CredentialsForm } from "@/components/tiny-erp/CredentialsForm";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

interface TinyErpSettings {
  client_id: string;
  client_secret: string;
  redirect_uri: string;
}

interface UserIntegration {
  settings: TinyErpSettings;
}

const TinyErp = () => {
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [hasCredentials, setHasCredentials] = useState(false);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getCurrentUser();
  }, []);

  const { data: integration } = useQuery({
    queryKey: ["tiny-integration"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("integrations")
        .select("id")
        .eq("name", "tiny_erp")
        .single();

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const checkCredentials = async () => {
      if (!userId || !integration?.id) return;

      const { data, error } = await supabase
        .from("user_integrations")
        .select("settings")
        .eq("user_id", userId)
        .eq("integration_id", integration.id)
        .maybeSingle();

      if (error) {
        console.error("Erro ao verificar credenciais:", error);
        return;
      }

      const settings = data?.settings as unknown as TinyErpSettings | undefined;
      setHasCredentials(!!settings?.client_id);
    };

    checkCredentials();
  }, [userId, integration?.id]);

  const handleAuth = async () => {
    try {
      if (!userId || !integration?.id) {
        throw new Error("Usuário não autenticado ou integração não encontrada");
      }

      console.log("Buscando credenciais do usuário...");
      const { data: userIntegration, error: fetchError } = await supabase
        .from("user_integrations")
        .select("settings")
        .eq("user_id", userId)
        .eq("integration_id", integration.id)
        .single();

      if (fetchError) {
        console.error("Erro ao buscar credenciais:", fetchError);
        throw fetchError;
      }

      const settings = userIntegration.settings as unknown as TinyErpSettings;
      if (!settings || !settings.client_id || !settings.redirect_uri) {
        throw new Error("Credenciais inválidas ou incompletas");
      }

      console.log("Construindo URL de autorização...");
      console.log("Client ID:", settings.client_id);
      console.log("Redirect URI:", settings.redirect_uri);

      // URL de autorização do Tiny ERP
      const authUrl = new URL("https://api.tiny.com.br/oauth2/authorize");
      authUrl.searchParams.append("response_type", "code");
      authUrl.searchParams.append("client_id", settings.client_id);
      authUrl.searchParams.append("redirect_uri", settings.redirect_uri);
      authUrl.searchParams.append("scope", "empresas");

      console.log("URL de autorização construída:", authUrl.toString());

      // Redirecionar para a página de autorização
      window.location.href = authUrl.toString();
    } catch (error) {
      console.error("Erro ao iniciar autenticação:", error);
      toast({
        variant: "destructive",
        title: "Erro ao iniciar autenticação",
        description: "Verifique suas credenciais e tente novamente.",
      });
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-primary">Integração Tiny ERP</h1>
        <p className="text-secondary-foreground">Gerencie sua integração com o Tiny ERP</p>
      </header>

      {!hasCredentials ? (
        <Card>
          <CardHeader>
            <CardTitle>Configurar Credenciais</CardTitle>
            <CardDescription>
              Insira as credenciais do seu aplicativo Tiny ERP para começar a integração.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CredentialsForm />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Autenticação</CardTitle>
            <CardDescription>
              Suas credenciais estão configuradas. Clique no botão abaixo para autorizar o acesso ao Tiny ERP.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleAuth}>
              Conectar ao Tiny ERP
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TinyErp;