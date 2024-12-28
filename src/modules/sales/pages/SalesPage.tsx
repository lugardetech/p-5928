import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "../components/sales-table/columns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function SalesPage() {
  const { data: sales, isLoading } = useQuery({
    queryKey: ['sales'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customer:customers(*),
          items:order_items(
            *,
            product:products(*),
            product_variation:product_variations(*)
          )
        `)
        .eq('type', 'sale');

      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-primary">Vendas</h1>
        <p className="text-secondary-foreground">Gerencie suas vendas</p>
      </header>

      <Card className="p-6">
        <DataTable 
          columns={columns} 
          data={sales || []} 
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
}