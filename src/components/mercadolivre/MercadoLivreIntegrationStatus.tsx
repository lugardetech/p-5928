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
import { useToast } from "@/components/ui/use-toast";

export function MercadoLivreIntegrationStatus() {
  const { data: status, isLoading } = useIntegrationStatus();
  const { toast } = useToast();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  const getAuthUrl = () => {
    const settings = status?.settings as MercadoLivreSettings | undefined;
    if (!settings?.client_id) {
      return "#";
    }

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
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">Credenciais configuradas:</span>
            {status?.isConfigured ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Configurar Credenciais</DialogTitle>
                </DialogHeader>
                <CredentialsForm />
              </DialogContent>
            </Dialog>
          </div>
          {!status?.isConfigured && (
            <p className="text-sm text-muted-foreground">
              Configure suas credenciais do Mercado Livre para começar.
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">Conta autenticada:</span>
            {status?.isAuthenticated ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
          </div>
          {!status?.isAuthenticated && status?.isConfigured && (
            <p className="text-sm text-muted-foreground">
              Clique no botão ao lado para autenticar sua conta do Mercado Livre.
            </p>
          )}
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