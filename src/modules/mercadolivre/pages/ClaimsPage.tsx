import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "../components/claims-table/columns";
import { useMercadoLivreClaims } from "@/hooks/mercadolivre/useMercadoLivreClaims";

export default function ClaimsPage() {
  const { data: claims, isLoading, error } = useMercadoLivreClaims();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Card className="p-6 bg-red-50">
          <h2 className="text-lg font-semibold text-red-700">Erro ao carregar reclamações</h2>
          <p className="text-red-600">{error.message}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-primary">Reclamações</h1>
        <p className="text-secondary-foreground">Gerencie suas reclamações do Mercado Livre</p>
      </header>

      <Card className="p-6">
        <DataTable 
          columns={columns} 
          data={claims || []} 
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
}