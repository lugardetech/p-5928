import { useState } from "react";
import { Input } from "@/components/ui/input";
import { OrdersTableContent } from "./OrdersTableContent";
import { useTinyOrders } from "./hooks/useTinyOrders";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface OrdersTableProps {
  data?: any[];
  isLoading?: boolean;
}

export const OrdersTable = ({ data, isLoading }: OrdersTableProps = {}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const hookResult = useTinyOrders(currentPage, perPage);
  
  const orders = data || hookResult.data?.orders;
  const loading = isLoading ?? hookResult.isLoading;
  const error = hookResult.error;
  const totalPages = hookResult.data?.totalPages || 1;

  if (loading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <p className="text-muted-foreground">Carregando pedidos...</p>
      </div>
    );
  }

  if (error || !orders?.length) {
    return (
      <div className="min-h-[200px] flex items-center justify-center text-muted-foreground">
        {error ? "Erro ao carregar pedidos." : "Nenhum pedido encontrado."}
      </div>
    );
  }

  const filteredOrders = orders.filter(order => 
    order.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Buscar pedidos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <OrdersTableContent orders={filteredOrders} />
      
      <div className="flex items-center justify-end space-x-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>
        <span className="text-sm text-muted-foreground">
          Página {currentPage} de {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1"
        >
          Próximo
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};