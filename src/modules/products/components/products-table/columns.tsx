import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { TinyProduct } from "@/integrations/supabase/types/tiny-products";

export const columns: ColumnDef<TinyProduct>[] = [
  {
    accessorKey: "sku",
    header: "SKU",
  },
  {
    accessorKey: "nome",
    header: "Nome",
  },
  {
    accessorKey: "preco",
    header: "Preço",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("preco"));
      return price ? new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(price) : "-";
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