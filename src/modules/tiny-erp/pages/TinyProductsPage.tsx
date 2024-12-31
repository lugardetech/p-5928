import { Card } from "@/components/ui/card";
import { ProductsTable } from "@/components/tiny-erp/ProductsTable";

export default function TinyProductsPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-primary">Produtos Tiny ERP</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie seus produtos integrados com o Tiny ERP
        </p>
      </header>

      <Card className="p-6">
        <ProductsTable />
      </Card>
    </div>
  );
}