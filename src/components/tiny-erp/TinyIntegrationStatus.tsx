import { Button } from "@/components/ui/button";
import { useIntegrationStatus } from "@/hooks/tiny-erp/useIntegrationStatus";
import { CheckCircle, Settings, XCircle } from "lucide-react";
import { TinyErpSettings } from "@/types/tiny-erp";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CredentialsForm } from "./CredentialsForm";
import { useState } from "react";

export function TinyIntegrationStatus() {
  const { hasCredentials, isConnected, handleAuth } = useIntegrationStatus();
  const [open, setOpen] = useState(false);

  const getAuthUrl = () => {
    const settings = status?.settings as TinyErpSettings | undefined;
    if (!settings?.client_id) {
      return "#";
    }

    const params = new URLSearchParams({
      client_id: settings.client_id,
      redirect_uri: settings.redirect_uri,
      scope: "openid",
      response_type: "code",
    });

    return `https://accounts.tiny.com.br/realms/tiny/protocol/openid-connect/auth?${params.toString()}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">Credenciais configuradas:</span>
            {hasCredentials ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Configurar Credenciais</DialogTitle>
                </DialogHeader>
                <CredentialsForm onSuccess={() => setOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
          {!hasCredentials && (
            <p className="text-sm text-muted-foreground">
              Configure suas credenciais do Tiny ERP para começar.
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">Conta autenticada:</span>
            {isConnected ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
          </div>
          {!isConnected && hasCredentials && (
            <p className="text-sm text-muted-foreground">
              Clique no botão ao lado para autenticar sua conta do Tiny ERP.
            </p>
          )}
        </div>
        {hasCredentials && !isConnected && (
          <Button onClick={handleAuth}>Autenticar</Button>
        )}
      </div>
    </div>
  );
}
