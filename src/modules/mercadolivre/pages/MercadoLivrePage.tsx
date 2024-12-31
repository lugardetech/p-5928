import { Card } from "@/components/ui/card";
import { MercadoLivreIntegrationStatus } from "@/components/mercadolivre/MercadoLivreIntegrationStatus";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "../components/claims-table/columns";
import { useMercadoLivreClaims } from "@/hooks/mercadolivre/useMercadoLivreClaims";
import { useMercadoLivreClosedClaims } from "@/hooks/mercadolivre/useMercadoLivreClosedClaims";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MercadoLivrePage() {
  const { data: openClaims, isLoading: isLoadingOpen } = useMercadoLivreClaims();
  const { data: closedClaims, isLoading: isLoadingClosed } = useMercadoLivreClosedClaims();

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
          <h2 className="text-2xl font-semibold mb-4">Reclamações</h2>
          <Tabs defaultValue="open" className="w-full">
            <TabsList>
              <TabsTrigger value="open">Abertas</TabsTrigger>
              <TabsTrigger value="closed">Fechadas</TabsTrigger>
            </TabsList>
            <TabsContent value="open">
              <DataTable 
                columns={columns} 
                data={openClaims || []} 
                isLoading={isLoadingOpen}
              />
            </TabsContent>
            <TabsContent value="closed">
              <DataTable 
                columns={columns} 
                data={closedClaims || []} 
                isLoading={isLoadingClosed}
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}