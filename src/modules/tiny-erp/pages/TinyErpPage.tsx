import { Card } from "@/components/ui/card";
import { TinyIntegrationStatus } from "@/components/tiny-erp/TinyIntegrationStatus";
import { CredentialsForm } from "@/components/tiny-erp/CredentialsForm";
import { ProductSearch } from "@/components/tiny-erp/ProductSearch";

export default function TinyErpPage() {
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
          <CredentialsForm />
        </Card>

        <Card className="p-6">
          <ProductSearch />
        </Card>
      </div>
    </div>
  );
}