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
          anexos:tiny_product_attachments(*),
          fornecedores:tiny_product_suppliers(*),
          variacoes:tiny_product_variations(*)
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error("❌ Erro ao buscar produtos:", error);
        throw error;
      }

      // Converte o metadata para Record<string, any>
      const productsWithParsedMetadata = data?.map(product => ({
        ...product,
        metadata: product.metadata ? JSON.parse(product.metadata as string) : {}
      })) || [];

      console.log("✅ Produtos encontrados:", productsWithParsedMetadata);
      return productsWithParsedMetadata as TinyProduct[];
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