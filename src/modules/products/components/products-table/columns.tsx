import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Product } from "./types";

export const columns: ColumnDef<Product>[] = [
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
      const price = row.getValue("preco");
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(Number(price));
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
          {stock}
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
        <Badge variant={status === "Ativo" ? "default" : "secondary"}>
          {status || "Indefinido"}
        </Badge>
      );
    },
  },
];