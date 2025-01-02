import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Product } from "./types";

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "sku",
    header: "SKU",
    cell: ({ row }) => row.getValue("sku") || "-",
  },
  {
    accessorKey: "nome",
    header: "Nome",
  },
  {
    accessorKey: "preco",
    header: "Preço",
    cell: ({ row }) => {
      const price = row.getValue("preco") as number | null;
      return price ? 
        new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(price) : 
        "R$ 0,00";
    },
  },
  {
    accessorKey: "unidade",
    header: "Unidade",
    cell: ({ row }) => row.getValue("unidade") || "-",
  },
  {
    accessorKey: "estoque",
    header: "Estoque",
    cell: ({ row }) => {
      const stock = row.getValue("estoque") as number | null;
      return (
        <Badge variant={stock && stock > 0 ? "default" : "destructive"}>
          {stock || "0"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "situacao",
    header: "Situação",
    cell: ({ row }) => {
      const status = row.getValue("situacao") as string | null;
      return (
        <Badge variant={status === "Ativo" ? "default" : "secondary"}>
          {status || "Indefinido"}
        </Badge>
      );
    },
  },
];

export const ProductTableRow = ({ row }: ProductTableRowProps) => {
  return (
    <tr className="cursor-pointer hover:bg-muted/50">
      {row.getVisibleCells().map((cell: any) => (
        <td key={cell.id} className="p-4">
          {cell.column.columnDef.cell({ row: cell.row })}
        </td>
      ))}
    </tr>
  );
};