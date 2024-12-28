import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProductForm } from "@/modules/products/components/ProductForm";
import { ProductDetailsCard } from "@/modules/products/components/ProductDetailsCard";

interface ProductDialogProps {
  children: React.ReactNode;
  productData: any;
}

export const ProductDialog = ({ children, productData }: ProductDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductData, setCurrentProductData] = useState<any>(null);
  const { toast } = useToast();

  const handleEdit = async () => {
    try {
      const { data: product, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('id', productData.id)
        .single();

      if (error) throw error;

      console.log("Dados do produto carregados:", product);
      setCurrentProductData(product);
      setIsEditing(true);
    } catch (error) {
      console.error("Erro ao carregar dados do produto:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar produto",
        description: "Não foi possível carregar os dados do produto para edição.",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="contents">
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detalhes do Produto</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="mt-6">
          {isEditing && currentProductData ? (
            <ProductForm 
              initialData={currentProductData}
              onSuccess={() => {
                setIsEditing(false);
                setCurrentProductData(null);
              }}
            />
          ) : (
            <ProductDetailsCard product={productData} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};