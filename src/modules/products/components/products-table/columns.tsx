import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { TinyProduct } from "@/integrations/supabase/types/tiny-products";
import { formatCurrency } from "@/lib/utils";
import { ProductAvatar } from "./ProductAvatar";
import { ProductDialog } from "./ProductDialog";

export const columns: ColumnDef<TinyProduct>[] = [
  {
    id: "image",
    header: "Imagem",
    cell: ({ row }) => {
      const product = row.original;
      const imageUrl = product.anexos?.[0]?.url || null;
      return (
        <ProductAvatar imageUrl={imageUrl} productName={product.nome} />
      );
    },
  },
  {
    accessorKey: "sku",
    header: "SKU",
  },
  {
    accessorKey: "nome",
    header: "Nome",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <ProductDialog productData={product}>
          <span className="cursor-pointer hover:underline">{product.nome}</span>
        </ProductDialog>
      );
    },
  },
  {
    accessorKey: "preco",
    header: "Preço",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("preco"));
      return price ? formatCurrency(price) : "-";
    },
  },
  {
    accessorKey: "unidade",
    header: "Unidade",
  },
  {
    accessorKey: "estoque",
    header: "Estoque",
    cell: ({ row }) => {
      const stock = Number(row.getValue("estoque"));
      return (
        <Badge variant={stock > 0 ? "default" : "destructive"}>
          {stock || 0}
        </Badge>
      );
    },
  },
  {
    accessorKey: "situacao",
    header: "Situação",
    cell: ({ row }) => {
      const status = row.getValue("situacao") as string;
      return (
        <Badge variant={status === "A" ? "default" : "secondary"}>
          {status === "A" ? "Ativo" : "Inativo"}
        </Badge>
      );
    },
  },
];