import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Json } from "@/integrations/supabase/types";

interface TinyErpSettings {
  client_id: string;
  client_secret: string;
  redirect_uri: string;
}

// Type guard to check if the settings match TinyErpSettings interface
function isTinyErpSettings(settings: Json): settings is TinyErpSettings {
  if (!settings || typeof settings !== 'object' || Array.isArray(settings)) {
    return false;
  }

  const s = settings as Record<string, unknown>;
  return (
    typeof s.client_id === 'string' &&
    typeof s.client_secret === 'string' &&
    typeof s.redirect_uri === 'string'
  );
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

  // First, get the integration ID for tiny_erp
  const { data: integration } = useQuery({
    queryKey: ["tiny-integration"],
    queryFn: async () => {
      console.log("Fetching tiny_erp integration...");
      const { data, error } = await supabase
        .from("integrations")
        .select("id")
        .eq("name", "tiny_erp")
        .single();

      if (error) {
        console.error("Error fetching integration:", error);
        throw error;
      }
      console.log("Found integration:", data);
      return data;
    },
  });

  useEffect(() => {
    const checkIntegrationStatus = async () => {
      if (!userId || !integration?.id) {
        console.log("Missing userId or integration.id", { userId, integrationId: integration?.id });
        return;
      }

      console.log("Checking integration status for user", userId);
      const { data, error } = await supabase
        .from("user_integrations")
        .select("settings, access_token, token_expires_at")
        .eq("user_id", userId)
        .eq("integration_id", integration.id)
        .maybeSingle();

      if (error) {
        console.error("Error checking integration status:", error);
        return;
      }

      console.log("Integration status data:", data);

      if (data) {
        if (isTinyErpSettings(data.settings)) {
          setHasCredentials(true);
          
          if (data.access_token && data.token_expires_at) {
            const expiresAt = new Date(data.token_expires_at);
            setIsConnected(expiresAt > new Date());
          } else {
            setIsConnected(false);
          }
        } else {
          console.log("Invalid settings format:", data.settings);
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

      console.log("Fetching user integration...");
      const { data: userIntegration, error: fetchError } = await supabase
        .from("user_integrations")
        .select("settings")
        .eq("user_id", userId)
        .eq("integration_id", integration.id)
        .single();

      if (fetchError) {
        console.error("Error fetching user integration:", fetchError);
        throw fetchError;
      }

      if (!isTinyErpSettings(userIntegration.settings)) {
        throw new Error("Credenciais inválidas ou incompletas");
      }

      console.log("Building auth URL...");
      const authUrl = new URL("https://accounts.tiny.com.br/realms/tiny/protocol/openid-connect/auth");
      authUrl.searchParams.append("client_id", userIntegration.settings.client_id);
      authUrl.searchParams.append("redirect_uri", userIntegration.settings.redirect_uri);
      authUrl.searchParams.append("scope", "openid");
      authUrl.searchParams.append("response_type", "code");

      console.log("Auth URL:", authUrl.toString());
      window.location.href = authUrl.toString();
    } catch (error) {
      console.error("Auth error:", error);
      toast({
        variant: "destructive",
        title: "Erro ao iniciar autenticação",
        description: "Verifique suas credenciais e tente novamente.",
      });
    }
  };

  return { hasCredentials, isConnected, handleAuth };
};