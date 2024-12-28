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
      return <span className="font-medium">{row.getValue("id")}</span>;
    },
  },
  {
    accessorKey: "title",
    header: "Título",
  },
  {
    accessorKey: "buyer.nickname",
    header: "Comprador",
  },
  {
    accessorKey: "item.title",
    header: "Produto",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "closed" ? "default" : "secondary"}>
          {status === "closed" ? "Fechada" : "Aberta"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "date_created",
    header: "Data",
    cell: ({ row }) => {
      return format(new Date(row.getValue("date_created")), "PPP 'às' HH:mm", { locale: ptBR });
    },
  },
];