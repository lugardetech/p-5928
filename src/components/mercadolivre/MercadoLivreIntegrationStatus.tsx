import { Button } from "@/components/ui/button";
import { useIntegrationStatus } from "@/hooks/mercadolivre/useIntegrationStatus";
import { CheckCircle, RefreshCw, Settings, XCircle } from "lucide-react";
import { MercadoLivreSettings } from "@/types/mercadolivre";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CredentialsForm } from "./CredentialsForm";
import { useToast } from "@/hooks/use-toast";

export function MercadoLivreIntegrationStatus() {
  const { data: status, isLoading } = useIntegrationStatus();
  const { toast } = useToast();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  const getAuthUrl = () => {
    const settings = status?.settings as MercadoLivreSettings;
    if (!settings?.client_id) return "#";

    const params = new URLSearchParams({
      response_type: "code",
      client_id: settings.client_id,
      redirect_uri: settings.redirect_uri,
    });

    return `https://auth.mercadolivre.com.br/authorization?${params.toString()}`;
  };

  const handleReauth = () => {
    if (!status?.isConfigured) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Configure suas credenciais antes de reautenticar.",
      });
      return;
    }
    window.location.href = getAuthUrl();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Mercado Livre</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Configurações do Mercado Livre</DialogTitle>
            </DialogHeader>
            <CredentialsForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          {status?.isConfigured ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
          <p className="text-sm">
            {status?.isConfigured
              ? "Credenciais configuradas"
              : "Credenciais não configuradas"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {status?.isAuthenticated ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
          <p className="text-sm">
            {status?.isAuthenticated
              ? "Autenticado"
              : "Não autenticado"}
          </p>
        </div>

        <div className="flex gap-2">
          {status?.isConfigured && !status?.isAuthenticated && (
            <Button asChild>
              <a href={getAuthUrl()}>Autenticar</a>
            </Button>
          )}
          {status?.isAuthenticated && (
            <Button onClick={handleReauth} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reautenticar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}