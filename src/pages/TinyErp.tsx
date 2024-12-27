import { TinyIntegrationStatus } from "@/components/tiny-erp/TinyIntegrationStatus";
import { ProductsTable } from "@/components/tiny-erp/ProductsTable";

const TinyErp = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tiny ERP</h1>
        <TinyIntegrationStatus />
      </div>
      
      <ProductsTable />
    </div>
  );
};

export default TinyErp;