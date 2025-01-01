import { OrdersTable } from "@/components/tiny-erp/OrdersTable";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export default function TinyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error("Usuário não autenticado");
        }

        const { data, error } = await supabase.functions.invoke('tiny-orders', {
          body: { userId: user.id },
        });

        if (error) throw error;
        setOrders(data.pedidos || []);
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        toast({
          title: "Erro ao buscar pedidos",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-primary">Pedidos Tiny ERP</h1>
        <p className="text-sm text-muted-foreground">Gerencie seus pedidos do Tiny ERP</p>
      </header>

      <OrdersTable data={orders} isLoading={loading} />
    </div>
  );
}