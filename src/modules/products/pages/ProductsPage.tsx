import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { columns, ProductTableRow } from "../components/products-table/columns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductForm } from "../components/ProductForm";
import { useToast } from "@/hooks/use-toast";

export default function ProductsPage() {
  const { toast } = useToast();
  const { data: products, isLoading, refetch } = useQuery({
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

  const handleDeleteSelected = async (selectedProducts: any[]) => {
    try {
      console.log("🗑️ Tentando excluir produtos:", selectedProducts);

      // Garantir que temos IDs válidos
      const productIds = selectedProducts.map(p => p.id).filter(Boolean);
      
      if (productIds.length === 0) {
        throw new Error("Nenhum produto válido selecionado para exclusão");
      }

      const { error } = await supabase
        .from('products')
        .delete()
        .in('id', productIds);

      if (error) {
        throw error;
      }

      console.log("✅ Produtos excluídos com sucesso!");
      
      toast({
        title: "Produtos excluídos",
        description: `${productIds.length} produtos foram excluídos com sucesso.`,
      });

      refetch();
    } catch (error) {
      console.error("❌ Erro ao excluir produtos:", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir produtos",
        description: "Ocorreu um erro ao tentar excluir os produtos selecionados.",
      });
    }
  };

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
          onDeleteSelected={handleDeleteSelected}
        />
      </Card>
    </div>
  );
}