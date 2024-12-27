import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CredentialsForm } from "@/components/tiny-erp/CredentialsForm";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TinyErpSettings {
  client_id: string;
  client_secret: string;
  redirect_uri: string;
}

interface UserIntegration {
  settings: TinyErpSettings;
  access_token?: string;
  token_expires_at?: string;
}

const TinyErp = () => {
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [hasCredentials, setHasCredentials] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

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
    const checkIntegrationStatus = async () => {
      if (!userId || !integration?.id) return;

      const { data, error } = await supabase
        .from("user_integrations")
        .select("settings, access_token, token_expires_at")
        .eq("user_id", userId)
        .eq("integration_id", integration.id)
        .maybeSingle();

      if (error) {
        console.error("Erro ao verificar status da integração:", error);
        return;
      }

      const userIntegration = data as UserIntegration | null;
      setHasCredentials(!!userIntegration?.settings?.client_id);
      
      // Verifica se o token está válido
      if (userIntegration?.access_token && userIntegration?.token_expires_at) {
        const expiresAt = new Date(userIntegration.token_expires_at);
        setIsConnected(expiresAt > new Date());
      } else {
        setIsConnected(false);
      }
    };

    checkIntegrationStatus();
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

      const settings = userIntegration.settings as TinyErpSettings;
      if (!settings || !settings.client_id || !settings.redirect_uri) {
        throw new Error("Credenciais inválidas ou incompletas");
      }

      console.log("Construindo URL de autorização...");
      console.log("Client ID:", settings.client_id);
      console.log("Redirect URI:", settings.redirect_uri);

      const authUrl = new URL("https://accounts.tiny.com.br/realms/tiny/protocol/openid-connect/auth");
      authUrl.searchParams.append("client_id", settings.client_id);
      authUrl.searchParams.append("redirect_uri", settings.redirect_uri);
      authUrl.searchParams.append("scope", "openid");
      authUrl.searchParams.append("response_type", "code");

      console.log("URL de autorização construída:", authUrl.toString());

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
    <div className="flex items-center space-x-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Settings2 className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Integração Tiny ERP</DialogTitle>
            <DialogDescription>
              Gerencie sua integração com o Tiny ERP
            </DialogDescription>
          </DialogHeader>
          
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
        </DialogContent>
      </Dialog>
      {isConnected && (
        <Badge variant="default" className="bg-green-500">
          Conectado
        </Badge>
      )}
    </div>
  );
};

export default TinyErp;