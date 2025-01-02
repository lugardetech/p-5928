import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "../components/products-table/columns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TinyProduct } from "@/integrations/supabase/types/tiny-products";

export default function ProductsPage() {
  const { toast } = useToast();
  
  const { data: products, isLoading } = useQuery<TinyProduct[]>({
    queryKey: ['products'],
    queryFn: async () => {
      console.log("=== Buscando produtos ===");
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error("❌ Usuário não autenticado");
        throw new Error("Usuário não autenticado");
      }

      console.log("✅ Usuário autenticado:", user.id);

      const { data, error } = await supabase
        .from('tiny_products')
        .select(`
          *,
          tiny_product_attachments(*),
          tiny_product_variations(*),
          tiny_product_suppliers(*),
          tiny_product_kit_items(*),
          tiny_product_production_items(*),
          tiny_product_production_steps(*)
        `)
        .eq('user_id', user.id);

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
      </header>

      <Card className="p-6">
        <DataTable 
          columns={columns} 
          data={products || []} 
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
}