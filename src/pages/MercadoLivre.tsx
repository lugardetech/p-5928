import { MercadoLivreIntegrationStatus } from "@/components/mercadolivre/MercadoLivreIntegrationStatus";

const MercadoLivre = () => {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-primary">Mercado Livre</h1>
        <p className="text-secondary-foreground">Gerencie sua integração com o Mercado Livre</p>
      </header>

      <div className="flex justify-end">
        <MercadoLivreIntegrationStatus />
      </div>
    </div>
  );
};

export default MercadoLivre;