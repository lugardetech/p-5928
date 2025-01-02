import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { columns, ProductTableRow } from "../components/products-table/columns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductForm } from "../components/ProductForm";
import { useToast } from "@/hooks/use-toast";
import { Product } from "../components/products-table/types";

export default function ProductsPage() {
  const { toast } = useToast();
  
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      console.log("=== Buscando produtos ===");
      
      const { data, error } = await supabase
        .from('tiny_products')
        .select(`
          id,
          nome,
          sku,
          preco,
          unidade,
          estoque,
          tipo,
          situacao
        `)
        .order('nome');

      if (error) {
        console.error("❌ Erro ao buscar produtos:", error);
        throw error;
      }

      console.log("✅ Produtos encontrados:", data);
      return data;
    },
    meta: {
      onError: (error: Error) => {
        console.error("❌ Erro na query:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar produtos",
          description: error.message || "Ocorreu um erro ao carregar os produtos",
        });
      }
    }
  });

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Produtos</h1>
          <p className="text-sm text-muted-foreground">Gerencie seu catálogo de produtos</p>
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