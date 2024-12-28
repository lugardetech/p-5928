import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "../components/claims-table/columns";
import { useMercadoLivreClaims } from "@/hooks/mercadolivre/useMercadoLivreClaims";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ClaimsPage() {
  const { data: claims, isLoading, error } = useMercadoLivreClaims();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : "Erro ao carregar reclamações"}
          </AlertDescription>
        </Alert>
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