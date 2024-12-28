import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "../components/purchases-table/columns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function PurchasesPage() {
  const { data: purchases, isLoading } = useQuery({
    queryKey: ['purchases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          supplier:customers(*),
          items:order_items(
            *,
            product:products(*),
            product_variation:product_variations(*)
          )
        `)
        .eq('type', 'purchase');

      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-primary">Ordens de Compra</h1>
        <p className="text-secondary-foreground">Gerencie suas compras</p>
      </header>

      <Card className="p-6">
        <DataTable 
          columns={columns} 
          data={purchases || []} 
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
}