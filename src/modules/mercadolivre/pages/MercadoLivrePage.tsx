import { Card } from "@/components/ui/card";
import { CredentialsForm } from "@/components/mercadolivre/CredentialsForm";
import { MercadoLivreIntegrationStatus } from "@/components/mercadolivre/MercadoLivreIntegrationStatus";

export default function MercadoLivrePage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-primary">Mercado Livre</h1>
        <p className="text-secondary-foreground">Gerencie sua integração com o Mercado Livre</p>
      </header>

      <div className="grid gap-6">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Status da Integração</h2>
          <MercadoLivreIntegrationStatus />
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Credenciais</h2>
          <CredentialsForm />
        </Card>
      </div>
    </div>
  );
}