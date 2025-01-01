import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Order {
  id: string;
  numero: string;
  data_pedido: string;
  data_prevista?: string | null;
  cliente: {
    nome: string;
    codigo: string;
    cpf_cnpj: string;
    email: string;
    telefone: string;
  };
  situacao: string;
  valor_total: string;
  vendedor?: {
    id: number;
    nome: string;
  } | null;
  transportador?: {
    nome: string;
    rastreamento?: string;
    url_rastreamento?: string;
  } | null;
}

interface OrdersTableContentProps {
  orders: Order[];
}

export const OrdersTableContent = ({ orders }: OrdersTableContentProps) => {
  const getSituacaoBadge = (situacao: string) => {
    const status = situacao.toLowerCase();
    if (status.includes("cancelado")) return "destructive";
    if (status.includes("aprovado") || status.includes("faturado")) return "success";
    if (status.includes("pendente")) return "warning";
    return "secondary";
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-medium text-muted-foreground">Número</TableHead>
            <TableHead className="font-medium text-muted-foreground">Data</TableHead>
            <TableHead className="font-medium text-muted-foreground">Previsão</TableHead>
            <TableHead className="font-medium text-muted-foreground">Cliente</TableHead>
            <TableHead className="font-medium text-muted-foreground">Situação</TableHead>
            <TableHead className="font-medium text-muted-foreground">Vendedor</TableHead>
            <TableHead className="font-medium text-muted-foreground">Transportador</TableHead>
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
              <TableCell className="text-sm">
                {new Date(order.data_pedido).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-sm">
                {order.data_prevista ? new Date(order.data_prevista).toLocaleDateString() : '-'}
              </TableCell>
              <TableCell className="text-sm">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      {order.cliente.nome}
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1">
                        <p>CPF/CNPJ: {order.cliente.cpf_cnpj}</p>
                        <p>Email: {order.cliente.email}</p>
                        <p>Telefone: {order.cliente.telefone}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell className="text-sm">
                <Badge variant={getSituacaoBadge(order.situacao)}>
                  {order.situacao}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">
                {order.vendedor?.nome || '-'}
              </TableCell>
              <TableCell className="text-sm">
                {order.transportador ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        {order.transportador.nome}
                      </TooltipTrigger>
                      {order.transportador.rastreamento && (
                        <TooltipContent>
                          <div className="space-y-1">
                            <p>Rastreamento: {order.transportador.rastreamento}</p>
                            {order.transportador.url_rastreamento && (
                              <a 
                                href={order.transportador.url_rastreamento} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                Rastrear pedido
                              </a>
                            )}
                          </div>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                ) : '-'}
              </TableCell>
              <TableCell className="text-sm">{formatCurrency(order.valor_total)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};