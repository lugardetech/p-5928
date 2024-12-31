import { Card } from "@/components/ui/card";
import { MercadoLivreIntegrationStatus } from "@/components/mercadolivre/MercadoLivreIntegrationStatus";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "../components/claims-table/columns";
import { useMercadoLivreClaims } from "@/hooks/mercadolivre/useMercadoLivreClaims";
import { useMercadoLivreClosedClaims } from "@/hooks/mercadolivre/useMercadoLivreClosedClaims";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function MercadoLivrePage() {
  const { data: openClaims, isLoading: isLoadingOpen } = useMercadoLivreClaims();
  const { data: closedClaims, isLoading: isLoadingClosed, refetch: refetchClosed } = useMercadoLivreClosedClaims();
  const { toast } = useToast();

  const handleSyncClosedClaims = async () => {
    try {
      console.log("=== Sincronizando reclamações fechadas ===");
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      const { data, error } = await supabase.functions.invoke("mercadolivre-claims-closed", {
        body: { userId: user.id }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Sincronização concluída",
        description: "As reclamações fechadas foram sincronizadas com sucesso!"
      });

      refetchClosed();
    } catch (error) {
      console.error("❌ Erro ao sincronizar reclamações fechadas:", error);
      toast({
        variant: "destructive",
        title: "Erro na sincronização",
        description: "Ocorreu um erro ao sincronizar as reclamações fechadas."
      });
    }
  };

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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Reclamações</h2>
            <Button 
              onClick={handleSyncClosedClaims}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Sincronizar Fechadas
            </Button>
          </div>
          
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