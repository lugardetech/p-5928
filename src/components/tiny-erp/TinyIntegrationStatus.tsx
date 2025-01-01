import { Button } from "@/components/ui/button";
import { useIntegrationStatus } from "@/hooks/tiny-erp/useIntegrationStatus";
import { CheckCircle, RefreshCw, Settings, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CredentialsForm } from "./CredentialsForm";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function TinyIntegrationStatus() {
  const { hasCredentials, isConnected, handleAuth, status } = useIntegrationStatus();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleReauth = async () => {
    try {
      console.log("Iniciando reautenticação...");
      if (!hasCredentials) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Configure suas credenciais antes de reautenticar.",
        });
        return;
      }
      await handleAuth();
    } catch (error) {
      console.error("Erro na reautenticação:", error);
      toast({
        variant: "destructive",
        title: "Erro na reautenticação",
        description: "Não foi possível reautenticar. Tente novamente.",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Tiny ERP</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Configurações do Tiny ERP</DialogTitle>
            </DialogHeader>
            <CredentialsForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          {hasCredentials ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
          <p className="text-sm">
            {hasCredentials
              ? "Credenciais configuradas"
              : "Credenciais não configuradas"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isConnected ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
          <p className="text-sm">
            {isConnected ? "Autenticado" : "Não autenticado"}
          </p>
        </div>

        <div className="flex gap-2">
          {hasCredentials && !isConnected && (
            <Button onClick={handleAuth}>Autenticar</Button>
          )}
          {hasCredentials && (
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