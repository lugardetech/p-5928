import { useState } from "react";
import { OrdersTable } from "@/components/tiny-erp/OrdersTable";
import { Button } from "@/components/ui/button";
import { Sync } from "lucide-react";
import { syncTinyOrders } from "@/components/tiny-erp/hooks/useTinyOrders";
import { useToast } from "@/hooks/use-toast";

export default function TinyOrdersPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSync = async () => {
    try {
      setIsLoading(true);
      await syncTinyOrders();
    } catch (error) {
      console.error("Erro na sincronização:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Pedidos Tiny ERP</h1>
          <p className="text-sm text-muted-foreground">Gerencie seus pedidos do Tiny ERP</p>
        </div>
        <Button 
          onClick={handleSync} 
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <Sync className="h-4 w-4" />
          {isLoading ? "Sincronizando..." : "Sincronizar Pedidos"}
        </Button>
      </header>

      <OrdersTable />
    </div>
  );
}