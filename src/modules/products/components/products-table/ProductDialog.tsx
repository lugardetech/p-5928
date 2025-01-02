import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TinyProduct } from "@/integrations/supabase/types/tiny-products";
import { ProductDetailsCard } from "./ProductDetailsCard";

interface ProductDialogProps {
  children: React.ReactNode;
  productData: TinyProduct;
}

export const ProductDialog = ({ children, productData }: ProductDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detalhes do Produto</span>
          </DialogTitle>
        </DialogHeader>
        <div className="mt-6">
          <ProductDetailsCard product={productData} />
        </div>
      </DialogContent>
    </Dialog>
  );
};