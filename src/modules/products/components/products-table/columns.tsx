"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export type Product = {
  id: string;
  sku: string;
  name: string;
  price: number;
  stock_quantity: number;
  active: boolean;
  category: {
    name: string;
  } | null;
}

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "sku",
    header: "SKU",
  },
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "category.name",
    header: "Categoria",
    cell: ({ row }) => {
      const category = row.original.category?.name;
      return category || "Sem categoria";
    }
  },
  {
    accessorKey: "price",
    header: "Preço",
    cell: ({ row }) => {
      return formatCurrency(row.original.price);
    }
  },
  {
    accessorKey: "stock_quantity",
    header: "Estoque",
    cell: ({ row }) => {
      const quantity = row.original.stock_quantity;
      return (
        <Badge variant={quantity > 0 ? "default" : "destructive"}>
          {quantity}
        </Badge>
      );
    }
  },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.active;
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Ativo" : "Inativo"}
        </Badge>
      );
    }
  }
];