// Move from /src/components/products/ProductDetailsCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Package, Boxes, DollarSign, AlertCircle, Tag } from "lucide-react";

interface ProductDetailsCardProps {
  product: {
    id: string;
    name: string;
    sku: string;
    price: number;
    stock_quantity: number;
    image_url: string | null;
    category: {
      name: string;
    } | null;
    description?: string;
  };
}

export function ProductDetailsCard({ product }: ProductDetailsCardProps) {
  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-6 w-6" />
          {product.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Imagem do Produto */}
          <div className="w-full md:w-1/3">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-48 bg-muted flex items-center justify-center rounded-lg">
                <Package className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Informações do Produto */}
          <div className="w-full md:w-2/3 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">SKU:</span>
                <span className="text-sm">{product.sku}</span>
              </div>

              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Preço:</span>
                <span className="text-sm">{formatCurrency(product.price)}</span>
              </div>

              <div className="flex items-center gap-2">
                <Boxes className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Estoque:</span>
                <Badge variant={product.stock_quantity > 0 ? "default" : "destructive"}>
                  {product.stock_quantity}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Categoria:</span>
                <span className="text-sm">{product.category?.name || "Sem categoria"}</span>
              </div>
            </div>

            {product.description && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Descrição:</h4>
                <p className="text-sm text-muted-foreground">{product.description}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}