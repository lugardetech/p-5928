import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ProductBasicInfo } from "./form/ProductBasicInfo";
import { ProductPricing } from "./form/ProductPricing";
import { ProductStock } from "./form/ProductStock";
import { ProductImage } from "./form/ProductImage";
import { ProductCategory } from "./form/ProductCategory";
import { FormData } from "./form/types";

interface ProductFormProps {
  initialData?: FormData;
  onSuccess?: () => void;
}

export function ProductForm({ initialData, onSuccess }: ProductFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<FormData>(initialData || {
    name: "",
    description: "",
    sku: "",
    price: "",
    cost_price: "",
    stock_quantity: "",
    min_stock_quantity: "",
    category_id: "",
    image: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("=== Iniciando cadastro de produto ===");
      console.log("Dados do formulário:", formData);

      // Verificar se o SKU já existe
      const { data: existingProduct } = await supabase
        .from("products")
        .select("id")
        .eq("sku", formData.sku)
        .maybeSingle();

      if (existingProduct) {
        toast({
          variant: "destructive",
          title: "SKU já existe",
          description: "Por favor, escolha um SKU diferente.",
        });
        setIsLoading(false);
        return;
      }

      // Upload da imagem
      let imageUrl = null;
      if (formData.image) {
        const fileExt = formData.image.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from('product-images')
          .upload(fileName, formData.image);

        if (uploadError) throw uploadError;

        // Construir a URL pública completa da imagem
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
        console.log("URL pública da imagem:", imageUrl);
      }

      // Inserir produto
      const { error } = await supabase.from("products").insert({
        name: formData.name,
        description: formData.description,
        sku: formData.sku,
        price: parseFloat(formData.price),
        cost_price: formData.cost_price ? parseFloat(formData.cost_price) : null,
        stock_quantity: parseInt(formData.stock_quantity),
        min_stock_quantity: formData.min_stock_quantity ? parseInt(formData.min_stock_quantity) : null,
        category_id: formData.category_id || null,
        image_url: imageUrl,
      });

      if (error) throw error;

      console.log("✅ Produto cadastrado com sucesso");

      toast({
        title: "Produto adicionado",
        description: "O produto foi cadastrado com sucesso.",
      });

      // Resetar formulário
      setFormData({
        name: "",
        description: "",
        sku: "",
        price: "",
        cost_price: "",
        stock_quantity: "",
        min_stock_quantity: "",
        category_id: "",
        image: null,
      });

      // Fechar modal
      setIsOpen(false);

      // Atualizar lista de produtos
      queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch (error) {
      console.error("❌ Erro ao cadastrar produto:", error);
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar produto",
        description: "Ocorreu um erro ao tentar cadastrar o produto.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {!initialData && (
        <DialogTrigger asChild>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Produto
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{initialData ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
            <DialogDescription>
              {initialData ? 'Edite os dados do produto abaixo.' : 'Preencha os dados do produto abaixo.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <ProductBasicInfo formData={formData} setFormData={setFormData} />
            <div className="grid md:grid-cols-2 gap-6">
              <ProductCategory formData={formData} setFormData={setFormData} />
              <ProductImage formData={formData} setFormData={setFormData} />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <ProductPricing formData={formData} setFormData={setFormData} />
              <ProductStock formData={formData} setFormData={setFormData} />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
