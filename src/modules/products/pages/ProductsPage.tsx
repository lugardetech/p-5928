import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { columns, ProductTableRow } from "../components/products-table/columns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductForm } from "@/components/products/ProductForm";

export default function ProductsPage() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      console.log("=== Buscando produtos ===");
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          sku,
          name,
          price,
          stock_quantity,
          active,
          image_url,
          category:categories(name)
        `)
        .order('name');

      if (error) {
        console.error("❌ Erro ao buscar produtos:", error);
        throw error;
      }

      console.log("✅ Produtos encontrados:", data);
      return data;
    }
  });

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-primary">Produtos</h1>
          <p className="text-secondary-foreground">Gerencie seu catálogo de produtos</p>
        </div>
        <ProductForm />
      </header>

      <Card className="p-6">
        <DataTable 
          columns={columns} 
          data={products || []} 
          isLoading={isLoading}
          rowComponent={ProductTableRow}
        />
      </Card>
    </div>
  );
}