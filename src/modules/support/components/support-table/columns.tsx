import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "id",
    header: "Número",
  },
  {
    accessorKey: "customer.name",
    header: "Cliente",
  },
  {
    accessorKey: "subject",
    header: "Assunto",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <Badge variant={status === "closed" ? "default" : "secondary"}>
          {status === "closed" ? "Resolvido" : "Em Aberto"}
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