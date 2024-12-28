import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "../components/returns-table/columns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function ReturnsPage() {
  const { data: returns, isLoading } = useQuery({
    queryKey: ['returns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customer:customers(*),
          original_order:orders(*),
          items:order_items(
            *,
            product:products(*),
            product_variation:product_variations(*)
          )
        `)
        .eq('type', 'return');

      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-primary">Devoluções</h1>
        <p className="text-secondary-foreground">Gerencie as devoluções de produtos</p>
      </header>

      <Card className="p-6">
        <DataTable 
          columns={columns} 
          data={returns || []} 
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
}