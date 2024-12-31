import { Card } from "@/components/ui/card";
import { ProductsTable } from "@/components/tiny-erp/ProductsTable";

export default function TinyProductsPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-primary">Produtos Tiny ERP</h1>
        <p className="text-secondary-foreground">Gerencie seus produtos integrados com o Tiny ERP</p>
      </header>

      <div className="grid gap-4">
        <Card className="p-6">
          <ProductsTable />
        </Card>
      </div>
    </div>
  );
}