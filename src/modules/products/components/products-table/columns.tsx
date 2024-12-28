"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Package, Edit, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProductDetailsCard } from "@/components/products/ProductDetailsCard";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/products/ProductForm";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  description?: string;
}

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

// Componente wrapper para a linha da tabela
export const ProductTableRow = ({ row }: { row: any }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [productData, setProductData] = useState<any>(null);
  const { toast } = useToast();

  const handleEdit = async () => {
    try {
      // Buscar dados completos do produto
      const { data: product, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('id', row.original.id)
        .single();

      if (error) throw error;

      console.log("Dados do produto carregados:", product);
      setProductData(product);
      setIsEditing(true);
    } catch (error) {
      console.error("Erro ao carregar dados do produto:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar produto",
        description: "Não foi possível carregar os dados do produto para edição.",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="contents">
        <tr className="cursor-pointer hover:bg-muted/50">
          {row.getVisibleCells().map((cell: any) => (
            <td key={cell.id} className="p-4">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detalhes do Produto</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="mt-6">
          {isEditing && productData ? (
            <ProductForm 
              initialData={productData}
              onSuccess={() => {
                setIsEditing(false);
                setProductData(null);
              }}
            />
          ) : (
            <ProductDetailsCard product={row.original} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};