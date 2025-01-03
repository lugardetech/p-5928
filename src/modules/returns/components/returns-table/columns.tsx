import { ColumnDef } from "@tanstack/react-table";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "order_number",
    header: "Número",
  },
  {
    accessorKey: "customer.name",
    header: "Cliente",
  },
  {
    accessorKey: "original_order.order_number",
    header: "Pedido Original",
  },
  {
    accessorKey: "total_amount",
    header: "Valor Total",
    cell: ({ row }) => formatCurrency(row.getValue("total_amount")),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <Badge variant={status === "completed" ? "default" : "secondary"}>
          {status === "completed" ? "Concluída" : "Pendente"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Data",
    cell: ({ row }) => format(new Date(row.getValue("created_at")), "dd/MM/yyyy"),
  },
];