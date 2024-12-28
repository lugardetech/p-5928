import { ColumnDef, flexRender } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Product, ProductTableRowProps } from "./types";
import { ProductAvatar } from "./ProductAvatar";
import { ProductDialog } from "./ProductDialog";

export const columns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecionar todos"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selecionar linha"
        onClick={(e) => e.stopPropagation()}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "image_url",
    header: "Imagem",
    cell: ({ row }) => {
      const imageUrl = row.getValue("image_url") as string | null;
      return <ProductAvatar imageUrl={imageUrl} productName={row.getValue("name")} />;
    },
  },
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "sku",
    header: "SKU",
  },
  {
    accessorKey: "category",
    header: "Categoria",
    cell: ({ row }) => {
      const category = row.original.category;
      return category?.name || "Sem categoria";
    },
  },
  {
    accessorKey: "price",
    header: "Preço",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(price);

      return formatted;
    },
  },
  {
    accessorKey: "stock_quantity",
    header: "Estoque",
    cell: ({ row }) => {
      const stock = parseInt(row.getValue("stock_quantity"));
      return (
        <Badge variant={stock > 0 ? "default" : "destructive"}>
          {stock}
        </Badge>
      );
    },
  },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("active");
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Ativo" : "Inativo"}
        </Badge>
      );
    },
  },
];

export const ProductTableRow = ({ row }: ProductTableRowProps) => {
  return (
    <ProductDialog productData={row.original}>
      <tr className="cursor-pointer hover:bg-muted/50">
        {row.getVisibleCells().map((cell: any) => (
          <td key={cell.id} className="p-4">
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        ))}
      </tr>
    </ProductDialog>
  );
};