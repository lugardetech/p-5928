import { OrdersTable } from "@/components/tiny-erp/OrdersTable";

export default function TinyOrdersPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-primary">Pedidos Tiny ERP</h1>
        <p className="text-sm text-muted-foreground">Gerencie seus pedidos do Tiny ERP</p>
      </header>

      <OrdersTable />
    </div>
  );
}