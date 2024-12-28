import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings2 } from "lucide-react";
import { CredentialsForm } from "./CredentialsForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useIntegrationStatus } from "@/hooks/mercadolivre/useIntegrationStatus";

export const MercadoLivreIntegrationStatus = () => {
  const { hasCredentials, isConnected, handleAuth } = useIntegrationStatus();

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
            <DialogTitle>Integração Mercado Livre</DialogTitle>
            <DialogDescription>
              Gerencie sua integração com o Mercado Livre
            </DialogDescription>
          </DialogHeader>
          
          {!hasCredentials ? (
            <Card>
              <CardHeader>
                <CardTitle>Configurar Credenciais</CardTitle>
                <CardDescription>
                  Insira as credenciais do seu aplicativo Mercado Livre para começar a integração.
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
                  Suas credenciais estão configuradas. Clique no botão abaixo para autorizar o acesso ao Mercado Livre.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleAuth}>
                  Conectar ao Mercado Livre
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