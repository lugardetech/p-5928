"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Package } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ProductDetailsCard } from "@/components/products/ProductDetailsCard";

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock_quantity: number;
  active: boolean;
  image_url: string | null;
  category: {
    name: string;
  } | null;
}

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "image_url",
    header: "Imagem",
    cell: ({ row }) => {
      const imageUrl = row.getValue("image_url") as string | null;
      
      return (
        <Avatar className="h-12 w-12">
          <AvatarImage 
            src={imageUrl || ""} 
            alt={row.getValue("name")} 
            className="object-cover"
          />
          <AvatarFallback>
            <Package className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
      );
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
    accessorKey: "category.name",
    header: "Categoria",
    cell: ({ row }) => {
      const category = row.getValue("category.name");
      return category || "Sem categoria";
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

// Componente wrapper para a linha da tabela
export const ProductTableRow = ({ row }: { row: any }) => {
  return (
    <Sheet>
      <SheetTrigger className="contents">
        <tr className="cursor-pointer hover:bg-muted/50">
          {row.getVisibleCells().map((cell: any) => (
            <td key={cell.id} className="p-4">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Detalhes do Produto</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <ProductDetailsCard product={row.original} />
        </div>
      </SheetContent>
    </Sheet>
  );
};