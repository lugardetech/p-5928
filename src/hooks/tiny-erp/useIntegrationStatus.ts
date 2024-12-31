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

  const { data: status } = useQuery({
    queryKey: ["tiny-integration", userId],
    queryFn: async () => {
      console.log("Fetching tiny_erp integration...");
      const { data, error } = await supabase
        .from("integrations")
        .select("*")
        .eq("name", "tiny_erp")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching integration:", error);
        throw error;
      }
      console.log("Found integration:", data);
      return data;
    },
    enabled: !!userId,
  });

  useEffect(() => {
    const checkIntegrationStatus = async () => {
      if (!status) {
        console.log("No integration found");
        return;
      }

      console.log("Checking integration status", status);

      if (isTinyErpSettings(status.settings)) {
        setHasCredentials(true);
        
        if (status.access_token && status.token_expires_at) {
          const expiresAt = new Date(status.token_expires_at);
          setIsConnected(expiresAt > new Date());
        } else {
          setIsConnected(false);
        }
      } else {
        console.log("Invalid settings format:", status.settings);
        setHasCredentials(false);
        setIsConnected(false);
      }
    };

    checkIntegrationStatus();
  }, [status]);

  const handleAuth = async () => {
    try {
      if (!userId) {
        throw new Error("Usuário não autenticado");
      }

      console.log("Fetching integration...");
      const { data: userIntegration, error: fetchError } = await supabase
        .from("integrations")
        .select("*")
        .eq("user_id", userId)
        .eq("name", "tiny_erp")
        .maybeSingle();

      if (fetchError) {
        console.error("Error fetching integration:", fetchError);
        throw fetchError;
      }

      if (!userIntegration || !isTinyErpSettings(userIntegration.settings)) {
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

  return { hasCredentials, isConnected, handleAuth, status };
};