import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "../components/purchases-table/columns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function PurchasesPage() {
  const { data: purchases, isLoading } = useQuery({
    queryKey: ['purchases'],
    queryFn: async () => {
      console.log("=== Buscando compras ===");
      
      const { data, error } = await supabase
        .from('purchases')
        .select(`
          *,
          supplier:suppliers(*),
          items:purchase_items(
            *,
            product:produtos(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("❌ Erro ao buscar compras:", error);
        throw error;
      }

      console.log("✅ Compras encontradas:", data);
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