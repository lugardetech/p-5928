import { useState } from "react";
import { Input } from "@/components/ui/input";
import { OrdersTableContent } from "./OrdersTableContent";
import { useTinyOrders } from "./hooks/useTinyOrders";
import { Card } from "@/components/ui/card";

export const OrdersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: orders, isLoading, error } = useTinyOrders();

  if (isLoading) {
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
    </Card>
  );
};