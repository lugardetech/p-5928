import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";

interface Order {
  id: string;
  numero: string;
  data_pedido: string;
  cliente: {
    nome: string;
    codigo: string;
  };
  situacao: string;
  valor_total: string;
}

interface OrdersTableContentProps {
  orders: Order[];
}

export const OrdersTableContent = ({ orders }: OrdersTableContentProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-medium text-muted-foreground">Número</TableHead>
            <TableHead className="font-medium text-muted-foreground">Data</TableHead>
            <TableHead className="font-medium text-muted-foreground">Cliente</TableHead>
            <TableHead className="font-medium text-muted-foreground">Situação</TableHead>
            <TableHead className="font-medium text-muted-foreground">Valor Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow 
              key={order.id}
              className="h-12 hover:bg-muted/50"
            >
              <TableCell className="text-sm">{order.numero}</TableCell>
              <TableCell className="text-sm">{new Date(order.data_pedido).toLocaleDateString()}</TableCell>
              <TableCell className="text-sm">{order.cliente.nome}</TableCell>
              <TableCell className="text-sm">{order.situacao}</TableCell>
              <TableCell className="text-sm">{formatCurrency(order.valor_total)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};