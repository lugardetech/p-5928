"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MercadoLivreClaim } from "@/types/mercadolivre/claims";

export const columns: ColumnDef<MercadoLivreClaim>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("id")}</div>;
    },
  },
  {
    accessorKey: "title",
    header: "Título",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("title")}</div>;
    },
  },
  {
    accessorKey: "buyer.nickname",
    header: "Comprador",
    cell: ({ row }) => {
      const claim = row.original;
      return <div>{claim.buyer?.nickname || "N/A"}</div>;
    },
  },
  {
    accessorKey: "item.title",
    header: "Produto",
    cell: ({ row }) => {
      const claim = row.original;
      return <div>{claim.item?.title || "N/A"}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      
      let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "default";
      
      switch (status.toLowerCase()) {
        case "closed":
          badgeVariant = "outline";
          break;
        case "opened":
          badgeVariant = "destructive";
          break;
        default:
          badgeVariant = "secondary";
      }
      
      return (
        <Badge variant={badgeVariant}>
          {status === "opened" ? "Aberta" : "Fechada"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "date_created",
    header: "Data de Criação",
    cell: ({ row }) => {
      const date = row.getValue("date_created") as string;
      const formattedDate = format(new Date(date), "dd/MM/yyyy HH:mm", { locale: ptBR });
      return <div>{formattedDate}</div>;
    },
  },
];