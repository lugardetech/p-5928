import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Package, Boxes, DollarSign, AlertCircle, Tag, Info } from "lucide-react";
import { TinyProduct } from "@/integrations/supabase/types/tiny-products";
import { Separator } from "@/components/ui/separator";

interface ProductDetailsCardProps {
  product: TinyProduct;
}

export function ProductDetailsCard({ product }: ProductDetailsCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-6 w-6" />
          {product.nome}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Imagem do Produto */}
          <div className="w-full md:w-1/3">
            {product.anexos?.[0]?.url ? (
              <img
                src={product.anexos[0].url}
                alt={product.nome}
                className="w-full h-48 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-48 bg-muted flex items-center justify-center rounded-lg">
                <Package className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Informações Principais */}
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
                <span className="text-sm">{formatCurrency(product.preco || 0)}</span>
              </div>

              <div className="flex items-center gap-2">
                <Boxes className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Estoque:</span>
                <Badge variant={Number(product.estoque) > 0 ? "default" : "destructive"}>
                  {product.estoque || 0}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Situação:</span>
                <Badge variant={product.situacao === "A" ? "default" : "secondary"}>
                  {product.situacao === "A" ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </div>

            {/* Descrição */}
            {product.descricao && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Descrição:</h4>
                <p className="text-sm text-muted-foreground">{product.descricao}</p>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Informações Adicionais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dimensões */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Dimensões</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Altura: {product.altura || '-'}</div>
              <div>Largura: {product.largura || '-'}</div>
              <div>Comprimento: {product.comprimento || '-'}</div>
              <div>Peso Bruto: {product.peso_bruto || '-'}</div>
            </div>
          </div>

          {/* Informações Fiscais */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Informações Fiscais</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>NCM: {product.ncm || '-'}</div>
              <div>GTIN: {product.gtin || '-'}</div>
              <div>Origem: {product.origem || '-'}</div>
            </div>
          </div>
        </div>

        {/* Fornecedores */}
        {product.fornecedores && product.fornecedores.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Fornecedores</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {product.fornecedores.map((fornecedor, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    <span>{fornecedor.nome}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}