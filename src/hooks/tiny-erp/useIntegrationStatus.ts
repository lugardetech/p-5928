import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

interface TinyErpSettings {
  client_id: string;
  client_secret: string;
  redirect_uri: string;
}

export const useIntegrationStatus = () => {
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

      if (data) {
        const settings = data.settings as TinyErpSettings;
        if (settings?.client_id && settings?.client_secret && settings?.redirect_uri) {
          setHasCredentials(true);
          
          if (data.access_token && data.token_expires_at) {
            const expiresAt = new Date(data.token_expires_at);
            setIsConnected(expiresAt > new Date());
          } else {
            setIsConnected(false);
          }
        } else {
          setHasCredentials(false);
          setIsConnected(false);
        }
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
      if (!settings?.client_id || !settings?.redirect_uri) {
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

  return { hasCredentials, isConnected, handleAuth };
};