import { Card } from "@/components/ui/card";
import { TinyIntegrationStatus } from "@/components/tiny-erp/TinyIntegrationStatus";
import { ProductSearch } from "@/components/tiny-erp/ProductSearch";
import { useState } from "react";

export default function TinyErpPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-primary">Tiny ERP</h1>
        <p className="text-secondary-foreground">Gerencie sua integração com o Tiny ERP</p>
      </header>

      <div className="grid gap-4">
        <Card className="p-6">
          <TinyIntegrationStatus />
        </Card>

        <Card className="p-6">
          <ProductSearch 
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </Card>
      </div>
    </div>
  );
}